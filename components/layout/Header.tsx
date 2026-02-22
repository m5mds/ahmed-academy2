'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { useSession } from '@/lib/session-context'
import { BookOpen, LayoutDashboard, LogOut, Menu, X, GraduationCap, Video } from 'lucide-react'

export default function Header() {
  const { user, loading, refetch } = useSession()
  const [menuOpen, setMenuOpen] = useState(false)
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await api('/api/auth/logout', { method: 'POST' })
    } catch {}
    refetch()
    router.push('/')
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex justify-between items-center h-16">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#1A2B4C] flex items-center justify-center">
            <span className="font-display text-white text-lg">A</span>
          </div>
          <div className="flex flex-col">
            <span className="font-display text-lg tracking-tight text-[#1A2B4C] leading-none">
              أكاديمية أحمد
            </span>
            <span className="font-mono-text text-[7px] tracking-[0.3em] uppercase text-gray-400 leading-none">
              ENGINEERING ACADEMY
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-[#1A2B4C] transition-colors">
            الرئيسية
          </Link>
          <Link href="/materials" className="text-sm text-gray-500 hover:text-[#1A2B4C] transition-colors">
            المواد الدراسية
          </Link>
          <Link href="/contact" className="text-sm text-gray-500 hover:text-[#1A2B4C] transition-colors">
            تواصل معنا
          </Link>

          {!loading && user ? (
            <>
              {user.role === 'STUDENT' && (
                <>
                  <Link href="/content" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1A2B4C] transition-colors">
                    <BookOpen className="w-4 h-4" />
                    المحتوى
                  </Link>
                  <Link href="/live" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#1A2B4C] transition-colors">
                    <Video className="w-4 h-4" />
                    المحاضرات المباشرة
                  </Link>
                </>
              )}
              <Link
                href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'}
                className="flex items-center gap-1.5 text-sm text-[#1A2B4C] font-semibold hover:text-[#1A2B4C]/80 transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                لوحة التحكم
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm text-red-500 hover:text-red-700 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                تسجيل الخروج
              </button>
            </>
          ) : !loading && !user ? (
            <>
              <Link
                href="/login"
                className="text-sm text-[#1A2B4C] font-semibold hover:text-[#1A2B4C]/80 transition-colors"
              >
                تسجيل الدخول
              </Link>
              <Link
                href="/register"
                className="bg-[#1A2B4C] text-sm px-5 py-2 text-white hover:bg-[#1A2B4C]/90 transition-colors flex items-center gap-1.5"
              >
                <GraduationCap className="w-4 h-4" />
                انضم الآن
              </Link>
            </>
          ) : null}
        </nav>

        <button
          className="md:hidden text-[#1A2B4C]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4">
          <div className="flex flex-col gap-4">
            <Link href="/" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600">الرئيسية</Link>
            <Link href="/materials" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600">المواد الدراسية</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600">تواصل معنا</Link>
            {!loading && user ? (
              <>
                {user.role === 'STUDENT' && (
                  <>
                    <Link href="/content" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600">المحتوى</Link>
                    <Link href="/live" onClick={() => setMenuOpen(false)} className="text-sm text-gray-600">المحاضرات المباشرة</Link>
                  </>
                )}
                <Link href={user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} onClick={() => setMenuOpen(false)} className="text-sm font-semibold text-[#1A2B4C]">لوحة التحكم</Link>
                <button onClick={handleLogout} className="text-right text-sm text-red-500">تسجيل الخروج</button>
              </>
            ) : !loading && !user ? (
              <>
                <Link href="/login" onClick={() => setMenuOpen(false)} className="text-sm text-[#1A2B4C] font-semibold">تسجيل الدخول</Link>
                <Link href="/register" onClick={() => setMenuOpen(false)} className="bg-[#1A2B4C] text-sm px-5 py-2.5 text-white text-center">انضم الآن</Link>
              </>
            ) : null}
          </div>
        </div>
      )}
    </header>
  )
}
