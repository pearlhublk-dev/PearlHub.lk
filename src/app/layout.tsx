import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "@/components/providers";
import { Toaster } from "@/components/ui/sonner";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "PearlHub - Premium Travel & Experiences",
  description: "Discover and book the best stays, vehicles, and events in Sri Lanka. Premium travel experiences curated for you.",
  keywords: ["Sri Lanka", "travel", "hotels", "vacation", "events", "vehicles", "bookings"],
  authors: [{ name: "PearlHub" }],
  creator: "PearlHub Team",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "PearlHub",
    title: "PearlHub - Premium Travel & Experiences",
    description: "Discover and book the best stays, vehicles, and events in Sri Lanka.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "PearlHub - Premium Travel & Experiences",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PearlHub - Premium Travel & Experiences",
    description: "Discover and book the best stays, vehicles, and events in Sri Lanka.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <Header />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <Toaster position="bottom-right" richColors />
        </Providers>
      </body>
    </html>
  );
}
