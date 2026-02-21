'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'
import { Lock, ChevronDown, BookOpen, Clock } from 'lucide-react'

interface LessonItem {
  id: string
  title: string
  durationMinutes: number | null
  isPreview: boolean
  tier: string
  locked: boolean
  lockReason?: string
}

interface ChapterItem {
  id: string
  title: string
  tier: string
  orderIndex: number
  lessons: LessonItem[]
}

interface GroupedContent {
  MID1: ChapterItem[]
  MID2: ChapterItem[]
  FINAL: ChapterItem[]
}

interface CourseOption {
  id: string
  title: string
}

interface ContentData {
  grouped: GroupedContent
  enrollment: { tier: string; expiresAt: string | null } | null
  courses: CourseOption[]
}

const TIER_LABELS: Record<string, string> = {
  MID1: 'المرحلة الأولى',
  MID2: 'المرحلة الثانية',
  FINAL: 'الاختبار النهائي',
}

export default function ContentPage() {
  const [data, setData] = useState<ContentData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'MID1' | 'MID2' | 'FINAL'>('MID1')
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(new Set())
  const [accessMessage, setAccessMessage] = useState<string | null>(null)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)

  const loadContent = useCallback(async (courseId?: string) => {
    setLoading(true)
    try {
      const url = courseId ? `/api/content/chapters?courseId=${courseId}` : '/api/content/chapters'
      const result = await api<ContentData>(url)
      setData(result)
      if (!selectedCourseId && result.courses?.length > 0) {
        setSelectedCourseId(result.courses[0].id)
      }
    } catch {
      setData(null)
    } finally {
      setLoading(false)
    }
  }, [selectedCourseId])

  useEffect(() => {
    loadContent(selectedCourseId || undefined)
  }, [selectedCourseId, loadContent])

  const toggleChapter = (id: string) => {
    setExpandedChapters((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleLockedClick = () => {
    setAccessMessage('الوصول مقيد: يرجى التواصل مع الإدارة أو التحقق من اشتراكك')
    setTimeout(() => setAccessMessage(null), 4000)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400 font-mono-text text-sm">جاري التحميل...</div>
      </div>
    )
  }

  if (!data?.enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white pt-24">
        <div className="text-center bg-white p-12 border border-gray-200">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">لم تسجل في أي مادة بعد</p>
          <a href="/courses" className="text-[#1A2B4C] font-semibold hover:underline text-sm">تصفح المواد الدراسية المتاحة</a>
        </div>
      </div>
    )
  }

  const tabs: Array<'MID1' | 'MID2' | 'FINAL'> = ['MID1', 'MID2', 'FINAL']
  const chapters = data?.grouped?.[activeTab] || []

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="mb-8">
          <h1 className="font-display text-4xl text-[#1A2B4C] tracking-tight">المحتوى التعليمي</h1>
          <p className="text-gray-500 text-sm mt-1">الوحدات والفصول الدراسية</p>
        </div>

        {data.courses && data.courses.length > 1 && (
          <div className="mb-4">
            <select
              value={selectedCourseId || ''}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-4 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
            >
              {data.courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        <p className="text-gray-500 mb-6 text-sm">
          اشتراكك: <span className="text-[#1A2B4C] font-bold">{TIER_LABELS[data.enrollment.tier] || data.enrollment.tier}</span>
        </p>

        {accessMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
            {accessMessage}
          </div>
        )}

        <div className="flex gap-2 mb-8 border-b border-gray-200">
          {tabs.map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTab(tier)}
              className={`flex-1 py-3 px-4 text-sm text-center transition-all border-b-2 -mb-px ${
                activeTab === tier
                  ? 'bg-white text-[#1A2B4C] border-[#FF4F00] border-b-2 font-semibold'
                  : 'bg-white text-gray-500 border-transparent hover:text-[#1A2B4C] hover:border-gray-300'
              }`}
            >
              {TIER_LABELS[tier]}
            </button>
          ))}
        </div>

        {chapters.length > 0 ? (
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="bg-white border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg text-[#1A2B4C]">{chapter.title}</h3>
                    <span className="text-xs text-gray-400 font-mono-text">({chapter.lessons.length} درس)</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${expandedChapters.has(chapter.id) ? 'rotate-180' : ''}`} />
                </button>

                {expandedChapters.has(chapter.id) && (
                  <div className="border-t border-gray-100">
                    {chapter.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        onClick={() => lesson.locked ? handleLockedClick() : undefined}
                        className={`flex items-center justify-between px-6 py-3 ${
                          idx > 0 ? 'border-t border-gray-50' : ''
                        } ${lesson.locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-gray-50 cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 flex items-center justify-center text-xs ${
                            lesson.locked ? 'bg-gray-100 text-gray-400' : 'bg-blue-50 text-[#1A2B4C]'
                          }`}>
                            {lesson.locked ? <Lock className="w-3.5 h-3.5" /> : idx + 1}
                          </div>
                          <span className={`text-sm ${lesson.locked ? 'text-gray-400' : 'text-gray-700'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lesson.isPreview && !lesson.locked && (
                            <span className="text-xs bg-emerald-50 text-emerald-600 px-2 py-0.5">مجاني</span>
                          )}
                          {lesson.durationMinutes && (
                            <span className="text-xs text-gray-400 flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.durationMinutes} د
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-gray-200">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-400">لا يوجد محتوى في هذا القسم</p>
          </div>
        )}
      </div>
    </div>
  )
}
