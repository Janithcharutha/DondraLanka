// // // 
// // import type { Metadata } from "next/types";
// // import { buildMetadata } from "@/lib/seo";
// // import ShopClient from "./shop-client";

// // export const metadata: Metadata = buildMetadata({
// //   title: "Shop",
// //   description:
// //     "Browse premium dried fish and seafood from Sri Lanka at DONDRA LANKA.",
// //   path: "/shop",
// // });

// // export default async function ShopPage() {
// //   return <ShopClient />;
// // }
 
// import type { Metadata } from "next/types";
// import { buildMetadata } from "@/lib/seo";
// import { getAllProducts } from "@/lib/api";
// import ShopClient from "./shop-client";

// export const metadata: Metadata = buildMetadata({
//   title: "Shop",
//   description:
//     "Browse premium dried fish and seafood from Sri Lanka at DONDRA LANKA.",
//   path: "/shop",
// });

// export default async function ShopPage() {
//   const products = await getAllProducts();
//   return <ShopClient  />;
  
  
// }

import type { Metadata } from "next/types";
import { buildMetadata } from "@/lib/seo";
import { getAllProducts } from "@/lib/api";
import ShopClient from "./shop-client";

export const metadata: Metadata = buildMetadata({
  title: "Shop",
  description:
    "Browse premium dried fish and seafood from Sri Lanka at DONDRA LANKA.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await getAllProducts();
  return <ShopClient initialProducts={products} />;
}