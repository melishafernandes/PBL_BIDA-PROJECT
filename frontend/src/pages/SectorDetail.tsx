import { useParams, useNavigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getSectorShap } from "@/lib/api";
import ShapWaterfall from "@/components/ShapWaterfall";
import InfoTooltip from "@/components/InfoTooltip";

const SIGNAL_STYLES: Record<string, string> = {
  Strong: "bg-emerald-500/15 text-emerald-500",
  Moderate: "bg-amber-500/15 text-amber-500",
  Neutral: "bg-slate-400/15 text-slate-400",
};

const SIGNAL_GUIDANCE: Record<string, string> = {
  Strong: "The model sees a clearly favorable historical pattern for this sector right now. This is not a buy signal — just a stronger-than-usual pattern match.",
  Moderate: "The model sees a mildly favorable pattern, but it's not a strong signal either way.",
  Neutral: "The model doesn't see a clear pattern in either direction for this sector right now.",
};

export default function SectorDetail() {
  const { sector } = useParams<{ sector: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["sectorShap", sector],
    queryFn: () => getSectorShap(sector!),
    enabled: !!sector,
  });

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Link to="/glossary" className="text-sm text-primary underline whitespace-nowrap">
            How this works
          </Link>
        </div>

                {isLoading && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center">
              Working out why the model scored this sector the way it did...
            </p>
            <div className="h-24 rounded-xl bg-muted animate-pulse" />
            <div className="h-64 rounded-xl bg-muted animate-pulse" />
          </div>
        )}

        {isError && (
          <p className="text-sm text-red-500">Couldn't load details for this sector.</p>
        )}

        {data && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">{data.sector}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 flex items-center">
                    Score: {data.score}/100
                    <InfoTooltip termKey="score" />
                  </p>
                </div>
                <span
                  className={`text-sm px-3 py-1.5 rounded-full font-medium flex items-center ${
                    SIGNAL_STYLES[data.signal] ?? SIGNAL_STYLES.Neutral
                  }`}
                >
                  {data.signal}
                  <InfoTooltip termKey="signal" />
                </span>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground border-t border-border pt-3">
                  {SIGNAL_GUIDANCE[data.signal] ?? SIGNAL_GUIDANCE.Neutral}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center">
                  What's driving this score?
                  <InfoTooltip termKey="shap" />
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Positive factors push the sector's outlook up; negative factors pull it down.
                  <br />
                  <span className="italic">
                    Note: these percentages show each factor's influence on the score above — they are not the sector's actual price return.
                  </span>
                </p>
              </CardHeader>
              <CardContent>
                <ShapWaterfall
                  positive={data.positive_contributors}
                  negative={data.negative_contributors}
                />
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground text-center pt-2">
              This explanation reflects the model's reasoning based on historical patterns.
              It is not personalized financial advice.
            </p>
          </>
        )}
      </div>
    </div>
  );
}