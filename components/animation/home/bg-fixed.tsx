"use client";

import { Stars } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { useMotionTemplate, motion } from "motion/react";
import { useColorAnimation } from "@/components/color-animation-provider";

export default function BgFixed({ children }: { children: React.ReactNode }) {
  const color = useColorAnimation();
  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;

  return (
    <motion.section
      style={{
        backgroundImage,
      }}
      className="min-h-screen max-w-screen flex flex-col relative"
    >
      {/* Content with higher z-index and pointer events */}
      <div className="relative z-20 w-full h-full flex flex-col">
        {children}
      </div>
      
      {/* Canvas completely isolated with pointer-events-none and lower z-index */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <Canvas
          style={{ pointerEvents: 'none' }}
          onCreated={({ gl }) => {
            gl.setClearColor(0x000000, 0); // Transparent background
          }}
        >
          <Stars radius={50} count={2500} factor={4} fade speed={2} />
        </Canvas>
      </div>
    </motion.section>
  );
}
