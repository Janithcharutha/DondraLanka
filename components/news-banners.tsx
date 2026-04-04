"use client"

import { useState, useEffect, type ReactNode } from "react"
import { useToast } from "@/components/ui/use-toast"
import type { NewsBanner } from "@/types/news-banner"

interface NewsBannersProps {
  fallback?: ReactNode
}

export default function NewsBanners({ fallback }: NewsBannersProps) {
  const [loading, setLoading] = useState(true)
  const [banners, setBanners] = useState<NewsBanner[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const { toast } = useToast()

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/news-banners')
        if (!response.ok) throw new Error('Failed to fetch banners')
        const data = await response.json()

        const activeBanners = data.filter((banner: NewsBanner) => {
          const now = new Date()
          const startDate = new Date(banner.startDate)
          const endDate = new Date(banner.endDate)
          return now >= startDate && now <= endDate && banner.status === 'Active'
        })

        setBanners(activeBanners)
      } catch (error) {
        console.error('Error:', error)
        toast({
          title: "Error",
          description: "Failed to load banners",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBanners()
  }, [toast])

  useEffect(() => {
    if (banners.length <= 1) return

    const timer = setInterval(() => {
      setCurrentIndex((current) =>
        current === banners.length - 1 ? 0 : current + 1
      )
    }, 2500)

    return () => clearInterval(timer)
  }, [banners.length])

  if (loading) return null
  if (banners.length === 0) return fallback

  return (
    <div className="relative w-full h-[60vh] sm:h-[70vh] md:h-[90vh] lg:h-[100vh] overflow-hidden">
      {banners.map((banner, index) => (
        <div
          key={banner._id}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <img
            src={banner.imageUrl}
            alt="Banner"
            className="w-full h-full object-contain" // Changed from object-cover to object-contain
          />
        </div>
      ))}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full transition-colors ${
              index === currentIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
