"use client";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMotionTemplate, motion } from "motion/react";
import { useColorAnimation } from "@/components/color-animation-provider";

export default function Bg({ children }: { children: React.ReactNode }) {
  const color = useColorAnimation();
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      // className="fixed grid min-h-screen place-content-center overflow-hidden bg-gray-950 px-4 py-24 text-gray-200 h-screen w-screen"
      className="min-h-screen max-w-screen flex flex-col"
    >
      {children}
      <div className="absolute inset-0 z-0">
        <Canvas>
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
}
