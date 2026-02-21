'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'

interface Enrollment {
  id: string
  progress: number
  course: {
    id: string
    title: string
    slug: string
    imageUrl: string | null
    level: string
  }
}

interface DashboardData {
  enrollments: Enrollment[]
  totalCourses: number
  completedCourses: number
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<DashboardData>('/api/dashboard')
      .then(setData)
      .catch(() => setData({ enrollments: [], totalCourses: 0, completedCourses: 0 }))
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
        <h1 className="text-3xl font-bold text-neutral-800 mb-8">لوحة التحكم</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="text-3xl font-bold text-primary">{data?.totalCourses || 0}</div>
            <div className="text-neutral-500 mt-1">الدورات المسجلة</div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="text-3xl font-bold text-secondary">{data?.completedCourses || 0}</div>
            <div className="text-neutral-500 mt-1">الدورات المكتملة</div>
          </div>
          <div className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="text-3xl font-bold text-accent">
              {data?.enrollments && data.enrollments.length > 0
                ? Math.round(data.enrollments.reduce((acc, e) => acc + Number(e.progress), 0) / data.enrollments.length)
                : 0}%
            </div>
            <div className="text-neutral-500 mt-1">متوسط التقدم</div>
          </div>
        </div>

        <h2 className="text-xl font-bold text-neutral-800 mb-4">دوراتي</h2>
        {data?.enrollments && data.enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.enrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/courses/${enrollment.course.slug}`}
                className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="h-36 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <span className="text-4xl text-white/30">📚</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-neutral-800 mb-2">{enrollment.course.title}</h3>
                  <div className="w-full bg-neutral-200 rounded-full h-2 mb-2">
                    <div
                      className="bg-primary h-2 rounded-full transition-all"
                      style={{ width: `${Number(enrollment.progress)}%` }}
                    />
                  </div>
                  <div className="text-sm text-neutral-500">{Number(enrollment.progress)}% مكتمل</div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-neutral-50 rounded-xl">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-neutral-500 mb-4">لم تسجل في أي دورة بعد</p>
            <Link href="/courses" className="inline-block bg-primary text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors">
              تصفح الدورات
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
