'use client'

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import ProductGrid from "@/components/product-grid"
import { Product, Offer, BundleKit } from "@/lib/types"

export default function ShopPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [offers, setOffers] = useState<Offer[]>([])
  const [bundleKits, setBundleKits] = useState<BundleKit[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedSubCategories, setSelectedSubCategories] = useState<string[]>([])
  const [priceRange, setPriceRange] = useState([0, 15000])

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true)

        const [productsRes, offersRes, bundleKitsRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/offers'),
          fetch('/api/bundle-kits')
        ])

        if (!productsRes.ok) throw new Error('Failed to fetch products')
        if (!offersRes.ok) throw new Error('Failed to fetch offers')
        if (!bundleKitsRes.ok) throw new Error('Failed to fetch bundle kits')

        const [productsData, offersData, bundleKitsData] = await Promise.all([
          productsRes.json(),
          offersRes.json(),
          bundleKitsRes.json()
        ])

        setProducts(productsData)
        setOffers(offersData)
        setBundleKits(bundleKitsData)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAllData()
  }, [])

  const categories = Array.from(new Set([
    ...products.map(p => p.categoryName),
    ...offers.map(o => o.categoryName),
    ...bundleKits.map(b => b.categoryName || "Bundle Kits") // fallback
  ])).sort()

  const subcategories = Array.from(new Set(products.map(p => p.subcategoryName))).sort()

  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategories.length === 0 ||
      selectedCategories.includes(product.categoryName)

    const subcategoryMatch = selectedSubCategories.length === 0 ||
      selectedSubCategories.includes(product.subcategoryName)

    const priceMatch = product.price >= priceRange[0] &&
      product.price <= priceRange[1]

    return categoryMatch && subcategoryMatch && priceMatch
  })

  const filteredOffers = offers.filter(offer => {
    const categoryMatch = selectedCategories.length === 0 ||
      selectedCategories.includes(offer.categoryName)

    const priceMatch = offer.discountedPrice >= priceRange[0] &&
      offer.discountedPrice <= priceRange[1]

    return categoryMatch && priceMatch
  })

  // ✅ Price filter only (no category/subcategory filtering for bundle kits)
  const filteredBundleKits = bundleKits.filter(kit =>
    kit.price >= priceRange[0] && kit.price <= priceRange[1]
  )

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const handleSubCategoryChange = (subcategory: string) => {
    setSelectedSubCategories(prev =>
      prev.includes(subcategory)
        ? prev.filter(s => s !== subcategory)
        : [...prev, subcategory]
    )
  }

  return (
    <div className="container mx-auto py-12">
      <h1 className="font-playfair text-4xl mb-8 text-center">Shop All Products</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar filters */}
        <div className="space-y-8">
          <div>
            <h3 className="font-playfair text-xl mb-4">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={`category-${category}`}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                  />
                  <Label htmlFor={`category-${category}`}>{category}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-xl mb-4">Price Range</h3>
            <Slider
              value={[0, priceRange[1]]}
              onValueChange={(val) => setPriceRange([0, val[1]])}
              min={0}
              max={Math.max(...products.map(p => p.price), ...bundleKits.map(b => b.price), 15000)}
              step={100}
            />
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>RS. 0</span>
              <span>RS. {priceRange[1].toLocaleString()}</span>
            </div>
          </div>

          <div>
            <h3 className="font-playfair text-xl mb-4">SubCategories</h3>
            <div className="space-y-2">
              {subcategories.map((subcategory) => (
                <div key={subcategory} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subcategory-${subcategory}`}
                    checked={selectedSubCategories.includes(subcategory)}
                    onCheckedChange={() => handleSubCategoryChange(subcategory)}
                  />
                  <Label htmlFor={`subcategory-${subcategory}`}>{subcategory}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product grid */}
        <div className="md:col-span-3">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <span className="loading loading-spinner loading-lg"></span>
            </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              offers={filteredOffers}
              bundleKits={filteredBundleKits}
            />
          )}
        </div>
      </div>
    </div>
  )
}
