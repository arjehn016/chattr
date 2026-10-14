import { AppTheme } from './types';

export interface ThemeConfig {
  name: string;
  bgMain: string;          // Ana arka plan (derin siyah/lacivert)
  bgSidebar: string;       // Sol panel arka planı
  bgChat: string;          // Sohbet ekranı arka planı
  cardMe: string;          // Sizin mesaj balonunuz (Canlı Turkuaz/Mavi tonu)
  cardOther: string;       // Karşı tarafın mesaj balonu (Koyu şık gri/mor)
  textPrimary: string;     // Ana yazı rengi (Saf beyaz / açık gri)
  textSecondary: string;   // İkincil yazı rengi
  accent: string;          // Vurgu rengi (Mor/Turkuaz)
  border: string;          // Kenar çizgileri
}

export const THEMES: Record<AppTheme, ThemeConfig> = {
  cyber_neon: {
    name: "Modern Turkuaz & Mor",
    bgMain: "#0d1117",
    bgSidebar: "#161b22",
    bgChat: "#0d1117",
    cardMe: "#00b4d8",     // Şık Turkuaz
    cardOther: "#21262d",  // Koyu modern gri
    textPrimary: "#f0f6fc",
    textSecondary: "#8b949e",
    accent: "#7209b7",     // Derin Mor
    border: "#30363d"
  },
  emerald_matrix: {
    name: "Derin Mavi & Mor Gece",
    bgMain: "#0b132b",
    bgSidebar: "#1c2541",
    bgChat: "#0b132b",
    cardMe: "#4361ee",     // Canlı Mavi
    cardOther: "#3a0ca3",  // Mor tonu
    textPrimary: "#ffffff",
    textSecondary: "#979dac",
    accent: "#4cc9f0",     // Turkuaz vurgu
    border: "#243b53"
  },
  midnight_purple: {
    name: "Minimalist Siyah & Beyaz",
    bgMain: "#000000",
    bgSidebar: "#0a0a0a",
    bgChat: "#000000",
    cardMe: "#ffffff",     // Net Beyaz (Sizin mesaj)
    cardOther: "#1f1f1f",  // Koyu Siyah/Gri (Karşı taraf)
    textPrimary: "#ffffff",
    textSecondary: "#a1a1aa",
    accent: "#38bdf8",     // Açık Mavi detay
    border: "#27272a"
  },
  sunset_glow: {
    name: "Şık Turkuaz Gece",
    bgMain: "#0f172a",
    bgSidebar: "#1e293b",
    bgChat: "#0f172a",
    cardMe: "#06b6d4",     // Turkuaz
    cardOther: "#334155",  // Slate Gri
    textPrimary: "#f8fafc",
    textSecondary: "#94a3b8",
    accent: "#8b5cf6",     // Mor
    border: "#334155"
  }
};