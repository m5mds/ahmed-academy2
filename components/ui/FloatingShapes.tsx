'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const shapes = ['hexagon', 'gear', 'circle']

export default function FloatingTechnicalShapes() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array.from({ length: 15 }).map((_, i) => {
                const size = Math.random() * 40 + 20
                const duration = Math.random() * 10 + 10
                const delay = Math.random() * 5
                const shape = shapes[Math.floor(Math.random() * shapes.length)]

                return (
                    <motion.div
                        key={i}
                        className="absolute opacity-[0.03] text-[#1A2B4C]"
                        initial={{
                            x: `${Math.random() * 100}%`,
                            y: `${Math.random() * 100}%`,
                            rotateX: 0,
                            rotateY: 0,
                            rotateZ: 0
                        }}
                        animate={{
                            y: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
                            rotateX: [0, 360],
                            rotateY: [0, 360],
                            rotateZ: [0, 360]
                        }}
                        transition={{
                            duration: duration,
                            repeat: Infinity,
                            delay: delay,
                            ease: "linear"
                        }}
                        style={{ width: size, height: size }}
                    >
                        {shape === 'hexagon' && (
                            <svg viewBox="0 0 100 100" fill="currentColor">
                                <path d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z" />
                            </svg>
                        )}
                        {shape === 'gear' && (
                            <svg viewBox="0 0 100 100" fill="currentColor">
                                <path d="M50 30 A20 20 0 1 0 50 70 A20 20 0 1 0 50 30 M50 0 L60 10 L60 20 L50 30 L40 20 L40 10 Z" />
                                {/* Simplified gear shape */}
                                <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="8" fill="none" strokeDasharray="10 10" />
                            </svg>
                        )}
                        {shape === 'circle' && (
                            <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="50" cy="50" r="45" />
                                <circle cx="50" cy="50" r="15" fill="currentColor" />
                            </svg>
                        )}
                    </motion.div>
                )
            })}
        </div>
    )
}
