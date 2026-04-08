import mongoose from 'mongoose'

export interface BundleProduct {
  productId: string | mongoose.Types.ObjectId
  productName: string
  quantity: number
  price: number
}

export interface BundleKit {
  _id?: string | mongoose.Types.ObjectId
  name: string
  slug: string
  description?: string
  price: number
  discountedPrice?: number | null
  images: string[]
  products: BundleProduct[]
  featured: boolean
  status: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}