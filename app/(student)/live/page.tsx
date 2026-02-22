'use client'

import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Video, Calendar, Lock, Activity, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import FloatingTechnicalShapes from '@/components/ui/FloatingShapes'

interface LiveSessionItem {
  id: string
  title: string | null
  tier: string
  isLive: boolean
  startedAt: string | null
  canJoin: boolean
}

const TIER_LABELS: Record<string, string> = {
  MID1: 'MIDTERM PROJECT 01',
  MID2: 'MIDTERM PROJECT 02',
  FINAL: 'FINAL ENGINEERING PHASE',
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
      <div className="min-h-screen flex items-center justify-center bg-white font-mono-text text-[10px] tracking-[0.5em] text-[#1A2B4C] uppercase">
        Initializing Secure Stream...
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.05]">
        <div className="absolute inset-0 academic-grid" />
        <FloatingTechnicalShapes />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        <header className="mb-20 text-right border-r-8 border-[#1A2B4C] pr-10">
          <div className="flex items-center justify-end gap-4 mb-4">
            <span className="font-mono-text text-[10px] text-[#FF4F00] font-bold tracking-[0.3em] uppercase">Status: Live Engine Alpha</span>
            <Activity className="w-4 h-4 text-[#FF4F00] animate-pulse" />
          </div>
          <h1 className="font-display text-6xl text-[#1A2B4C] uppercase leading-none mb-4">
            غرفة العمليات المباشرة
          </h1>
          <p className="font-mono-text text-[9px] text-gray-400 uppercase tracking-[0.4em] mb-12">Institutional Live Classroom Protocol</p>

          <div className="flex justify-end gap-12 text-[10px] font-mono-text text-gray-400 uppercase tracking-widest">
            <div className="flex flex-col items-end">
              <span>Active Nodes</span>
              <span className="text-[#1A2B4C] font-bold">4 CPU WORKERS</span>
            </div>
            <div className="flex flex-col items-end">
              <span>Latency</span>
              <span className="text-emerald-500 font-bold">&lt; 150ms</span>
            </div>
          </div>
        </header>

        {sessions.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-32 bg-gray-50/50 border border-dashed border-gray-200"
          >
            <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-6" />
            <p className="font-display text-2xl text-gray-300 uppercase tracking-[0.2em]">No Transmission Detected</p>
            <p className="font-mono-text text-[8px] text-gray-400 mt-4 uppercase tracking-widest">Awaiting Command from Engineering HQ</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {sessions.map((session, idx) => (
              <motion.div
                key={session.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="group relative bg-white border border-gray-100 p-8 hover:border-[#1A2B4C]/20 transition-all shadow-sm hover:shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-8"
              >
                <div className="flex items-center gap-8">
                  <div className="w-20 h-20 bg-[#1A2B4C] flex items-center justify-center relative overflow-hidden">
                    <Video className="w-8 h-8 text-white z-10" />
                    <div className="absolute inset-0 opacity-20 academic-grid scale-150 rotate-12" />
                  </div>
                  <div className="text-right md:text-left order-2 md:order-1">
                    <div className="flex items-center gap-3 mb-2 flex-row-reverse md:flex-row">
                      <h2 className="font-display text-2xl text-[#1A2B4C] uppercase">
                        {session.title || 'Technical Lecture'}
                      </h2>
                      {session.isLive && (
                        <span className="flex items-center gap-2 bg-[#FF4F00] text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-tighter">
                          <Activity className="w-3 h-3" /> LIVE
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-[9px] font-mono-text text-gray-400 uppercase tracking-widest flex-row-reverse md:flex-row">
                      <span className="text-[#1A2B4C] font-bold">{TIER_LABELS[session.tier] || session.tier}</span>
                      <span className="w-1 h-1 bg-gray-300 rounded-full" />
                      <span>{new Date(session.startedAt || Date.now()).toLocaleTimeString()} UTC</span>
                    </div>
                  </div>
                </div>

                <div className="order-1 md:order-2 flex justify-center md:justify-end">
                  {session.isLive && session.canJoin ? (
                    <button
                      onClick={() => handleJoin(session.id)}
                      className="group/btn bg-[#1A2B4C] text-white px-10 py-4 text-xs font-display uppercase tracking-widest hover:bg-[#FF4F00] transition-all flex items-center gap-3 shadow-[0_10px_20px_rgba(26,43,76,0.1)]"
                    >
                      <ShieldCheck className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                      Authorize & Join
                    </button>
                  ) : session.isLive && !session.canJoin ? (
                    <div className="flex items-center gap-3 text-gray-300 font-mono-text text-[10px] uppercase tracking-widest border border-gray-100 px-6 py-4">
                      <Lock className="w-4 h-4" />
                      Access Denied: Level Restricted
                    </div>
                  ) : (
                    <div className="text-gray-400 font-mono-text text-[10px] uppercase tracking-widest border border-gray-100 px-6 py-4">
                      Scheduled Sync
                    </div>
                  )}
                </div>

                {/* Technical lines decoration */}
                <div className="absolute top-0 right-0 w-20 h-[1px] bg-gray-100" />
                <div className="absolute top-0 right-0 w-[1px] h-20 bg-gray-100" />
              </motion.div>
            ))}
          </div>
        )}

        <footer className="mt-24 pt-10 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center gap-8 opacity-50">
          <div className="flex items-center gap-4 font-mono-text text-[8px] text-gray-400 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            End-to-End Encryption Protocol Active
          </div>
          <div className="font-mono-text text-[8px] text-gray-300 uppercase tracking-widest">
            Nodes: Frankfurt-01 | Riyadh-06 | London-04
          </div>
        </footer>
      </div>
    </div>
  )
}
