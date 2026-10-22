import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://hairdramaco-india-private-limited.vercel.app"),
  title: "Hairdrama FlowOS | Collaborative Task Management & Gmail Workflows",
  description: "Production-grade collaborative task orchestration platform built with Next.js 15, React 19, Supabase PostgreSQL, Flask Python backend, Google OAuth 2.0, and Gmail SMTP integration for Hair Drama Co. Powered by TheWebVale.",
  keywords: [
    "Hair Drama Co",
    "Task Management",
    "Supabase",
    "Flask",
    "Next.js 15",
    "Google OAuth",
    "Gmail SMTP",
    "TheWebVale Architecture"
  ],
  authors: [{ name: "TheWebVale Architecture Team", url: "https://thewebvale.com" }],
  creator: "TheWebVale",
  publisher: "TheWebVale",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Hairdrama FlowOS | Collaborative Task Management & Gmail Workflows",
    description: "Production-grade collaborative task orchestration platform for Hair Drama Co. Powered by TheWebVale.",
    url: "https://hairdramaco-india-private-limited.vercel.app",
    siteName: "Hairdrama FlowOS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Hairdrama FlowOS Platform",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Hairdrama FlowOS | Collaborative Task Management",
    description: "Production task orchestration platform for Hair Drama Co. Powered by TheWebVale.",
    images: ["/og-image.png"],
  },
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
