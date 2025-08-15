import { create } from 'zustand';
import { MotionValue, motionValue } from 'motion/react';

interface ThemeStore {
  colorsTop: string[];
  currentColorIndex: number;
  colorMotionValue: MotionValue<string> | null;
  setColorsTop: (colors: string[]) => void;
  setCurrentColorIndex: (index: number) => void;
  setColorMotionValue: (value: MotionValue<string>) => void;
}

export const useThemeStore = create<ThemeStore>((set) => ({
  colorsTop: ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"],
  currentColorIndex: 0,
  colorMotionValue: null,
  setColorsTop: (colors) => set({ colorsTop: colors }),
  setCurrentColorIndex: (index) => set({ currentColorIndex: index }),
  setColorMotionValue: (value) => set({ colorMotionValue: value }),
}));

export const COLORS_TOP = ["#13FFAA", "#1E67C6", "#CE84CF", "#DD335C"];