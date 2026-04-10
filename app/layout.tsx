import type { Metadata } from "next/types";
import { Inter } from "next/font/google"
import { ClerkProvider } from "@clerk/nextjs"
import { CartProvider } from "@/components/providers/cart-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import Header from "@/components/header"
import Footer from "@/components/footer"
import WhatsAppButton from "@/components/whatsapp-button"
import { AuthProvider } from "@/hooks/use-auth"

const inter = Inter({ subsets: ["latin"] })

// export const metadata = {
//   title: "DONDRA LANKA",
//   description: "Your one-stop shop for natural beauty and wellness products",
//     icons: {
//     icon: '/favicon1.png',
//   }
// }

export const metadata: Metadata = {
  metadataBase: new URL("https://www.dondralanka.com"),
  title: {
    default: "DONDRA LANKA | Premium Dried Fish and Seafood from Sri Lanka",
    template: "%s | DONDRA LANKA",
  },
  description:
    "Shop premium dried fish and seafood from Sri Lanka. DONDRA LANKA offers hygienic, high-quality products with trusted freshness and worldwide delivery.",
  keywords: [
    "dried fish Sri Lanka",
    "premium dried seafood",
    "Sri Lankan seafood online",
    "buy dried fish online",
    "Dondra Lanka",
    "dried fish delivery",
    "seafood Sri Lanka",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "https://www.dondralanka.com",
    title: "DONDRA LANKA | Premium Dried Fish and Seafood from Sri Lanka",
    description:
      "Shop premium dried fish and seafood from Sri Lanka with trusted freshness and worldwide delivery.",
    siteName: "DONDRA LANKA",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "DONDRA LANKA premium dried fish and seafood",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "DONDRA LANKA | Premium Dried Fish and Seafood from Sri Lanka",
    description:
      "Shop premium dried fish and seafood from Sri Lanka with trusted freshness and worldwide delivery.",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon1.png",
  },
  robots: {
    index: true,
    follow: true,
  },
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ClerkProvider>
          <CartProvider>
            <AuthProvider>
              <Header />
              <main>{children}</main>
              <Footer />
              <Toaster />
              <WhatsAppButton/>
            </AuthProvider>
          </CartProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}