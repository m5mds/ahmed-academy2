'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Video, Calendar, Lock } from 'lucide-react'

interface LiveSessionItem {
  id: string
  title: string | null
  tier: string
  isLive: boolean
  startedAt: string | null
  canJoin: boolean
}

const TIER_LABELS: Record<string, string> = {
  MID1: 'المرحلة الأولى',
  MID2: 'المرحلة الثانية',
  FINAL: 'الاختبار النهائي',
}

export default function LivePage() {
  const [sessions, setSessions] = useState<LiveSessionItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api<{ sessions: LiveSessionItem[] }>('/api/live/current')
      .then((data) => setSessions(data.sessions))
      .catch(() => setSessions([]))
      .finally(() => setLoading(false))
  }, [])

  const handleJoin = (sessionId: string) => {
    window.location.href = `/api/live/join/${sessionId}`
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-gray-400 font-mono-text text-sm">جاري التحميل...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-12">
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        <div className="mb-10">
          <h1 className="font-display text-4xl text-[#1A2B4C] tracking-tight flex items-center gap-3">
            <Video className="w-10 h-10 text-[#FF4F00]" />
            المحاضرات المباشرة
          </h1>
          <p className="text-gray-500 text-sm mt-1">انضم إلى البث المباشر حسب مستواك</p>
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-16 bg-white border border-gray-200">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">لا توجد محاضرة مباشرة حالياً</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div
                key={session.id}
                className="bg-white border border-gray-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#1A2B4C]/10 flex items-center justify-center flex-shrink-0">
                    <Video className="w-6 h-6 text-[#1A2B4C]" />
                  </div>
                  <div>
                    <h2 className="font-display text-lg text-[#1A2B4C]">
                      {session.title || `محاضرة ${TIER_LABELS[session.tier] || session.tier}`}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {TIER_LABELS[session.tier] || session.tier}
                      {session.isLive && (
                        <span className="mr-2 inline-flex items-center gap-1 text-[#FF4F00]">
                          <span className="w-2 h-2 rounded-full bg-[#FF4F00] animate-pulse" />
                          مباشر
                        </span>
                      )}
                    </p>
                  </div>
                </div>
                <div>
                  {session.isLive && session.canJoin ? (
                    <button
                      onClick={() => handleJoin(session.id)}
                      className="bg-[#FF4F00] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#FF4F00]/90 transition-colors flex items-center gap-2"
                    >
                      انضم الآن
                    </button>
                  ) : session.isLive && !session.canJoin ? (
                    <span className="inline-flex items-center gap-2 text-gray-400 text-sm">
                      <Lock className="w-4 h-4" />
                      غير متاح لمستواك
                    </span>
                  ) : (
                    <span className="text-gray-400 text-sm">مجدولة</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
