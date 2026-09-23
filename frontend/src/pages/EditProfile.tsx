import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProfile, updateProfile, type ProfileData } from "@/lib/api";

const FIELD_OPTIONS: { field: keyof ProfileData; label: string; options: string[] }[] = [
  { field: "experience", label: "Experience", options: ["Beginner", "Intermediate", "Advanced"] },
  { field: "risk_tolerance", label: "Risk Tolerance", options: ["Conservative", "Moderate", "Aggressive"] },
  { field: "investment_horizon", label: "Investment Horizon", options: ["Short-Term (<1 Year)", "Medium-Term (1-3 Years)", "Long-Term (3+ Years)"] },
  { field: "gender", label: "Gender", options: ["Male", "Female", "Other", "Prefer not to say"] },
  { field: "monthly_income_range", label: "Monthly Income", options: ["Under ₹25,000", "₹25,000–50,000", "₹50,000–1,00,000", "Above ₹1,00,000"] },
  { field: "monthly_expenses_range", label: "Monthly Expenses", options: ["Under ₹15,000", "₹15,000–30,000", "₹30,000–60,000", "Above ₹60,000"] },
  { field: "interest", label: "Investing Interest", options: ["Stability & Safety", "Steady Growth", "High Growth Potential", "Not Sure Yet"] },
];

export default function EditProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Partial<ProfileData>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfile()
      .then((data) => setProfile(data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await updateProfile({ ...profile, market: "India" } as ProfileData);
      setSaved(true);
    } catch (err) {
      console.error("Failed to update profile:", err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6 md:p-10">
        <div className="max-w-lg mx-auto space-y-3">
          <div className="h-8 w-40 bg-muted rounded animate-pulse" />
          <div className="h-64 bg-muted rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-lg mx-auto space-y-6">
        <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>

        <div>
          <h1 className="text-2xl font-bold">Edit Profile</h1>
          <p className="text-sm text-muted-foreground">
            Update your answers anytime — this doesn't affect the model's calculations, only how
            we present things to you.
          </p>
        </div>

        <div className="space-y-5">
          {FIELD_OPTIONS.map((f) => (
            <Card key={f.field}>
              <CardHeader>
                <CardTitle className="text-base">{f.label}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {f.options.map((option) => (
                  <Button
                    key={option}
                    variant={profile[f.field] === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => setProfile((p) => ({ ...p, [f.field]: option }))}
                  >
                    {option}
                  </Button>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="sticky bottom-6 flex flex-col items-center gap-2">
          <Button size="lg" onClick={handleSave} disabled={saving} className="w-full max-w-xs">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          {saved && <p className="text-sm text-emerald-500">Saved!</p>}
        </div>
      </div>
    </div>
  );
}