import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">أ</span>
              </div>
              <span className="text-xl font-bold text-white">أكاديمية أحمد</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              منصة تعليمية متكاملة لتعلم اللغة العربية مع دورات احترافية ومحتوى تعليمي عالي الجودة.
            </p>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">روابط سريعة</h3>
            <ul className="space-y-2">
              <li><Link href="/courses" className="text-neutral-400 hover:text-white transition-colors text-sm">الدورات</Link></li>
              <li><Link href="/login" className="text-neutral-400 hover:text-white transition-colors text-sm">تسجيل الدخول</Link></li>
              <li><Link href="/register" className="text-neutral-400 hover:text-white transition-colors text-sm">إنشاء حساب</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold mb-4">تواصل معنا</h3>
            <ul className="space-y-2 text-sm text-neutral-400">
              <li>البريد: info@ahmedacademy.com</li>
              <li>المنطقة الزمنية: توقيت الرياض</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-sm text-neutral-500">
          <p>© {new Date().getFullYear()} أكاديمية أحمد. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  )
}
