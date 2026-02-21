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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-neutral-500">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">لوحة تحكم المدير</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="text-3xl font-bold text-primary">{stats?.totalUsers || 0}</div>
            <div className="text-neutral-500 mt-1">إجمالي المستخدمين</div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="text-3xl font-bold text-secondary">{stats?.totalCourses || 0}</div>
            <div className="text-neutral-500 mt-1">إجمالي الدورات</div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="text-3xl font-bold text-accent">{stats?.totalEnrollments || 0}</div>
            <div className="text-neutral-500 mt-1">إجمالي التسجيلات</div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-neutral-800 mb-4">إدارة المنصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Link
            href="/admin/content"
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="text-3xl mb-3">📚</div>
            <h3 className="font-bold text-neutral-800 group-hover:text-primary transition-colors">إدارة المحتوى</h3>
            <p className="text-sm text-neutral-500 mt-1">الفصول والدروس وأقفال المحتوى</p>
          </Link>
          <Link
            href="/admin/content"
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="text-3xl mb-3">🔒</div>
            <h3 className="font-bold text-neutral-800 group-hover:text-primary transition-colors">التحكم بالأقفال</h3>
            <p className="text-sm text-neutral-500 mt-1">قفل وفتح المحتوى على مستوى الفصول والدروس</p>
          </Link>
          <Link
            href="/courses"
            className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-md transition-shadow group"
          >
            <div className="text-3xl mb-3">🎓</div>
            <h3 className="font-bold text-neutral-800 group-hover:text-primary transition-colors">الدورات</h3>
            <p className="text-sm text-neutral-500 mt-1">عرض وإدارة الدورات المتاحة</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
