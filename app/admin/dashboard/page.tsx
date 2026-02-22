'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { api } from '@/lib/api'
import { Users, BookOpen, UserCheck, Settings, Lock, FileText, Video, Calendar, Play } from 'lucide-react'

interface AdminStats {
  totalUsers: number
  totalCourses: number
  totalEnrollments: number
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    api<AdminStats>('/api/admin/stats')
      .then(setStats)
      .catch(() => {
        router.push('/')
      })
      .finally(() => setLoading(false))
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6]">
        <div className="text-gray-400 font-mono-text text-sm">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F3F4F6] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-[#1A2B4C] tracking-tight">لوحة تحكم المدير</h1>
          <p className="text-gray-500 text-sm mt-1">مركز إدارة المنصة الأكاديمية</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-white border border-gray-200 p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-blue-50 flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <div className="font-display text-4xl text-[#1A2B4C]">{stats?.totalUsers || 0}</div>
              <div className="text-gray-500 text-sm mt-1">إجمالي المستخدمين</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-emerald-50 flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <div className="font-display text-4xl text-[#1A2B4C]">{stats?.totalCourses || 0}</div>
              <div className="text-gray-500 text-sm mt-1">إجمالي المواد</div>
            </div>
          </div>
          <div className="bg-white border border-gray-200 p-6 flex items-start gap-4">
            <div className="w-12 h-12 bg-amber-50 flex items-center justify-center flex-shrink-0">
              <UserCheck className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <div className="font-display text-4xl text-[#1A2B4C]">{stats?.totalEnrollments || 0}</div>
              <div className="text-gray-500 text-sm mt-1">إجمالي التسجيلات</div>
            </div>
          </div>
        </div>

        <div className="mb-10 bg-white border border-gray-200 p-6">
          <h2 className="font-display text-2xl text-[#1A2B4C] mb-4 flex items-center gap-2">
            <Video className="w-7 h-7 text-[#FF4F00]" />
            البث المباشر
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <AdminLiveInstant />
            <AdminLiveSchedule />
          </div>
        </div>

        <h2 className="font-display text-2xl text-[#1A2B4C] mb-6">إدارة المنصة</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/content"
            className="group bg-white border border-gray-200 p-6 hover:border-[#1A2B4C] transition-all"
          >
            <Settings className="w-8 h-8 text-[#1A2B4C] mb-4" />
            <h3 className="font-display text-xl text-[#1A2B4C] mb-1 group-hover:underline">إدارة المحتوى</h3>
            <p className="text-sm text-gray-500">الفصول والدروس وترتيب المنهج</p>
          </Link>
          <Link
            href="/admin/content"
            className="group bg-white border border-gray-200 p-6 hover:border-[#1A2B4C] transition-all"
          >
            <Lock className="w-8 h-8 text-[#1A2B4C] mb-4" />
            <h3 className="font-display text-xl text-[#1A2B4C] mb-1 group-hover:underline">التحكم بالأقفال</h3>
            <p className="text-sm text-gray-500">قفل وفتح المحتوى على مستوى الفصول والدروس</p>
          </Link>
          <Link
            href="/materials"
            className="group bg-white border border-gray-200 p-6 hover:border-[#1A2B4C] transition-all"
          >
            <FileText className="w-8 h-8 text-[#1A2B4C] mb-4" />
            <h3 className="font-display text-xl text-[#1A2B4C] mb-1 group-hover:underline">المواد الدراسية</h3>
            <p className="text-sm text-gray-500">عرض وإدارة المواد المتاحة</p>
          </Link>
        </div>
      </div>
    </div>
  )
}

const TIER_OPTIONS = [
  { value: 'MID1', label: 'MID1' },
  { value: 'MID2', label: 'MID2' },
  { value: 'FINAL', label: 'FINAL' },
]

function AdminLiveInstant() {
  const [title, setTitle] = useState('')
  const [tier, setTier] = useState('MID1')
  const [zoomJoinUrl, setZoomJoinUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const handleStart = async () => {
    setLoading(true)
    setMsg(null)
    try {
      await api('/api/admin/live/instant', {
        method: 'POST',
        body: {
          title: title || undefined,
          tier,
          ...(zoomJoinUrl.trim().startsWith('http') && { zoomJoinUrl: zoomJoinUrl.trim() }),
        },
      })
      setMsg('تم بدء البث المباشر. الطلاب المؤهلون يمكنهم الانضمام من صفحة المحاضرات المباشرة.')
      setTitle('')
      setZoomJoinUrl('')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-gray-200 p-4 bg-gray-50/50">
      <h3 className="font-display text-lg text-[#1A2B4C] mb-3 flex items-center gap-2">
        <Play className="w-5 h-5 text-[#FF4F00]" />
        بدء فصل مباشر الآن
      </h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="عنوان (اختياري)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
        />
        <input
          type="url"
          placeholder="رابط Zoom للانضمام (إذا لم يكن متوفراً من الـ API)"
          value={zoomJoinUrl}
          onChange={(e) => setZoomJoinUrl(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
          dir="ltr"
        />
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
        >
          {TIER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={handleStart}
          disabled={loading}
          className="w-full bg-[#FF4F00] text-white text-sm py-2 px-4 hover:bg-[#FF4F00]/90 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Play className="w-4 h-4" /> {loading ? 'جاري البدء...' : 'بدء البث'}
        </button>
      </div>
      {msg && <p className="mt-2 text-sm text-gray-600">{msg}</p>}
    </div>
  )
}

function AdminLiveSchedule() {
  const [title, setTitle] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [tier, setTier] = useState('MID1')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const handleSchedule = async () => {
    if (!title.trim() || !date || !time) {
      setMsg('الرجاء تعبئة العنوان والتاريخ والوقت')
      return
    }
    setLoading(true)
    setMsg(null)
    try {
      await api('/api/admin/live/schedule', {
        method: 'POST',
        body: { title, date, time, tier },
      })
      setMsg('تم جدولة المحاضرة بنجاح.')
      setTitle('')
      setDate('')
      setTime('')
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border border-gray-200 p-4 bg-gray-50/50">
      <h3 className="font-display text-lg text-[#1A2B4C] mb-3 flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#FF4F00]" />
        جدولة محاضرة
      </h3>
      <div className="space-y-3">
        <input
          type="text"
          placeholder="عنوان المحاضرة"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
        />
        <div className="grid grid-cols-2 gap-2">
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
          />
        </div>
        <select
          value={tier}
          onChange={(e) => setTier(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 text-[#1A2B4C] text-sm bg-white"
        >
          {TIER_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <button
          onClick={handleSchedule}
          disabled={loading}
          className="w-full bg-[#1A2B4C] text-white text-sm py-2 px-4 hover:bg-[#1A2B4C]/90 disabled:opacity-50"
        >
          {loading ? 'جاري الحفظ...' : 'جدولة'}
        </button>
      </div>
      {msg && <p className="mt-2 text-sm text-gray-600">{msg}</p>}
    </div>
  )
}
