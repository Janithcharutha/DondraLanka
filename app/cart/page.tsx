"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useCart } from "@/components/providers/cart-provider"
import type { CartItem } from "@/types/cart"
import { useRouter } from "next/navigation"

export default function CartPage() {
  const router = useRouter()
  const { items, updateQuantity, removeItem, total, proceedToCheckout } = useCart()

  const getItemPrice = (item: CartItem) => {
    if (item.type === 'offer') {
      return item.price
    }
    return item.price * item.quantity
  }

  const getItemImage = (item: CartItem) => {
    if (!item.image) {
      return `/placeholder.svg?text=${encodeURIComponent(item.name)}`
    }

    // Handle different item types
    switch (item.type) {
      case 'bundle':
        return item.image || `/placeholder.svg?text=${encodeURIComponent(item.name)}`
      case 'offer':
        return item.image || `/placeholder.svg?text=${encodeURIComponent(item.name)}`
      default:
        return item.image || `/placeholder.svg?text=${encodeURIComponent(item.name)}`
    }
  }

  const getItemLink = (item: CartItem) => {
    switch (item.type) {
      case 'bundle':
        return `/bundle-kits/${item.slug}`
      case 'offer':
        return `/offers/${item.slug}`
      default:
        return `/products/${item.slug}`
    }
  }

  const subtotal = items.reduce((sum, item) => sum + getItemPrice(item), 0)
  const shipping = 350 // Fixed shipping cost

  const handleCheckout = () => {
    // Store cart data in localStorage
    localStorage.setItem('checkoutItems', JSON.stringify({
      items,
      total,
      timestamp: new Date().toISOString()
    }))
    // Navigate to checkout
    router.push('/checkout')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>
      {items.length === 0 ? (
        <div className="text-center py-8">
          <p>Your cart is empty</p>
          <Button 
            onClick={() => router.push('/products')}
            className="mt-4"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.itemId} className="flex gap-4 p-4 bg-white rounded-lg shadow group">
                <Link 
                  href={getItemLink(item)}
                  className="flex gap-4 flex-1 cursor-pointer"
                >
                  <div className="relative w-24 h-24">
                    <Image
                      src={getItemImage(item)}
                      alt={item.name}
                      fill
                      className="rounded-md object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium group-hover:text-primary transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      RS. {item.price.toLocaleString()}
                    </p>
                  </div>
                </Link>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      updateQuantity(item.itemId, item.quantity - 1)
                    }}
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => {
                      e.preventDefault()
                      const value = parseInt(e.target.value)
                      if (!isNaN(value) && value > 0) {
                        updateQuantity(item.itemId, value)
                      }
                    }}
                    min={1}
                    className="w-20 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      updateQuantity(item.itemId, item.quantity + 1)
                    }}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={(e) => {
                      e.preventDefault()
                      removeItem(item.itemId)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-lg shadow h-fit">
            <div className="space-y-4">
              <div className="flex justify-between">
                <span>Total:</span>
                <span className="font-semibold">Rs. {total.toLocaleString()}</span>
              </div>
              <Button 
                onClick={handleCheckout}
                className="w-full bg-[#c9a77c] hover:bg-[#b89669] text-white"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
