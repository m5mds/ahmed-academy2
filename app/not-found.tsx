import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F4F6] pt-24">
      <div className="text-center">
        <div className="font-display text-[10rem] text-[#1A2B4C]/10 leading-none">404</div>
        <h1 className="font-display text-3xl text-[#1A2B4C] mt-4">الصفحة غير موجودة</h1>
        <p className="text-gray-500 text-sm mt-2 mb-8">الصفحة التي تبحث عنها غير متوفرة</p>
        <Link
          href="/"
          className="bg-[#1A2B4C] text-lg px-8 py-3 text-white hover:bg-[#1A2B4C]/90 transition-colors"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
