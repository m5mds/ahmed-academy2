'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<AdminStats>('/api/admin/stats')
      .then(setStats)
      .catch(() => setStats({ totalUsers: 0, totalCourses: 0, totalEnrollments: 0 }))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-white/40 font-mono-text">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="py-12 bg-background min-h-screen pt-28 relative">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-10">
          <span className="font-display text-primary tracking-[0.4em] uppercase text-sm mb-2 block">مركز القيادة</span>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-tighter">لوحة تحكم المدير</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-6 border-r-2 border-r-primary">
            <div className="font-display text-4xl text-primary">{stats?.totalUsers || 0}</div>
            <div className="text-white/40 mt-1 font-display text-sm tracking-widest uppercase">إجمالي المستخدمين</div>
          </div>
          <div className="glass p-6 border-r-2 border-r-green-500">
            <div className="font-display text-4xl text-green-500">{stats?.totalCourses || 0}</div>
            <div className="text-white/40 mt-1 font-display text-sm tracking-widest uppercase">إجمالي المواد</div>
          </div>
          <div className="glass p-6 border-r-2 border-r-amber-500">
            <div className="font-display text-4xl text-amber-500">{stats?.totalEnrollments || 0}</div>
            <div className="text-white/40 mt-1 font-display text-sm tracking-widest uppercase">إجمالي التسجيلات</div>
          </div>
        </div>

        <h2 className="font-display text-2xl text-white tracking-tighter mb-6">إدارة المنصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/content"
            className="group glass p-6 hover:border-primary/50 transition-all duration-500 border border-white/10"
          >
            <div className="text-3xl mb-3 text-primary">&#9881;</div>
            <h3 className="font-display text-xl text-white tracking-tight group-hover:text-primary transition-colors">إدارة المحتوى</h3>
            <p className="text-sm text-white/40 mt-1 font-mono-text">الفصول والدروس وأقفال المحتوى</p>
          </Link>
          <Link
            href="/admin/content"
            className="group glass p-6 hover:border-primary/50 transition-all duration-500 border border-white/10"
          >
            <div className="text-3xl mb-3 text-primary">&#128274;</div>
            <h3 className="font-display text-xl text-white tracking-tight group-hover:text-primary transition-colors">التحكم بالأقفال</h3>
            <p className="text-sm text-white/40 mt-1 font-mono-text">قفل وفتح المحتوى على مستوى الفصول والدروس</p>
          </Link>
          <Link
            href="/courses"
            className="group glass p-6 hover:border-primary/50 transition-all duration-500 border border-white/10"
          >
            <div className="text-3xl mb-3 text-primary">&#128218;</div>
            <h3 className="font-display text-xl text-white tracking-tight group-hover:text-primary transition-colors">المواد</h3>
            <p className="text-sm text-white/40 mt-1 font-mono-text">عرض وإدارة المواد المتاحة</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
