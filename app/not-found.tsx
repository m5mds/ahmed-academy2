import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background pt-24 relative">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
      <div className="text-center relative z-10">
        <div className="font-display text-[10rem] text-primary/20 leading-none">404</div>
        <h1 className="font-display text-3xl text-white tracking-tighter mt-4">الصفحة غير موجودة</h1>
        <p className="text-white/40 font-mono-text text-sm mt-2 mb-8">الصفحة التي تبحث عنها غير متوفرة</p>
        <Link
          href="/"
          className="accent-button font-display text-lg tracking-widest uppercase px-8 py-3 text-white shadow-[0_0_20px_rgba(255,79,0,0.3)]"
        >
          العودة للرئيسية
        </Link>
      </div>
    </div>
  )
}
