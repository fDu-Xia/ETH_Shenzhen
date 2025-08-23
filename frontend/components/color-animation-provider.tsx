"use client";

import { createContext, useContext, useEffect, useRef } from "react";
import { MotionValue, useMotionValue, animate } from "motion/react";
import { useThemeStore } from "@/lib/stores/theme-store";

interface ColorAnimationContextType {
  color: MotionValue<string>;
}

const ColorAnimationContext = createContext<ColorAnimationContextType | null>(null);

export function ColorAnimationProvider({ children }: { children: React.ReactNode }) {
  const colorsTop = useThemeStore((state) => state.colorsTop);
  const color = useMotionValue(colorsTop[0]);
  const animationRef = useRef<any>(null);

  // useEffect(() => {
  //   // 清理之前的动画
  //   if (animationRef.current) {
  //     animationRef.current.stop();
  //   }

  //   // 启动新动画
  //   animationRef.current = animate(color, colorsTop, {
  //     ease: "easeInOut",
  //     duration: 10,
  //     repeat: Infinity,
  //     repeatType: "mirror",
  //   });

  //   // 清理函数
  //   return () => {
  //     if (animationRef.current) {
  //       animationRef.current.stop();
  //     }
  //   };
  // }, [colorsTop, color]);

  return (
    <ColorAnimationContext.Provider value={{ color }}>
      {children}
    </ColorAnimationContext.Provider>
  );
}

export function useColorAnimation() {
  const context = useContext(ColorAnimationContext);
  if (!context) {
    throw new Error("useColorAnimation must be used within ColorAnimationProvider");
  }
  return context.color;
}