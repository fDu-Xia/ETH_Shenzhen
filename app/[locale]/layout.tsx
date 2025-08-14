import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Providers } from "@/components/providers";
import "../globals.css";
import "../../lib/styles/animate-background.css";

export async function generateStaticParams() {
  return [
    { locale: 'en' },
    { locale: 'zh' }
  ];
}

export const metadata: Metadata = {
  title: "ContentDAO",
  description: "Decentralized content platform",
  generator: "v0.app",
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  
  return (
    <html lang={locale}>
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body
        className="scrollbar scrollbar-thumb-purple-500/70 scroll-m-0
                    scrollbar-thumb-rounded-full scrollbar-w-[6px]
                  "
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
