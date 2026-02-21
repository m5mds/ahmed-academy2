'use client'

import Link from 'next/link'

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] pt-24">
      <div className="text-center">
        <div className="font-display text-[8rem] text-[#1A2B4C]/10 leading-none">500</div>
        <h1 className="font-display text-3xl text-[#1A2B4C] mt-4">حدث خطأ</h1>
        <p className="text-gray-500 text-sm mt-2 mb-8">نعتذر، حدث خطأ غير متوقع</p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={reset}
            className="bg-[#1A2B4C] text-lg px-8 py-3 text-white hover:bg-[#1A2B4C]/90 transition-colors"
          >
            حاول مرة أخرى
          </button>
          <Link
            href="/"
            className="border border-gray-200 text-lg px-8 py-3 text-[#1A2B4C] hover:bg-gray-50 transition-colors"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    </div>
  )
}
