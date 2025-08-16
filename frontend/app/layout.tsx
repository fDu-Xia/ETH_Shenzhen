import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "./globals.css";
import "../lib/styles/animate-background.css";
import { Header } from "@/components/header";
import BgFixed from "@/components/animation/home/bg-fixed";

export const metadata: Metadata = {
  title: "ContentDAO",
  description: "Decentralized content platform",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Providers>
          <BgFixed>
            <Header />
            <div className="flex flex-col flex-1">{children}</div>
          </BgFixed>
        </Providers>
      </body>
    </html>
  );
}
