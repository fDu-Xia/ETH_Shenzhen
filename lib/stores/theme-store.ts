import { create } from 'zustand';

interface ThemeStore {
  colorsTop: string[];
  currentColorIndex: number;
  setColorsTop: (colors: string[]) => void;
  setCurrentColorIndex: (index: number) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  colorsTop: ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"],
  currentColorIndex: 0,
  setColorsTop: (colors) => set({ colorsTop: colors }),
  setCurrentColorIndex: (index) => set({ currentColorIndex: index }),
}));

export const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];