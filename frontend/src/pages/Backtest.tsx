import { useQuery } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getBacktest } from "@/lib/api";
import InfoTooltip from "@/components/InfoTooltip";
import { GLOSSARY } from "@/lib/glossary";

export default function Backtest() {
  const navigate = useNavigate();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["backtest"],
    queryFn: getBacktest,
  });

  const chartData = data?.equity_curve?.map((point: any) => ({
    date: new Date(point.date).toLocaleDateString("en-IN", { month: "short", year: "2-digit" }),
    Strategy: +((point.strategy_cumulative - 1) * 100).toFixed(2),
    "Nifty 50": +((point.benchmark_cumulative - 1) * 100).toFixed(2),
  }));

  const stats: { label: string; value: string | number; key: keyof typeof GLOSSARY }[] = [
    { label: "Strategy Return", value: `${data?.strategy_total_return_pct}%`, key: "cumulativeReturn" },
    { label: "Benchmark Return", value: `${data?.benchmark_total_return_pct}%`, key: "cumulativeReturn" },
    { label: "Pick Accuracy", value: `${data?.pick_accuracy_vs_benchmark_pct}%`, key: "pickAccuracy" },
    { label: "Strategy Sharpe", value: data?.strategy_sharpe, key: "sharpeRatio" },
    { label: "Benchmark Sharpe", value: data?.benchmark_sharpe, key: "sharpeRatio" },
    { label: "Max Drawdown", value: `${data?.strategy_max_drawdown_pct}%`, key: "maxDrawdown" },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
          <Link to="/glossary" className="text-sm text-primary underline whitespace-nowrap">
            How this works
          </Link>
        </div>

        <div>
          <h1 className="text-2xl font-bold flex items-center">
            Historical Backtest
            <InfoTooltip termKey="backtest" />
          </h1>
            <p className="text-sm text-muted-foreground flex items-center flex-wrap">
            Walk-forward simulation: following the top-ranked sector each week, vs. holding the Nifty 50.
            <InfoTooltip termKey="nifty50" />
          </p>
        </div>

                {isLoading && (
          <div className="space-y-3">
            <p className="text-xs text-muted-foreground text-center">
              Replaying history week by week — this involves retraining the model several times,
              so it can take up to a minute...
            </p>
            <div className="h-80 rounded-xl bg-muted animate-pulse" />
            <div className="h-24 rounded-xl bg-muted animate-pulse" />
          </div>
        )}

        {isError && <p className="text-sm text-red-500">Couldn't load backtest results.</p>}

        {data && (
          <>
            <Card>
                            <CardHeader>
                <CardTitle className="text-base flex items-center">
                  Cumulative Return (%)
                  <InfoTooltip termKey="cumulativeReturn" />
                </CardTitle>
                <p className="text-xs text-muted-foreground flex items-center flex-wrap">
                  Green = this app's strategy. Grey = Nifty 50 (the overall Indian market).
                  Lines going up mean money grew; going down means it shrank.
                  <InfoTooltip termKey="nifty50" />
                </p>
              </CardHeader>
              <CardContent>
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="date" tick={{ fontSize: 12 }} interval="preserveStartEnd" />
                      <YAxis tick={{ fontSize: 12 }} unit="%" />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Strategy" stroke="#10b981" strokeWidth={2} dot={false} />
                      <Line type="monotone" dataKey="Nifty 50" stroke="#94a3b8" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {stats.map((stat) => (
                <Card key={stat.label}>
                  <CardContent className="pt-6">
                    <p className="text-xs text-muted-foreground flex items-center">
                      {stat.label}
                      <InfoTooltip termKey={stat.key} />
                    </p>
                    <p className="text-xl font-semibold mt-1">{stat.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <p className="text-xs text-muted-foreground text-center pt-2">
              {data.risk_disclaimer}
            </p>
          </>
        )}
      </div>
    </div>
  );
}