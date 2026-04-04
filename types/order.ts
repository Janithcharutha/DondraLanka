export interface OrderItem {
  itemId: string
  name: string
  quantity: number
  price: number
  image?: string
  slug?: string
  type?: string
  inStock?: boolean
}

export interface BillingDetails {
  firstName: string
  lastName: string
  companyName?: string
  country: string
  streetAddress: string
  addressLine2?: string
  city: string
  phoneNumber: string
  email: string
  orderNotes?: string
}

export interface Order {
  _id?: string
  orderNumber: string
  userId: string
  billingDetails: BillingDetails
  items: OrderItem[]
  total: number
  paymentMethod: 'cod' | 'bank-transfer'
  orderReference?: string
  status: 'pending' | 'processing' | 'completed' | 'cancelled'
}