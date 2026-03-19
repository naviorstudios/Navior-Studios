import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { WishlistProvider } from "@/context/WishlistContext";
import CartSidebar from "@/components/CartSidebar";
import CustomCursor from "@/components/CustomCursor";
import LoadingScreen from "@/components/LoadingScreen";
import SearchOverlay from "@/components/SearchOverlay";
import SmoothScroll from "@/components/SmoothScroll";
import MarketActivity from "@/components/MarketActivity";
import AITerminal from "@/components/AITerminal";

// Rest of layout...

// Rest of layout...

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "NAVIOR STUDIOS | Engineered Protection. Elevated Design.",
  description: "Ultra-premium protection and accessories for your daily gear. Engineered for the future of mobile experiences.",
  openGraph: {
    title: "NAVIOR STUDIOS",
    description: "Ultra-premium protection for the modern minimalist.",
    url: "https://navior.studio",
    siteName: "Navior Studios",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NAVIOR STUDIOS",
    description: "Engineered Protection. Elevated Design.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black`}
      >
        <ToastProvider>
          <WishlistProvider>
            <AuthProvider>
              <SmoothScroll>
                <LoadingScreen />
                <CustomCursor />
                <SearchOverlay />
                {children}
                <CartSidebar />
                <MarketActivity />
                <AITerminal />
              </SmoothScroll>
            </AuthProvider>
          </WishlistProvider>
        </ToastProvider>
      </body>
    </html>
  );
}

