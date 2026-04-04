import Link from "next/link"
import { Package, ShoppingBag, Users, DollarSign, TrendingUp } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { connectToDatabase } from "@/lib/mongodb"
import { formatDate } from "@/lib/utils"

const SHIPPING_COST = 350

async function getDashboardData() {
  const db = await connectToDatabase()

  // Get total products count
  const productsCount = await db.collection("products").countDocuments()

  // Get total orders and calculate revenue
  const orders = await db.collection("orders")
    .find({})
    .sort({ createdAt: -1 })
    .limit(5)
    .toArray()

  const totalOrders = await db.collection("orders").countDocuments()

  // Calculate total revenue including shipping
  const revenue = await db.collection("orders").aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: { $add: ["$total", SHIPPING_COST] } }
      }
    }
  ]).toArray()

  // Get unique customers count
  const uniqueCustomers = await db.collection("orders").distinct("billingDetails.email")

  return {
    stats: {
      products: productsCount,
      orders: totalOrders,
      customers: uniqueCustomers.length,
      revenue: revenue[0]?.total || 0
    },
    recentOrders: orders
  }
}

export default async function AdminDashboard() {
  const { stats, recentOrders } = await getDashboardData()

  const statsConfig = [
    { 
      name: "Total Products", 
      value: stats.products.toString(), 
      icon: Package 
    },
    { 
      name: "Total Orders", 
      value: stats.orders.toString(), 
      icon: ShoppingBag 
    },
    { 
      name: "Total Customers", 
      value: stats.customers.toString(), 
      icon: Users 
    },
    { 
      name: "Total Revenue", 
      value: `Rs.${stats.revenue.toLocaleString()}`, 
      icon: DollarSign 
    },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsConfig.map((stat) => (
          <Card key={stat.name}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{stat.name}</CardTitle>
              <stat.icon className="h-5 w-5 text-gray-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="w-full">
        {/* Recent orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest 5 orders across the store</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left pb-3 font-medium">Order ID</th>
                    <th className="text-left pb-3 font-medium">Customer</th>
                    <th className="text-left pb-3 font-medium">Date</th>
                    <th className="text-left pb-3 font-medium">Status</th>
                    <th className="text-right pb-3 font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order._id.toString()} className="border-b">
                      <td className="py-3">
                        <Link href={`/admin/orders/${order._id}`} className="text-blue-600 hover:underline">
                          {order.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3">{`${order.billingDetails.firstName} ${order.billingDetails.lastName}`}</td>
                      <td className="py-3">{formatDate(order.createdAt)}</td>
                      <td className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            order.status === "delivered"
                              ? "bg-green-100 text-green-800"
                              : order.status === "processing"
                                ? "bg-blue-100 text-blue-800"
                                : order.status === "shipped"
                                  ? "bg-purple-100 text-purple-800"
                                  : order.status === "cancelled"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        Rs.{(order.total + SHIPPING_COST).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-right">
              <Link href="/admin/orders" className="text-sm text-blue-600 hover:underline">
                View all orders
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
