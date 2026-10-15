import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useProfileStore } from "@/store/useProfileStore";
import { submitProfile, type ProfileData } from "@/lib/api";

const STEPS: { field: keyof ProfileData; title: string; why: string; options: string[] }[] = [
  {
    field: "interest",
    title: "What are you most drawn to as an investor?",
    why: "We'll use this to highlight sectors that match your interests on the dashboard.",
    options: ["Stability & Safety", "Steady Growth", "High Growth Potential", "Not Sure Yet"],
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
    field: "gender",
    title: "What's your gender?",
    why: "Purely for our own understanding of who uses InvestIQ. Never shown to anyone, and you can skip this.",
    options: ["Male", "Female", "Other", "Prefer not to say"],
  },
];

function describeError(err: any): string {
  const detail = err?.response?.data?.detail ?? err?.detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d: any) => `${(d.loc ?? []).slice(1).join(".")}: ${d.msg}`)
      .join("; ");
  }
  if (typeof detail === "string") return detail;
  return err?.message ?? "Something went wrong. Please try again.";
}

export default function Onboarding() {
  const [stepIndex, setStepIndex] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Partial<ProfileData>>({});
  const { profile, setField } = useProfileStore();
  const navigate = useNavigate();

  const step = STEPS[stepIndex];
  const isLastStep = stepIndex === STEPS.length - 1;

  const finish = async (finalAnswers: Partial<ProfileData>) => {
    const payload = { ...profile, ...finalAnswers, market: "India" } as ProfileData;
    setSubmitting(true);
    try {
      await submitProfile(payload);
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to submit profile:", err);
      setError(describeError(err));
      setSubmitting(false);
    }
  };

  const handleSelect = async (value: string) => {
    setError(null);
    const next = { ...answers, [step.field]: value };
    setAnswers(next);
    setField(step.field, value);

    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }
    await finish(next);
  };

  const handleSkip = async () => {
    setError(null);
    if (!isLastStep) {
      setStepIndex((i) => i + 1);
      return;
    }
    await finish(answers);
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

        {error && (
          <p className="text-center text-sm text-red-500 mt-4 break-words">{error}</p>
        )}

        <p className="text-center text-xs text-muted-foreground mt-4">
          Step {stepIndex + 1} of {STEPS.length}
        </p>
      </div>
    </div>
  );
}