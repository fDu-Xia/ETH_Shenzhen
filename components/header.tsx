"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export function Header() {
  return (
    <header className="border-b border-purple-800/30 bg-[#1E1B3A]/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 w-[320px]">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-white">ContentDAO</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              发现
            </Link>
            <Link
              href="/trending"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              热门
            </Link>
            <Link
              href="/publish"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              发布新内容
            </Link>
            <Link
              href="/profile"
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              个人主页
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 w-[320px]">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-purple-400"
            >
              <Search className="w-4 h-4" />
            </Button>
            <ConnectButton
              label="连接钱包"
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
              chainStatus={{
                smallScreen: "icon",
                largeScreen: "full",
              }}
              showBalance={{
                smallScreen: false,
                largeScreen: true,
              }}
            />
          </div>
        </div>
      </div>
    </header>
  );
}
