"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { toast } from "@/components/ui/use-toast";

export default function BundleKitDetailClient({ bundle }: { bundle: any }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const getFirstImage = (images?: string[]): string => {
    if (!images || !Array.isArray(images) || images.length === 0) {
      return "/placeholder.svg";
    }
    return images[0];
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      await addItem({
        type: "bundle",
        itemId: bundle._id,
        name: bundle.name,
        slug: bundle.slug,
        image: getFirstImage(bundle.images),
        price: bundle.discountedPrice || bundle.price,
        originalPrice: bundle.price,
        quantity,
        inStock: true,
        products: bundle.products || [],
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
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add item to cart. Please try again.",
        variant: "destructive",
      });
    } finally {
      setAddingToCart(false);
    }
  };

  const savings = bundle.price - (bundle.discountedPrice || bundle.price);
  const savingsPercentage =
    bundle.price > 0 ? Math.round((savings / bundle.price) * 100) : 0;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-800">
          HOME
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/bundle-kits" className="hover:text-gray-800">
          BUNDLE KITS
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-800">{bundle.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative">
          {savings > 0 && (
            <div className="absolute top-4 left-4 z-10 bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
              SAVE {savingsPercentage}%
            </div>
          )}

          <div className="bg-[#f5f0e8] rounded-lg overflow-hidden">
            <Image
              src={getFirstImage(bundle.images)}
              alt={bundle.name}
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              priority
              unoptimized={process.env.NODE_ENV === "development"}
            />
          </div>
        </div>

        <div>
          <h1 className="font-playfair text-3xl mb-2">{bundle.name}</h1>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl font-semibold">
              Rs.{(bundle.discountedPrice || bundle.price).toLocaleString()}
            </span>
            {bundle.discountedPrice && (
              <span className="text-gray-500 line-through">
                Rs.{bundle.price.toLocaleString()}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex items-center border border-gray-300">
              <button
                className="px-3 py-2 border-r border-gray-300"
                onClick={decrementQuantity}
                disabled={addingToCart}
                type="button"
              >
                <Minus className="h-4 w-4" />
              </button>

              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value) || 1)}
                className="h-10 w-16 text-center border-none focus:outline-none"
                disabled={addingToCart}
              />

              <button
                className="px-3 py-2 border-l border-gray-300"
                onClick={incrementQuantity}
                disabled={addingToCart}
                type="button"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              disabled={addingToCart}
              className="bg-[#c9a77c] hover:bg-[#b89669] text-white px-8"
            >
              {addingToCart ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Adding...
                </span>
              ) : (
                "Add to Cart"
              )}
            </Button>
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-700">{bundle.description}</p>
          </div>

          <div className="mb-8">
            <h3 className="font-medium mb-2">Bundle Contains</h3>
            <ul className="space-y-4">
              {bundle.products?.map((product: any, index: number) => (
                <li key={index} className="border-b pb-4">
                  <h4 className="font-medium mb-1">{product.productName}</h4>
                  <p className="text-gray-600">Quantity: {product.quantity}</p>
                  <p className="text-gray-600">
                    Price: Rs.{product.price.toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}