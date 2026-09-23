import axios from "axios";
import { useAuthStore } from "@/store/useAuthStore";

export const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
  headers: { "Content-Type": "application/json" },
});

// Automatically attach the JWT to every request, if we have one
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export interface ProfileData {
  experience: string;
  risk_tolerance: string;
  investment_horizon: string;
  market: string;
  gender?: string;
  monthly_income_range?: string;
  monthly_expenses_range?: string;
  interest?: string;
}

export async function submitProfile(data: ProfileData) {
  const response = await api.post("/api/profile", data);
  return response.data;
}

export async function getProfile() {
  const response = await api.get("/api/profile");
  return response.data as ProfileData & { id: number };
}

export async function updateProfile(data: ProfileData) {
  const response = await api.put("/api/profile", data);
  return response.data;
}

export async function getSectorRankings() {
  const response = await api.get("/api/sectors/ranking");
  return response.data;
}

export async function getRegime() {
  const response = await api.get("/api/regime");
  return response.data;
}

export async function getSectorShap(sector: string) {
  const response = await api.get(`/api/sectors/${encodeURIComponent(sector)}/shap`);
  return response.data;
}

export async function getBacktest() {
  const response = await api.get("/api/backtest");
  return response.data;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export async function registerUser(data: AuthCredentials) {
  const response = await api.post("/api/auth/register", data);
  return response.data as { access_token: string; token_type: string };
}

export async function loginUser(data: AuthCredentials) {
  const response = await api.post("/api/auth/login", data);
  return response.data as { access_token: string; token_type: string };
}