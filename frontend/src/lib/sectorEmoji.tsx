const EMOJI: Record<string, string> = {
  auto: "🚗",
  pharma: "💊",
  metal: "🔩",
  it: "💻",
  bank: "🏦",
  banking: "🏦",
  "financial services": "💳",
  fmcg: "🛒",
  energy: "⚡",
  "oil & gas": "🛢️",
  realty: "🏠",
  infra: "🏗️",
  infrastructure: "🏗️",
  media: "🎬",
  healthcare: "🏥",
  "consumer durables": "🔌",
};

export function sectorEmoji(name: string): string {
  return EMOJI[name.trim().toLowerCase()] ?? "📊";
}