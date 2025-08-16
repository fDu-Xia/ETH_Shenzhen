"use client";

import { ContentGrid } from "@/components/content-grid";
import { SearchAndFilters } from "@/components/search-and-filters";
import { motion, useMotionTemplate } from "motion/react";
import { useColorAnimation } from "@/components/color-animation-provider";
import { useContentFactory } from "@/hooks/use-content-factory";

export default function ExplorePage() {
  const color = useColorAnimation();
  const { contentCount, loading: contractLoading, error: contractError } = useContentFactory();
  const glowText = useMotionTemplate`0 0 20px ${color}, 0 0 40px ${color}40, 0 0 60px ${color}20`;
  const borderGlow = useMotionTemplate`1px solid ${color}`;
  
  return (
    <>
      <section className="pt-16 pb-8 relative overflow-hidden">
        {/* Cyberpunk grid background */}
        <div className="absolute inset-0 opacity-20">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(${color.get()}20 1px, transparent 1px), linear-gradient(90deg, ${color.get()}20 1px, transparent 1px)`,
              backgroundSize: '50px 50px',
            }}
          />
        </div>
        
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${20 + i * 15}%`,
                top: `${10 + i * 10}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Title */}
            <motion.div
              className="relative mb-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              <h1 className="text-4xl md:text-6xl font-light text-white tracking-wider uppercase">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
                >
                  探索
                </motion.span>
                <motion.span
                  className="font-thin mx-2 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  ·
                </motion.span>
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
                >
                  投资
                </motion.span>
                <motion.span
                  className="font-thin mx-2 text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.4 }}
                >
                  ·
                </motion.span>
                <motion.span
                  className="inline-block font-medium"
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
                  style={{
                    textShadow: useMotionTemplate`0 0 20px ${color}, 0 0 40px ${color}40, 0 0 60px ${color}20`,
                  }}
                >
                  共创
                </motion.span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7, ease: "easeOut" }}
            >
              <motion.div
                className="absolute -inset-x-4 -inset-y-2 rounded-lg opacity-30"
                style={{
                  background: `linear-gradient(90deg, transparent, ${color.get()}20, transparent)`,
                }}
                animate={{
                  x: ["-100%", "100%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                  delay: 1.2,
                }}
              />
              
              <p className="text-base md:text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto relative">
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.8 }}
                >
                  在这里，每一份优质内容都是一次投资机会。
                </motion.span>
                <br className="hidden md:block" />
                <motion.span
                  className="inline-block"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.9 }}
                >
                  与创作者共同成长，分享知识价值的复利。
                </motion.span>
              </p>
            </motion.div>



            {/* Wave line decoration */}
            <motion.div
              className="mt-8 flex justify-center"
              initial={{ opacity: 0, y: 20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 1.1, ease: "easeOut" }}
            >
              <motion.svg
                width="200"
                height="20"
                viewBox="0 0 200 20"
                className="overflow-visible"
                style={{
                  stroke: color,
                }}
              >
                <motion.path
                  d="M0,10 Q25,5 50,10 T100,10 T150,10 T200,10"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: 1,
                    opacity: [0.3, 1, 0.3],
                  }}
                  transition={{
                    pathLength: { duration: 2, ease: "easeInOut" },
                    opacity: { duration: 2, repeat: Infinity, ease: "easeInOut" }
                  }}
                  style={{
                    filter: useMotionTemplate`drop-shadow(0 0 10px ${color})`,
                  }}
                />
                <motion.path
                  d="M0,10 Q25,15 50,10 T100,10 T150,10 T200,10"
                  strokeWidth="1"
                  fill="none"
                  strokeLinecap="round"
                  opacity="0.5"
                  initial={{ pathLength: 0 }}
                  animate={{
                    pathLength: 1,
                    y: [0, -2, 0],
                  }}
                  transition={{
                    pathLength: { duration: 2, ease: "easeInOut", delay: 0.5 },
                    y: { duration: 3, repeat: Infinity, ease: "easeInOut" }
                  }}
                />
              </motion.svg>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Showcase */}
      <motion.div
        className="container mx-auto pb-12"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.3, ease: "easeOut" }}
      >
        <SearchAndFilters />
        <ContentGrid />
      </motion.div>
    </>
  );
}
