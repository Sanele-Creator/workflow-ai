import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { ResponsibleAINotice } from "./responsible-ai-notice";

export function ToolShell({
  icon: Icon,
  title,
  subtitle,
  children,
}: {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 p-4 md:p-8">
      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{subtitle}</p>
        </div>
      </header>
      <div className="grid gap-6 lg:grid-cols-2">{children}</div>
      <ResponsibleAINotice />
    </div>
  );
}
