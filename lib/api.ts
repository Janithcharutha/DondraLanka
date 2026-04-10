// // import { cache } from 'react'
// // import { connectToDatabase } from "@/lib/mongodb"
// // import type { Category } from "@/lib/types"
// // import mongoose from 'mongoose'

// // interface CategoryDocument {
// //   _id: mongoose.Types.ObjectId
// //   name: string
// //   slug: string
// //   description?: string
// //   image?: string
// //   order?: number
// //   subcategories?: {
// //     _id: mongoose.Types.ObjectId
// //     name: string
// //     slug: string
// //     description?: string
// //     image?: string
// //   }[]
// // }

// // export const getCategoryData = cache(async (slug: string) => {
// //   try {
// //     const db = await connectToDatabase()
    
// //     const category = await db
// //       .collection("categories")
// //       .findOne({ slug })

// //     if (!category) return null

// //     return {
// //       ...category,
// //       _id: category._id.toString()
// //     }
// //   } catch (error) {
// //     console.error("Error fetching category:", error)
// //     return null
// //   }
// // })

// // export async function getCategories(): Promise<Category[]> {
// //   try {
// //     const db = await connectToDatabase()
// //     const categories = await db.collection<CategoryDocument>("categories")
// //       .find({})
// //       .sort({ order: 1 })
// //       .toArray()

// //     return categories.map(category => ({
// //       _id: category._id.toString(),
// //       name: category.name,
// //       slug: category.slug,
// //       description: category.description,
// //       image: category.image,
// //       order: category.order,
// //       subcategories: category.subcategories?.map(sub => ({
// //         _id: sub._id.toString(),
// //         name: sub.name,
// //         slug: sub.slug,
// //         description: sub.description,
// //         image: sub.image
// //       })) || []
// //     }))
// //   } catch (error) {
// //     console.error("Error fetching categories:", error)
// //     return []
// //   }
// // }

// import { cache } from "react"
// import mongoose from "mongoose"
// import { connectToDatabase } from "@/lib/mongodb"
// import type { Category, Product } from "@/lib/types"

// interface CategoryDocument {
//   _id: mongoose.Types.ObjectId
//   name: string
//   title?: string
//   slug: string
//   description?: string
//   image?: string
//   order?: number
//   createdAt?: Date
//   updatedAt?: Date
//   subcategories?: {
//     _id: mongoose.Types.ObjectId
//     name: string
//     title?: string
//     slug: string
//     description?: string
//   }[]
// }

// interface ProductDocument {
//   _id: mongoose.Types.ObjectId
//   name: string
//   slug: string
//   description: string
//   price: number
//   images: string[]
//   category: string
//   categoryName: string
//   subcategory: string
//   subcategoryName: string
//   stock: number
//   featured: boolean
//   status: string
//   createdAt?: Date
//   updatedAt?: Date
// }

// export const getCategoryData = cache(
//   async (slug: string): Promise<Category | null> => {
//     try {
//       const db = await connectToDatabase()

//       const category = await db
//         .collection<CategoryDocument>("categories")
//         .findOne({ slug })

//       if (!category) return null

//       return {
//         _id: category._id.toString(),
//         name: category.name,
//         title: category.title,
//         slug: category.slug,
//         description: category.description,
//         image: category.image,
//         createdAt: category.createdAt,
//         updatedAt: category.updatedAt,
//         subcategories:
//           category.subcategories?.map((sub) => ({
//             _id: sub._id.toString(),
//             name: sub.name,
//             title: sub.title,
//             slug: sub.slug,
//             description: sub.description,
//           })) || [],
//       }
//     } catch (error) {
//       console.error("Error fetching category:", error)
//       return null
//     }
//   }
// )

// export async function getCategories(): Promise<Category[]> {
//   try {
//     const db = await connectToDatabase()

//     const categories = await db
//       .collection<CategoryDocument>("categories")
//       .find({})
//       .sort({ order: 1, name: 1 })
//       .toArray()

//     return categories.map((category) => ({
//       _id: category._id.toString(),
//       name: category.name,
//       title: category.title,
//       slug: category.slug,
//       description: category.description,
//       image: category.image,
//       createdAt: category.createdAt,
//       updatedAt: category.updatedAt,
//       subcategories:
//         category.subcategories?.map((sub) => ({
//           _id: sub._id.toString(),
//           name: sub.name,
//           title: sub.title,
//           slug: sub.slug,
//           description: sub.description,
//         })) || [],
//     }))
//   } catch (error) {
//     console.error("Error fetching categories:", error)
//     return []
//   }
// }

// export async function getAllProducts(): Promise<Product[]> {
//   try {
//     const db = await connectToDatabase()

//     const products = await db
//       .collection<ProductDocument>("products")
//       .find({ status: "active" })
//       .sort({ createdAt: -1 })
//       .toArray()

//     return products.map((product) => ({
//       _id: product._id.toString(),
//       name: product.name,
//       slug: product.slug,
//       description: product.description,
//       price: product.price,
//       images: product.images,
//       category: product.category,
//       categoryName: product.categoryName,
//       subcategory: product.subcategory,
//       subcategoryName: product.subcategoryName,
//       stock: product.stock,
//       featured: product.featured,
//       status: product.status,
//     }))
//   } catch (error) {
//     console.error("Error fetching products:", error)
//     return []
//   }
// }

// export async function getAllSubcategories(): Promise<
//   {
//     _id: string
//     name: string
//     title?: string
//     slug: string
//     description?: string
//     categorySlug: string
//     categoryName: string   
//   }[]
// > {
//   try {
//     const categories = await getCategories()

//     const subcategories: {
//       _id: string
//       name: string
//       title?: string
//       slug: string
//       description?: string
//       categorySlug: string
//       categoryName: string
//     }[] = []

//     categories.forEach((category) => {
//       ;(category.subcategories || []).forEach((sub) => {
//         subcategories.push({
//           _id: String(sub._id),
//           name: sub.name,
//           title: sub.title,
//           slug: sub.slug,
//           description: sub.description,
//           categorySlug: category.slug,
//           categoryName: category.name,
//         })
//       })
//     })

//     return subcategories
//   } catch (error) {
//     console.error("Error fetching subcategories:", error)
//     return []
//   }
// }


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url, {
     cache: "no-store",
    
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch: ${url}`);
  }

  return res.json();
}

/* =========================
   BASIC GETTERS
========================= */

export async function getCategories() {
  try {
    return await fetcher<any[]>(`${API_BASE_URL}/api/categories`);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
}

export async function getAllSubcategories() {
  try {
    return await fetcher<any[]>(`${API_BASE_URL}/api/subcategories`);
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
}

export async function getAllProducts() {
  try {
    return await fetcher<any[]>(`${API_BASE_URL}/api/products`);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}

export async function getOffers() {
  try {
    return await fetcher<any[]>(`${API_BASE_URL}/api/offers`);
  } catch (error) {
    console.error("Error fetching offers:", error);
    return [];
  }
}

export async function getBundleKits() {
  try {
    return await fetcher<any[]>(`${API_BASE_URL}/api/bundle-kits`);
  } catch (error) {
    console.error("Error fetching bundle kits:", error);
    return [];
  }
}

/* =========================
   SEO HELPER GETTERS
========================= */

export async function getCategoryBySlug(slug: string) {
  try {
    const categories = await getCategories();
    return categories.find((category: any) => category.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching category by slug:", error);
    return null;
  }
}

export async function getSubcategoryBySlugs(
  categorySlug: string,
  subcategorySlug: string
) {
  try {
    const subcategories = await getAllSubcategories();

    return (
      subcategories.find(
        (subcategory: any) =>
          subcategory.slug === subcategorySlug &&
          (subcategory.categorySlug === categorySlug ||
            subcategory.category?.slug === categorySlug ||
            subcategory.category === categorySlug)
      ) || null
    );
  } catch (error) {
    console.error("Error fetching subcategory by slugs:", error);
    return null;
  }
}

export async function getProductBySlugs(
  categorySlug: string,
  subcategorySlug: string,
  productSlug: string
) {
  try {
    const products = await getAllProducts();

    return (
      products.find((product: any) => {
        const productCategorySlug =
          product.categorySlug || product.category?.slug || product.category;
        const productSubcategorySlug =
          product.subcategorySlug ||
          product.subcategory?.slug ||
          product.subcategory;

        return (
          product.slug === productSlug &&
          productCategorySlug === categorySlug &&
          productSubcategorySlug === subcategorySlug
        );
      }) || null
    );
  } catch (error) {
    console.error("Error fetching product by slugs:", error);
    return null;
  }
}

export async function getProductsByCategory(categorySlug: string) {
  try {
    const products = await getAllProducts();

    return products.filter((product: any) => {
      const productCategorySlug =
        product.categorySlug || product.category?.slug || product.category;

      return productCategorySlug === categorySlug;
    });
  } catch (error) {
    console.error("Error fetching products by category:", error);
    return [];
  }
}

export async function getProductsBySubcategory(
  categorySlug: string,
  subcategorySlug: string
) {
  try {
    const products = await getAllProducts();

    return products.filter((product: any) => {
      const productCategorySlug =
        product.categorySlug || product.category?.slug || product.category;
      const productSubcategorySlug =
        product.subcategorySlug ||
        product.subcategory?.slug ||
        product.subcategory;

      return (
        productCategorySlug === categorySlug &&
        productSubcategorySlug === subcategorySlug
      );
    });
  } catch (error) {
    console.error("Error fetching products by subcategory:", error);
    return [];
  }
}

// export async function getOfferBySlug(slug: string) {
//   try {
//     const offers = await getOffers();
//     return offers.find((offer: any) => offer.slug === slug) || null;
//   } catch (error) {
//     console.error("Error fetching offer by slug:", error);
//     return null;
//   }
// }

export async function getBundleKitBySlug(slug: string) {
  try {
    const bundleKits = await getBundleKits();
    return bundleKits.find((bundleKit: any) => bundleKit.slug === slug) || null;
  } catch (error) {
    console.error("Error fetching bundle kit by slug:", error);
    return null;
  }
}

export async function getOfferBySlug(slug: string) {
  try {
    const offers = await getOffers();

    const normalize = (value?: string) =>
      (value || "").trim().toLowerCase();

    const makeSlug = (value?: string) =>
      normalize(value).replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

    return (
      offers.find((offer: any) => {
        const directSlug = normalize(offer.slug);
        const productSlug = normalize(offer.productSlug);
        const nestedProductSlug = normalize(offer.product?.slug);
        const productNameSlug = makeSlug(
          offer.productName || offer.product?.name || offer.title
        );

        return (
          directSlug === normalize(slug) ||
          productSlug === normalize(slug) ||
          nestedProductSlug === normalize(slug) ||
          productNameSlug === normalize(slug)
        );
      }) || null
    );
  } catch (error) {
    console.error("Error fetching offer by slug:", error);
    return null;
  }
}