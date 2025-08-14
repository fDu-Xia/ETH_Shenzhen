"use client";

import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Eye,
  Users,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { motion, useMotionTemplate } from "motion/react";
import { useColorChange } from "@/hooks/animation/use-color-change";
import { useState } from "react";

interface ContentCardProps {
  content: {
    id: string;
    title: string;
    description: string;
    image: string;
    price: string;
    author: {
      name: string;
      avatar: string;
      verified: boolean;
    };
    stats: {
      investors: number;
      views: string;
      likes: number;
    };
    tags: string[];
    trending: boolean;
  };
}

export function ContentCard({ content }: ContentCardProps) {
  const color = useColorChange();
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}10, inset 0 0 0 1px ${color}30`;
  const hoverBoxShadow = useMotionTemplate`0px 4px 24px ${color}20, inset 0 0 0 2px ${color}60`;
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      className="relative bg-gray-950/30 backdrop-blur-sm rounded-2xl transition-all duration-300"
      style={{
        boxShadow: isHovered ? hoverBoxShadow : boxShadow,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      animate={{
        backgroundColor: isHovered ? "rgba(9, 9, 11, 0.5)" : "rgba(9, 9, 11, 0.3)",
      }}
      transition={{ duration: 0.3 }}
    >

      {/* Particle Effect on Hover */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full"
              style={{
                background: color,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                x: (Math.random() - 0.5) * 50,
                y: (Math.random() - 0.5) * 50,
              }}
              transition={{
                duration: 1.5,
                delay: i * 0.1,
                repeat: Infinity,
                repeatDelay: 0.5,
              }}
            />
          ))}
        </div>
      )}
      {/* Image Container with Padding */}
      <div className="p-3 pb-0">
        {/* Image */}
        <div className="relative overflow-hidden rounded-xl">
          <Image
            src={content.image || "/placeholder.svg"}
            alt={content.title}
            width={300}
            height={200}
            className="w-full h-48 object-cover"
          />
          {content.trending && (
            <motion.div
              className="absolute top-3 left-3"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="flex items-center gap-1 px-3 py-1.5 rounded-full backdrop-blur-md"
              style={{
                background: useMotionTemplate`linear-gradient(135deg, ${color}90, ${color}60)`,
                border: useMotionTemplate`1px solid ${color}`,
              }}
              animate={{
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <TrendingUp className="w-3.5 h-3.5 text-white" />
              <span className="text-xs font-semibold text-white">热门</span>
            </motion.div>
          </motion.div>
          )}
          <div className="absolute top-3 right-3 bg-gray-950/60 backdrop-blur-sm rounded-full px-3 py-1.5 border border-gray-700/50">
            <span className="text-white font-semibold text-sm">
              {content.price}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Author */}
        <div className="flex items-center mb-3">
          <Image
            src={content.author.avatar || "/placeholder.svg"}
            alt={content.author.name}
            width={32}
            height={32}
            className="w-8 h-8 rounded-full mr-2"
          />
          <span className="text-gray-300 text-sm">{content.author.name}</span>
          {content.author.verified && (
            <CheckCircle className="w-4 h-4 text-purple-400 ml-1" />
          )}
        </div>

        {/* Title and Description */}
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2">
          {content.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {content.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mb-4">
          {content.tags.map((tag) => (
            <span
              key={tag}
              className="text-gray-400 text-sm border-b border-dashed border-gray-600 hover:text-white hover:border-gray-400 transition-colors cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1" />
              {content.stats.investors}
            </div>
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1" />
              {content.stats.views}
            </div>
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {content.stats.likes}
            </div>
          </div>
        </div>

        {/* Action Button */}
        <Link href={`/content/${content.id}`}>
          <motion.button
            style={{
              boxShadow: useMotionTemplate`0px 2px 8px ${color}20, inset 0 0 0 1px ${color}30`,
            }}
            whileHover={{
              scale: 1.05,
            }}
            whileTap={{
              scale: 0.95,
            }}
            className="w-full px-4 py-2 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center justify-center gap-2 group cursor-pointer"
          >
            查看详情
            <ArrowRight className="w-4 h-4 transition-transform group-hover:-rotate-45" />
          </motion.button>
        </Link>
      </div>
    </motion.div>
  );
}
