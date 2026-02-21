'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface User {
  id: string
  name: string
  email: string
  role: string
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    api<{ user: User }>('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  const handleLogout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' })
    } catch {}
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <header className="bg-white shadow-sm border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">أ</span>
            </div>
            <span className="text-xl font-bold text-neutral-800">أكاديمية أحمد</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-neutral-600 hover:text-primary transition-colors">
              الرئيسية
            </Link>
            <Link href="/courses" className="text-neutral-600 hover:text-primary transition-colors">
              الدورات
            </Link>
            {user ? (
              <>
                <Link
                  href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                  className="text-neutral-600 hover:text-primary transition-colors"
                >
                  لوحة التحكم
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-neutral-600 hover:text-red-500 transition-colors"
                >
                  تسجيل الخروج
                </button>
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.name.charAt(0)}
                  </span>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-neutral-600 hover:text-primary transition-colors"
                >
                  تسجيل الدخول
                </Link>
                <Link
                  href="/register"
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  إنشاء حساب
                </Link>
              </>
            )}
          </nav>

          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden py-4 border-t border-neutral-200">
            <div className="flex flex-col gap-3">
              <Link href="/" className="text-neutral-600 hover:text-primary">الرئيسية</Link>
              <Link href="/courses" className="text-neutral-600 hover:text-primary">الدورات</Link>
              {user ? (
                <>
                  <Link href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="text-neutral-600 hover:text-primary">لوحة التحكم</Link>
                  <button onClick={handleLogout} className="text-right text-neutral-600 hover:text-red-500">تسجيل الخروج</button>
                </>
              ) : (
                <>
                  <Link href="/login" className="text-neutral-600 hover:text-primary">تسجيل الدخول</Link>
                  <Link href="/register" className="text-primary font-bold">إنشاء حساب</Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
