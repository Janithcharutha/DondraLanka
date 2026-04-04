import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "@/components/ui/use-toast"
import type { BundleKit } from "@/lib/types"

interface BundleKitCardProps {
  bundle: BundleKit
}

export default function BundleKitCard({ bundle }: BundleKitCardProps) {
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleAddToCart = async () => {
    try {
      setAddingToCart(bundle._id)
      await addItem({
        type: 'bundle',
        itemId: bundle._id,
        name: bundle.name,
        slug: bundle.slug,
        image: bundle.images[0],
        price: bundle.price,
        quantity: 1,
        inStock: bundle.stock > 0
      })

      toast({
        title: "✅ Added to Cart",
        description: `${bundle.name} has been added to your cart.`,
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
    <div className="group bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative aspect-square bg-[#f5f0e8]">
        <Link href={`/bundle-kits/${bundle.slug}`} className="block">
          <Image
            src={bundle.images[0] || "/placeholder.svg"}
            alt={bundle.name}
            fill
            className="object-contain transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </Link>
      </div>
      
      <div className="p-4">
        <h3 className="font-medium mb-2">
          <Link href={`/bundle-kits/${bundle.slug}`} className="hover:text-gray-600">
            {bundle.name}
          </Link>
        </h3>
        <p className="text-lg font-semibold mb-4">Rs. {bundle.price.toLocaleString()}</p>

        <Button 
          onClick={handleAddToCart}
          disabled={addingToCart === bundle._id}
          className="w-full bg-[#c9a77c] hover:bg-[#b89669] text-white mt-4"
        >
          {addingToCart === bundle._id ? (
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