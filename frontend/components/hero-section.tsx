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
      <motion.div
        className="mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <h2 className="text-xl sm:text-2xl md:text-3xl font-light text-gray-300 tracking-wider">
          Explore · Invest · <span className="font-medium text-white">Co-create</span>
        </h2>
      </motion.div>
      
      <motion.h1
        className="max-w-3xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        {/* Decrease your SaaS churn by over 90% */}
        Discover and Invest in
        <br />
        Quality Content
      </motion.h1>
      
      <motion.p
        className="my-6 max-w-xl text-center text-base leading-relaxed md:text-lg md:leading-relaxed text-gray-400"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      >
        Here, every piece of quality content is an investment opportunity.
        <br />
        Grow with creators and share the compound value of knowledge.
      </motion.p>
      <motion.button
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6, ease: "easeOut" }}
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
        Start Exploring
        <ArrowRight className="transition-transform group-hover:-rotate-45 group-active:-rotate-12" />
      </motion.button>
    </div>
  );
};
