import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, Brain, ShieldCheck } from "lucide-react";

export default function Welcome() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-6 text-center">
        <div>
          <h1 className="text-3xl font-bold">InvestIQ</h1>
          <p className="text-muted-foreground mt-2">
            A beginner-friendly tool that ranks Indian market sectors using machine learning
            — and explains its reasoning in plain language, not just a number.
          </p>
        </div>

        <div className="grid gap-3 text-left">
          <Card>
            <CardContent className="pt-6 flex gap-3">
              <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                See which sectors currently show favorable historical patterns.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex gap-3">
              <Brain className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Every score comes with a plain-language explanation of why.
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 flex gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                This is a learning tool, not financial advice — every prediction is honestly
                tested against real market history.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-2">
          <Button asChild size="lg">
            <Link to="/register">Get Started</Link>
          </Button>
          <Button asChild variant="ghost" size="lg">
            <Link to="/login">I already have an account</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}