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
    default: "Jakub Bruniecki — QA Engineer",
    template: "%s · Jakub Bruniecki",
  },
  description:
    "QA Engineer · Manual leadership + Playwright automation · 5 years · Open to international remote roles.",
  openGraph: {
    title: "Jakub Bruniecki — QA Engineer",
    description:
      "QA Engineer · Manual leadership + Playwright automation · 5 years · Open to international remote roles.",
    url: "/",
    type: "profile",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "Jakub Bruniecki — QA Automation Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jakub Bruniecki — QA Engineer",
    description:
      "QA Engineer · Manual leadership + Playwright automation · 5 years.",
    images: ["/og-image.png"],
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
