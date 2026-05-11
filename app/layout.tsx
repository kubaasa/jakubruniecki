import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { NavBar } from "@/components/ui/NavBar";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Jakub Bruniecki — Senior QA Engineer",
  description:
    "Senior QA Engineer · Manual leadership + Playwright automation · 5 years · Open to international remote roles.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-bg-base text-fg font-sans antialiased">
        <NavBar />
        {children}
      </body>
    </html>
  );
}
