import { createFileRoute } from "@tanstack/react-router";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "@/components/markdown";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { recordGeneration } from "@/lib/session-store";
import { toast } from "sonner";

export const Route = createFileRoute("/chat")({
  head: () => ({
    meta: [
      { title: "AI Chatbot — Workplace AI" },
      { name: "description", content: "Conversational AI assistant for workplace productivity." },
      { property: "og:title", content: "Workplace AI Chatbot" },
      { property: "og:description", content: "Ask anything — productivity, content, planning, research." },
    ],
  }),
  component: ChatPage,
});

function ChatPage() {
  const transport = useMemo(() => new DefaultChatTransport({ api: "/api/chat" }), []);
  const { messages, sendMessage, status } = useChat({
    transport,
    onError: (e) => toast.error(e.message),
    onFinish: ({ message }) => {
      const text = message.parts
        .map((p) => (p.type === "text" ? p.text : ""))
        .join("")
        .trim();
      if (text) recordGeneration("chat", "Chat reply", text);
    },
  });
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const loading = status === "submitted" || status === "streaming";

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, status]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    void sendMessage({ text });
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)] flex-col p-4 md:p-8">
      <header className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <MessageSquare className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">AI Chatbot</h1>
          <p className="text-sm text-muted-foreground">
            Conversational workplace assistant for ideas, drafts, and quick answers.
          </p>
        </div>
      </header>

      <Card className="flex min-h-0 flex-1 flex-col">
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="mx-auto max-w-md py-12 text-center text-sm text-muted-foreground">
              <p className="font-medium text-foreground">How can I help you today?</p>
              <p className="mt-1">
                Ask for a draft, a quick plan, a summary, or productivity advice.
              </p>
            </div>
          ) : (
            <ul className="space-y-4">
              {messages.map((m) => {
                const text = m.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("");
                const isUser = m.role === "user";
                return (
                  <li
                    key={m.id}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2 text-sm ${
                        isUser
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-foreground"
                      }`}
                    >
                      {isUser ? (
                        <p className="whitespace-pre-wrap">{text}</p>
                      ) : (
                        <Markdown>{text}</Markdown>
                      )}
                    </div>
                  </li>
                );
              })}
              {loading && (
                <li className="flex justify-start">
                  <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" /> Thinking…
                  </div>
                </li>
              )}
            </ul>
          )}
        </div>

        <form onSubmit={submit} className="flex items-end gap-2 border-t p-3">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message the assistant…"
            className="max-h-40 min-h-[2.5rem] resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                submit(e);
              }
            }}
          />
          <Button type="submit" disabled={loading || !input.trim()} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </Card>

      <div className="mt-4">
        <ResponsibleAINotice />
      </div>
    </div>
  );
}
