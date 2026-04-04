"use client"
import { useState } from 'react'
import dynamic from 'next/dynamic'

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[180px] w-[180px] animate-pulse bg-gray-200 rounded-lg" />
    )
  }
)

export default function Why() {
  const steps = [
    {
      number: 1,
      title: "Sourcing and testing our Products",
      description:
        "At DONDRA-LANKA, we prioritize sustainable sourcing and rigorous quality checks to deliver the finest dry fish, authentic Sri Lankan spices, and flavorful Fish Ambul Thiyal, ensuring a premium experience for our customers.",
      animation: "/animations/sourcing.json",
    },
    {
      number: 2,
      title: "Packing the Products",
      description:
        "At DONDRA-LANKA, we meticulously package our dry fish, spices, and ready-to-cook curry products to preserve freshness and flavor, maintaining our commitment to quality.",
      animation: "/animations/packing .json",
    },
    {
      number: 3,
      title: "Delivering the Products to You",
      description:
        "At DONDRA-LANKA, we ensure quick and secure delivery of our dry fish, spices, and Fish Ambul Thiyal so they reach you fresh and full of authentic Sri Lankan taste.",
      animation: "/animations/delivery.json",
    },
  ]

  return (
    <section className="py-10 bg-white text-center">
      <h2 className="text-4xl font-bold text-teal-600 mb-5 tracking-wide">WHY DONDRA-LANKA</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-4 max-w-9xl mx-auto">
        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-lg font-semibold mb-2 shadow-sm">
              {step.number}
            </div>
            <h3 className="text-lg font-bold">{step.title}</h3>
            <p className="text-gray-600 text-sm px-2">{step.description}</p>

            {/* Add a loading placeholder for the Lottie animation */}
            <div className="h-[180px] w-[180px] relative">
              <Player
                autoplay
                loop
                src={step.animation}
                style={{ height: "180px", width: "180px" }}
              />
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
