"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { useCart } from "@/components/providers/cart-provider"
import { toast } from "@/components/ui/use-toast"
import type { Product } from "@/lib/types"
import type { EmblaOptionsType } from 'embla-carousel'

interface FeaturedProductsProps {
  products: Product[]
  carouselOptions: EmblaOptionsType
}

export default function FeaturedProducts({ products, carouselOptions }: FeaturedProductsProps) {
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

  const getProductUrl = (product: Product) => {
    return `/products/${product.category}/${product.subcategory}/${product.slug}`
  }

  return (
    <Carousel className="relative" opts={carouselOptions}>
      <CarouselContent className="-ml-4">
        {products.map((product) => (
          <div 
            key={product._id.toString()} 
            className="pl-4 w-full" 
            style={{ flex: '0 0 300px' }}
          >
            <div className="group h-full bg-white rounded-lg overflow-hidden">
              {/* Wrap the clickable area in Link */}
              <Link 
                href={getProductUrl(product)}
                className="block cursor-pointer"
              >
                <div className="relative h-[300px] overflow-hidden">
                  <Image
                    src={product.images[0] || `/placeholder.svg?height=300&width=300&text=${product.name}`}
                    alt={product.name}
                    width={300}
                    height={300}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    priority
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-playfair text-xl mb-2 truncate group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-gray-700 mb-4">
                    RS. {product.price.toLocaleString()}
                  </p>
                </div>
              </Link>
              {/* Keep Add to Cart button outside of Link */}
              <div className="px-4 pb-4">
                <Button 
                  onClick={(e) => {
                    e.preventDefault()
                    handleAddToCart(product)
                  }}
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
          </div>
        ))}
      </CarouselContent>
      <CarouselPrevious className="absolute -left-12 top-1/2 transform -translate-y-1/2" />
      <CarouselNext className="absolute -right-12 top-1/2 transform -translate-y-1/2" />
    </Carousel>
  )
}