import type { Metadata } from "next";
import { Geist } from "next/font/google";
import ThemeToggle from "@/components/ThemeToggle";
import "./globals.css";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" });

// first load of the home page (no hash, no reduced motion): hide header and text until the photo intro has played
const introScript = `try{if(location.pathname==='/'&&!location.hash&&!matchMedia('(prefers-reduced-motion: reduce)').matches){document.documentElement.dataset.intro='pre'}}catch(e){}`;

export const metadata: Metadata = {
  title: "Rafael Bragança Oliveira",
  description:
    "Computer Science student at ETH Zürich. AI agents, federated learning, applied ML.",
  icons: { icon: "/favicon.svg" },
};

const themeScript = `try{var t=localStorage.getItem('theme');document.documentElement.dataset.theme=t==='dark'?'dark':'light'}catch(e){document.documentElement.dataset.theme='light'}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={geist.variable} data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script dangerouslySetInnerHTML={{ __html: introScript }} />
      </head>
      <body>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
