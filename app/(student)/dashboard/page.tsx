'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api'
import { BookOpen, CheckCircle, TrendingUp, ArrowLeft } from 'lucide-react'

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
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="text-gray-400 font-mono-text text-sm">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-[#1A2B4C] tracking-tight">لوحة التحكم</h1>
          <p className="text-gray-500 text-sm mt-1">تتبع تقدمك الأكاديمي</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-gray-200 p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-display text-4xl text-[#1A2B4C]">{data?.totalCourses || 0}</div>
              <div className="text-gray-500 text-sm mt-1">المواد المسجلة</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <CheckCircle className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-display text-4xl text-[#1A2B4C]">{data?.completedCourses || 0}</div>
              <div className="text-gray-500 text-sm mt-1">المواد المكتملة</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-50 flex items-center justify-center flex-shrink-0">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="font-display text-4xl text-[#1A2B4C]">
                {data?.enrollments && data.enrollments.length > 0
                  ? Math.round(data.enrollments.reduce((acc, e) => acc + Number(e.progress), 0) / data.enrollments.length)
                  : 0}%
              </div>
              <div className="text-gray-500 text-sm mt-1">متوسط التقدم</div>
            </div>
          </div>
        </div>

        <h2 className="font-display text-2xl text-[#1A2B4C] mb-6">موادي التعليمية</h2>
        {data?.enrollments && data.enrollments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.enrollments.map((enrollment) => (
              <Link
                key={enrollment.id}
                href={`/courses/${enrollment.course.slug}`}
                className="group bg-white border border-gray-200 overflow-hidden hover:border-[#1A2B4C] transition-all"
              >
                <div className="h-28 bg-gradient-to-br from-[#1A2B4C]/10 to-[#1A2B4C]/5 flex items-center justify-center relative">
                  <BookOpen className="w-10 h-10 text-[#1A2B4C]/20" />
                  <div className="absolute bottom-3 right-3">
                    <span className="bg-[#1A2B4C] px-3 py-1 text-[10px] tracking-widest uppercase text-white">
                      {enrollment.course.level === 'BEGINNER' ? 'تأسيسي' : enrollment.course.level === 'INTERMEDIATE' ? 'متقدم' : 'احترافي'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-xl text-[#1A2B4C] mb-3 group-hover:underline">{enrollment.course.title}</h3>
                  <div className="w-full bg-gray-100 h-2 overflow-hidden mb-2">
                    <div
                      className="h-full bg-[#1A2B4C] transition-all"
                      style={{ width: `${Number(enrollment.progress)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">{Number(enrollment.progress)}% مكتمل</span>
                    <span className="text-[#1A2B4C] flex items-center gap-1">
                      متابعة <ArrowLeft className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4 text-lg">لم تسجل في أي مادة بعد</p>
            <Link href="/courses" className="inline-block bg-[#1A2B4C] text-white px-8 py-3 text-sm hover:bg-[#1A2B4C]/90 transition-colors">
              تصفح المواد الدراسية
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
