import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Mail,
  FileText,
  ListChecks,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getStore, subscribe, type RecentItem } from "@/lib/session-store";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — AI Workplace Productivity Assistant" },
      {
        name: "description",
        content: "Overview of your AI productivity activity: emails, summaries, plans, and research.",
      },
      { property: "og:title", content: "Workplace AI Dashboard" },
      {
        property: "og:description",
        content: "Track AI-assisted work across email, meetings, tasks, and research.",
      },
    ],
  }),
  component: Dashboard,
});

const tools = [
  { key: "email", title: "Email Generator", icon: Mail, url: "/email", desc: "Draft professional emails fast." },
  { key: "notes", title: "Meeting Summarizer", icon: FileText, url: "/notes", desc: "Turn raw notes into action items." },
  { key: "tasks", title: "Task Planner", icon: ListChecks, url: "/tasks", desc: "Prioritize and schedule your day." },
  { key: "research", title: "Research Assistant", icon: Sparkles, url: "/research", desc: "Get balanced topic briefings." },
  { key: "chat", title: "AI Chatbot", icon: MessageSquare, url: "/chat", desc: "Conversational workplace help." },
] as const;

function Dashboard() {
  const [store, setStore] = useState(() => getStore());
  useEffect(() => subscribe(() => setStore(getStore())), []);

  const metrics = [
    { label: "Emails Generated", value: store.counters.email, icon: Mail },
    { label: "Meetings Summarized", value: store.counters.notes, icon: FileText },
    { label: "Tasks Planned", value: store.counters.tasks, icon: ListChecks },
    { label: "Research Reports", value: store.counters.research, icon: Sparkles },
  ];

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="text-sm text-muted-foreground">
          Your AI workplace productivity overview.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label}>
            <CardContent className="flex items-center gap-3 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <m.icon className="h-5 w-5" />
              </div>
              <div>
                <div className="text-2xl font-semibold leading-tight">{m.value}</div>
                <div className="text-xs text-muted-foreground">{m.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Quick launch
        </h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t) => (
            <Link key={t.key} to={t.url} className="group">
              <Card className="h-full transition-colors hover:border-primary/50 hover:bg-accent/5">
                <CardContent className="flex items-start gap-3 p-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/10 text-accent">
                    <t.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{t.title}</div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </div>
                    <div className="text-xs text-muted-foreground">{t.desc}</div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-4 w-4" /> Recent activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {store.recents.length === 0 ? (
            <div className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
              Your recent AI generations will appear here.
            </div>
          ) : (
            <ul className="divide-y">
              {store.recents.slice(0, 6).map((r: RecentItem) => (
                <li key={r.id} className="flex items-start justify-between gap-4 py-3">
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium">{r.title}</div>
                    <div className="line-clamp-2 text-xs text-muted-foreground">{r.preview}</div>
                  </div>
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {new Date(r.createdAt).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <ResponsibleAINotice />
    </div>
  );
}
