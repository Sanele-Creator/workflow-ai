import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ListChecks, Plus, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "AI Task Planner — Workplace AI" },
      { name: "description", content: "Prioritize tasks and generate a smart daily or weekly schedule." },
      { property: "og:title", content: "AI Task Planner" },
      { property: "og:description", content: "Priority ranking, time blocks, and productivity tips." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  const [tasks, setTasks] = useState<string[]>([""]);
  const [mode, setMode] = useState<"Daily" | "Weekly">("Daily");
  const { output, setOutput, loading, run, regenerate } = useAiTool("tasks");

  const update = (i: number, v: string) =>
    setTasks((arr) => arr.map((t, idx) => (idx === i ? v : t)));
  const add = () => setTasks((arr) => [...arr, ""]);
  const remove = (i: number) =>
    setTasks((arr) => (arr.length === 1 ? [""] : arr.filter((_, idx) => idx !== i)));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tasks.map((t) => t.trim()).filter(Boolean);
    if (!clean.length) return;
    void run({ tasks: clean, mode }, { title: `${mode} plan (${clean.length} tasks)` });
  };

  return (
    <ToolShell
      icon={ListChecks}
      title="AI Task Planner"
      subtitle="Turn a list of tasks into a prioritized, time-blocked schedule."
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid gap-2">
              <Label>Plan type</Label>
              <Select value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Daily">Daily</SelectItem>
                  <SelectItem value="Weekly">Weekly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Tasks</Label>
              {tasks.map((t, i) => (
                <div key={i} className="flex gap-2">
                  <Input
                    value={t}
                    onChange={(e) => update(i, e.target.value)}
                    placeholder={`Task ${i + 1}`}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => remove(i)}
                    aria-label="Remove"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="ghost" size="sm" onClick={add}>
                <Plus className="mr-1 h-4 w-4" /> Add task
              </Button>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Planning…" : "Generate Plan"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <OutputEditor
        value={output}
        onChange={setOutput}
        loading={loading}
        onRegenerate={regenerate}
        filename="task-plan.md"
        emptyHint="Your prioritized plan will appear here."
      />
    </ToolShell>
  );
}
