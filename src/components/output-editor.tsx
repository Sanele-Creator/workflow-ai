import { useEffect, useState } from "react";
import { Copy, Download, RefreshCw, Pencil, Check, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Markdown } from "./markdown";
import { toast } from "sonner";

export function OutputEditor({
  value,
  onChange,
  loading,
  onRegenerate,
  filename = "output.md",
  emptyHint,
}: {
  value: string;
  onChange: (v: string) => void;
  loading?: boolean;
  onRegenerate?: () => void;
  filename?: string;
  emptyHint?: string;
}) {
  const [editing, setEditing] = useState(false);
  useEffect(() => {
    if (!value) setEditing(false);
  }, [value]);

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    toast.success("Copied to clipboard");
  };

  const download = () => {
    const blob = new Blob([value], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Generated Result</CardTitle>
        <div className="flex flex-wrap gap-1.5">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setEditing((e) => !e)}
            disabled={!value || loading}
          >
            {editing ? <Check className="h-3.5 w-3.5" /> : <Pencil className="h-3.5 w-3.5" />}
            <span className="ml-1">{editing ? "Done" : "Edit"}</span>
          </Button>
          <Button variant="outline" size="sm" onClick={copy} disabled={!value || loading}>
            <Copy className="h-3.5 w-3.5" />
            <span className="ml-1">Copy</span>
          </Button>
          <Button variant="outline" size="sm" onClick={download} disabled={!value || loading}>
            <Download className="h-3.5 w-3.5" />
            <span className="ml-1">Download</span>
          </Button>
          {onRegenerate && (
            <Button variant="outline" size="sm" onClick={onRegenerate} disabled={loading}>
              <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
              <span className="ml-1">Regenerate</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        {loading && !value ? (
          <div className="flex h-64 items-center justify-center text-sm text-muted-foreground">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
          </div>
        ) : !value ? (
          <div className="flex h-64 items-center justify-center rounded-md border border-dashed text-sm text-muted-foreground">
            {emptyHint ?? "Output will appear here."}
          </div>
        ) : editing ? (
          <Textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="min-h-[24rem] font-mono text-sm"
          />
        ) : (
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <Markdown>{value}</Markdown>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
