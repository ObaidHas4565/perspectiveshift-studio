import { useState } from "react";
import { Check, Copy, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PlanActions({ solution }: { solution: string }) {
  const [copiedText, setCopiedText] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const copied = copiedText === solution;

  const copy = async () => {
    setError(null);
    try {
      await navigator.clipboard.writeText(solution);
      setCopiedText(solution);
    } catch {
      setError("Copy isn't available in this browser. Download the plan instead.");
    }
  };

  const download = () => {
    setError(null);
    try {
      const url = URL.createObjectURL(new Blob([solution], { type: "text/plain;charset=utf-8" }));
      const link = document.createElement("a");
      link.href = url;
      link.download = "perspectiveshift-plan.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      setError("The download couldn't start. Try copying the plan instead.");
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" disabled={!solution.trim()} onClick={copy}>
          {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
          {copied ? "Copied" : "Copy plan"}
        </Button>
        <Button variant="outline" size="sm" disabled={!solution.trim()} onClick={download}>
          <Download aria-hidden="true" />Download plan
        </Button>
      </div>
      <span role="status" className="sr-only">{copied ? "Plan copied." : ""}</span>
      {error && <p role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
    </div>
  );
}