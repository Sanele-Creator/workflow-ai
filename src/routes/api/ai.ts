import { createFileRoute } from "@tanstack/react-router";
import { generateText } from "ai";
import { createLovableAiGatewayProvider } from "@/lib/ai-gateway.server";
import { buildPrompt, type AiTool } from "@/lib/prompts";

export const Route = createFileRoute("/api/ai")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = (await request.json()) as { tool: AiTool; input: unknown };
          if (!body?.tool || !body?.input) {
            return new Response("Missing tool or input", { status: 400 });
          }
          const key = process.env.LOVABLE_API_KEY;
          if (!key) return new Response("Missing LOVABLE_API_KEY", { status: 500 });

          const { system, prompt } = buildPrompt(body.tool, body.input as never);
          const gateway = createLovableAiGatewayProvider(key);
          const model = gateway("google/gemini-3-flash-preview");

          const result = await generateText({ model, system, prompt });
          return Response.json({ text: result.text });
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : String(err);
          const status =
            /rate limit|429/i.test(msg) ? 429 : /402|credit/i.test(msg) ? 402 : 500;
          const userMsg =
            status === 429
              ? "Rate limit reached. Please try again shortly."
              : status === 402
                ? "AI credits exhausted. Please add credits to continue."
                : "Generation failed. Please try again.";
          return Response.json({ error: userMsg }, { status });
        }
      },
    },
  },
});
