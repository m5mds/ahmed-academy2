'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Video, PlayCircle, Lock } from 'lucide-react'

interface Lesson {
    id: string
    title: string
    durationMinutes: number | null
    isPreview: boolean
    tier: string
}

interface Chapter {
    id: string
    title: string
    tier: string
    lessons: Lesson[]
}

export default function MaterialCurriculum({
    chapters,
    userTier,
    isAdmin
}: {
    chapters: Chapter[],
    userTier?: string,
    isAdmin?: boolean
}) {
    const [activeTab, setActiveTab] = useState<'MID1' | 'MID2' | 'FINAL'>('MID1')

    const filteredChapters = chapters.filter(c => c.tier === activeTab)

    return (
        <div className="bg-white border border-gray-100 overflow-hidden">
            {/* 3-Tab System */}
            <div className="flex border-b border-gray-100">
                {(['MID1', 'MID2', 'FINAL'] as const).map((tier) => (
                    <button
                        key={tier}
                        onClick={() => setActiveTab(tier)}
                        className={`flex-1 py-4 text-center font-display text-lg transition-all relative ${activeTab === tier ? 'text-[#FF4F00]' : 'text-gray-400 hover:text-[#1A2B4C]'
                            }`}
                    >
                        {tier}
                        {activeTab === tier && (
                            <motion.div
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-[#FF4F00]"
                            />
                        )}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {isAdmin && (
                    <div className="mb-6 flex gap-4">
                        <button className="flex-1 bg-[#1A2B4C] text-white py-2 text-xs font-display uppercase tracking-widest hover:bg-[#FF4F00] transition-colors flex items-center justify-center gap-2">
                            <Video className="w-4 h-4" /> Start Instant Live ({activeTab})
                        </button>
                        <button className="flex-1 border border-[#1A2B4C] text-[#1A2B4C] py-2 text-xs font-display uppercase tracking-widest hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                            Schedule Live ({activeTab})
                        </button>
                    </div>
                )}

                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-4"
                    >
                        {filteredChapters.length > 0 ? (
                            filteredChapters.map((chapter) => (
                                <div key={chapter.id} className="border border-gray-50">
                                    <div className="flex items-center justify-between p-4 bg-gray-50/50">
                                        <div className="flex items-center gap-3">
                                            <div className="w-1 h-6 bg-[#1A2B4C]" />
                                            <h3 className="font-display text-lg text-[#1A2B4C]">{chapter.title}</h3>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-gray-50">
                                        {chapter.lessons.map((lesson, idx) => {
                                            const isLocked = !isAdmin && userTier !== 'FULL' && userTier !== activeTab && !lesson.isPreview

                                            return (
                                                <div key={lesson.id} className="group flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-center gap-4">
                                                        <span className="font-mono-text text-[10px] text-gray-300">
                                                            {String(idx + 1).padStart(2, '0')}
                                                        </span>
                                                        <div className="flex flex-col">
                                                            <span className={`text-sm ${isLocked ? 'text-gray-400 italic' : 'text-[#1A2B4C] font-medium'}`}>
                                                                {lesson.title}
                                                            </span>
                                                            {lesson.durationMinutes && (
                                                                <span className="text-[10px] text-gray-400 font-mono-text">{lesson.durationMinutes} min</span>
                                                            )}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-3">
                                                        {isLocked ? (
                                                            <Lock className="w-4 h-4 text-gray-300" />
                                                        ) : (
                                                            <button className="text-[#1A2B4C] opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <PlayCircle className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        {lesson.isPreview && (
                                                            <span className="bg-[#FF4F00]/10 text-[#FF4F00] px-2 py-0.5 text-[8px] font-bold uppercase tracking-tighter">Preview</span>
                                                        )}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="py-20 text-center">
                                <p className="font-display text-gray-300 text-xl uppercase tracking-widest italic">No implementation for {activeTab} yet</p>
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
