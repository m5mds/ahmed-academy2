'use client'

import { useState, useEffect } from 'react'
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
      </div>
    </div>
  )
}
