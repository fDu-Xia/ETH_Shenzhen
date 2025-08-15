import { useThemeStore } from "@/lib/stores/theme-store";
import { useMotionValue, animate } from "motion/react";
import { useEffect } from "react";

export const useColorChange = () => {
  const colorsTop = useThemeStore((state) => state.colorsTop);
  const color = useMotionValue(colorsTop[0]);

  // ! dev 模式下关了，容易卡
  // useEffect(() => {
  //   animate(color, colorsTop, {
  //     ease: "easeInOut",
  //     duration: 10,
  //     repeat: Infinity,
  //     repeatType: "mirror",
  //   });
  // }, [colorsTop]);

  return color;
};
