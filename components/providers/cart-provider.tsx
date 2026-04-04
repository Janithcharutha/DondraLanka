"use client"

import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from 'next/navigation'
import type { CartItem } from "@/types/cart"

interface CartContextType {
  items: CartItem[]
  addItem: (item: CartItem) => Promise<void>
  removeItem: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  total: number
  proceedToCheckout: () => void
}

export const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, user } = useUser()
  const [items, setItems] = useState<CartItem[]>([])
  const router = useRouter()

  useEffect(() => {
    if (isSignedIn) {
      fetch(`/api/cart/${user.id}`)
        .then(res => res.json())
        .then(data => setItems(data.items))
    } else {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) setItems(JSON.parse(savedCart))
    }
  }, [isSignedIn, user])

  const saveCart = async (newItems: CartItem[]) => {
    if (isSignedIn) {
      await fetch(`/api/cart/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: newItems }),
      })
    } else {
      localStorage.setItem('cart', JSON.stringify(newItems))
    }
    setItems(newItems)
  }

  const total = items.reduce((acc, item) => acc + item.quantity * item.price, 0)

  const proceedToCheckout = () => {
    localStorage.setItem('checkoutItems', JSON.stringify({
      items,
      total,
      timestamp: new Date().toISOString()
    }))
    router.push('/checkout')
  }

  const clearCart = useCallback(() => {
    setItems([])
    localStorage.removeItem('cartItems')
  }, [])

  const value = {
    items,
    addItem: async (newItem: CartItem) => {
      const existingItem = items.find(item => item.itemId === newItem.itemId)
      if (existingItem) {
        await saveCart(
          items.map(item =>
            item.itemId === newItem.itemId
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        )
      } else {
        await saveCart([...items, newItem])
      }
    },
    removeItem: async (itemId: string) => {
      await saveCart(items.filter(item => item.itemId !== itemId))
    },
    updateQuantity: async (itemId: string, quantity: number) => {
      await saveCart(
        items.map(item =>
          item.itemId === itemId ? { ...item, quantity } : item
        )
      )
    },
    clearCart,
    total,
    proceedToCheckout
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}