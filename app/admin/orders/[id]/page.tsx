import { OrderDetailsClient } from "./order-details-client"

// Use a simpler approach without type annotations
export default function OrderDetailsPage({ params }: any) {
  const { id } = params

  // For now, we'll pass the ID to the client component
  return <OrderDetailsClient orderId={id} />
}
