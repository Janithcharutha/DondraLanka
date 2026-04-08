import mongoose from 'mongoose'

export type CartItemType = 'product' | 'bundle' | 'offer'

export interface CartItem {
  _id?: string
  type: CartItemType
  itemId: string
  name: string
  slug: string
  image: string
  price: number
  originalPrice?: number
  quantity: number
  inStock?: boolean
  products?: {
    productId: string
    productName: string
    quantity: number
    price: number
  }[]
  discountPercentage?: number
  offerEndDate?: string
}

export interface BundleKit {
  _id: mongoose.Types.ObjectId
  name: string
  slug: string
  description: string
  price: number
  discountedPrice?: number
  images: string[]
  products: {
    productId: mongoose.Types.ObjectId
    productName: string
    quantity: number
    price: number
  }[]
  featured: boolean
  status: 'active' | 'draft' | 'archived'
}

export interface CartDocument {
  _id: mongoose.Types.ObjectId
  userId: string
  items: {
    type: CartItemType
    itemId: mongoose.Types.ObjectId
    name: string
    slug: string
    image: string
    price: number
    originalPrice?: number
    quantity: number
    products?: {
      productId: mongoose.Types.ObjectId
      productName: string
      quantity: number
      price: number
    }[]
    discountPercentage?: number
    offerEndDate?: string
  }[]
  createdAt: Date
  updatedAt: Date
}

export interface Cart {
  _id: string
  userId: string
  items: CartItem[]
  createdAt: string
  updatedAt: string
}