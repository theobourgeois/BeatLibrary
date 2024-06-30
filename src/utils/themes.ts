import { create } from "zustand";

export type Theme = {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  accent: string;
  accentDark: string;
  accentLight: string;
  text: string;
  textLight: string;
  grayDark: string;
  gray: string;
};

type ThemeKey = keyof typeof themes;

type ThemeStore = {
  theme: ThemeKey;
  setTheme: (theme: ThemeKey) => void;
};

export const themes = {
  light: {
    primary: "#E0E0E0",
    primaryDark: "#C7C7C7",
    primaryLight: "#FFFFFF69",
    secondary: "#979797",
    accent: "#FF8F0C",
    accentDark: "#FFC400",
    accentLight: "#FCC27F",
    text: "#585858",
    textLight: "#FFFFFF",
    grayDark: "#585858",
    gray: "#979797",
  },
};

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: "light",
  setTheme: (theme) => set({ theme }),
}));

export const useTheme = () => {
  const theme = useThemeStore((state) => state.theme);
  return themes[theme];
}
