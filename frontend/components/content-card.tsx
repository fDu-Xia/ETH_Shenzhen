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
import { useColorAnimation } from "@/components/color-animation-provider";
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
    ipfsUrl?: string;
    ipfsData?: {
      contentType: string;
      timestamp: string;
      version: string;
    };
  };
}

export function ContentCard({ content }: ContentCardProps) {
  const color = useColorAnimation();
  const gradientBackground = useMotionTemplate`radial-gradient(circle at 20% 80%, ${color} 0%, transparent 50%), radial-gradient(circle at 80% 20%, ${color} 0%, transparent 50%), radial-gradient(circle at 40% 40%, ${color} 0%, transparent 50%)`;

  return (
    <div className="relative p-[2px] group">
      {/* Animated gradient border - blur layer */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-60 group-hover:opacity-100 blur-xl transition duration-500 will-change-transform"
        style={{
          background: gradientBackground,
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />
      
      {/* Animated gradient border - sharp layer */}
      <motion.div
        className="absolute inset-0 rounded-lg opacity-75 group-hover:opacity-100 transition duration-500 will-change-transform"
        style={{
          background: gradientBackground,
        }}
        animate={{
          backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Card content */}
      <div className="relative bg-gray-950/95 backdrop-blur-sm rounded-lg overflow-hidden z-10">
        {/* Image Container with Padding */}
        <div className="p-2 pb-0">
          {/* Image */}
          <div className="relative overflow-hidden rounded-md bg-gray-800/50">
            <Image
              src={content.image}
              alt={content.title}
              width={400}
              height={250}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
              onError={(e) => {
                console.error(`Failed to load image: ${content.image}`);
                // Fallback to placeholder if image fails to load
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.jpg";
              }}
              onLoad={() => {
                console.log(`Successfully loaded image: ${content.image.substring(0, 50)}...`);
              }}
              priority={false}
              quality={85}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
            {content.trending && (
              <motion.div
                className="absolute top-3 left-3"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md backdrop-blur-md shadow-lg"
                  style={{
                    background: useMotionTemplate`linear-gradient(135deg, ${color}20, ${color}30)`,
                    border: useMotionTemplate`1px solid ${color}40`,
                    boxShadow: useMotionTemplate`0 2px 8px ${color}20, inset 0 1px 0 ${color}20`,
                  }}
                  animate={{
                    scale: [1, 1.02, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  whileHover={{
                    scale: 1.05,
                  }}
                >
                  <TrendingUp className="w-4 h-4" style={{ color: color.get() }} />
                  <motion.span
                    className="text-sm font-semibold"
                    style={{
                      color: color,
                      textShadow: useMotionTemplate`0 0 8px ${color}40`,
                    }}
                  >
                    Trending
                  </motion.span>
                </motion.div>
              </motion.div>
            )}
            <motion.div
              className="absolute top-3 right-3 backdrop-blur-md rounded-md px-3 py-1.5 shadow-lg"
              style={{
                background: useMotionTemplate`linear-gradient(135deg, ${color}15, ${color}25)`,
                border: useMotionTemplate`1px solid ${color}40`,
                boxShadow: useMotionTemplate`0 2px 8px ${color}20, inset 0 1px 0 ${color}20`,
              }}
              whileHover={{
                scale: 1.05,
              }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                className="font-semibold text-sm"
                style={{
                  color: color,
                  textShadow: useMotionTemplate`0 0 8px ${color}40`,
                }}
              >
                {content.price}
              </motion.span>
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Author */}
          <div className="flex items-center mb-3">
            <Image
              src={content.author.avatar || "/placeholder-user.jpg"}
              alt={content.author.name}
              width={40}
              height={40}
              className="w-8 h-8 rounded-full mr-2 object-cover border border-gray-600/50"
              onError={(e) => {
                // Fallback to placeholder if avatar fails to load
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-user.jpg";
              }}
              quality={90}
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
          
          {/* IPFS Metadata */}
          {content.ipfsData && (
            <div className="mb-3 space-y-2">
              <div className="p-2 bg-gray-800/30 rounded border border-gray-700/30">
                <p className="text-xs text-gray-400 mb-1">Content Type</p>
                <p className="text-xs text-gray-300 font-medium">
                  {content.ipfsData.contentType}
                </p>
              </div>
              <div className="p-2 bg-gray-800/30 rounded border border-gray-700/30">
                <p className="text-xs text-gray-400 mb-1">Created</p>
                <p className="text-xs text-gray-300">
                  {new Date(content.ipfsData.timestamp).toLocaleDateString()}
                </p>
              </div>
              <div className="p-2 bg-gray-800/30 rounded border border-gray-700/30">
                <p className="text-xs text-gray-400 mb-1">Version</p>
                <p className="text-xs text-gray-300">{content.ipfsData.version}</p>
              </div>
            </div>
          )}
          
          {/* Blockchain Info */}
          {content.ipfsUrl && (
            <div className="mb-3 p-2 bg-gray-800/30 rounded border border-gray-700/30">
              <p className="text-xs text-gray-400 mb-1">IPFS Content</p>
              <p className="text-xs text-gray-300 font-mono break-all">
                {content.ipfsUrl.length > 20 ? `${content.ipfsUrl.slice(0, 20)}...` : content.ipfsUrl}
              </p>
            </div>
          )}

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
                <span className="font-medium">{content.stats.investors}</span>
                <span className="ml-1 text-xs">investors</span>
              </div>
              <div className="flex items-center">
                <Eye className="w-4 h-4 mr-1" />
                <span className="font-medium">{content.stats.views}</span>
                <span className="ml-1 text-xs">views</span>
              </div>
              <div className="flex items-center">
                <Heart className="w-4 h-4 mr-1" />
                <span className="font-medium">{content.stats.likes}</span>
                <span className="ml-1 text-xs">ratings</span>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Link href={`/content/${content.id}`}>
            <motion.button
              className="w-full px-4 py-2.5 rounded-lg text-sm font-medium bg-gradient-to-r from-gray-900/50 to-gray-950/50 text-white backdrop-blur-sm transition-all hover:from-gray-900/70 hover:to-gray-950/70 flex items-center justify-center gap-2 group cursor-pointer border border-gray-700/20 shadow-sm hover:shadow-md"
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
            >
              View Details
              <ArrowRight className="w-4 h-4 transition-transform group-hover:-rotate-45" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
}
