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
          <span className="font-display text-primary tracking-[0.4em] uppercase text-sm mb-2 block">لوحة القيادة</span>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-tighter">لوحة التحكم</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="glass p-6 border-r-2 border-r-primary">
            <div className="font-display text-4xl text-primary">{data?.totalCourses || 0}</div>
            <div className="text-white/40 mt-1 font-display text-sm tracking-widest uppercase">المواد المسجلة</div>
          </div>
          <div className="glass p-6 border-r-2 border-r-green-500">
            <div className="font-display text-4xl text-green-500">{data?.completedCourses || 0}</div>
            <div className="text-white/40 mt-1 font-display text-sm tracking-widest uppercase">المواد المكتملة</div>
          </div>
          <div className="glass p-6 border-r-2 border-r-amber-500">
            <div className="font-display text-4xl text-amber-500">
              {data?.enrollments && data.enrollments.length > 0
                ? Math.round(data.enrollments.reduce((acc, e) => acc + Number(e.progress), 0) / data.enrollments.length)
                : 0}%
            </div>
            <div className="text-white/40 mt-1 font-display text-sm tracking-widest uppercase">متوسط التقدم</div>
          </div>
        </div>

        <h2 className="font-display text-2xl text-white tracking-tighter mb-6">موادي التعليمية</h2>
        {data?.enrollments && data.enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.enrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/courses/${enrollment.course.slug}`}
                className="group bg-black border border-white/10 overflow-hidden hover:border-primary/50 transition-all duration-500"
              >
                <div className="h-32 bg-gradient-to-br from-primary/20 to-black flex items-center justify-center relative">
                  <span className="text-4xl opacity-20">&#9881;</span>
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-primary px-3 py-1 font-display text-xs tracking-widest uppercase text-white">
                      {enrollment.course.level === 'BEGINNER' ? 'تأسيسي' : enrollment.course.level === 'INTERMEDIATE' ? 'متقدم' : 'احترافي'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-white tracking-tight mb-3 group-hover:text-primary transition-colors">{enrollment.course.title}</h3>
                  <div className="w-full bg-white/10 h-1.5 overflow-hidden mb-2">
                    <div
                      className="h-full bg-primary shadow-[0_0_10px_rgba(255,79,0,0.5)] transition-all"
                      style={{ width: `${Number(enrollment.progress)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs font-mono-text">
                    <span className="text-white/40">{Number(enrollment.progress)}% مكتمل</span>
                    <span className="text-primary">قيد التقدم</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass">
            <p className="text-5xl mb-6 opacity-30">&#9881;</p>
            <p className="text-white/50 mb-4 font-display text-lg tracking-widest uppercase">لم تسجل في أي مادة بعد</p>
            <Link href="/courses" className="inline-block accent-button font-display tracking-widest uppercase px-8 py-3 text-white shadow-[0_0_20px_rgba(255,79,0,0.3)]">
              تصفح المواد
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
