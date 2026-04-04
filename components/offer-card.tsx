import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "@/components/ui/use-toast"
import type { Offer } from "@/lib/types"

interface OfferCardProps {
  offer: Offer
}

export default function OfferCard({ offer }: OfferCardProps) {
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleAddToCart = async () => {
    try {
      setAddingToCart(offer._id)
      await addItem({
        type: 'offer',
        itemId: offer._id,
        name: offer.productName,
        slug: offer.productSlug,
        image: offer.productImage,
        price: offer.discountedPrice,
        originalPrice: offer.originalPrice,
        quantity: 1,
        inStock: true,
        discountPercentage: offer.discountPercentage
      })

      toast({
        title: "✅ Added to Cart",
        description: `${offer.productName} has been added to your cart.`,
        duration: 3000
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
    <div className="group bg-white rounded-lg shadow-md overflow-hidden relative">
      <div className="absolute top-2 left-2 z-20 bg-red-500 text-white rounded-full px-3 py-1 text-sm font-semibold">
        {offer.discountPercentage}% OFF
      </div>

      <div className="relative aspect-square bg-[#f5f0e8]">
        <Link href={`/offers/${offer.productSlug}`} className="block">
          <Image
            src={offer.productImage || "/placeholder.svg"}
            alt={offer.productName}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </Link>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium mb-2">
          <Link href={`/offers/${offer.productSlug}`} className="hover:text-gray-600">
            {offer.productName}
          </Link>
        </h3>
        <div className="flex items-center gap-2">
          <span className="text-gray-500 line-through">Rs. {offer.originalPrice.toLocaleString()}</span>
          <span className="text-lg font-semibold">Rs. {offer.discountedPrice.toLocaleString()}</span>
        </div>

        <Button 
          onClick={handleAddToCart}
          disabled={addingToCart === offer._id}
          className="w-full bg-[#c9a77c] hover:bg-[#b89669] text-white mt-4"
        >
          {addingToCart === offer._id ? (
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
  )
}