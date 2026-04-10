// // import type { MetadataRoute } from 'next/types'

// // export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
// //   return [
// //     {
// //       url: "https://www.dondralanka.com",
// //       lastModified: new Date(),
// //       changeFrequency: "weekly",
// //       priority: 1,
// //     },
// //     {
// //       url: "https://www.dondralanka.com/about",
// //       lastModified: new Date(),
// //       changeFrequency: "monthly",
// //       priority: 0.8,
// //     },
// //     {
// //       url: "https://www.dondralanka.com/shop",
// //       lastModified: new Date(),
// //       changeFrequency: "weekly",
// //       priority: 0.9,
// //     },
// //     {
// //       url: "https://www.dondralanka.com/bundle-kits",
// //       lastModified: new Date(),
// //       changeFrequency: "weekly",
// //       priority: 0.8,
// //     },
// //     {
// //       url: "https://www.dondralanka.com/offers",
// //       lastModified: new Date(),
// //       changeFrequency: "weekly",
// //       priority: 0.8,
// //     },
// //   ];
// // }


// // ///////////////
// // // import type { MetadataRoute } from "next";
// // // import { getAllProducts, getAllCategories, getAllSubcategories } from "@/lib/api";

// // // export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
// // //   const baseUrl = "https://www.dondralanka.com";

// // //   const staticPages: MetadataRoute.Sitemap = [
// // //     {
// // //       url: `${baseUrl}/`,
// // //       lastModified: new Date(),
// // //       changeFrequency: "weekly",
// // //       priority: 1,
// // //     },
// // //     {
// // //       url: `${baseUrl}/about`,
// // //       lastModified: new Date(),
// // //       changeFrequency: "monthly",
// // //       priority: 0.8,
// // //     },
// // //     {
// // //       url: `${baseUrl}/shop`,
// // //       lastModified: new Date(),
// // //       changeFrequency: "weekly",
// // //       priority: 0.9,
// // //     },
// // //     {
// // //       url: `${baseUrl}/offers`,
// // //       lastModified: new Date(),
// // //       changeFrequency: "weekly",
// // //       priority: 0.8,
// // //     },
// // //     {
// // //       url: `${baseUrl}/bundle-kits`,
// // //       lastModified: new Date(),
// // //       changeFrequency: "weekly",
// // //       priority: 0.8,
// // //     },
// // //   ];

// // //   const categories = await getAllCategories();
// // //   const subcategories = await getAllSubcategories();
// // //   const products = await getAllProducts();

// // //   const categoryPages = categories.map((category: any) => ({
// // //     url: `${baseUrl}/products/${category.slug}`,
// // //     lastModified: new Date(category.updatedAt || Date.now()),
// // //     changeFrequency: "weekly" as const,
// // //     priority: 0.8,
// // //   }));

// // //   const subcategoryPages = subcategories.map((subcategory: any) => ({
// // //     url: `${baseUrl}/products/${subcategory.categorySlug}/${subcategory.slug}`,
// // //     lastModified: new Date(subcategory.updatedAt || Date.now()),
// // //     changeFrequency: "weekly" as const,
// // //     priority: 0.7,
// // //   }));

// // //   const productPages = products.map((product: any) => ({
// // //     url: `${baseUrl}/products/${product.categorySlug}/${product.subcategorySlug}/${product.slug}`,
// // //     lastModified: new Date(product.updatedAt || Date.now()),
// // //     changeFrequency: "weekly" as const,
// // //     priority: 0.7,
// // //   }));

// // //   return [...staticPages, ...categoryPages, ...subcategoryPages, ...productPages];
// // // }

// import type { MetadataRoute } from "next/types";
// import { getCategories, getAllProducts, getAllSubcategories } from "@/lib/api";

// export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
//   const baseUrl = "https://www.dondralanka.com";

//   const staticPages: MetadataRoute.Sitemap = [
//     {
//       url: `${baseUrl}/`,
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 1,
//     },
//     {
//       url: `${baseUrl}/shop`,
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 0.9,
//     },
//     {
//       url: `${baseUrl}/about`,
//       lastModified: new Date(),
//       changeFrequency: "monthly",
//       priority: 0.8,
//     },
//     {
//       url: `${baseUrl}/offers`,
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 0.8,
//     },
//     {
//       url: `${baseUrl}/bundle-kits`,
//       lastModified: new Date(),
//       changeFrequency: "weekly",
//       priority: 0.8,
//     },
//   ];

//   const categories = await getCategories();
//   const subcategories = await getAllSubcategories();
//   const products = await getAllProducts();

//   const categoryPages = categories.map((category: any) => ({
//     url: `${baseUrl}/products/${category.slug}`,
//     lastModified: new Date(category.updatedAt || Date.now()),
//     changeFrequency: "weekly" as const,
//     priority: 0.8,
//   }));

//   const subcategoryPages = subcategories.map((subcategory: any) => ({
//     url: `${baseUrl}/products/${subcategory.categorySlug}/${subcategory.slug}`,
//     lastModified: new Date(subcategory.updatedAt || Date.now()),
//     changeFrequency: "weekly" as const,
//     priority: 0.7,
//   }));

//   const productPages = products.map((product: any) => ({
//     url: `${baseUrl}/products/${product.categorySlugSlug}/${product.subcategorySlugSlug}/${product.slug}`,
//     lastModified: new Date(product.updatedAt || Date.now()),
//     changeFrequency: "weekly" as const,
//     priority: 0.7,
//   }));

//   return [...staticPages, ...categoryPages, ...subcategoryPages, ...productPages];
// }

import type { MetadataRoute } from "next/types"
import {
  getCategories,
  getAllProducts,
  getAllSubcategories,
} from "@/lib/api"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://www.dondralanka.com"

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/offers`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/bundle-kits`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ]

  const [categories, subcategories, products] = await Promise.all([
    getCategories(),
    getAllSubcategories(),
    getAllProducts(),
  ])

  const categoryPages: MetadataRoute.Sitemap = categories.map((category) => ({
    url: `${baseUrl}/products/${category.slug}`,
    lastModified: category.updatedAt
      ? new Date(category.updatedAt)
      : category.createdAt
        ? new Date(category.createdAt)
        : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }))

  const subcategoryPages: MetadataRoute.Sitemap = subcategories.map(
    (subcategory) => ({
      url: `${baseUrl}/products/${subcategory.categorySlug}/${subcategory.slug}`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    })
  )

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${baseUrl}/products/${product.category}/${product.subcategory}/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  return [...staticPages, ...categoryPages, ...subcategoryPages, ...productPages]
}