"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "@/components/ui/use-toast"
import type { Product, Offer, BundleKit } from "@/lib/types"
import ProductCard from "./product-card"
import OfferCard from "./offer-card"
import BundleKitCard from "./bundle-kit-card"

interface ProductGridProps {
  products: Product[]
  offers?: Offer[]
  bundleKits?: BundleKit[]
}

export default function ProductGrid({ 
  products, 
  offers = [], 
  bundleKits = [] 
}: ProductGridProps) {
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleAddToCart = async (product: Product) => {
    try {
      setAddingToCart(product._id)
      await addItem({
        type: 'product',
        itemId: product._id,
        name: product.name,
        slug: product.slug,
        image: product.images[0],
        price: product.price,
        quantity: 1,
        inStock: product.stock > 0
      })

      toast({
        title: "✅ Added to Cart",
        description: (
          <div className="space-y-2">
            <p>{`${product.name} has been added to your cart.`}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cart">
                Proceed to Cart
              </Link>
            </Button>
          </div>
        ),
        duration: 5000
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive"
      })
    } finally {
      setAddingToCart(null)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {/* Regular products */}
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}

      {/* Offers - only render if provided */}
      {offers.map((offer) => (
        <OfferCard key={offer._id} offer={offer} />
      ))}

      {/* Bundle Kits - only render if provided */}
      {bundleKits.map((bundle) => (
        <BundleKitCard key={bundle._id} bundle={bundle} />
      ))}
    </div>
  )
}
