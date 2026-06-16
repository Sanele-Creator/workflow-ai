import { useState } from "react";
import { toast } from "sonner";
import { recordGeneration, type ToolKey } from "./session-store";
import type { AiTool } from "./prompts";

export function useAiTool(tool: AiTool) {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastInput, setLastInput] = useState<unknown>(null);

  const run = async (input: unknown, opts?: { title: string }) => {
    setLoading(true);
    setLastInput(input);
    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tool, input }),
      });
      const data = (await res.json()) as { text?: string; error?: string };
      if (!res.ok) throw new Error(data.error || "Failed");
      setOutput(data.text ?? "");
      recordGeneration(tool as ToolKey, opts?.title ?? tool, data.text ?? "");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  const regenerate = () => {
    if (lastInput) void run(lastInput);
  };

  return { output, setOutput, loading, run, regenerate };
}
