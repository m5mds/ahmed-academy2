'use client'

import { motion } from 'framer-motion'

export default function EngineTurbine() {
    return (
        <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: '1000px' }}>
            <motion.div
                className="relative w-64 h-64 md:w-80 md:h-80"
                style={{ transformStyle: 'preserve-3d' }}
                animate={{
                    rotateY: [0, 360],
                    rotateX: [10, -10, 10],
                }}
                transition={{
                    rotateY: { duration: 20, repeat: Infinity, ease: 'linear' },
                    rotateX: { duration: 5, repeat: Infinity, ease: 'easeInOut' },
                }}
            >
                {/* Turbine Core */}
                <div className="absolute inset-0 flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                    {/* Outer Ring */}
                    <div className="w-full h-full border-4 border-[#1A2B4C] rounded-full opacity-20" />

                    {/* Blades */}
                    {Array.from({ length: 12 }).map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute w-1 h-32 md:h-40 bg-gradient-to-t from-[#1A2B4C] to-[#FF4F00]/40 origin-bottom"
                            style={{
                                bottom: '50%',
                                left: '50%',
                                transform: `translateX(-50%) rotate(${i * 30}deg) translateZ(20px) rotateX(45deg)`,
                                transformStyle: 'preserve-3d'
                            }}
                        />
                    ))}

                    {/* Inner Core */}
                    <div
                        className="w-16 h-16 md:w-24 md:h-24 bg-[#1A2B4C] rounded-full border-4 border-[#FF4F00] shadow-[0_0_30px_rgba(255,79,0,0.3)] flex items-center justify-center"
                        style={{ transform: 'translateZ(40px)' }}
                    >
                        <div className="w-4 h-4 bg-[#FF4F00] rounded-full animate-pulse" />
                    </div>

                    {/* Technical Circles */}
                    <div
                        className="absolute inset-[-20%] border border-[#1A2B4C]/10 rounded-full"
                        style={{ transform: 'translateZ(-20px)' }}
                    />
                    <div
                        className="absolute inset-[-40%] border border-[#1A2B4C]/5 rounded-full"
                        style={{ transform: 'translateZ(-40px)' }}
                    />
                </div>

                {/* Floating Technical Lines */}
                <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="absolute border border-[#1A2B4C]/20"
                            style={{
                                width: '120%',
                                height: '1px',
                                top: `${25 * (i + 1)}%`,
                                left: '-10%',
                                transform: `translateZ(${(i - 1.5) * 50}px)`,
                            }}
                        />
                    ))}
                </div>
            </motion.div>
        </div>
    )
}
