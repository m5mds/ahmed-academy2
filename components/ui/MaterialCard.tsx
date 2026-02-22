'use client'

import { motion, useMotionValue, useTransform } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

interface MaterialCardProps {
    id: string
    title: string
    slug: string
    description: string
    idx: number
    category?: string
    level?: string
    price?: number
    isFree?: boolean
}

export default function MaterialCard({
    id, title, slug, description, idx, category, level, price, isFree
}: MaterialCardProps) {
    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const rotateX = useTransform(y, [-100, 100], [15, -15])
    const rotateY = useTransform(x, [-100, 100], [-15, 15])

    function handleMouseMove(event: React.MouseEvent) {
        const rect = event.currentTarget.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        x.set(event.clientX - centerX)
        y.set(event.clientY - centerY)
    }

    function handleMouseLeave() {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            style={{
                perspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
        >
            <Link href={`/materials/${slug}`} className="block">
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        transformStyle: "preserve-3d",
                    }}
                    className="group relative bg-white border border-gray-100 p-8 transition-all hover:border-[#1A2B4C]/20 shadow-sm hover:shadow-xl"
                >
                    {/* Depth Layered Icons/Text */}
                    <div className="space-y-4" style={{ transformStyle: "preserve-3d" }}>
                        <div className="flex justify-between items-start" style={{ transform: "translateZ(20px)" }}>
                            <span className="text-[#FF4F00] font-mono-text text-[10px] tracking-widest uppercase font-bold">
                                {category || 'ENGINEERING'}
                            </span>
                            <span className="text-gray-200 font-display text-xl" style={{ transform: "translateZ(40px)" }}>
                                #{String(idx + 1).padStart(2, '0')}
                            </span>
                        </div>

                        <h3
                            className="font-display text-2xl text-[#1A2B4C] leading-tight group-hover:text-[#FF4F00] transition-colors"
                            style={{ transform: "translateZ(50px)" }}
                        >
                            {title}
                        </h3>

                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2" style={{ transform: "translateZ(30px)" }}>
                            {description}
                        </p>

                        <div className="pt-6 flex items-center justify-between text-gray-500" style={{ transform: "translateZ(40px)" }}>
                            <span className="font-mono-text text-[10px] uppercase border border-gray-100 px-2 py-1">
                                {level === 'BEGINNER' ? 'تأسيسي' : 'متقدم'}
                            </span>
                            <span className="font-display text-lg text-[#1A2B4C]">
                                {isFree ? 'مجاني' : `${price} ر.س`}
                            </span>
                        </div>
                    </div>

                    {/* Blueprint background lines on hover */}
                    <div className="absolute inset-0 border border-gray-100 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity">
                        <div className="absolute top-0 bottom-0 left-1/4 border-l border-gray-100" />
                        <div className="absolute top-0 bottom-0 left-2/4 border-l border-gray-100" />
                        <div className="absolute top-0 bottom-0 left-3/4 border-l border-gray-100" />
                    </div>
                </motion.div>
            </Link>
        </motion.div>
    )
}
