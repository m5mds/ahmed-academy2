'use client'

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { api } from '@/lib/api'

export interface SessionUser {
  id: string
  name: string
  email: string
  role: string
}

interface SessionContextValue {
  user: SessionUser | null
  loading: boolean
  refetch: () => Promise<void>
}

const SessionContext = createContext<SessionContextValue | null>(null)

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null)
  const [loading, setLoading] = useState(true)

  const refetch = useCallback(async () => {
    try {
      const data = await api<{ user: SessionUser }>('/api/auth/me')
      setUser(data.user)
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <SessionContext.Provider value={{ user, loading, refetch }}>
      {children}
    </SessionContext.Provider>
  )
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext)
  if (!ctx) {
    throw new Error('useSession must be used within SessionProvider')
  }
  return ctx
}
