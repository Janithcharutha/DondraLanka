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

export const metadata = {
  title: "DONDRA LANKA",
  description: "Your one-stop shop for natural beauty and wellness products",
    icons: {
    icon: '/favicon1.png',
  }
}

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