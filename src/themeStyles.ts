import { AppTheme } from './types';

export interface ThemeConfig {
  name: string;
  bgMain: string;
  bgSidebar: string;
  bgChat: string;
  cardMe: string;
  cardOther: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  border: string;
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  cyber_neon: {
    name: "Modern Turkuaz & Mor",
    bgMain: "#0d1117",
    bgSidebar: "#161b22",
    bgChat: "#0d1117",
    cardMe: "#00b4d8",
    cardOther: "#21262d",
    textPrimary: "#f0f6fc",
    textSecondary: "#8b949e",
    accent: "#7209b7",
    border: "#30363d"
  },
  emerald_matrix: {
    name: "Derin Mavi & Mor Gece",
    bgMain: "#0b132b",
    bgSidebar: "#1c2541",
    bgChat: "#0b132b",
    cardMe: "#4361ee",
    cardOther: "#3a0ca3",
    textPrimary: "#ffffff",
    textSecondary: "#979dac",
    accent: "#4cc9f0",
    border: "#243b53"
  },
  synthwave_pink: {
    name: "Synthwave Pink",
    bgMain: "#120f1d",
    bgSidebar: "#1a162b",
    bgChat: "#120f1d",
    cardMe: "#f72585",
    cardOther: "#2a2240",
    textPrimary: "#ffffff",
    textSecondary: "#9d94b4",
    accent: "#7209b7",
    border: "#362c55"
  },
  nordic_cobalt: {
    name: "Nordic Cobalt",
    bgMain: "#0f172a",
    bgSidebar: "#1e293b",
    bgChat: "#0f172a",
    cardMe: "#3b82f6",
    cardOther: "#334155",
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    accent: "#60a5fa",
    border: "#334155"
  },
  matrix_emerald: {
    name: "Matrix Emerald",
    bgMain: "#0d1110",
    bgSidebar: "#161f1c",
    bgChat: "#0d1110",
    cardMe: "#10b981",
    cardOther: "#22302b",
    textPrimary: "#f0fdf4",
    textSecondary: "#94a3b8",
    accent: "#059669",
    border: "#1b332b"
  },
  solar_amber: {
    name: "Solar Amber",
    bgMain: "#14100d",
    bgSidebar: "#211a14",
    bgChat: "#14100d",
    cardMe: "#f59e0b",
    cardOther: "#38291e",
    textPrimary: "#fffbeb",
    textSecondary: "#a89684",
    accent: "#d97706",
    border: "#443122"
  },
  minimal_pearl: {
    name: "Minimal Pearl",
    bgMain: "#f8fafc",
    bgSidebar: "#f1f5f9",
    bgChat: "#f8fafc",
    cardMe: "#0284c7",
    cardOther: "#e2e8f0",
    textPrimary: "#0f172a",
    textSecondary: "#64748b",
    accent: "#0369a1",
    border: "#cbd5e1"
  }
};

// Türkçe içe aktaran bileşenler için alias (takma ad) ekledik
export const TEMALAR = THEMES;