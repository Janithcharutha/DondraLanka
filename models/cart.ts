import mongoose from 'mongoose'
import type { CartItem } from '@/types/cart'

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
    index: true
  },
  items: [{
    type: {
      type: String,
      required: true,
      enum: ['product', 'bundle', 'offer']
    },
    itemId: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    slug: {
      type: String,
      required: true
    },
    image: String,
    price: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    inStock: {
      type: Boolean,
      default: true
    }
  }]
}, {
  timestamps: true
})

export const Cart = mongoose.models.Cart || mongoose.model('Cart', cartSchema)