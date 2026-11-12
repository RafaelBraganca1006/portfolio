import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

export const metadata: Metadata = {
  title: "Rafael Bragança Oliveira",
  description:
    "Computer Science student at ETH Zürich. AI agents, federated learning, applied ML.",
  icons: { icon: "/favicon.svg" },
};

const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='light'?'light':'dark'}catch(e){document.documentElement.dataset.theme='dark'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
