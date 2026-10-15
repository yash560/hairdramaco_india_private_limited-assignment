import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hairdrama FlowOS | Collaborative Task Management & Gmail Workflows",
  description: "Production-grade collaborative task orchestration platform built with Next.js 15, React 19, Supabase PostgreSQL, Flask Python backend, Google OAuth 2.0, and Gmail SMTP integration for Hair Drama Co.",
  keywords: ["Hair Drama Co", "Task Management", "Supabase", "Flask", "Next.js 15", "Google OAuth", "Gmail SMTP"],
  authors: [{ name: "Yash Jain", url: "https://thewebvale.com" }],
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#08090d",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col selection:bg-[#d4af37]/30 selection:text-[#f5e7a3]">
        {children}
      </body>
    </html>
  );
}
