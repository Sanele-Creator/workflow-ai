import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Settings as SettingsIcon, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ResponsibleAINotice } from "@/components/responsible-ai-notice";
import { clearStore, getStore, subscribe } from "@/lib/session-store";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — Workplace AI" },
      { name: "description", content: "Manage local data and review the responsible AI notice." },
      { property: "og:title", content: "Settings" },
      { property: "og:description", content: "Workplace AI preferences and local data." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const [store, setStore] = useState(() => getStore());
  useEffect(() => subscribe(() => setStore(getStore())), []);
  const total = Object.values(store.counters).reduce((a, b) => a + b, 0);

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <SettingsIcon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Manage your local session data and AI preferences.
          </p>
        </div>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Local data</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <p className="text-muted-foreground">
            This app stores activity counts and recent outputs locally in your browser. No account
            or server-side database is used.
          </p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
            {(Object.entries(store.counters) as [string, number][]).map(([k, v]) => (
              <div key={k} className="rounded-md border p-3">
                <div className="text-xs uppercase text-muted-foreground">{k}</div>
                <div className="text-lg font-semibold">{v}</div>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            Total generations: <span className="font-medium text-foreground">{total}</span> ·
            Recents stored: {store.recents.length}
          </p>
          <Button
            variant="destructive"
            onClick={() => {
              clearStore();
              toast.success("Local data cleared");
            }}
          >
            <Trash2 className="mr-2 h-4 w-4" /> Clear all local data
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Responsible AI</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            This application uses Artificial Intelligence to assist with workplace productivity
            tasks. AI-generated content may contain inaccuracies and should always be reviewed by a
            human before use in professional, legal, financial, or business-critical situations.
          </p>
          <ResponsibleAINotice />
        </CardContent>
      </Card>
    </div>
  );
}
