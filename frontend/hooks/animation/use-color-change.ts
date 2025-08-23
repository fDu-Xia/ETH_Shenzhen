import { useThemeStore } from "@/lib/stores/theme-store";
import { useMotionValue, animate } from "motion/react";
import { useEffect, useRef } from "react";

export const useColorChange = () => {
  const colorsTop = useThemeStore((state) => state.colorsTop);
  const colorMotionValue = useThemeStore((state) => state.colorMotionValue);
  const setColorMotionValue = useThemeStore(
    (state) => state.setColorMotionValue
  );
  const animationRef = useRef<any>(null);

  // 始终创建一个本地的 motion value（保持 hooks 顺序一致）
  const localColor = useMotionValue(colorsTop[0]);

  // 使用共享的 motion value 或本地的
  const color = colorMotionValue || localColor;

  useEffect(() => {
  // 如果还没有设置全局 motion value，设置它
  if (!colorMotionValue && color === localColor) {
    setColorMotionValue(localColor);

    // 清理之前的动画
    if (animationRef.current) {
      animationRef.current.stop();
    }

    // 启动新动画
    animationRef.current = animate(localColor, colorsTop, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }

  // 清理函数
  return () => {
    if (animationRef.current) {
      animationRef.current.stop();
    }
  };
  }, [colorsTop, color, localColor, colorMotionValue, setColorMotionValue]);

  return color;
};
