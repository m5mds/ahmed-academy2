'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

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
  MID1: 'الفصل الأول',
  MID2: 'الفصل الثاني',
  FINAL: 'الاختبار النهائي',
}

const TIER_COLORS: Record<string, string> = {
  MID1: 'bg-blue-600',
  MID2: 'bg-emerald-600',
  FINAL: 'bg-amber-600',
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

  const handleLockedClick = (reason?: string) => {
    setAccessMessage(reason || 'هذا المحتوى مقيد الوصول')
    setTimeout(() => setAccessMessage(null), 3000)
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-neutral-500">جاري التحميل...</div>
      </div>
    )
  }

  if (!data?.enrollment) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">📚</p>
          <p className="text-neutral-500 text-lg">لم تسجل في أي دورة بعد</p>
          <a href="/courses" className="text-primary hover:underline mt-2 inline-block">تصفح الدورات المتاحة</a>
        </div>
      </div>
    )
  }

  const tabs: Array<'MID1' | 'MID2' | 'FINAL'> = ['MID1', 'MID2', 'FINAL']
  const chapters = data?.grouped?.[activeTab] || []

  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-neutral-800 mb-2">المحتوى التعليمي</h1>

        {data.courses && data.courses.length > 1 && (
          <div className="mb-4">
            <select
              value={selectedCourseId || ''}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-4 py-2 border border-neutral-300 rounded-lg"
            >
              {data.courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        <p className="text-neutral-500 mb-6">
          اشتراكك: <span className="font-bold text-primary">{TIER_LABELS[data.enrollment.tier] || data.enrollment.tier}</span>
        </p>

        {accessMessage && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {accessMessage}
          </div>
        )}

        <div className="flex gap-2 mb-8">
          {tabs.map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTab(tier)}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-center transition-all ${
                activeTab === tier
                  ? `${TIER_COLORS[tier]} text-white shadow-lg`
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {TIER_LABELS[tier]}
            </button>
          ))}
        </div>

        {chapters.length > 0 ? (
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <div key={chapter.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-8 rounded-full ${TIER_COLORS[chapter.tier]}`} />
                    <h3 className="font-bold text-neutral-800 text-right">{chapter.title}</h3>
                    <span className="text-xs text-neutral-400">({chapter.lessons.length} درس)</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-neutral-400 transition-transform ${
                      expandedChapters.has(chapter.id) ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedChapters.has(chapter.id) && (
                  <div className="border-t border-neutral-100">
                    {chapter.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        onClick={() => lesson.locked ? handleLockedClick(lesson.lockReason) : undefined}
                        className={`flex items-center justify-between px-6 py-3 ${
                          idx > 0 ? 'border-t border-neutral-50' : ''
                        } ${lesson.locked ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-50 cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            lesson.locked ? 'bg-neutral-200 text-neutral-400' : 'bg-primary/10 text-primary'
                          }`}>
                            {lesson.locked ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span className={`text-sm ${lesson.locked ? 'text-neutral-400' : 'text-neutral-700'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lesson.isPreview && !lesson.locked && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">مجاني</span>
                          )}
                          {lesson.durationMinutes && (
                            <span className="text-xs text-neutral-400">{lesson.durationMinutes} د</span>
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
          <div className="text-center py-12 bg-neutral-50 rounded-xl">
            <p className="text-4xl mb-4">📚</p>
            <p className="text-neutral-500">لا يوجد محتوى في هذا القسم</p>
          </div>
        )}
      </div>
    </div>
  )
}
