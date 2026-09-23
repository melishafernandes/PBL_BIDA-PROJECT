import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GLOSSARY } from "@/lib/glossary";

export default function Glossary() {
  const navigate = useNavigate();
  const entries = Object.values(GLOSSARY);

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>

        <div>
          <h1 className="text-2xl font-bold">How This Works</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Plain-language explanations of every term you'll see in InvestIQ. No finance
            background required.
          </p>
        </div>

        <div className="space-y-3">
          {entries.map((entry) => (
            <Card key={entry.term}>
              <CardContent className="pt-6">
                <p className="font-semibold">{entry.term}</p>
                <p className="text-sm text-muted-foreground mt-1">{entry.simple}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}