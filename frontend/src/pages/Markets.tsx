import MarketPanel from "@/components/MarketPanel";

export default function Markets() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Market Overview</h1>
        <p className="text-sm text-muted-foreground">
          How major stock markets around the world have moved recently. This is background
          context. The sector scores on your Dashboard are calculated separately.
        </p>
      </div>

      <div className="max-w-xl">
        <MarketPanel />
      </div>

      <div className="text-xs text-muted-foreground space-y-1 max-w-xl">
        <p>
          <span className="font-medium text-foreground">What is an index?</span> A number that
          tracks a group of large companies, like NIFTY 50 or SENSEX in India, or the Dow Jones in
          the US. When it rises, those companies are doing better on average.
        </p>
        <p>
          Green means the index closed higher than the previous day, and red means lower. The
          small line shows the last 30 days.
        </p>
      </div>
    </div>
  );
}