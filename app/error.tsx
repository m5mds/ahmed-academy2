'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-24 relative">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
      <div className="text-center relative z-10">
        <div className="font-display text-[8rem] text-primary/20 leading-none">500</div>
        <h1 className="font-display text-3xl text-white tracking-tighter mt-4">حدث خطأ</h1>
        <p className="text-white/40 font-mono-text text-sm mt-2 mb-8">نعتذر، حدث خطأ غير متوقع</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="accent-button font-display text-lg tracking-widest uppercase px-8 py-3 text-white shadow-[0_0_20px_rgba(255,79,0,0.3)]"
          >
            حاول مرة أخرى
          </button>
          <Link
            href="/"
            className="sharp-button font-display text-lg tracking-widest uppercase px-8 py-3 text-white"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
