'use client'

import { useState } from 'react'
import ScrollReveal from '@/components/ui/ScrollReveal'

export default function ContactPage() {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSent, setContactSent] = useState(false)

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSent(true)
    setTimeout(() => setContactSent(false), 4000)
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="py-24 bg-white min-h-screen pt-32 relative px-6">
      <div className="absolute inset-0 academic-grid opacity-10 pointer-events-none" />
      <div className="max-w-3xl mx-auto relative z-10">
        <ScrollReveal>
          <div className="text-center mb-16 border-b border-gray-100 pb-12">
            <span className="font-mono-text text-[#FF4F00] tracking-[0.3em] uppercase text-xs mb-4 block">المكتب الأكاديمي</span>
            <h1 className="font-display text-5xl text-[#1A2B4C] mb-4">تواصل معنا</h1>
            <p className="text-gray-500 font-mono-text text-sm leading-relaxed">للاستفسارات الرسمية المتعلقة بالتسجيل والمناهج الدراسية والتعاون الأكاديمي</p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={200}>
          <form onSubmit={handleContact} className="space-y-8 bg-gray-50 p-8 md:p-12 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="block text-xs font-mono-text uppercase text-gray-400 font-bold">الاسم بالكامل</label>
                <input
                  type="text"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  required
                  className="w-full px-4 py-4 border border-gray-200 text-[#1A2B4C] font-mono-text text-sm outline-none focus:border-[#1A2B4C] transition-all"
                  placeholder="Academic Full Name"
                />
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-mono-text uppercase text-gray-400 font-bold">البريد الجامعي / الرسمي</label>
                <input
                  type="email"
                  value={contactForm.email}
                  onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                  required
                  className="w-full px-4 py-4 border border-gray-200 text-[#1A2B4C] font-mono-text text-sm outline-none focus:border-[#1A2B4C] transition-all"
                  placeholder="official@institution.edu"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-mono-text uppercase text-gray-400 font-bold">طبيعة الاستفسار الأكاديمي</label>
              <textarea
                value={contactForm.message}
                onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                required
                rows={6}
                className="w-full px-4 py-4 border border-gray-200 text-[#1A2B4C] font-mono-text text-sm outline-none focus:border-[#1A2B4C] transition-all resize-none"
                placeholder="أدخل تفاصيل استفسارك هنا..."
              />
            </div>
            <button
              type="submit"
              className="bg-[#1A2B4C] font-display text-xl tracking-widest uppercase px-12 py-5 text-white w-full hover:bg-[#1A2B4C]/90 transition-all shadow-lg"
            >
              {contactSent ? 'تم إرسال الاستفسار بنجاح ✓' : 'إرسال الطلب الرسمي'}
            </button>
          </form>
        </ScrollReveal>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center border-t border-gray-100 pt-16">
          <div className="space-y-2">
            <h4 className="font-display text-[#1A2B4C] text-lg uppercase">الموقع</h4>
            <p className="text-gray-500 font-mono-text text-[10px] uppercase">المملكة العربية السعودية</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-display text-[#1A2B4C] text-lg uppercase">البريد</h4>
            <p className="text-gray-500 font-mono-text text-[10px] uppercase">info@ahmedacademy.com</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-display text-[#1A2B4C] text-lg uppercase">ساعات العمل</h4>
            <p className="text-gray-500 font-mono-text text-[10px] uppercase">9:00 AM - 5:00 PM (AST)</p>
          </div>
        </div>
      </div>
    </div>
  )
}
