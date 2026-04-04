"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  LayoutDashboard,
  Layers,
  Package,
  Tag,
  ShoppingBag,
  Newspaper,
  LogOut,
  Menu,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/hooks/use-auth"
import { useIdleTimeout } from '@/hooks/use-idle-timeout'

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  useIdleTimeout() // Add this line to enable idle timeout

  // Check if current route is an auth route
  const isAuthRoute = pathname?.includes('/admin/auth')

  useEffect(() => {
    // Protect admin routes
    if (!isAuthenticated && !isAuthRoute) {
      router.replace('/admin/auth/login')
    }
  }, [isAuthenticated, isAuthRoute, router])

  // Show auth pages without layout
  if (isAuthRoute) {
    return <>{children}</>
  }

  // Show loading or redirect if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const handleLogout = async () => {
    try {
      await logout()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const navItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Categories", href: "/admin/categories", icon: Layers },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Offers", href: "/admin/offers", icon: Tag },
    { name: "Bundle Kits", href: "/admin/bundle-kits", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingBag },
    { name: "News Banners", href: "/admin/news-banners", icon: Newspaper },
    { 
      name: "Logout", 
      href: "#",
      icon: LogOut,
      onClick: handleLogout 
    }
  ]

  return (
    <div className="h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-20 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b">
          <Link href="/admin" className="font-playfair text-xl">
            DONDRA LANKA Admin
          </Link>
          {user && (
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {user.name}
            </p>
          )}
        </div>
        <nav className="p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
            
            if (item.name === "Logout") {
              return (
                <button
                  key={item.name}
                  onClick={item.onClick}
                  className={cn(
                    "w-full flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                    "text-gray-700 hover:bg-gray-100"
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.name}
                </button>
              )
            }

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm rounded-md transition-colors",
                  isActive ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100",
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col lg:ml-64">
        {/* Mobile navbar */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-white border-b p-4 flex justify-between items-center">
          <Link href="/admin" className="font-playfair text-xl">
            DONDRA LANKA Admin
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-md hover:bg-gray-100">
            {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Scrollable main content */}
        <main className="flex-1 overflow-y-auto pt-20 lg:pt-6 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
