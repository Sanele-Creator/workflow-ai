import { Info } from "lucide-react";

export function ResponsibleAINotice({ className = "" }: { className?: string }) {
  return (
    <div
      className={`flex items-start gap-2 rounded-md border bg-muted/40 p-3 text-xs text-muted-foreground ${className}`}
    >
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <p>
        <span className="font-medium text-foreground">Responsible AI:</span> AI-generated content
        may contain inaccuracies. Always review before using in professional, legal, financial, or
        business-critical contexts.
      </p>
    </div>
  );
}
