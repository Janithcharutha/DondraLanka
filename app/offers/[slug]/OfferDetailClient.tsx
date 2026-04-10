"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Minus, Plus, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/components/providers/cart-provider";
import { toast } from "@/components/ui/use-toast";

export default function OfferDetailClient({ offer }: { offer: any }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [addingToCart, setAddingToCart] = useState(false);

  const product = offer.product || offer;
  const productName = product.name || offer.productName || "Special Offer";

  const getFirstImage = (): string => {
    if (product.images?.length) return product.images[0];
    if (offer.productImage) return offer.productImage;
    if (offer.images?.length) return offer.images[0];
    return "/placeholder.svg";
  };

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);

      await addItem({
        type: "offer",
        itemId: offer._id,
        name: productName,
        slug: product.slug || offer.slug,
        image: getFirstImage(),
        price: offer.discountedPrice,
        originalPrice: product.price || offer.originalPrice,
        quantity,
        inStock: true,
        discountPercentage: offer.discountPercentage,
      });

      toast({
        title: "✅ Added to Cart",
        description: (
          <div className="space-y-2">
            <p>{`${productName} has been added to your cart.`}</p>
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

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center text-sm text-gray-500 mb-8">
        <Link href="/" className="hover:text-gray-800">
          HOME
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <Link href="/offers" className="hover:text-gray-800">
          OFFERS
        </Link>
        <ChevronRight className="h-4 w-4 mx-2" />
        <span className="text-gray-800">{productName}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-12">
        <div className="relative">
          <div className="absolute top-4 left-4 z-10 bg-black text-white rounded-full px-4 py-1 text-sm font-medium">
            {offer.discountPercentage}% OFF
          </div>

          <div className="bg-[#f5f0e8] rounded-lg overflow-hidden">
            <Image
              src={getFirstImage()}
              alt={productName}
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              priority
              unoptimized={process.env.NODE_ENV === "development"}
            />
          </div>
        </div>

        <div>
          <h1 className="font-playfair text-3xl mb-2">
            {productName} {product.size && `(${product.size})`}
          </h1>

          {typeof product.rating === "number" && (
            <div className="flex items-center gap-2 mb-4">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= product.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }`}
                  />
                ))}
              </div>
              <span>({product.reviewCount || 0} reviews)</span>
            </div>
          )}

          <div className="flex items-center gap-3 mb-4">
            {(product.price || offer.originalPrice) && (
              <span className="text-gray-500 line-through">
                Rs.{(product.price || offer.originalPrice).toLocaleString()}
              </span>
            )}
            <span className="text-2xl font-semibold">
              Rs.{offer.discountedPrice.toLocaleString()}
            </span>
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
            <p className="text-gray-700">{product.description || offer.description}</p>
          </div>

          {product.items && product.items.length > 0 && (
            <div className="mb-8">
              <h3 className="font-medium mb-2">Kit Contents</h3>
              <ul className="space-y-4">
                {product.items.map((item: any, index: number) => (
                  <li key={index} className="border-b pb-4">
                    <h4 className="font-medium mb-1">{item.name}</h4>
                    <p className="text-gray-600">{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="text-sm text-gray-600 mb-6">
            {product.productCode && <p>Product Code: {product.productCode}</p>}
            {product.category && <p>Category: {product.category}</p>}
            {product.tags && Array.isArray(product.tags) && product.tags.length > 0 && (
              <p>Tags: {product.tags.join(", ")}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}