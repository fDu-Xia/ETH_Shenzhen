"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'zh';

  const changeLanguage = (newLocale: string) => {
    const newPath = pathname.replace(`/${currentLocale}`, `/${newLocale}`);
    window.location.href = newPath;
  };

  return (
    <header className="border-b border-purple-800/30 bg-[#1E1B3A]/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href={`/${currentLocale}`} className="flex items-center space-x-2 w-[320px]">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="text-xl font-bold text-white">ContentDAO</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href={`/${currentLocale}`}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              {currentLocale === 'en' ? 'Home' : '首页'}
            </Link>
            <Link
              href={`/${currentLocale}/explore`}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              {currentLocale === 'en' ? 'Discover' : '发现'}
            </Link>
            <Link
              href={`/${currentLocale}/publish`}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              {currentLocale === 'en' ? 'Publish' : '发布'}
            </Link>
            <Link
              href={`/${currentLocale}/profile`}
              className="text-gray-300 hover:text-purple-400 transition-colors"
            >
              {currentLocale === 'en' ? 'Profile' : '个人主页'}
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 w-[320px]">
            {/* Language Switcher */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => changeLanguage(currentLocale === 'en' ? 'zh' : 'en')}
                className="text-gray-300 hover:text-purple-400"
              >
                {currentLocale === 'en' ? '中文' : 'English'}
              </Button>
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-purple-400"
            >
              <Search className="w-4 h-4" />
            </Button>
            <ConnectButton
              label={currentLocale === 'en' ? 'Connect Wallet' : '连接钱包'}
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
