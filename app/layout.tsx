import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { RecruiterEasterEgg } from "@/components/RecruiterEasterEgg";
import { Analytics } from "@vercel/analytics/next";
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
  metadataBase: new URL("https://jakubruniecki.dev"),
  title: {
    default: "Jakub Bruniecki - QA Automation Engineer",
    template: "%s · Jakub Bruniecki",
  },
  description:
    "QA Automation Engineer · Manual senior. Automation builder. AI-augmented. · 5 years · Open to international remote roles.",
  openGraph: {
    title: "Jakub Bruniecki - QA Automation Engineer",
    description:
      "QA Automation Engineer · Manual senior. Automation builder. AI-augmented. · 5 years · Open to international remote roles.",
    url: "/",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Jakub Bruniecki - QA Automation Engineer",
    description:
      "QA Automation Engineer · Manual senior. Automation builder. AI-augmented. · 5 years.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="bg-bg-base text-fg font-sans antialiased md:h-screen md:overflow-hidden">
        <RecruiterEasterEgg />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
