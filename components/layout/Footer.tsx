import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white py-20 border-t border-gray-100 relative overflow-hidden px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10 text-right" dir="rtl">
        <div className="md:col-span-2">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-[#1A2B4C] flex items-center justify-center">
              <span className="font-display text-white text-xl">A</span>
            </div>
            <span className="font-display text-2xl tracking-tighter uppercase text-[#1A2B4C]">
              أكاديمية أحمد
            </span>
          </div>
          <p className="text-gray-500 max-w-sm mb-6 text-sm font-mono-text leading-relaxed">
            منصة تعليمية متخصصة في العلوم الهندسية المتقدمة والابتكار التقني. نركز على تأهيل جيل من المهندسين المبدعين وفق أسس علمية رصينة.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-[0.2em] uppercase text-[#1A2B4C] mb-6 border-b border-[#1A2B4C]/20 inline-block pb-1">الفهرس الأكاديمي</h4>
          <ul className="space-y-3 font-display text-gray-500 uppercase text-sm">
            <li><Link href="/materials" className="hover:text-[#1A2B4C] transition-colors">المواد الدراسية</Link></li>
            <li><Link href="/about" className="hover:text-[#1A2B4C] transition-colors">عن الأكاديمية</Link></li>
            <li><Link href="/login" className="hover:text-[#1A2B4C] transition-colors">دخول الطلاب</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg tracking-[0.2em] uppercase text-[#1A2B4C] mb-6 border-b border-[#1A2B4C]/20 inline-block pb-1">المكتب الأكاديمي</h4>
          <ul className="space-y-3 text-sm text-gray-500 font-mono-text">
            <li>info@ahmedacademy.com</li>
            <li>المملكة العربية السعودية</li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-[10px] font-display tracking-[0.3em] uppercase text-gray-400 relative z-10">
        <div>&copy; {new Date().getFullYear()} أكاديمية أحمد للعلوم الهندسية المتقدمة. جميع الحقوق محفوظة.</div>
        <div className="flex gap-6 mt-4 md:mt-0">
          <Link href="#" className="hover:text-[#1A2B4C] transition-colors">اللوائح والسياسات</Link>
          <Link href="#" className="hover:text-[#1A2B4C] transition-colors">شروط القبول</Link>
        </div>
      </div>
    </footer>
  )
}
