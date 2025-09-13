'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateToken, demoUser } from '@/lib/auth'

interface AuthGuardProps {
  children: React.ReactNode
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('auth-token')
    if (token) {
      // In a real app, you'd verify the token with the server
      setIsAuthenticated(true)
    } else {
      // For demo purposes, auto-login with demo user
      const token = generateToken(demoUser)
      localStorage.setItem('auth-token', token)
      setIsAuthenticated(true)
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-gray-600">Please log in to access this application.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
