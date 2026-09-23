import { create } from "zustand";
import type { ProfileData } from "@/lib/api";

interface ProfileStore {
  profile: Partial<ProfileData>;
  setField: (field: keyof ProfileData, value: string) => void;
  isComplete: () => boolean;
}

export const useProfileStore = create<ProfileStore>((set, get) => ({
  profile: {},
  setField: (field, value) =>
    set((state) => ({ profile: { ...state.profile, [field]: value } })),
  isComplete: () => {
    const p = get().profile;
    return !!(p.experience && p.risk_tolerance && p.investment_horizon && p.market);
  },
}));