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
      scrolled ? 'bg-[#0A0A0A]/95 backdrop-blur-lg border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.5)]' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rotate-45 flex items-center justify-center shadow-[0_0_20px_rgba(255,79,0,0.3)]">
            <span className="font-display text-white -rotate-45 text-xl">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-xl tracking-tighter uppercase text-white leading-none">
              أكاديمية أحمد
            </span>
            <span className="font-mono-text text-[8px] tracking-[0.4em] uppercase text-primary/60 leading-none">
              ENGINEERING ACADEMY
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-mono-text text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300">
            الرئيسية
          </Link>
          <Link href="/courses" className="font-mono-text text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300">
            المواد
          </Link>
          {user ? (
            <>
              {user.role === 'STUDENT' && (
                <Link href="/content" className="font-mono-text text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300">
                  المحتوى
                </Link>
              )}
              <Link
                href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                className="font-mono-text text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300"
              >
                لوحة التحكم
              </Link>
              <button
                onClick={handleLogout}
                className="font-mono-text text-xs tracking-[0.2em] uppercase text-white/50 hover:text-red-400 transition-colors duration-300"
              >
                خروج
              </button>
              <div className="w-9 h-9 bg-primary/20 border border-primary/50 flex items-center justify-center">
                <span className="text-primary text-xs font-bold font-display">
                  {user.name.charAt(0)}
                </span>
              </div>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="font-mono-text text-xs tracking-[0.2em] uppercase text-white/50 hover:text-white transition-colors duration-300"
              >
                دخول
              </Link>
              <Link
                href="/register"
                className="accent-button font-display text-sm tracking-[0.2em] uppercase px-6 py-2.5 text-white shadow-[0_0_15px_rgba(255,79,0,0.3)]"
              >
                انضم الآن
              </Link>
            </>
          )}
        </nav>

        <button
          className="md:hidden text-white"
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
        <div className="md:hidden mt-4 py-6 border-t border-white/10 bg-[#0A0A0A]/95 backdrop-blur-lg -mx-6 px-6">
          <div className="flex flex-col gap-5">
            <Link href="/" onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-white/60 hover:text-primary">الرئيسية</Link>
            <Link href="/courses" onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-white/60 hover:text-primary">المواد</Link>
            {user ? (
              <>
                {user.role === 'STUDENT' && (
                  <Link href="/content" onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-white/60 hover:text-primary">المحتوى</Link>
                )}
                <Link href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-white/60 hover:text-primary">لوحة التحكم</Link>
                <button onClick={handleLogout} className="text-right font-mono-text text-sm tracking-[0.2em] uppercase text-white/60 hover:text-red-400">خروج</button>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="font-mono-text text-sm tracking-[0.2em] uppercase text-white/60 hover:text-primary">دخول</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="accent-button font-display text-sm tracking-widest uppercase px-6 py-3 text-white text-center shadow-[0_0_15px_rgba(255,79,0,0.3)]">
                  انضم الآن
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
