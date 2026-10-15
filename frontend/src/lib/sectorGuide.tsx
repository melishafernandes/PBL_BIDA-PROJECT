export interface SectorInfo {
  about: string;
  drivers: string[];
  risks: string[];
}

const GUIDE: Record<string, SectorInfo> = {
  metal: {
    about:
      "Companies that make and process metals such as steel, aluminium and copper, which go into buildings, vehicles and machines.",
    drivers: [
      "Global metal prices, which can change quickly",
      "Demand from construction, infrastructure and manufacturing",
      "Trade rules, import duties and exchange rates",
    ],
    risks: [
      "Highly cyclical: profits can swing sharply with the economy",
      "Metal prices can fall fast on global news",
      "Some companies carry a lot of debt",
    ],
  },
  auto: {
    about: "Companies that make cars, two-wheelers, trucks and vehicle parts.",
    drivers: [
      "Household incomes and festive-season demand",
      "Loan interest rates, since many buyers take loans",
      "Fuel prices and the shift to electric vehicles",
    ],
    risks: [
      "Sales fall when the economy slows",
      "Rising raw material costs such as steel and aluminium",
      "Rule changes on emissions and electric vehicles",
    ],
  },
  pharma: {
    about: "Companies that make medicines and healthcare products, in India and for export.",
    drivers: [
      "Steady everyday demand for medicines",
      "Approvals and inspections by drug regulators, including in the US",
      "Exports and the rupee-dollar exchange rate",
    ],
    risks: [
      "Regulatory action or a failed inspection can hurt a company",
      "Price controls and competition",
      "Currency swings",
    ],
  },
  it: {
    about: "Companies that build software and provide technology services, mostly to clients abroad.",
    drivers: [
      "How much clients in the US and Europe spend on technology",
      "The rupee-dollar exchange rate",
      "New technology trends such as AI and cloud",
    ],
    risks: [
      "Clients cut spending during slowdowns",
      "Changes in visa and trade rules",
      "Fast-changing technology",
    ],
  },
  bank: {
    about: "Banks that take deposits from people and give loans.",
    drivers: [
      "Interest rates and demand for loans",
      "How many loans are repaid on time",
      "The strength of the overall economy",
    ],
    risks: [
      "Loans can go bad when the economy slows",
      "Changes in rules from the regulator",
      "Shrinking gap between loan and deposit rates",
    ],
  },
  "financial services": {
    about: "Banks, lenders, insurers and other companies that handle money and loans.",
    drivers: [
      "Interest rates and loan demand",
      "How many loans are repaid on time",
      "Growth of the overall economy",
    ],
    risks: [
      "Loans can go bad when the economy slows",
      "Changes in rules from regulators",
      "Competition from new lenders",
    ],
  },
  fmcg: {
    about: "Companies that sell everyday goods like soap, snacks and packaged food.",
    drivers: [
      "Steady demand for daily needs",
      "Spending in rural and urban areas",
      "Costs of raw materials such as edible oil and packaging",
    ],
    risks: [
      "Rising input costs can squeeze profits",
      "Growth can be slow in a mature business",
      "Competition from new brands",
    ],
  },
  energy: {
    about: "Companies that produce or supply oil, gas and electricity.",
    drivers: [
      "Oil and gas prices",
      "Demand for electricity",
      "Government policy and the move towards cleaner energy",
    ],
    risks: [
      "Prices can swing sharply",
      "Changes in policy and regulation",
      "Long-term shift away from fossil fuels",
    ],
  },
  realty: {
    about: "Companies that build and sell homes and commercial property.",
    drivers: [
      "Home loan interest rates",
      "Demand for homes and offices",
      "Approvals and rules for property projects",
    ],
    risks: [
      "Very sensitive to interest rates and the economy",
      "Projects can be delayed",
      "Many companies carry debt",
    ],
  },
  infra: {
    about: "Companies that build roads, railways, ports, power plants and other large projects.",
    drivers: [
      "Government spending on projects",
      "How many new orders companies win",
      "Prices of cement and steel",
    ],
    risks: [
      "Project delays and rising costs",
      "Dependence on government budgets",
      "Debt on company books",
    ],
  },
  media: {
    about: "Companies in television, film, advertising and streaming.",
    drivers: [
      "How much businesses spend on advertising",
      "Growth in subscribers",
      "Changes in how people watch content",
    ],
    risks: [
      "Advertising falls when the economy slows",
      "Viewers moving to new platforms",
      "Rising content costs",
    ],
  },
  healthcare: {
    about: "Hospitals, diagnostic labs and other healthcare services.",
    drivers: [
      "Growing demand for care",
      "New hospitals and beds",
      "Spread of health insurance",
    ],
    risks: [
      "Price pressure and rising costs",
      "Changes in regulation",
      "Heavy spending on expansion",
    ],
  },
  "consumer durables": {
    about: "Companies that make appliances and electronics, such as air conditioners, fridges and TVs.",
    drivers: [
      "Household incomes",
      "Demand for housing",
      "Hot summers, which boost cooling products",
    ],
    risks: [
      "Demand falls when household budgets are tight",
      "Rising component costs",
      "Strong competition",
    ],
  },
};

const ALIASES: Record<string, string> = {
  banking: "bank",
  banks: "bank",
  infrastructure: "infra",
  "oil & gas": "energy",
  "oil and gas": "energy",
  "information technology": "it",
};

export function getSectorInfo(sector: string): SectorInfo {
  const key = sector.trim().toLowerCase();
  const found = GUIDE[ALIASES[key] ?? key];
  if (found) return found;
  return {
    about: `Companies in the ${sector} sector.`,
    drivers: [
      "Economic conditions",
      "Demand for the sector's products and services",
      "Government policy",
    ],
    risks: [
      "Sector-wide downturns",
      "Problems at individual companies",
      "Changes in rules and regulations",
    ],
  };
}

// Names that often appear in beginner guides. Not a ranking or a recommendation.
export const PLATFORMS = [
  "Groww",
  "Zerodha (Coin for mutual funds)",
  "Upstox",
  "Paytm Money",
  "ET Money",
  "FundsIndia",
];