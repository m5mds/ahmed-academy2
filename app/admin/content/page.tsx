'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'
import { Plus, Pencil, Trash2, ChevronUp, ChevronDown, Lock, Unlock, User } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  tier: string
  orderIndex: number
  durationMinutes: number | null
}

interface Chapter {
  id: string
  title: string
  tier: string
  orderIndex: number
  lessons: Lesson[]
}

interface Course {
  id: string
  title: string
  slug: string
  chapters: Chapter[]
}

interface LockItem {
  id: string
  scope: string
  level: string
  targetId: string
  locked: boolean
}

const TIER_LABELS: Record<string, string> = {
  MID1: 'المرحلة الأولى',
  MID2: 'المرحلة الثانية',
  FINAL: 'الاختبار النهائي',
  FULL: 'وصول كامل',
}

export default function AdminContentPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [locks, setLocks] = useState<LockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [showCreateChapter, setShowCreateChapter] = useState(false)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [newChapterTier, setNewChapterTier] = useState<string>('MID1')
  const [editingChapter, setEditingChapter] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editTier, setEditTier] = useState('')
  const [lockStudentId, setLockStudentId] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const router = useRouter()

  const loadData = useCallback(async () => {
    try {
      const result = await api<{ courses: Course[]; locks: LockItem[] }>('/api/admin/content')
      setCourses(result.courses)
      setLocks(result.locks)
      if (!selectedCourse && result.courses.length > 0) {
        setSelectedCourse(result.courses[0].id)
      }
    } catch {
      router.push('/')
    } finally {
      setLoading(false)
    }
  }, [selectedCourse, router])

  useEffect(() => { loadData() }, [loadData])

  const showFeedback = (msg: string) => {
    setFeedback(msg)
    setTimeout(() => setFeedback(null), 3000)
  }

  const createChapter = async () => {
    if (!selectedCourse || !newChapterTitle.trim()) return
    try {
      await api('/api/admin/chapters', {
        method: 'POST',
        body: { courseId: selectedCourse, title: newChapterTitle, tier: newChapterTier },
      })
      setNewChapterTitle('')
      setShowCreateChapter(false)
      showFeedback('تم إنشاء الفصل بنجاح')
      loadData()
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'حدث خطأ')
    }
  }

  const updateChapter = async (id: string) => {
    try {
      await api(`/api/admin/chapters/${id}`, {
        method: 'PUT',
        body: { title: editTitle, tier: editTier },
      })
      setEditingChapter(null)
      showFeedback('تم تحديث الفصل')
      loadData()
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'حدث خطأ')
    }
  }

  const deleteChapter = async (id: string) => {
    try {
      await api(`/api/admin/chapters/${id}`, { method: 'DELETE' })
      showFeedback('تم حذف الفصل')
      loadData()
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'حدث خطأ')
    }
  }

  const toggleLock = async (level: string, targetId: string, lock: boolean, scope: string = 'GLOBAL', studentId?: string) => {
    try {
      await api('/api/admin/locks', {
        method: 'POST',
        body: {
          scope,
          level,
          targetId,
          studentId: scope === 'PER_STUDENT' ? studentId : null,
          locked: lock,
        },
      })
      showFeedback(lock ? 'تم القفل' : 'تم فتح القفل')
      loadData()
    } catch (err: unknown) {
      showFeedback(err instanceof Error ? err.message : 'حدث خطأ')
    }
  }

  const isLocked = (level: string, targetId: string) => {
    return locks.some((l) => l.level === level && l.targetId === targetId && l.locked)
  }

  const moveChapter = async (courseChapters: Chapter[], index: number, direction: number) => {
    const newIndex = index + direction
    if (newIndex < 0 || newIndex >= courseChapters.length) return
    const ordered = [...courseChapters]
    const [moved] = ordered.splice(index, 1)
    ordered.splice(newIndex, 0, moved)
    try {
      await api('/api/admin/chapters/reorder', {
        method: 'PUT',
        body: { orderedIds: ordered.map((c) => c.id) },
      })
      loadData()
    } catch {}
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="text-gray-400 font-mono-text text-sm">جاري التحميل...</div>
      </div>
    )
  }

  const course = courses.find((c) => c.id === selectedCourse)
  const courseChapters = course?.chapters || []

  return (
    <div className="min-h-screen bg-[#F3F4F6] pt-24 pb-12">
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="font-display text-4xl text-[#1A2B4C] tracking-tight">إدارة المحتوى التعليمي</h1>
            <p className="text-gray-500 text-sm mt-1">إدارة الفصول والدروس وصلاحيات الوصول</p>
          </div>
        </div>

        {feedback && (
          <div className="mb-4 bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 text-sm">
            {feedback}
          </div>
        )}

        {courses.length > 1 && (
          <div className="mb-6">
            <select
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-6 bg-white p-5 border border-gray-200">
          <h2 className="font-display text-lg text-[#1A2B4C] mb-4">قفل حسب المستوى</h2>
          <div className="flex flex-wrap gap-4">
            {(['MID1', 'MID2', 'FINAL'] as const).map((tier) => (
              <div key={tier} className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{TIER_LABELS[tier]}</span>
                <button
                  onClick={() => toggleLock('TIER', tier, !isLocked('TIER', tier))}
                  className={`px-3 py-1 text-xs font-semibold flex items-center gap-1 ${
                    isLocked('TIER', tier)
                      ? 'bg-red-50 text-red-600 border border-red-200'
                      : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                  }`}
                >
                  {isLocked('TIER', tier) ? <><Lock className="w-3 h-3" /> مقفل</> : <><Unlock className="w-3 h-3" /> مفتوح</>}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center gap-3">
            <User className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="معرف الطالب (لقفل فردي)"
              value={lockStudentId}
              onChange={(e) => setLockStudentId(e.target.value)}
              className="px-3 py-1.5 border border-gray-200 text-[#1A2B4C] text-xs flex-1 max-w-xs bg-white"
              dir="ltr"
            />
            <span className="text-xs text-gray-400">استخدم لقفل/فتح فردي</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-2xl text-[#1A2B4C]">الفصول</h2>
          <button
            onClick={() => setShowCreateChapter(true)}
            className="bg-[#1A2B4C] text-sm px-5 py-2 text-white flex items-center gap-1.5 hover:bg-[#1A2B4C]/90 transition-colors"
          >
            <Plus className="w-4 h-4" /> إضافة فصل
          </button>
        </div>

        {showCreateChapter && (
          <div className="mb-4 bg-white p-5 border border-[#1A2B4C]/20">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs text-gray-500 mb-2">عنوان الفصل</label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
                  placeholder="أدخل عنوان الفصل"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-2">المستوى</label>
                <select
                  value={newChapterTier}
                  onChange={(e) => setNewChapterTier(e.target.value)}
                  className="px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
                >
                  <option value="MID1">{TIER_LABELS.MID1}</option>
                  <option value="MID2">{TIER_LABELS.MID2}</option>
                  <option value="FINAL">{TIER_LABELS.FINAL}</option>
                </select>
              </div>
              <button onClick={createChapter} className="bg-[#1A2B4C] text-sm px-4 py-2 text-white">إنشاء</button>
              <button onClick={() => setShowCreateChapter(false)} className="text-gray-400 px-4 py-2 text-sm hover:text-gray-600">إلغاء</button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {courseChapters.length > 0 ? (
            courseChapters.map((chapter, idx) => (
              <div key={chapter.id} className="bg-white border border-gray-200 overflow-hidden">
                <div className="p-4">
                  {editingChapter === chapter.id ? (
                    <div className="flex flex-wrap gap-3 items-end">
                      <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="flex-1 min-w-[200px] px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white" />
                      <select value={editTier} onChange={(e) => setEditTier(e.target.value)} className="px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white">
                        <option value="MID1">{TIER_LABELS.MID1}</option>
                        <option value="MID2">{TIER_LABELS.MID2}</option>
                        <option value="FINAL">{TIER_LABELS.FINAL}</option>
                      </select>
                      <button onClick={() => updateChapter(chapter.id)} className="bg-[#1A2B4C] text-sm px-3 py-2 text-white">حفظ</button>
                      <button onClick={() => setEditingChapter(null)} className="text-gray-400 px-3 py-2 text-sm">إلغاء</button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-0.5">
                          <button onClick={() => moveChapter(courseChapters, idx, -1)} disabled={idx === 0} className="text-gray-300 hover:text-[#1A2B4C] disabled:opacity-20">
                            <ChevronUp className="w-4 h-4" />
                          </button>
                          <button onClick={() => moveChapter(courseChapters, idx, 1)} disabled={idx === courseChapters.length - 1} className="text-gray-300 hover:text-[#1A2B4C] disabled:opacity-20">
                            <ChevronDown className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="w-1 h-8 bg-[#1A2B4C]" />
                        <div>
                          <h3 className="font-display text-lg text-[#1A2B4C]">{chapter.title}</h3>
                          <span className="text-xs text-gray-400 font-mono-text">{TIER_LABELS[chapter.tier]} - {chapter.lessons.length} درس</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLock('CHAPTER', chapter.id, !isLocked('CHAPTER', chapter.id))}
                          className={`px-2 py-1 text-xs flex items-center gap-1 ${
                            isLocked('CHAPTER', chapter.id)
                              ? 'bg-red-50 text-red-600 border border-red-200'
                              : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                          }`}
                        >
                          {isLocked('CHAPTER', chapter.id) ? <><Lock className="w-3 h-3" /> مقفل</> : <><Unlock className="w-3 h-3" /> مفتوح</>}
                        </button>
                        {lockStudentId && (
                          <button
                            onClick={() => toggleLock('CHAPTER', chapter.id, true, 'PER_STUDENT', lockStudentId)}
                            className="px-2 py-1 text-xs bg-amber-50 text-amber-600 border border-amber-200 flex items-center gap-1"
                          >
                            <User className="w-3 h-3" /> قفل فردي
                          </button>
                        )}
                        <button onClick={() => { setEditingChapter(chapter.id); setEditTitle(chapter.title); setEditTier(chapter.tier) }} className="text-gray-300 hover:text-[#1A2B4C] p-1">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteChapter(chapter.id)} className="text-gray-300 hover:text-red-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {chapter.lessons.length > 0 && (
                  <div className="border-t border-gray-100">
                    {chapter.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between px-6 py-2.5 border-b border-gray-50 last:border-b-0">
                        <span className="text-sm text-gray-600">{lesson.title}</span>
                        <div className="flex items-center gap-2">
                          {lesson.durationMinutes && (
                            <span className="text-xs text-gray-400 font-mono-text">{lesson.durationMinutes} د</span>
                          )}
                          <button
                            onClick={() => toggleLock('LESSON', lesson.id, !isLocked('LESSON', lesson.id))}
                            className={`px-2 py-0.5 text-xs flex items-center gap-1 ${
                              isLocked('LESSON', lesson.id)
                                ? 'bg-red-50 text-red-600 border border-red-200'
                                : 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                            }`}
                          >
                            {isLocked('LESSON', lesson.id) ? <Lock className="w-3 h-3" /> : <Unlock className="w-3 h-3" />}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-white border border-gray-200">
              <Settings2Icon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-400">لا توجد فصول بعد. أضف فصلاً جديداً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function Settings2Icon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
}
