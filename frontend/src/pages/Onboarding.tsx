import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { submitProfile, type ProfileData } from "@/lib/api";

const STEPS: { field: keyof ProfileData; title: string; why: string; options: string[] }[] = [
  {
    field: "experience",
    title: "How experienced are you as an investor?",
    why: "This helps us decide how much explanation to show alongside the numbers.",
    options: ["Beginner", "Intermediate", "Advanced"],
  },
  {
    field: "risk_tolerance",
    title: "What's your risk tolerance?",
    why: "Some sectors swing up and down more than others. This is just for context — it doesn't change the model's calculations.",
    options: ["Conservative", "Moderate", "Aggressive"],
  },
  {
    field: "investment_horizon",
    title: "What's your investment horizon?",
    why: "Short-term traders and long-term investors often care about different signals. Again, just for context.",
    options: ["Short-Term (<1 Year)", "Medium-Term (1-3 Years)", "Long-Term (3+ Years)"],
  },
  {
    field: "gender",
    title: "What's your gender?",
    why: "Purely for our own understanding of who uses InvestIQ. Never shown to anyone, and you can skip this.",
    options: ["Male", "Female", "Other", "Prefer not to say"],
  },
  {
    field: "monthly_income_range",
    title: "What's your monthly income range?",
    why: "This helps us highlight sectors that suit different starting points. We only store a range, never an exact figure.",
    options: ["Under ₹25,000", "₹25,000–50,000", "₹50,000–1,00,000", "Above ₹1,00,000"],
  },
  {
    field: "monthly_expenses_range",
    title: "What's your monthly expenses range?",
    why: "Just for context alongside income — again, only a range is stored.",
    options: ["Under ₹15,000", "₹15,000–30,000", "₹30,000–60,000", "Above ₹60,000"],
  },
  {
    field: "interest",
    title: "What are you most drawn to as an investor?",
    why: "We'll use this to highlight sectors that match your interests on the dashboard.",
    options: ["Stability & Safety", "Steady Growth", "High Growth Potential", "Not Sure Yet"],
  },
];

export default function Onboarding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const { profile, setField, isComplete } = useProfileStore();
  const navigate = useNavigate();

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const handleSelect = async (value: string) => {
    setField(step.field, value);

    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }

    setSubmitting(true);
    try {
      await submitProfile({ ...profile, [step.field]: value, market: "India" } as ProfileData);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to submit profile:", err);
      setSubmitting(false);
    }
  };

  const handleSkip = () => {
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="flex gap-2 mb-8">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= stepIndex ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.25 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">{step.title}</CardTitle>
                <p className="text-sm text-muted-foreground pt-1">{step.why}</p>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {step.options.map((option) => (
                  <Button
                    key={option}
                    variant="outline"
                    size="lg"
                    className="justify-start h-auto py-3"
                    disabled={submitting}
                    onClick={() => handleSelect(option)}
                  >
                    {option}
                  </Button>
                ))}

                {step.field === "gender" && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-1"
                    disabled={submitting}
                    onClick={handleSkip}
                  >
                    Skip
                  </Button>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {submitting && (
          <p className="text-center text-sm text-muted-foreground mt-4">
            Setting up your dashboard...
          </p>
        )}

        {isComplete() && stepIndex < STEPS.length - 1 && (
          <p className="text-center text-xs text-muted-foreground mt-4">
            Step {stepIndex + 1} of {STEPS.length}
          </p>
        )}
      </div>
    </div>
  );
}