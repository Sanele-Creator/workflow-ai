import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "@/components/tool-shell";
import { OutputEditor } from "@/components/output-editor";
import { useAiTool } from "@/lib/use-ai-tool";

export const Route = createFileRoute("/notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Workplace AI" },
      { name: "description", content: "Turn long meeting notes into a structured summary with action items." },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      { property: "og:description", content: "Summary, decisions, action items, deadlines, risks." },
    ],
  }),
  component: NotesPage,
});

function NotesPage() {
  const [notes, setNotes] = useState("");
  const { output, setOutput, loading, run, regenerate } = useAiTool("notes");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!notes.trim()) return;
    void run({ notes }, { title: `Meeting summary (${new Date().toLocaleDateString()})` });
  };

  return (
    <ToolShell
      icon={FileText}
      title="Meeting Notes Summarizer"
      subtitle="Extract decisions, action items, deadlines and risks."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Meeting notes</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="notes">Paste raw notes or transcript</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="min-h-[24rem] font-mono text-xs"
                placeholder="Paste meeting notes here…"
                required
              />
            </div>
            <Button type="submit" disabled={loading || !notes.trim()} className="w-full">
              {loading ? "Summarizing…" : "Summarize Notes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <OutputEditor
        value={output}
        onChange={setOutput}
        loading={loading}
        onRegenerate={regenerate}
        filename="meeting-summary.md"
        emptyHint="Your meeting summary will appear here."
      />
    </ToolShell>
  );
}
