'use client'

import { useState, useEffect, useCallback } from 'react'
import { api } from '@/lib/api'

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

interface Lock {
  id: string
  scope: string
  level: string
  targetId: string
  locked: boolean
}

const TIER_LABELS: Record<string, string> = {
  MID1: 'الفصل الأول',
  MID2: 'الفصل الثاني',
  FINAL: 'الاختبار النهائي',
  FULL: 'وصول كامل',
}

export default function AdminContentPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [locks, setLocks] = useState<Lock[]>([])
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

  const loadData = useCallback(async () => {
    try {
      const result = await api<{ courses: Course[]; locks: Lock[] }>('/api/admin/content')
      setCourses(result.courses)
      setLocks(result.locks)
      if (!selectedCourse && result.courses.length > 0) {
        setSelectedCourse(result.courses[0].id)
      }
    } catch {
      setCourses([])
    } finally {
      setLoading(false)
    }
  }, [selectedCourse])

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-neutral-500">جاري التحميل...</div>
      </div>
    )
  }

  const course = courses.find((c) => c.id === selectedCourse)
  const courseChapters = course?.chapters || []

  return (
    <div className="py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-neutral-800">إدارة المحتوى التعليمي</h1>
        </div>

        {feedback && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            {feedback}
          </div>
        )}

        {courses.length > 1 && (
          <div className="mb-6">
            <select
              value={selectedCourse || ''}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full md:w-auto px-4 py-2 border border-neutral-300 rounded-lg"
            >
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.title}</option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-6 p-4 bg-white rounded-xl border border-neutral-200">
          <h2 className="font-bold text-neutral-700 mb-3">قفل حسب المستوى</h2>
          <div className="flex flex-wrap gap-3">
            {(['MID1', 'MID2', 'FINAL'] as const).map((tier) => (
              <div key={tier} className="flex items-center gap-2">
                <span className="text-sm font-medium">{TIER_LABELS[tier]}</span>
                <button
                  onClick={() => toggleLock('TIER', tier, !isLocked('TIER', tier))}
                  className={`px-3 py-1 rounded-lg text-sm font-bold transition-colors ${
                    isLocked('TIER', tier)
                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                      : 'bg-green-100 text-green-700 hover:bg-green-200'
                  }`}
                >
                  {isLocked('TIER', tier) ? 'مقفل' : 'مفتوح'}
                </button>
              </div>
            ))}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="معرف الطالب (لقفل فردي)"
              value={lockStudentId}
              onChange={(e) => setLockStudentId(e.target.value)}
              className="px-3 py-1.5 border border-neutral-300 rounded-lg text-sm flex-1 max-w-xs"
              dir="ltr"
            />
            <span className="text-xs text-neutral-400">استخدم لقفل/فتح فردي</span>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-neutral-800">الفصول</h2>
          <button
            onClick={() => setShowCreateChapter(true)}
            className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            + إضافة فصل
          </button>
        </div>

        {showCreateChapter && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex flex-wrap gap-3 items-end">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm font-medium text-neutral-700 mb-1">عنوان الفصل</label>
                <input
                  type="text"
                  value={newChapterTitle}
                  onChange={(e) => setNewChapterTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-neutral-300 rounded-lg"
                  placeholder="أدخل عنوان الفصل"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">المستوى</label>
                <select
                  value={newChapterTier}
                  onChange={(e) => setNewChapterTier(e.target.value)}
                  className="px-3 py-2 border border-neutral-300 rounded-lg"
                >
                  <option value="MID1">{TIER_LABELS.MID1}</option>
                  <option value="MID2">{TIER_LABELS.MID2}</option>
                  <option value="FINAL">{TIER_LABELS.FINAL}</option>
                </select>
              </div>
              <button onClick={createChapter} className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-bold">
                إنشاء
              </button>
              <button onClick={() => setShowCreateChapter(false)} className="text-neutral-500 px-4 py-2 text-sm">
                إلغاء
              </button>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {courseChapters.length > 0 ? (
            courseChapters.map((chapter, idx) => (
              <div key={chapter.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                <div className="p-4">
                  {editingChapter === chapter.id ? (
                    <div className="flex flex-wrap gap-3 items-end">
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-1 min-w-[200px] px-3 py-2 border border-neutral-300 rounded-lg"
                      />
                      <select
                        value={editTier}
                        onChange={(e) => setEditTier(e.target.value)}
                        className="px-3 py-2 border border-neutral-300 rounded-lg"
                      >
                        <option value="MID1">{TIER_LABELS.MID1}</option>
                        <option value="MID2">{TIER_LABELS.MID2}</option>
                        <option value="FINAL">{TIER_LABELS.FINAL}</option>
                      </select>
                      <button onClick={() => updateChapter(chapter.id)} className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-bold">
                        حفظ
                      </button>
                      <button onClick={() => setEditingChapter(null)} className="text-neutral-500 px-3 py-2 text-sm">
                        إلغاء
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            onClick={() => moveChapter(courseChapters, idx, -1)}
                            disabled={idx === 0}
                            className="text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => moveChapter(courseChapters, idx, 1)}
                            disabled={idx === courseChapters.length - 1}
                            className="text-neutral-400 hover:text-neutral-600 disabled:opacity-30"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>
                        <div>
                          <h3 className="font-bold text-neutral-800">{chapter.title}</h3>
                          <span className="text-xs text-neutral-400">{TIER_LABELS[chapter.tier]} - {chapter.lessons.length} درس</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleLock('CHAPTER', chapter.id, !isLocked('CHAPTER', chapter.id))}
                          className={`px-2 py-1 rounded text-xs font-bold ${
                            isLocked('CHAPTER', chapter.id)
                              ? 'bg-red-100 text-red-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {isLocked('CHAPTER', chapter.id) ? 'مقفل' : 'مفتوح'}
                        </button>
                        {lockStudentId && (
                          <button
                            onClick={() => toggleLock('CHAPTER', chapter.id, true, 'PER_STUDENT', lockStudentId)}
                            className="px-2 py-1 rounded text-xs font-bold bg-orange-100 text-orange-700"
                          >
                            قفل فردي
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setEditingChapter(chapter.id)
                            setEditTitle(chapter.title)
                            setEditTier(chapter.tier)
                          }}
                          className="text-neutral-400 hover:text-primary"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteChapter(chapter.id)}
                          className="text-neutral-400 hover:text-red-500"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {chapter.lessons.length > 0 && (
                  <div className="border-t border-neutral-100">
                    {chapter.lessons.map((lesson) => (
                      <div key={lesson.id} className="flex items-center justify-between px-6 py-2 border-b border-neutral-50 last:border-b-0">
                        <span className="text-sm text-neutral-600">{lesson.title}</span>
                        <div className="flex items-center gap-2">
                          {lesson.durationMinutes && (
                            <span className="text-xs text-neutral-400">{lesson.durationMinutes} د</span>
                          )}
                          <button
                            onClick={() => toggleLock('LESSON', lesson.id, !isLocked('LESSON', lesson.id))}
                            className={`px-2 py-0.5 rounded text-xs font-bold ${
                              isLocked('LESSON', lesson.id)
                                ? 'bg-red-100 text-red-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {isLocked('LESSON', lesson.id) ? 'مقفل' : 'مفتوح'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-neutral-50 rounded-xl">
              <p className="text-4xl mb-4">📖</p>
              <p className="text-neutral-500">لا توجد فصول بعد. أضف فصلاً جديداً</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
