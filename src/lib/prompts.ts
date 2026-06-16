export type AiTool = "email" | "notes" | "tasks" | "research";

export type EmailInput = {
  context: string;
  recipient: string;
  purpose: string;
  tone: "Formal" | "Friendly" | "Persuasive" | "Concise";
};
export type NotesInput = { notes: string };
export type TasksInput = { tasks: string[]; mode: "Daily" | "Weekly" };
export type ResearchInput = { topic: string; focus?: string };

export function buildPrompt(
  tool: AiTool,
  input: EmailInput | NotesInput | TasksInput | ResearchInput,
): { system: string; prompt: string } {
  switch (tool) {
    case "email": {
      const i = input as EmailInput;
      return {
        system:
          "You are an expert business communication assistant. Produce clean, professional emails in Markdown.",
        prompt: `Generate a professional email.

Context: ${i.context}
Tone: ${i.tone}
Recipient: ${i.recipient}
Purpose: ${i.purpose}

Output in Markdown with these sections:
**Subject:** ...
**Body:**
...
**Closing:** ...`,
      };
    }
    case "notes": {
      const i = input as NotesInput;
      return {
        system: "You are an expert meeting analyst. Be concise, structured, and actionable.",
        prompt: `Summarize the following meeting notes.

Extract in Markdown:
1. **Summary**
2. **Key Decisions**
3. **Action Items** (assignee if mentioned)
4. **Deadlines**
5. **Risks / Concerns**
6. **Follow-up Recommendations**

Meeting Notes:
${i.notes}`,
      };
    }
    case "tasks": {
      const i = input as TasksInput;
      return {
        system: "You are a productivity coach. Output an actionable plan in Markdown.",
        prompt: `Create a ${i.mode.toLowerCase()} productivity plan.

Tasks:
${i.tasks.map((t, n) => `${n + 1}. ${t}`).join("\n")}

Prioritize each task as High / Medium / Low and produce:
- **Prioritized Task List**
- **Recommended Schedule** (time blocks)
- **Time Estimates**
- **Productivity Tips**`,
      };
    }
    case "research": {
      const i = input as ResearchInput;
      return {
        system:
          "You are a workplace research analyst. Be objective, structured, and balanced. Cite reasoning, not external URLs.",
        prompt: `Research Topic: ${i.topic}
${i.focus ? `Focus: ${i.focus}` : ""}

Provide in Markdown:
1. **Executive Summary**
2. **Key Insights**
3. **Opportunities**
4. **Risks**
5. **Recommendations**`,
      };
    }
  }
}
