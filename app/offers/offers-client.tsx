"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ChevronRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "@/components/ui/use-toast"

interface OfferProduct {
  _id: string
  name: string
  slug: string
  productName?: string
  productSlug?: string
  productImage?: string
  category: string
  categoryName: string
  image: string[]
  images: string[]
  originalPrice: number
  discountedPrice: number
  description: string
  contents?: string[]
  discountPercentage: number
  product?: {
    name: string
    images: string[]
    slug: string
  }
}

export default function OffersClient({ initialOffers }: { initialOffers: any[] }) {
  const { addItem } = useCart()
  const [offerProducts, setOfferProducts] = useState<OfferProduct[]>([])
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  useEffect(() => {
    const transformedData = initialOffers.map((offer: any) => ({
      ...offer,
      name: offer.productName || offer.product?.name || "Untitled Product",
      slug:
        offer.productSlug ||
        offer.product?.slug ||
        offer.slug ||
        (offer.productName || offer.product?.name || "untitled")
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-"),
      image: offer.productImage
        ? [offer.productImage]
        : offer.product?.images || offer.images || [],
      categoryName: offer.categoryName || offer.category || "Offer",
    }))

    setOfferProducts(transformedData)
  }, [initialOffers])

  const handleAddToCart = async (product: OfferProduct) => {
    try {
      setAddingToCart(product._id)

      await addItem({
        type: "offer",
        itemId: product._id,
        name: product.name,
        slug:
          product.slug ||
          product.productSlug ||
          product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        image:
          Array.isArray(product.image) && product.image.length > 0
            ? product.image[0]
            : "/placeholder.svg",
        price: product.discountedPrice,
        originalPrice: product.originalPrice,
        quantity: 1,
        inStock: true,
        discountPercentage: product.discountPercentage,
      })

      toast({
        title: "✅ Added to Cart",
        description: `${product.name} has been added to your cart.`,
      })
    } finally {
      setAddingToCart(null)
    }
  }

  return (
    <div className="container mx-auto py-12">
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link href="/">HOME</Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span>OFFERS</span>
      </div>

      <h1 className="font-playfair text-4xl mb-8 text-center">
        Special Offers
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {offerProducts.map((product) => (
          <div
            key={product._id}
            className="group bg-white rounded-lg shadow-md overflow-hidden relative"
          >
            <div className="absolute top-2 left-2 z-20 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-semibold shadow-md">
              {product.discountPercentage}% OFF
            </div>

            <div className="relative aspect-square bg-[#f5f0e8]">
              <Link href={`/offers/${product.slug || product.productSlug}`}>
                <Image
                  src={
                    product.image?.[0] ||
                    product.images?.[0] ||
                    product.productImage ||
                    "/placeholder.svg"
                  }
                  alt={product.name}
                  fill
                  className="object-contain transition-transform duration-500 group-hover:scale-105"
                />
              </Link>
            </div>

            <div className="p-4 text-center">
              <p className="text-sm text-gray-500 mb-1">
                {product.categoryName}
              </p>

              <h3 className="font-playfair text-lg mb-2 line-clamp-2 min-h-[3.5rem]">
                <Link href={`/offers/${product.slug || product.productSlug}`}>
                  {product.name}
                </Link>
              </h3>

              <div className="flex justify-center items-center gap-2 mb-4">
                <span className="text-gray-500 line-through text-sm">
                  Rs.{product.originalPrice.toLocaleString()}
                </span>
                <span className="font-semibold text-lg text-[#c9a77c]">
                  Rs.{product.discountedPrice.toLocaleString()}
                </span>
              </div>

              <Button
                onClick={() => handleAddToCart(product)}
                disabled={addingToCart === product._id}
                className="w-full bg-[#c9a77c] hover:bg-[#b89669] text-white"
              >
                {addingToCart === product._id ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Adding...
                  </span>
                ) : (
                  "Add to Cart"
                )}
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}