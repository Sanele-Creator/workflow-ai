import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToolShell } from "@/components/tool-shell";
import { OutputEditor } from "@/components/output-editor";
import { useAiTool } from "@/lib/use-ai-tool";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator — Workplace AI" },
      { name: "description", content: "Generate professional emails with adjustable tone." },
      { property: "og:title", content: "Smart Email Generator" },
      { property: "og:description", content: "AI-drafted professional emails in seconds." },
    ],
  }),
  component: EmailPage,
});

function EmailPage() {
  const [context, setContext] = useState("");
  const [recipient, setRecipient] = useState("");
  const [purpose, setPurpose] = useState("");
  const [tone, setTone] = useState<"Formal" | "Friendly" | "Persuasive" | "Concise">("Formal");
  const { output, setOutput, loading, run, regenerate } = useAiTool("email");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!context.trim()) return;
    void run(
      { context, recipient, purpose, tone },
      { title: `Email: ${purpose || recipient || "draft"}` },
    );
  };

  return (
    <ToolShell
      icon={Mail}
      title="Smart Email Generator"
      subtitle="Draft polished, on-tone emails in seconds."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Email details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input
                id="recipient"
                placeholder="e.g. Alex Chen, Product Lead"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="purpose">Purpose</Label>
              <Input
                id="purpose"
                placeholder="e.g. Reschedule Friday review"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label>Tone</Label>
              <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["Formal", "Friendly", "Persuasive", "Concise"].map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="context">Context</Label>
              <Textarea
                id="context"
                placeholder="What should the email cover? Background, key points, asks…"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                className="min-h-32"
                required
              />
            </div>
            <Button type="submit" disabled={loading || !context.trim()} className="w-full">
              {loading ? "Generating…" : "Generate Email"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <OutputEditor
        value={output}
        onChange={setOutput}
        loading={loading}
        onRegenerate={regenerate}
        filename="email.md"
        emptyHint="Your generated email will appear here."
      />
    </ToolShell>
  );
}
