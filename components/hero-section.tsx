"use client";

import { ArrowRight } from "lucide-react";
import { useMotionTemplate, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { useColorAnimation } from "@/components/color-animation-provider";

export const HeroSection = () => {
  const router = useRouter();
  const color = useColorAnimation();

  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
    <div className="relative z-10 flex flex-col items-center m-auto">
      <div className="mb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-300 tracking-wider">
          探索 · 投资 · <span className="font-medium text-white">共创</span>
        </h2>
      </div>
      
      <h1 className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
        {/* Decrease your SaaS churn by over 90% */}
        发现和投资
        <br />
        优质内容
      </h1>
      
      <p className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed text-gray-400">
        在这里，每一份优质内容都是一次投资机会。
        <br />
        与创作者共同成长，分享知识价值的复利。
      </p>
      <motion.button
        style={{
          border,
          boxShadow,
        }}
        whileHover={{
          scale: 1.015,
        }}
        whileTap={{
          scale: 0.985,
        }}
        className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50 cursor-pointer"
        onClick={() => router.push("/explore")}
      >
        开始探索
        <ArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
      </motion.button>
    </div>
  );
};
