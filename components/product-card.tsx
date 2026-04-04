
"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/types"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const [addingToCart, setAddingToCart] = useState<string | null>(null)

  const handleAddToCart = async () => {
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
              <Link href="/cart">Proceed to Cart</Link>
            </Button>
          </div>
        ),
        duration: 5000
      })
    } catch {
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
    <div className="group">
      <Link href={`/products/${product.category}/${product.subcategory}/${product.slug}`}>
        <div className="mb-4 overflow-hidden rounded-lg">
          <Image
            src={product.images[0] || `/placeholder.svg?height=300&width=300&text=${product.name}`}
            alt={product.name}
            width={300}
            height={300}
            className="w-full h-[300px] object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
      </Link>
      <h3 className="font-playfair text-xl mb-1">{product.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{product.subcategoryName}</p>
      <p className="text-gray-700 mb-3">Rs. {product.price.toLocaleString()}</p>
      <Button 
        onClick={handleAddToCart}
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
  )
}
