"use client";

import Link from "next/link";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { usePathname } from "next/navigation";
import { useColorChange } from "@/hooks/animation/use-color-change";
import { motion, useMotionTemplate } from "motion/react";

export function Header() {
  const pathname = usePathname();
  const color = useColorChange();
  const backgroundImage = useMotionTemplate`linear-gradient(to right, ${color}, ${color}dd)`;

  const navItems = [
    { href: "/", label: "首页" },
    { href: "/explore", label: "发现" },
    { href: "/publish", label: "发布" },
    { href: "/profile", label: "个人" },
  ];

  return (
    <header className="border-b border-purple-800/30 sticky top-0 z-50 bg-transparent backdrop-blur-md flex items-center h-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 w-[320px]">
            <motion.div
              style={{ backgroundImage }}
              className="w-8 h-8 rounded-lg flex items-center justify-center"
            >
              <span className="text-white font-bold text-sm">C</span>
            </motion.div>
            <span className="text-xl font-bold text-white">ContentDAO</span>
          </Link>

          {/* Navigation - Apple Store Style Capsule */}
          <nav className="hidden md:flex items-center">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-full p-1 flex items-center">
              {navItems.map((item) => {
                // 特殊处理：如果是 /content/* 路由，激活"发现"导航项
                const isActive = item.href === "/explore"
                  ? (pathname === "/explore" || pathname.startsWith("/content/"))
                  : pathname === item.href;
                  
                const border = useMotionTemplate`1px solid ${color}`;
                const boxShadow = useMotionTemplate`0px 2px 8px ${color}`;
                
                return isActive ? (
                  <motion.div key={item.href} className="relative">
                    <Link href={item.href}>
                      <motion.div
                        style={{
                          border,
                          boxShadow,
                        }}
                        whileHover={{
                          scale: 1.05,
                        }}
                        whileTap={{
                          scale: 0.95,
                        }}
                        className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50"
                      >
                        {item.label}
                      </motion.div>
                    </Link>
                  </motion.div>
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 text-gray-300 hover:text-white hover:bg-gray-700/50"
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 w-[320px]">
            <div className="bg-gray-800/40 backdrop-blur-sm rounded-full p-1">
              <ConnectButton.Custom>
                {({
                  account,
                  chain,
                  openAccountModal,
                  openChainModal,
                  openConnectModal,
                  mounted,
                }) => {
                  const ready = mounted;
                  const connected = ready && account && chain;
                  const border = useMotionTemplate`1px solid ${color}`;
                  const boxShadow = useMotionTemplate`0px 2px 8px ${color}`;

                  return (
                    <div
                      {...(!ready && {
                        "aria-hidden": true,
                        style: {
                          opacity: 0,
                          pointerEvents: "none",
                          userSelect: "none",
                        },
                      })}
                    >
                      {(() => {
                        if (!connected) {
                          return (
                            <motion.button
                              onClick={openConnectModal}
                              type="button"
                              style={{
                                border,
                                boxShadow,
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50"
                            >
                              连接钱包
                            </motion.button>
                          );
                        }

                        if (chain.unsupported) {
                          return (
                            <button
                              onClick={openChainModal}
                              type="button"
                              className="px-4 py-1.5 rounded-full text-sm font-medium bg-red-600/30 text-red-300 backdrop-blur-sm transition-colors hover:bg-red-600/50"
                            >
                              错误网络
                            </button>
                          );
                        }

                        return (
                          <motion.button
                            onClick={openAccountModal}
                            type="button"
                            style={{
                              border,
                              boxShadow,
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-4 py-1.5 rounded-full text-sm font-medium bg-gray-950/30 text-white backdrop-blur-sm transition-colors hover:bg-gray-950/50 flex items-center gap-2"
                          >
                            {chain.hasIcon && (
                              <div className="w-4 h-4 rounded-full overflow-hidden flex-shrink-0">
                                {chain.iconUrl && (
                                  <img
                                    alt={chain.name ?? "Chain icon"}
                                    src={chain.iconUrl}
                                    className="w-4 h-4"
                                  />
                                )}
                              </div>
                            )}
                            <span className="truncate max-w-[100px]">
                              {account.displayName}
                            </span>
                            {account.displayBalance && (
                              <span className="text-xs opacity-70">
                                {account.displayBalance}
                              </span>
                            )}
                          </motion.button>
                        );
                      })()}
                    </div>
                  );
                }}
              </ConnectButton.Custom>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
