import { redirect } from "next/navigation"
import { connectToDatabase } from "@/lib/mongodb"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle2 } from "lucide-react"
import { sendOrderConfirmationEmail } from "@/lib/mail"
import type { Order } from "@/types/order"
import { WithId } from "mongodb"
import { z } from "zod"

const OrderSchema = z.object({
  _id: z.any(),
  orderNumber: z.string(),
  userId: z.string(),
  billingDetails: z.object({
    firstName: z.string(),
    lastName: z.string(),
    companyName: z.string().optional(),
    country: z.string(),
    streetAddress: z.string(),
    addressLine2: z.string().optional(),
    city: z.string(),
    phoneNumber: z.string(),
    email: z.string(),
    orderNotes: z.string().optional(),
  }),
  items: z.array(
    z.object({
      itemId: z.string(),
      name: z.string(),
      quantity: z.number(),
      price: z.number(),
      image: z.string().optional(),
      slug: z.string().optional(),
      type: z.string().optional(),
      inStock: z.boolean().optional(),
    })
  ),
  total: z.number(),
  paymentMethod: z.enum(["cod", "bank-transfer"]),
  orderReference: z.string().optional(),
  status: z.enum(["pending", "processing", "completed", "cancelled"]),
})

const SHIPPING_COST = 350

export default async function OrderConfirmationPage({ params }: any) {
  const orderNumber = params.orderNumber

  const db = await connectToDatabase()
  const orderData = await db.collection("orders").findOne({ orderNumber })

  if (!orderData) {
    redirect("/404")
  }

  const parsedOrder = OrderSchema.parse(orderData)
  const order = parsedOrder as WithId<Order>

  try {
    await sendOrderConfirmationEmail(order)
  } catch (error) {
    console.error("Failed to send confirmation email:", error)
  }

  const itemTotal = order.total
  const finalTotal = itemTotal + SHIPPING_COST

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-6">
          <div className="text-center mb-6">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-2" />
            <h1 className="text-2xl font-bold">Order Confirmed!</h1>
            <p className="text-gray-600">
              Your order number is:{" "}
              <span className="font-semibold">{order.orderNumber}</span>
            </p>
          </div>

          {order.paymentMethod === "bank-transfer" && (
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <p className="font-medium text-blue-800">Bank Transfer Reference:</p>
              <p className="text-blue-700">{order.orderReference}</p>
            </div>
          )}

          <div className="border-t pt-4">
            <h2 className="font-semibold mb-2">Order Summary</h2>
            <div className="space-y-2">
              {order.items.map((item: any, index: number) => (
                <div key={`${item.itemId}-${index}`} className="flex justify-between">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>Rs. {item.price * item.quantity}</span>
                </div>
              ))}

              <div className="flex justify-between pt-2">
                <span>Shipping</span>
                <span>Rs. {SHIPPING_COST}</span>
              </div>

              <div className="border-t pt-2 font-semibold">
                <div className="flex justify-between">
                  <span>Total</span>
                  <span>Rs. {finalTotal}</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
