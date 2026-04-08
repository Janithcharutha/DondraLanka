"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, Filter, Eye, Truck, CheckCircle, XCircle, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const SHIPPING_COST = 350

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
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const { toast } = useToast()
  const router = useRouter()

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/orders')
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }

      const data = await response.json()
      console.log('Fetched orders:', data) // Debug log
      setOrders(data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${order.billingDetails.firstName} ${order.billingDetails.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.billingDetails.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || !statusFilter ? true : order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
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

      setOrders(orders.map((order) => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ))

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

  const deleteOrder = async (orderId: string) => {
    try {
      const response = await fetch(`/api/admin/orders/${orderId}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete order')
      }

      // Remove the deleted order from state
      setOrders(orders.filter(order => order._id !== orderId))

      toast({
        title: "Success",
        description: "Order deleted successfully",
      })
    } catch (error) {
      console.error('Error deleting order:', error)
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive"
      })
    }
  }

  const handleRowClick = (orderId: string) => {
    router.push(`/admin/orders/${orderId}`)
  }

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]">Loading...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <Button onClick={fetchOrders}>Refresh</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by order number, customer name, or email..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-medium">Order ID</th>
                  <th className="text-left p-4 font-medium">Customer</th>
                  {/* <th className="text-left p-4 font-medium">Date</th> */}
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Payment</th>
                  <th className="text-left p-4 font-medium">Total</th>
                  <th className="text-right p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr 
                    key={order._id} 
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleRowClick(order._id)}
                  >
                    <td className="p-4 font-medium">{order.orderNumber}</td>
                    <td className="p-4">
                      <div>
                        <p>{`${order.billingDetails.firstName} ${order.billingDetails.lastName}`}</p>
                        <p className="text-xs text-gray-500">{order.billingDetails.email}</p>
                      </div>
                    </td>
                    {/* <td className="p-4">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td> */}
                    <td className="p-4">
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
                    </td>
                    <td className="p-4">
                      <Badge variant={order.paymentMethod === "cod" ? "secondary" : "default"}>
                        {order.paymentMethod === "cod" ? "Cash on Delivery" : order.paymentMethod}
                      </Badge>
                    </td>
                    <td className="p-4">
                      <div>
                        <p>Rs.{(order.total + SHIPPING_COST).toLocaleString()}</p>
                        <p className="text-xs text-gray-500">
                          {order.items.length} items
                          <span className="text-gray-400 ml-1">(+Rs.{SHIPPING_COST} shipping)</span>
                        </p>
                      </div>
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm" asChild>
                          <Link href={`/admin/orders/${order._id}`}>
                            <Eye className="h-4 w-4" />
                          </Link>
                        </Button>
                        {order.status === "pending" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => updateOrderStatus(order._id, "processing")}
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>
                        )}
                        {order.status === "processing" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-purple-500 hover:text-purple-700"
                            onClick={() => updateOrderStatus(order._id, "shipped")}
                          >
                            <Truck className="h-4 w-4" />
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Order</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete order {order.orderNumber}? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                className="bg-red-500 hover:bg-red-600"
                                onClick={() => deleteOrder(order._id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
