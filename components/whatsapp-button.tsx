"use client"

import { Phone } from "lucide-react"
import { usePathname } from "next/navigation"

export default function WhatsAppButton() {
  const pathname = usePathname()

  // Hide on /admin pages
  if (pathname.startsWith("/admin")) {
    return null
  }

  return (
    <a
      href="https://wa.me/+94782672914"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white rounded-full p-5 shadow-lg hover:bg-green-600 transition-colors z-50"
      aria-label="Chat on WhatsApp"
    >
      <div className="relative">
        <Phone className="h-8 w-8" />
        <span className="absolute -top-4 -right-4 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
          1
        </span>
      </div>
    </a>
  )
}
