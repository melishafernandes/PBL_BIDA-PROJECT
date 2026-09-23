import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { GLOSSARY } from "@/lib/glossary";

export default function InfoTooltip({ termKey }: { termKey: keyof typeof GLOSSARY }) {
  const entry = GLOSSARY[termKey];
  if (!entry) return null;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center justify-center align-middle text-muted-foreground hover:text-foreground transition-colors ml-1"
            aria-label={`What is ${entry.term}?`}
          >
            <Info className="w-3.5 h-3.5" />
          </button>
        </TooltipTrigger>
        <TooltipContent className="max-w-64 text-sm">
          <p className="font-medium mb-1">{entry.term}</p>
          <p className="text-muted-foreground">{entry.simple}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}