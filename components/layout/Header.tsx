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
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    api<{ user: User }>('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
  }, [])

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleLogout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' })
    } catch {}
    setUser(null)
    window.location.href = '/login'
  }

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 md:px-12 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-lg border-b border-gray-200 shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1A2B4C] flex items-center justify-center">
            <span className="font-display text-white text-xl">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-tighter uppercase text-[#1A2B4C] leading-none">
              أكاديمية أحمد
            </span>
            <span className="font-mono-text text-[8px] tracking-[0.4em] uppercase text-gray-500 leading-none">
              ENGINEERING ACADEMY
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-mono-text text-xs tracking-[0.2em] uppercase text-gray-600 hover:text-[#1A2B4C] transition-colors">
            عن الأكاديمية
          </Link>
          <Link href="/courses" className="font-mono-text text-xs tracking-[0.2em] uppercase text-gray-600 hover:text-[#1A2B4C] transition-colors">
            المناهج والمواد الدراسية
          </Link>
          <Link href="/contact" className="font-mono-text text-xs tracking-[0.2em] uppercase text-gray-600 hover:text-[#1A2B4C] transition-colors">
            تواصل معنا
          </Link>
          {user ? (
            <>
              <Link
                href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                className="font-mono-text text-xs tracking-[0.2em] uppercase text-gray-600 hover:text-[#1A2B4C] transition-colors"
              >
                لوحة التحكم
              </Link>
              <button
                onClick={handleLogout}
                className="font-mono-text text-xs tracking-[0.2em] uppercase text-red-600 transition-colors"
              >
                خروج
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-mono-text text-xs tracking-[0.2em] uppercase text-gray-600 hover:text-[#1A2B4C] transition-colors"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="bg-[#1A2B4C] font-display text-sm tracking-[0.2em] uppercase px-6 py-2.5 text-white"
              >
                التسجيل الأكاديمي
              </Link>
            </>
          )}
        </nav>

        <button
          className="md:hidden text-[#1A2B4C]"
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
        <div className="md:hidden mt-4 py-6 border-t border-gray-100 bg-white shadow-xl -mx-6 px-6">
          <div className="flex flex-col gap-5">
            <Link href="/" onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-gray-600">عن الأكاديمية</Link>
            <Link href="/courses" onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-gray-600">المواد الدراسية</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-gray-600">تواصل معنا</Link>
            {user ? (
              <Link href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-gray-600">لوحة التحكم</Link>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-gray-600">دخول</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="bg-[#1A2B4C] font-display text-sm tracking-widest uppercase px-6 py-3 text-white text-center">
                  التسجيل الأكاديمي
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
