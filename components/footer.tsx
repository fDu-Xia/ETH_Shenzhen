"use client";

import Link from "next/link";
import { usePathname } from 'next/navigation';

export function Footer() {
  const pathname = usePathname();
  const currentLocale = pathname.startsWith('/en') ? 'en' : 'zh';

  return (
    <footer className="bg-[#151229] border-t border-purple-800/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">C</span>
              </div>
              <span className="text-xl font-bold text-white">ContentDAO</span>
            </div>
            <p className="text-gray-400 max-w-md">
              {currentLocale === 'en' 
                ? 'Decentralized content platform, enabling quality content to receive its deserved value and creators to directly earn from their fans.'
                : '去中心化内容付费平台，让优质内容获得应有的价值，让创作者直接从粉丝获得收益。'
              }
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">
              {currentLocale === 'en' ? 'Platform' : '平台'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${currentLocale}/about`} className="text-gray-400 hover:text-purple-400 transition-colors">
                  {currentLocale === 'en' ? 'About Us' : '关于我们'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/how-it-works`} className="text-gray-400 hover:text-purple-400 transition-colors">
                  {currentLocale === 'en' ? 'How It Works' : '工作原理'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/tokenomics`} className="text-gray-400 hover:text-purple-400 transition-colors">
                  {currentLocale === 'en' ? 'Tokenomics' : '代币经济'}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">
              {currentLocale === 'en' ? 'Support' : '支持'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link href={`/${currentLocale}/help`} className="text-gray-400 hover:text-purple-400 transition-colors">
                  {currentLocale === 'en' ? 'Help Center' : '帮助中心'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/docs`} className="text-gray-400 hover:text-purple-400 transition-colors">
                  {currentLocale === 'en' ? 'Documentation' : '开发文档'}
                </Link>
              </li>
              <li>
                <Link href={`/${currentLocale}/contact`} className="text-gray-400 hover:text-purple-400 transition-colors">
                  {currentLocale === 'en' ? 'Contact Us' : '联系我们'}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-purple-800/30 mt-8 pt-8 text-center">
          <p className="text-gray-400">© 2024 ContentDAO. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
