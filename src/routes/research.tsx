import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "@/components/tool-shell";
import { OutputEditor } from "@/components/output-editor";
import { useAiTool } from "@/lib/use-ai-tool";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Workplace AI" },
      { name: "description", content: "Get a structured workplace-focused briefing on any topic." },
      { property: "og:title", content: "AI Research Assistant" },
      { property: "og:description", content: "Executive summary, insights, opportunities, risks, recommendations." },
    ],
  }),
  component: ResearchPage,
});

function ResearchPage() {
  const [topic, setTopic] = useState("");
  const [focus, setFocus] = useState("");
  const { output, setOutput, loading, run, regenerate } = useAiTool("research");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;
    void run({ topic, focus }, { title: `Research: ${topic}` });
  };

  return (
    <ToolShell
      icon={Sparkles}
      title="AI Research Assistant"
      subtitle="Quick, structured briefings to support workplace decisions."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Topic</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Async-first team operating models"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="focus">Specific focus (optional)</Label>
              <Textarea
                id="focus"
                value={focus}
                onChange={(e) => setFocus(e.target.value)}
                placeholder="Audience, lens, constraints, or specific questions to answer."
                className="min-h-24"
              />
            </div>
            <Button type="submit" disabled={loading || !topic.trim()} className="w-full">
              {loading ? "Researching…" : "Generate Briefing"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <OutputEditor
        value={output}
        onChange={setOutput}
        loading={loading}
        onRegenerate={regenerate}
        filename="research-brief.md"
        emptyHint="Your research briefing will appear here."
      />
    </ToolShell>
  );
}
