import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";

interface SimpleModeValue {
  simple: boolean;
  toggle: () => void;
}

const SimpleModeContext = createContext<SimpleModeValue>({
  simple: false,
  toggle: () => {},
});

export function SimpleModeProvider({ children }: { children: ReactNode }) {
  const [simple, setSimple] = useState<boolean>(() => {
    try {
      return localStorage.getItem("investiq_simple") === "1";
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem("investiq_simple", simple ? "1" : "0");
    } catch {
      // storage unavailable, ignore
    }
  }, [simple]);

  return (
    <SimpleModeContext.Provider value={{ simple, toggle: () => setSimple((s) => !s) }}>
      {children}
    </SimpleModeContext.Provider>
  );
}

export const useSimpleMode = () => useContext(SimpleModeContext);

export const SIGNAL_LABEL = {
  normal: { Strong: "Strong", Moderate: "Moderate", Neutral: "Neutral" },
  simple: {
    Strong: "Looking good 🌟",
    Moderate: "Looking okay 🙂",
    Neutral: "Nothing special yet",
  },
} as const;

export const RISK_LABEL = {
  normal: { Low: "Low volatility", Medium: "Medium volatility", High: "High volatility" },
  simple: { Low: "Calm ride", Medium: "A few bumps", High: "Bumpy ride" },
} as const;