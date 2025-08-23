"use client";

import { useState, use } from "react";
import { ContentDetailMain } from "@/components/content-detail-main";
import { ContentDetailSidebar } from "@/components/content-detail-sidebar";
import { BlockchainInfo } from "@/components/blockchain-info";
import { motion } from "motion/react";
import { useColorAnimation } from "@/components/color-animation-provider";
import { useContentById } from "@/hooks/use-content-by-id";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";

export default function ContentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const paramsId = use(params);
  const color = useColorAnimation();
  const { content, loading, error, refreshContent } = useContentById(paramsId.id);

  const handlePurchaseComplete = () => {
    setIsUnlocked(true);
  };

  // Show loading state
  if (loading) {
    return (
      <main className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mb-6"></div>
          <p className="text-gray-400 text-lg">Loading content from blockchain...</p>
          <p className="text-gray-500 text-sm mt-2">Fetching IPFS data and contract information</p>
        </div>
      </main>
    );
  }

  // Show error state
  if (error || !content) {
    return (
      <main className="container mx-auto px-4 pt-8 pb-4">
        <div className="flex flex-col items-center justify-center py-20">
          <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
          <h2 className="text-2xl font-semibold text-white mb-4">Content Not Found</h2>
          <p className="text-gray-400 text-center mb-6 max-w-md">
            {error || "The content you're looking for doesn't exist or couldn't be loaded from the blockchain."}
          </p>
          <div className="space-x-4">
            <Button onClick={refreshContent} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </div>
      </main>
    );
  }

  const contentWithUnlockStatus = {
    ...content,
    isUnlocked,
  };

  return (
    <main className="container mx-auto px-4 pt-8 pb-4">
      {/* Page Title with Dynamic Color */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="mb-8"
      >
        <motion.h1
          className="text-3xl font-bold text-white mb-2"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
        >
          Content Details
        </motion.h1>
        <motion.div
          className="h-1 w-24 rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: 96 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
        />
      </motion.div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Main Content (2/3 width on desktop) */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
          >
            <ContentDetailMain content={contentWithUnlockStatus} />
          </motion.div>

          {isUnlocked && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Content unlock functionality can be added here later */}
              <div className="p-6 bg-gray-900/50 rounded-lg border border-gray-700/50 text-center">
                <h3 className="text-xl font-semibold text-white mb-2">Content Unlocked!</h3>
                <p className="text-gray-400">This content is now accessible to you.</p>
              </div>
            </motion.div>
          )}

          {/* Blockchain Information */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: "easeOut" }}
          >
            <BlockchainInfo content={content} />
          </motion.div>
        </div>

        {/* Right Sidebar (1/3 width on desktop) */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
          className="lg:col-span-1"
        >
          <ContentDetailSidebar
            content={contentWithUnlockStatus}
            onPurchaseComplete={handlePurchaseComplete}
          />
        </motion.div>
      </div>
    </main>
  );
}
