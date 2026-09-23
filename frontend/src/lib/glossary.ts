export const GLOSSARY: Record<string, { term: string; simple: string }> = {
  score: {
    term: "Score",
    simple: "A number from 0-100 showing how likely this sector is to do better than the overall market next week, based on patterns the model found in past data. Higher = more favorable outlook.",
  },
  signal: {
    term: "Signal (Strong / Moderate / Neutral)",
    simple: "A simple label for the score: Strong means the model sees a clearly favorable pattern, Neutral means it's unsure either way.",
  },
  regime: {
    term: "Market Regime",
    simple: "A short description of the overall economic weather right now — is the economy growing, prices rising fast, interest rates changing? This context shapes which sectors tend to do well.",
  },
  shap: {
    term: "What's Driving This Score",
    simple: "A breakdown of WHY the model gave this score — which factors (like recent price trends or inflation) pushed the outlook up (green) or down (red), and by how much.",
  },
  sectorMomentum: {
    term: "Sector Momentum",
    simple: "How this sector's stock prices have been moving recently. Strong recent gains can signal continued strength (or a coming correction).",
  },
  volatility: {
    term: "Volatility",
    simple: "How much this sector's prices have been jumping up and down recently. Higher volatility means higher risk and less predictability.",
  },
  shortTermTrend: {
    term: "Short-Term Trend",
    simple: "The average price level over the last 4 weeks — a quick read on recent direction.",
  },
  longTermTrend: {
    term: "Long-Term Trend",
    simple: "The average price level over the last 12 weeks — a slower, steadier read on direction.",
  },
  gdpGrowth: {
    term: "GDP Growth",
    simple: "Whether the overall economy (total value of goods/services produced) is expanding or shrinking. Growth generally helps most sectors.",
  },
  inflation: {
    term: "Inflation",
    simple: "How fast prices for everyday goods are rising. High inflation can hurt some sectors (like consumer goods) and help others (like commodities).",
  },
  interestRate: {
    term: "Interest Rate Trend",
    simple: "The cost of borrowing money, set by the central bank. Rising rates often slow down sectors like real estate and growth stocks.",
  },
  backtest: {
    term: "Backtest",
    simple: "A test of 'what if you had followed this strategy in the past?' — run on historical data the model never got to see in advance, so the result reflects genuine, honest performance rather than hindsight.",
  },
  pickAccuracy: {
    term: "Pick Accuracy",
    simple: "Out of all the weeks tested, the percentage of times the model's top-ranked sector actually beat the overall market that week. 50% is like a coin flip.",
  },
  sharpeRatio: {
    term: "Sharpe Ratio",
    simple: "A measure of return per unit of risk taken. Higher is better — it means you got more reward for the ups-and-downs you endured. Below 1 is generally considered weak, above 1 is decent.",
  },
  maxDrawdown: {
    term: "Max Drawdown",
    simple: "The single worst drop from a peak to a low point during the test period. A smaller (less negative) number means a smoother ride.",
  },
    cumulativeReturn: {
    term: "Cumulative Return",
    simple: "The total percentage gain or loss over the whole period, if you'd invested at the very start and held on.",
  },
  nifty50: {
    term: "Nifty 50",
    simple: "An index made up of the 50 biggest, most-traded companies on India's National Stock Exchange (NSE). It's commonly used as a stand-in for 'how the Indian stock market did overall,' the way the S&P 500 is used for the US market.",
  },
};