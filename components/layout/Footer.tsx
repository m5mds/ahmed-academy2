import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-background py-20 border-t border-white/5 relative overflow-hidden px-6 md:px-12">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-primary rotate-45 flex items-center justify-center">
              <span className="font-display text-white -rotate-45 text-xl">A</span>
            </div>
            <span className="font-display text-2xl tracking-tighter uppercase italic text-white">
              أكاديمية أحمد
            </span>
          </div>
          <p className="text-white/40 max-w-sm mb-6 text-sm font-mono-text tracking-wide leading-relaxed">
            مستقبل التعليم الهندسي بأداء عالي. أتقن الحرفة مع أحمد وحوّل مسيرتك المهنية إلى تحفة من الدقة والإتقان.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-[0.3em] uppercase text-white mb-6 border-b border-primary/30 inline-block pb-1">المنهج</h4>
          <ul className="space-y-3 font-display text-white/40 tracking-widest uppercase text-sm">
            <li><Link href="/courses" className="hover:text-white transition-colors">المواد التعليمية</Link></li>
            <li><Link href="/content" className="hover:text-white transition-colors">الوحدات التقنية</Link></li>
            <li><Link href="/login" className="hover:text-white transition-colors">دخول المنصة</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-[0.3em] uppercase text-white mb-6 border-b border-primary/30 inline-block pb-1">تواصل</h4>
          <ul className="space-y-3 text-sm text-white/40 font-mono-text">
            <li>info@ahmedacademy.com</li>
            <li>توقيت الرياض</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center text-[10px] font-display tracking-[0.4em] uppercase text-white/20 relative z-10">
        <div>&copy; {new Date().getFullYear()} أكاديمية أحمد. جميع الحقوق محفوظة.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link>
          <Link href="#" className="hover:text-white transition-colors">شروط الاستخدام</Link>
        </div>
      </div>
    </footer>
  )
}
