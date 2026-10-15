import { useEffect, useState } from "react";

export type WidgetKey =
  | "inflation"
  | "priceMover"
  | "lemonade"
  | "sectorMatch"
  | "explorer"
  | "ranking"
  | "companies"
  | "decision"
  | "readiness"
  | "review";

export interface Check {
  q: string;
  options: string[];
  answer: number;
  why: string;
}

export interface Card {
  icon: string;
  title: string;
  text: string;
  risk?: number;
}

export interface JourneyStep {
  n: number;
  phase: 1 | 2 | 3;
  emoji: string;
  grad: string;
  title: string;
  question: string;
  simple: string;
  intro: string;
  analogy: { emojis: string[]; caption: string };
  cards: Card[];
  walk?: { icon: string; text: string }[];
  widget?: WidgetKey;
  links?: { to: string; label: string }[];
  warn?: string;
  check: Check;
}

export const STORAGE_KEY = "investiq_journey_done";

export function loadDone(): number[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "number") : [];
  } catch {
    return [];
  }
}

export function useJourneyProgress() {
  const [done, setDone] = useState<number[]>(() => loadDone());

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(done));
    } catch {
      // storage unavailable, ignore
    }
  }, [done]);

  const mark = (n: number) => setDone((d) => (d.includes(n) ? d : [...d, n]));
  const reset = () => setDone([]);
  return { done, mark, reset };
}

export function plantStage(percent: number) {
  if (percent === 0) return { emoji: "🌰", label: "A seed. Let's start!" };
  if (percent < 40) return { emoji: "🌱", label: "A tiny sprout" };
  if (percent < 80) return { emoji: "🌿", label: "Growing nicely" };
  if (percent < 100) return { emoji: "🌳", label: "Almost fully grown" };
  return { emoji: "🌟", label: "Fully grown! Great job" };
}

export const PHASES = [
  {
    id: 1,
    emoji: "🧠",
    title: "Understand the basics",
    sub: "Steps 1 to 6",
    grad: "bg-[linear-gradient(135deg,#38bdf8_0%,#6366f1_100%)]",
  },
  {
    id: 2,
    emoji: "🔭",
    title: "Explore and choose",
    sub: "Steps 7 to 9",
    grad: "bg-[linear-gradient(135deg,#f472b6_0%,#a855f7_100%)]",
  },
  {
    id: 3,
    emoji: "🚀",
    title: "Start investing",
    sub: "Steps 10 to 13",
    grad: "bg-[linear-gradient(135deg,#34d399_0%,#0d9488_100%)]",
  },
] as const;

const G1 = "bg-[linear-gradient(135deg,#38bdf8_0%,#6366f1_100%)]";
const G2 = "bg-[linear-gradient(135deg,#f472b6_0%,#a855f7_100%)]";
const G3 = "bg-[linear-gradient(135deg,#34d399_0%,#0d9488_100%)]";

export const STEPS: JourneyStep[] = [
  {
    n: 1,
    phase: 1,
    emoji: "💸",
    grad: G1,
    title: "Why should I invest?",
    question: "Why not just keep my money safe in a drawer?",
    simple:
      "Prices go up over time, so money in a drawer buys less and less. Investing tries to grow money, but it can also go down.",
    intro:
      "Prices usually rise over the years, which is called inflation. Money kept idle slowly loses buying power, and future goals need money. That is why people invest, while accepting some risk.",
    analogy: {
      emojis: ["🍫", "💸", "🍬"],
      caption: "A chocolate that costs ₹10 now may cost more in future years, so idle money buys less.",
    },
    cards: [
      { icon: "💸", title: "Prices go up", text: "Things usually cost more each year. This is called inflation." },
      { icon: "🌳", title: "Money can grow", text: "Investing can earn returns, and returns can earn more returns. This is compounding." },
      { icon: "🎯", title: "Goals need money", text: "Studies, a bike, a home or retirement all need money in the future." },
      { icon: "⚠️", title: "There is risk", text: "Investments can go down as well as up, so learn first and start small." },
    ],
    widget: "inflation",
    links: [{ to: "/steps", label: "Try the saving calculators" }],
    check: {
      q: "What usually happens to money kept idle for many years?",
      options: ["It always grows by itself", "It buys less over time because prices rise", "Nothing changes"],
      answer: 1,
      why: "Because of inflation, the same amount of money buys less as prices rise.",
    },
  },
  {
    n: 2,
    phase: 1,
    emoji: "🧰",
    grad: G1,
    title: "What can I invest in?",
    question: "What are my options?",
    simple: "There are many places to put money. Some are very safe but grow slowly. Others grow faster but bounce around a lot.",
    intro:
      "There is no single best option. Each tool has its own balance of safety, growth and ease of getting your money back. This is a rough guide only, because the risk depends on the exact product.",
    analogy: {
      emojis: ["🏦", "📈", "🏢"],
      caption: "From the safest to the bumpiest: different tools for different jobs.",
    },
    cards: [
      { icon: "🏦", title: "Savings account or fixed deposit", text: "Very safe and easy, but growth is usually low.", risk: 1 },
      { icon: "📜", title: "Bonds and government securities", text: "You lend money and earn interest. Usually steadier, but not risk-free.", risk: 2 },
      { icon: "🪙", title: "Gold", text: "Often used to balance savings. Its price still goes up and down.", risk: 3 },
      { icon: "📈", title: "Mutual funds", text: "Many people pool money and experts pick the investments. Risk depends on the type of fund.", risk: 3 },
      { icon: "🏠", title: "Real estate", text: "Needs a large amount and can be slow to sell.", risk: 3 },
      { icon: "🏢", title: "Stocks", text: "You own part of a company. Higher potential, and bigger swings.", risk: 4 },
    ],
    check: {
      q: "Which of these usually has the biggest ups and downs?",
      options: ["Savings account", "Fixed deposit", "Stocks"],
      answer: 2,
      why: "Stocks can rise a lot but can also fall a lot, so they usually swing more than savings or deposits.",
    },
  },
  {
    n: 3,
    phase: 1,
    emoji: "🍕",
    grad: G1,
    title: "How do stocks work?",
    question: "What am I actually buying when I buy a stock?",
    simple: "A company is like a pizza. A share is one slice, so you own a tiny part of it. Prices go up and down.",
    intro:
      "A share is a small piece of ownership in a company. Shares are bought and sold on exchanges, and their prices move all day as buyers and sellers react to news and expectations.",
    analogy: {
      emojis: ["🍕", "🔪", "🧩"],
      caption: "A company is like a pizza. A share is one slice, so you own a small part.",
    },
    cards: [
      { icon: "🧩", title: "A share is a small part", text: "Owning a share means owning a tiny piece of a company." },
      { icon: "🏛️", title: "Exchanges are marketplaces", text: "In India the main ones are the BSE and the NSE." },
      { icon: "🎢", title: "Prices move", text: "When more people want to buy than sell, the price tends to rise. When more want to sell, it tends to fall." },
      { icon: "💵", title: "You can gain or lose", text: "You may gain if the price rises or the company pays a dividend (a share of profit). You may lose if the price falls." },
      { icon: "🔐", title: "You need an account", text: "To hold shares you need a demat and trading account." },
    ],
    widget: "priceMover",
    check: {
      q: "What is a share?",
      options: ["A loan you give to a company", "A small part of ownership in a company", "A type of bank account"],
      answer: 1,
      why: "A share is a small piece of ownership in a company.",
    },
  },
  {
    n: 4,
    phase: 1,
    emoji: "🍋",
    grad: G1,
    title: "How do companies work?",
    question: "Where does a company's money come from?",
    simple: "A company sells things and pays its costs. What is left over is profit. Share prices follow what people expect about future profit.",
    intro:
      "Companies earn money from sales and pay costs like materials, salaries and loan interest. The difference is profit. They can reinvest it to grow, or pay part of it to owners as dividends.",
    analogy: {
      emojis: ["🍋", "🥤", "💰"],
      caption: "A lemonade stand: what you earn minus what you spend is your profit.",
    },
    cards: [
      { icon: "💰", title: "Revenue", text: "The money a company earns from selling its products or services." },
      { icon: "🧾", title: "Costs", text: "Ingredients, salaries, rent and interest on loans." },
      { icon: "📊", title: "Profit", text: "Revenue minus costs. If costs are higher, it is a loss." },
      { icon: "🌱", title: "Grow or share", text: "A company can reinvest profit to grow or pay part of it as dividends." },
      { icon: "🔮", title: "Expectations matter", text: "Share prices reflect what people expect about future profits, not just today's." },
    ],
    widget: "lemonade",
    check: {
      q: "What is profit?",
      options: ["All the money a company earns", "The price of one share", "Money earned minus money spent"],
      answer: 2,
      why: "Profit is revenue minus costs.",
    },
  },
  {
    n: 5,
    phase: 1,
    emoji: "🏫",
    grad: G1,
    title: "What is a sector?",
    question: "What does it mean when people say 'the auto sector'?",
    simple: "A sector is a group of companies that do a similar kind of work, like classes in a school.",
    intro:
      "Companies are grouped into sectors by what they do, such as cars, medicines, banks or technology. Companies in one sector often react to similar things.",
    analogy: {
      emojis: ["🚗", "💊", "🏦"],
      caption: "Like classes in a school: companies are grouped by what they do.",
    },
    cards: [
      { icon: "🏫", title: "Groups of similar companies", text: "Car makers sit in Auto, medicine makers in Pharma, and so on." },
      { icon: "🌦️", title: "Different reactions", text: "A change in loan rates affects banks and car sales differently from how it affects medicine makers." },
      { icon: "🧭", title: "Sector indexes", text: "Each sector can have its own index that tracks its companies." },
      { icon: "🧺", title: "Spreading out", text: "Holding different sectors can reduce the damage if one area falls." },
    ],
    widget: "sectorMatch",
    check: {
      q: "What is a sector?",
      options: ["One single company", "A group of companies in a similar business", "A kind of loan"],
      answer: 1,
      why: "A sector is a group of companies that do a similar kind of business.",
    },
  },
  {
    n: 6,
    phase: 1,
    emoji: "🌦️",
    grad: G1,
    title: "Understand the sectors",
    question: "What makes each sector go up or down?",
    simple: "The economy is like the weather. Each sector is a plant that likes different weather.",
    intro:
      "Each sector depends on different things, like loan rates, global demand, prices of materials or government policy. Learning what drives a sector helps you understand why it moves.",
    analogy: {
      emojis: ["🌦️", "🌱", "🌾"],
      caption: "The economy is the weather, and each sector is a plant that likes different weather.",
    },
    cards: [
      { icon: "🏦", title: "Loan rates matter", text: "Banks, homes and vehicles are affected by interest rates, since many buyers take loans." },
      { icon: "🌍", title: "Global demand matters", text: "Metals and technology services depend a lot on demand from other countries." },
      { icon: "🛒", title: "Everyday needs", text: "Companies that sell daily needs and medicines are often steadier when the economy is slow." },
      { icon: "📉", title: "Cyclical sectors", text: "Some sectors rise and fall with the economy, so their profits can swing a lot." },
    ],
    widget: "explorer",
    links: [{ to: "/markets", label: "See how markets are doing today" }],
    check: {
      q: "Why do sectors react differently to the economy?",
      options: ["They depend on different things, like loan rates or global demand", "They are all exactly the same", "It is only luck"],
      answer: 0,
      why: "Each sector depends on different drivers, so the same news can affect them differently.",
    },
  },
  {
    n: 7,
    phase: 2,
    emoji: "🏆",
    grad: G2,
    title: "Which sectors look interesting?",
    question: "Where should I start looking?",
    simple: "This is InvestIQ's scoreboard. It shows where the past patterns look good. It points where to look, not what to buy.",
    intro:
      "InvestIQ uses economic data and past patterns to score each sector. A higher score means the patterns look more favorable. It is a starting point for learning, not a promise.",
    analogy: {
      emojis: ["📊", "🏆", "🔍"],
      caption: "InvestIQ is a scoreboard of patterns. It shows where to look, not what to buy.",
    },
    cards: [
      { icon: "🏆", title: "Score (0 to 100)", text: "How favorable the model's past patterns look. It is not a forecast." },
      { icon: "🚦", title: "Signal", text: "A simple label: Strong, Moderate or Neutral." },
      { icon: "🎢", title: "Volatility", text: "How bumpy the ride has been. Higher is bumpier, not necessarily worse." },
      { icon: "🤔", title: "Interesting is not a buy order", text: "Use the ranking to pick sectors to study further." },
    ],
    widget: "ranking",
    links: [
      { to: "/sectors", label: "Open the full Sector Outlook" },
      { to: "/backtest", label: "See how the picks did in the past" },
    ],
    warn: "This is general education, not personal investment advice.",
    check: {
      q: "What does a Strong signal in InvestIQ mean?",
      options: ["You will definitely make money", "You must buy now", "Past patterns look favorable, but nothing is promised"],
      answer: 2,
      why: "A Strong signal is a pattern from past data. It does not promise future results.",
    },
  },
  {
    n: 8,
    phase: 2,
    emoji: "🕵️",
    grad: G2,
    title: "Study companies",
    question: "How do I look inside a company?",
    simple: "Be a detective. Ask what the company sells, whether it is growing, and how much it owes.",
    intro:
      "Once a sector interests you, look at the companies in it. A few simple questions tell you a lot about a business, before you ever think about its price.",
    analogy: {
      emojis: ["🕵️", "🔍", "🏢"],
      caption: "Be a detective: check the company before you trust it.",
    },
    cards: [
      { icon: "🛍️", title: "What does it sell?", text: "Understand how the company makes money and who its customers are." },
      { icon: "📈", title: "Is it growing?", text: "Look at sales and profit over several years, not just one." },
      { icon: "💳", title: "How much debt?", text: "A lot of debt can be risky when business slows." },
      { icon: "🏷️", title: "Is the price reasonable?", text: "Compare its price with its profit, and with similar companies." },
      { icon: "📰", title: "Read it from the source", text: "Company websites and the BSE and NSE websites publish results and announcements." },
    ],
    widget: "companies",
    warn: "Company names are shown for reference only. They are not recommendations.",
    check: {
      q: "Which is a good question to ask about a company?",
      options: ["What colour is its logo?", "Is it growing and profitable, and how much debt does it have?", "Did my friend buy it?"],
      answer: 1,
      why: "Growth, profit and debt tell you far more about a business than logos or what others did.",
    },
  },
  {
    n: 9,
    phase: 2,
    emoji: "⚖️",
    grad: G2,
    title: "How do I decide?",
    question: "How do I make a sensible choice?",
    simple: "Think about your goal, when you need the money, and how you would feel if prices fell. Write down your reason.",
    intro:
      "A good decision matches your goal, your timeline and your comfort with risk. Writing down your reason now makes it easier to stay calm later.",
    analogy: {
      emojis: ["⚖️", "🧺", "📝"],
      caption: "Weigh your goal, your time and your comfort with risk, then write down why.",
    },
    cards: [
      { icon: "🎯", title: "Goal and time", text: "When will you need this money? Money needed soon is not suited to risky investments." },
      { icon: "😬", title: "Risk comfort", text: "How would you feel if your investment fell by a fifth?" },
      { icon: "🧺", title: "Don't use one basket", text: "Spreading money across many companies or sectors can reduce the damage of one bad pick." },
      { icon: "📝", title: "Write your reason", text: "Note why you chose it and what would change your mind." },
      { icon: "🙋", title: "Ask for help", text: "For big decisions, talk to someone you trust or a SEBI-registered adviser." },
    ],
    widget: "decision",
    warn: "This is general education, not personal investment advice.",
    check: {
      q: "Which money is NOT suited for risky investments?",
      options: ["Money you will not need for many years", "Spare money", "Money you need soon"],
      answer: 2,
      why: "Prices can be down just when you need the money, so money needed soon should stay safe.",
    },
  },
  {
    n: 10,
    phase: 3,
    emoji: "🛣️",
    grad: G3,
    title: "How can I invest?",
    question: "Where and how do I actually put money in?",
    simple: "There are a few safe roads: a fund app, a broker app, or a fund company's own website. Pick a registered one.",
    intro:
      "You can invest through a mutual fund app or website, a stockbroker app, or directly with a fund house. What you pick depends on what you want to buy.",
    analogy: {
      emojis: ["🛣️", "📱", "🏁"],
      caption: "Many roads lead to the same place. Pick a safe, registered one.",
    },
    cards: [
      { icon: "📱", title: "Fund app or website", text: "Good for SIPs in mutual funds." },
      { icon: "🧾", title: "Broker app", text: "For buying shares and ETFs. Needs a demat account." },
      { icon: "🏢", title: "Fund house website", text: "Invest directly in that company's funds." },
      { icon: "🧺", title: "Index fund or ETF", text: "Both follow an index. An ETF trades on the exchange like a share." },
      { icon: "🔁", title: "SIP or one-time", text: "A SIP invests a fixed amount regularly. A lump sum invests once." },
      { icon: "🏷️", title: "Direct or regular plan", text: "Direct plans have a lower yearly fee. Regular plans are sold through a distributor." },
    ],
    links: [{ to: "/steps?tab=plan", label: "How to choose and verify a platform" }],
    check: {
      q: "What does a SIP do?",
      options: ["Closes your account", "Guarantees a profit", "Invests a fixed amount at regular intervals"],
      answer: 2,
      why: "A SIP invests a fixed amount on a regular schedule, such as every month.",
    },
  },
  {
    n: 11,
    phase: 3,
    emoji: "🎒",
    grad: G3,
    title: "Get ready to invest",
    question: "What should I sort out first?",
    simple: "Pack your bag before the trip: ID check, bank account, a little emergency money, and a grown-up if you are under 18.",
    intro:
      "Before the first rupee goes in, make sure the basics are done. It keeps you safe and makes the process smooth.",
    analogy: {
      emojis: ["🎒", "✅", "🗺️"],
      caption: "Pack your bag before the trip.",
    },
    cards: [
      { icon: "🆔", title: "Finish KYC", text: "The identity check needed for funds and trading accounts." },
      { icon: "🏦", title: "Bank account", text: "You will link it to your investing account." },
      { icon: "🐷", title: "Emergency fund", text: "A small cushion so you never have to sell in a hurry." },
      { icon: "💳", title: "Clear costly debt", text: "Pay off high-interest debt, like credit card dues, first." },
      { icon: "👨‍👩‍👧", title: "Guardian if under 18", text: "A parent or guardian must open and operate the account." },
      { icon: "✅", title: "Verified platform", text: "Check its registration on SEBI's website." },
    ],
    widget: "readiness",
    links: [{ to: "/steps", label: "Open the full checklist and calculators" }],
    check: {
      q: "What should come before investing?",
      options: ["Borrowing money to invest", "An emergency fund and clearing high-interest debt", "Skipping the identity check"],
      answer: 1,
      why: "A cushion and no costly debt mean you will not be forced to sell at a bad time.",
    },
  },
  {
    n: 12,
    phase: 3,
    emoji: "🚲",
    grad: G3,
    title: "Make a first investment",
    question: "What does the first time look like?",
    simple: "Start tiny, like riding a bike with training wheels. Read before you confirm, and keep the receipt.",
    intro:
      "Your first investment should be small, simple and well understood. Follow a short routine, and never rush.",
    analogy: {
      emojis: ["🚲", "🛟", "🌟"],
      caption: "Your first ride: go slow and keep the training wheels on.",
    },
    cards: [
      { icon: "🌱", title: "Start small", text: "Begin with an amount you are comfortable with." },
      { icon: "🔎", title: "Read before confirming", text: "Check the fees and the risk label." },
      { icon: "🧾", title: "Keep the receipt", text: "Save the confirmation for your records." },
    ],
    walk: [
      { icon: "🔑", text: "Log in to your verified app" },
      { icon: "🔍", text: "Open the fund or stock you studied" },
      { icon: "🏷️", text: "Read its fees and risk label" },
      { icon: "🔁", text: "Choose a monthly SIP or a one-time payment" },
      { icon: "💰", text: "Enter a small amount you are comfortable with" },
      { icon: "🧾", text: "Confirm and save the receipt" },
    ],
    links: [{ to: "/practice", label: "Practise first in the Practice Corner" }],
    warn: "Never share your OTP, PIN or password. Be careful of anyone who promises guaranteed or very high returns.",
    check: {
      q: "Someone promises guaranteed high returns. What should you do?",
      options: ["Send money quickly before it ends", "Be careful: this is a warning sign", "Share your OTP to get started"],
      answer: 1,
      why: "Genuine investments cannot guarantee high returns. Promises like this are a common scam sign.",
    },
  },
  {
    n: 13,
    phase: 3,
    emoji: "🌳",
    grad: G3,
    title: "Monitor and learn",
    question: "What do I do after I have invested?",
    simple: "Water your plant, but do not dig it up every day. Check in every few months and keep learning.",
    intro:
      "Investing is not one decision, it is a habit. Review now and then, stay calm in dips, and keep learning.",
    analogy: {
      emojis: ["🌳", "💧", "⏳"],
      caption: "Like a garden: water it, watch it, and be patient.",
    },
    cards: [
      { icon: "🗓️", title: "Review every few months", text: "Checking daily mostly adds stress." },
      { icon: "📓", title: "Compare with your reason", text: "Is the reason you wrote down still true?" },
      { icon: "😌", title: "Stay calm in dips", text: "Prices fall sometimes. Avoid panic-selling." },
      { icon: "➕", title: "Keep adding steadily", text: "A regular SIP keeps you consistent." },
      { icon: "📚", title: "Keep learning", text: "SEBI's investor website has free beginner material." },
    ],
    widget: "review",
    links: [
      { to: "/backtest", label: "See past performance" },
      { to: "/markets", label: "Check the markets" },
    ],
    check: {
      q: "A sector you invested in falls for a week. What is a calm first step?",
      options: ["Panic-sell everything", "Borrow money to buy more", "Check your original reason and plan before acting"],
      answer: 2,
      why: "A short dip is common. Check whether your reason has really changed before doing anything.",
    },
  },
];