import mongoose, { Document } from 'mongoose'

interface OrderItem {
  type?: string;
  itemId: string;
  name: string;
  slug?: string;
  image: string;
  price: number;
  originalPrice?: number;
  quantity: number;
  inStock?: boolean;
  discountPercentage?: number;
}

interface IOrder extends Document {
  orderNumber: string;
  userId: string;
  billingDetails: {
    firstName: string;
    lastName: string;
    companyName?: string;
    country: string;
    streetAddress: string;
    addressLine2?: string;
    city: string;
    phoneNumber: string;
    email: string;
    orderNotes?: string;
  };
  items: OrderItem[];
  total: number;
  paymentMethod: 'cod' | 'payhere' | 'bank-transfer';
  paymentProof?: string;
  orderReference?: string;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
}

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  userId: {
    type: String,
    required: true
  },
  billingDetails: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    companyName: String,
    country: { type: String, required: true },
    streetAddress: { type: String, required: true },
    addressLine2: String,
    city: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    email: { type: String, required: true },
    orderNotes: String
  },
  items: [{
    type: { type: String },
    itemId: { type: String, required: true },
    name: { type: String, required: true },
    slug: String,
    image: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: Number,
    quantity: { type: Number, required: true },
    inStock: Boolean,
    discountPercentage: Number
  }],
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    required: true,
    enum: ['cod', '', 'bank-transfer']
  },
  paymentProof: {
    type: String,
    required: function(this: IOrder) {
      return this.paymentMethod === 'bank-transfer'
    }
  },
  orderReference: {
    type: String,
    sparse: true
  },
  status: {
    type: String,
    required: true,
    enum: ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
})

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', orderSchema)