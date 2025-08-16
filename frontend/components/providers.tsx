"use client";

import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { monadTestnetConfig } from "@/config/monad";
import { useThemeStore } from "@/lib/stores/theme-store";
import { useEffect, useState } from "react";
import { ColorAnimationProvider, useColorAnimation } from "@/components/color-animation-provider";

const config = createConfig({
  chains: [monadTestnetConfig],
  transports: {
    [monadTestnetConfig.id]: http(),
  },
  ssr: true,
});

const queryClient = new QueryClient();

function RainbowKitThemeProvider({ children }: { children: React.ReactNode }) {
  const colorsTop = useThemeStore((state) => state.colorsTop);
  const [currentColor, setCurrentColor] = useState(colorsTop[0]);
  const color = useColorAnimation();
  
  useEffect(() => {
    const unsubscribe = color.on("change", (latest) => {
      setCurrentColor(latest as string);
    });
    
    return () => unsubscribe();
  }, [color]);

  return (
    <RainbowKitProvider
      theme={darkTheme({
        accentColor: currentColor,
        accentColorForeground: "white",
        borderRadius: "large",
      })}
    >
      {children}
    </RainbowKitProvider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <ColorAnimationProvider>
          <RainbowKitThemeProvider>
            {children}
          </RainbowKitThemeProvider>
        </ColorAnimationProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
