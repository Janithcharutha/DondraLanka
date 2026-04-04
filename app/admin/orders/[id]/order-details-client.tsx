"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, Printer, Mail, Truck, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { format } from "date-fns"

// Update interfaces to match your MongoDB schema
interface OrderItem {
  _id: string
  itemId: string
  name: string
  quantity: number
  price: number
  image: string
}

interface BillingDetails {
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

interface Order {
  _id: string
  orderNumber: string
  userId: string
  billingDetails: BillingDetails
  items: OrderItem[]
  total: number
  paymentMethod: string
  status: string
  createdAt: string
  updatedAt: string
  orderReference?: string
  paymentProof?: string
}

interface OrderDetailsClientProps {
  orderId: string
}

const SHIPPING_COST = 350

export function OrderDetailsClient({ orderId }: OrderDetailsClientProps) {
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/admin/orders/${orderId}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch order')
        }

        const data = await response.json()
        console.log('Raw order data:', data) // Debug log to see raw data

        // Don't override paymentProof if it exists in data
        setOrder({
          ...data,
          orderReference: data.orderReference || `${data.billingDetails.firstName} ${data.billingDetails.lastName}`,
          paymentProof: data.paymentProof, // Remove the || null fallback
          paymentMethod: data.paymentMethod
        })
      } catch (error) {
        console.error('Error fetching order:', error)
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    if (orderId) {
      fetchOrder()
    }
  }, [orderId, toast])

  // Add debug logging
  useEffect(() => {
    if (order) {
      console.log('Order details:', {
        reference: order.orderReference,
        paymentProof: order.paymentProof,
        method: order.paymentMethod
      })
    }
  }, [order])

  const updateOrderStatus = async (newStatus: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) {
        throw new Error('Failed to update order status')
      }

      const updatedOrder = await response.json()
      setOrder(updatedOrder)
      
      toast({
        title: "Success",
        description: "Order status updated successfully",
      })
    } catch (error) {
      console.error('Error updating order:', error)
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Loading...
      </div>
    )
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        Order not found
      </div>
    )
  }

  // Add this helper function to safely format dates
  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Invalid date'
      }
      return format(date, 'MMM dd, yyyy - HH:mm')
    } catch (error) {
      console.error('Error formatting date:', error)
      return 'Invalid date'
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-2">
          <Link href="/admin/orders">
            <Button variant="outline" size="sm">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Orders
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">Order {order.orderNumber}</h1>
        </div>
        {/* ...existing action buttons... */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>View and manage order information</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Payment Method and Bank Transfer Details */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <p className="text-sm text-gray-500">Order Date</p>
                <p className="font-medium">
                  {order?.createdAt ? formatDate(order.createdAt) : 'Not available'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Method</p>
                <div>
                  <p className="font-medium">{order.paymentMethod}</p>
                  {order.paymentMethod === 'bank-transfer' && (
                    <p className="text-sm text-blue-600">
                      Ref: {order.orderReference || 'N/A'}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500">Order Status</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={`${
                      order.status === "delivered"
                        ? "border-green-500 text-green-700"
                        : order.status === "processing"
                          ? "border-blue-500 text-blue-700"
                          : order.status === "shipped"
                            ? "border-purple-500 text-purple-700"
                            : order.status === "cancelled"
                              ? "border-red-500 text-red-700"
                              : "border-yellow-500 text-yellow-700"
                    }`}
                  >
                    {order.status}
                  </Badge>
                  <Select value={order.status} onValueChange={updateOrderStatus}>
                    <SelectTrigger className="w-[140px] h-8">
                      <SelectValue placeholder="Update Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="processing">Processing</SelectItem>
                      <SelectItem value="shipped">Shipped</SelectItem>
                      <SelectItem value="delivered">Delivered</SelectItem>
                      <SelectItem value="cancelled">Cancelled</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Bank Transfer Payment Proof */}
            {order.paymentMethod === 'bank-transfer' && (
              <div className="mb-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Bank Transfer Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-500">Reference Number</p>
                          <p className="font-medium">{order.orderReference || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Payment Status</p>
                          <Badge
                            variant={order.status === 'pending' ? 'secondary' : 'default'}
                          >
                            {order.status === 'pending' ? 'Awaiting Verification' : 'Verified'}
                          </Badge>
                        </div>
                      </div>
                      
                      {order.paymentProof ? (
                        <div>
                          <p className="text-sm text-gray-500 mb-2">Payment Proof</p>
                          <div className="relative h-[300px] w-full border rounded-lg overflow-hidden bg-gray-50">
                            <Image
                              src={order.paymentProof}
                              alt="Payment proof"
                              fill
                              className="object-contain"
                              priority
                              onError={(e) => {
                                console.error('Error loading image:', e)
                                e.currentTarget.src = '/placeholder.svg'
                              }}
                              sizes="(max-width: 768px) 100vw, 50vw"
                            />
                            <div className="absolute bottom-2 right-2 z-10">
                              <Button
                                size="sm"
                                variant="secondary"
                                onClick={() => {
                                  if (order.paymentProof) {
                                    window.open(order.paymentProof, '_blank')
                                  }
                                }}
                              >
                                View Full Image
                              </Button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="p-8 bg-gray-50 rounded-lg text-center text-gray-500">
                          <p>No payment proof uploaded yet</p>
                          <p className="text-sm mt-2">Order ID: {order._id}</p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            <Separator className="my-6" />

            {/* Order Items */}
            <div className="space-y-4">
              <h3 className="font-medium">Order Items</h3>
              <div className="space-y-4">
                {order?.items?.map((item, index) => (
                  <div 
                    key={`${item._id || item.itemId}-${index}`}
                    className="flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      {item.image && (
                        <div className="relative w-16 h-16">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover rounded-md"
                          />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-medium">Rs. {item.price * item.quantity}</p>
                  </div>
                ))}

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-gray-500">
                    <span>Subtotal</span>
                    <span>Rs. {order?.total}</span>
                  </div>
                  <div className="flex justify-between text-gray-500 mt-2">
                    <span>Shipping</span>
                    <span>Rs. {SHIPPING_COST}</span>
                  </div>
                  <div className="flex justify-between font-semibold mt-2 pt-2 border-t">
                    <span>Total</span>
                    <span>Rs. {order?.total + SHIPPING_COST}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customer Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="font-medium">
                    {`${order.billingDetails.firstName} ${order.billingDetails.lastName}`}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium">{order.billingDetails.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium">{order.billingDetails.phoneNumber}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Shipping Address */}
          <Card>
            <CardHeader>
              <CardTitle>Shipping Address</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                <p>{order.billingDetails.streetAddress}</p>
                {order.billingDetails.addressLine2 && (
                  <p>{order.billingDetails.addressLine2}</p>
                )}
                <p>
                  {order.billingDetails.city}, {order.billingDetails.country}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Order Notes */}
          {order.billingDetails.orderNotes && (
            <Card>
              <CardHeader>
                <CardTitle>Order Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{order.billingDetails.orderNotes}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        {order.paymentMethod === 'bank-transfer' && order.status === 'pending' && (
          <Button 
            className="flex items-center gap-2 bg-green-600 hover:bg-green-700" 
            onClick={() => updateOrderStatus("processing")}
          >
            <CheckCircle className="h-4 w-4" />
            Verify Payment
          </Button>
        )}
        {order.status === "processing" && (
          <Button 
            className="flex items-center gap-2" 
            onClick={() => updateOrderStatus("shipped")}
          >
            <Truck className="h-4 w-4" />
            Mark as Shipped
          </Button>
        )}
        {order.status === "shipped" && (
          <Button 
            className="flex items-center gap-2" 
            onClick={() => updateOrderStatus("delivered")}
          >
            <CheckCircle className="h-4 w-4" />
            Mark as Delivered
          </Button>
        )}
        {(order.status === "pending" || order.status === "processing") && (
          <Button
            variant="destructive"
            className="flex items-center gap-2"
            onClick={() => updateOrderStatus("cancelled")}
          >
            <XCircle className="h-4 w-4" />
            Cancel Order
          </Button>
        )}
      </div>
    </div>
  )
}
