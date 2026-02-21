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
  MID1: 'المرحلة الأولى',
  MID2: 'المرحلة الثانية',
  FINAL: 'الاختبار النهائي',
}

const TIER_COLORS: Record<string, string> = {
  MID1: 'border-l-blue-500',
  MID2: 'border-l-green-500',
  FINAL: 'border-l-amber-500',
}

const TIER_BG: Record<string, string> = {
  MID1: 'bg-blue-500',
  MID2: 'bg-green-500',
  FINAL: 'bg-amber-500',
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-white/40 font-mono-text">جاري التحميل...</div>
      </div>
    )
  }

  if (!data?.enrollment) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-24">
        <div className="text-center glass p-12">
          <p className="text-5xl mb-6 opacity-30">&#9881;</p>
          <p className="text-white/50 text-lg font-display tracking-widest uppercase">لم تسجل في أي مادة بعد</p>
          <a href="/courses" className="text-primary hover:underline mt-4 inline-block font-display tracking-widest uppercase text-sm">تصفح المواد المتاحة</a>
        </div>
      </div>
    )
  }

  const tabs: Array<'MID1' | 'MID2' | 'FINAL'> = ['MID1', 'MID2', 'FINAL']
  const chapters = data?.grouped?.[activeTab] || []

  return (
    <div className="py-12 bg-background min-h-screen pt-28 relative">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-8">
          <span className="font-display text-primary tracking-[0.4em] uppercase text-sm mb-2 block">الوحدات التقنية</span>
          <h1 className="font-display text-4xl md:text-5xl text-white tracking-tighter">المحتوى التعليمي</h1>
        </div>

        {data.courses && data.courses.length > 1 && (
          <div className="mb-4">
            <select
              value={selectedCourseId || ''}
              onChange={(e) => setSelectedCourseId(e.target.value)}
              className="px-4 py-2 bg-black/50 border border-white/10 text-white font-mono-text text-sm"
            >
              {data.courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        <p className="text-white/40 mb-6 font-mono-text text-sm">
          اشتراكك: <span className="text-primary font-bold">{TIER_LABELS[data.enrollment.tier] || data.enrollment.tier}</span>
        </p>

        {accessMessage && (
          <div className="mb-4 bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 text-sm font-mono-text">
            {accessMessage}
          </div>
        )}

        <div className="flex gap-2 mb-8">
          {tabs.map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTab(tier)}
              className={`flex-1 py-3 px-4 font-display text-sm tracking-widest uppercase text-center transition-all border ${
                activeTab === tier
                  ? `${TIER_BG[tier]} text-white border-transparent shadow-lg`
                  : 'bg-black/50 text-white/50 border-white/10 hover:border-white/30'
              }`}
            >
              {TIER_LABELS[tier]}
            </button>
          ))}
        </div>

        {chapters.length > 0 ? (
          <div className="space-y-3">
            {chapters.map((chapter) => (
              <div key={chapter.id} className={`bg-black border border-white/10 overflow-hidden ${TIER_COLORS[chapter.tier]} border-l-2`}>
                <button
                  onClick={() => toggleChapter(chapter.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg text-white tracking-tight">{chapter.title}</h3>
                    <span className="text-xs text-white/30 font-mono-text">({chapter.lessons.length} درس)</span>
                  </div>
                  <svg
                    className={`w-5 h-5 text-white/30 transition-transform ${
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
                  <div className="border-t border-white/5">
                    {chapter.lessons.map((lesson, idx) => (
                      <div
                        key={lesson.id}
                        onClick={() => lesson.locked ? handleLockedClick(lesson.lockReason) : undefined}
                        className={`flex items-center justify-between px-6 py-3 ${
                          idx > 0 ? 'border-t border-white/5' : ''
                        } ${lesson.locked ? 'opacity-40 cursor-not-allowed' : 'hover:bg-white/5 cursor-pointer'}`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 flex items-center justify-center text-xs font-display ${
                            lesson.locked ? 'bg-white/10 text-white/30' : 'bg-primary/10 text-primary'
                          }`}>
                            {lesson.locked ? (
                              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                              </svg>
                            ) : (
                              idx + 1
                            )}
                          </div>
                          <span className={`text-sm font-mono-text ${lesson.locked ? 'text-white/30' : 'text-white/70'}`}>
                            {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {lesson.isPreview && !lesson.locked && (
                            <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 font-display tracking-widest">مجاني</span>
                          )}
                          {lesson.durationMinutes && (
                            <span className="text-xs text-white/30 font-mono-text">{lesson.durationMinutes} د</span>
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
          <div className="text-center py-16 glass">
            <p className="text-5xl mb-6 opacity-30">&#9881;</p>
            <p className="text-white/40 font-display tracking-widest uppercase">لا يوجد محتوى في هذا القسم</p>
          </div>
        )}
      </div>
    </div>
  )
}
