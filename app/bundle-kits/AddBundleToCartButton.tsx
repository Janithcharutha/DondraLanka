"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { toast } from "@/components/ui/use-toast";

export default function AddBundleToCartButton({ bundle }: { bundle: any }) {
  const { addItem } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAddToCart = async () => {
    if (!bundle?._id) {
      toast({
        title: "Error",
        description: "Invalid bundle data",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);

      await addItem({
        type: "bundle",
        itemId: bundle._id.toString(),
        name: bundle.name,
        slug: bundle.slug,
        image: bundle.images?.[0] || "/placeholder.svg",
        price: bundle.discountedPrice || bundle.price,
        originalPrice: bundle.price,
        quantity: 1,
        inStock: true,
        products:
          bundle.products?.map((product: any) => ({
            productId: product.productId.toString(),
            productName: product.productName,
            quantity: product.quantity,
            price: product.price,
          })) || [],
      });

      toast({
        title: "✅ Added to Cart",
        description: (
          <div className="space-y-2">
            <p>{`${bundle.name} has been added to your cart.`}</p>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cart">Proceed to Cart</Link>
            </Button>
          </div>
        ),
        duration: 7000,
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleAddToCart}
      disabled={loading}
      type="button"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          Adding...
        </span>
      ) : (
        "Add to Cart"
      )}
    </Button>
  );
}