'use client'

import { useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { toast } from '@/components/ui/use-toast'

const IDLE_TIMEOUT = 3 * 60 * 1000 // 3 minutes
const WARNING_TIME = 30 * 1000 // Show warning 30 seconds before logout

export function useIdleTimeout() {
  const { logout } = useAuth()
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const warningRef = useRef<NodeJS.Timeout | null>(null)

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (warningRef.current) {
      clearTimeout(warningRef.current)
    }

    // Set warning timeout
    warningRef.current = setTimeout(() => {
      toast({
        title: "Session Expiring Soon",
        description: "You'll be logged out in 30 seconds due to inactivity",
        variant: "destructive",
      })
    }, IDLE_TIMEOUT - WARNING_TIME)

    // Set logout timeout
    timeoutRef.current = setTimeout(async () => {
      await logout()
      router.push('/admin/auth/login')
      toast({
        title: "Session Expired",
        description: "You've been logged out due to inactivity",
        variant: "destructive",
      })
    }, IDLE_TIMEOUT)
  }

  useEffect(() => {
    const events = [
      'mousedown',
      'mousemove',
      'keypress',
      'scroll',
      'touchstart'
    ]

    // Reset timeout on any user activity
    const handleActivity = () => {
      resetTimeout()
    }

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity)
    })

    // Initial timeout
    resetTimeout()

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (warningRef.current) {
        clearTimeout(warningRef.current)
      }
      events.forEach(event => {
        document.removeEventListener(event, handleActivity)
      })
    }
  }, [logout, router])
}