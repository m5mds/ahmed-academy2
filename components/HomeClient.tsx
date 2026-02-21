'use client'

import Link from 'next/link'
import { useState } from 'react'
import AnimatedCounter from '@/components/ui/AnimatedCounter'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface CourseItem {
  id: string
  title: string
  slug: string
  description: string | null
  shortDescription: string | null
  level: string
  price: number | null
  isFree: boolean
  category: string | null
  _count: { enrollments: number }
}

export default function HomeClient({ courses }: { courses: CourseItem[] }) {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSent, setContactSent] = useState(false)

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSent(true)
    setTimeout(() => setContactSent(false), 4000)
    setContactForm({ name: '', email: '', message: '' })
  }

  const disciplines = [
    { name: 'الهندسة الميكانيكية', icon: '⚙️', count: courses.filter(c => c.category?.includes('Mechanical')).length },
    { name: 'الهندسة الكهربائية', icon: '⚡', count: courses.filter(c => c.category?.includes('Electrical')).length },
    { name: 'الهندسة المدنية', icon: '🏗️', count: courses.filter(c => c.category?.includes('Civil')).length },
  ]

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section - Split Layout */}
      <section className="relative min-h-screen flex items-center bg-white pt-20 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 academic-grid opacity-30 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Right Side (Content - RTL) */}
          <div className="relative z-10 order-1 lg:order-2 text-right">
            <ScrollReveal delay={0}>
              <div className="mb-6">
                <span className="font-mono-text text-[#1A2B4C] tracking-[0.3em] uppercase text-xs font-bold border-r-4 border-[#1A2B4C] pr-4 py-1">
                  مؤسسة تعليمية معتمدة
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h1 className="font-display text-4xl md:text-6xl uppercase leading-tight text-[#1A2B4C] mb-8">
                أكاديمية أحمد للعلوم
                <br />
                <span className="text-[#FF4F00]">الهندسية المتقدمة</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <p className="text-gray-600 text-lg mb-10 max-w-xl ml-auto leading-relaxed">
                توفير محتوى تعليمي هندسي رصين يركز على التطبيق العملي والأسس النظرية المتقدمة لتأهيل الكوادر الهندسية للمستقبل.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={600}>
              <div className="flex flex-col sm:flex-row gap-4 justify-start">
                <Link
                  href="/courses"
                  className="bg-[#1A2B4C] font-display text-xl tracking-widest px-12 py-4 text-white uppercase"
                >
                  المناهج والمواد الدراسية
                </Link>
                <Link
                  href="/register"
                  className="border border-[#1A2B4C] font-display text-xl tracking-widest px-12 py-4 text-[#1A2B4C] uppercase hover:bg-gray-50 transition-colors"
                >
                  التسجيل الأكاديمي
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Left Side (Blueprint Graphic) */}
          <div className="relative order-2 lg:order-1 flex justify-center lg:justify-start opacity-40 lg:opacity-100">
            <ScrollReveal delay={300}>
              <div className="w-full max-w-[500px] aspect-square relative">
                <svg viewBox="0 0 200 200" className="w-full h-full text-[#1A2B4C]">
                  {/* Technical Blueprint Elements */}
                  <rect x="20" y="20" width="160" height="160" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="4 4" />
                  <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="0.2" />
                  <path d="M100 20 L100 180 M20 100 L180 100" stroke="currentColor" strokeWidth="0.1" />
                  
                  {/* Schematic Representation */}
                  <g className="animate-pulse">
                    <path d="M40 100 L70 60 L130 60 L160 100 L130 140 L70 140 Z" fill="none" stroke="currentColor" strokeWidth="1" />
                    <circle cx="70" cy="60" r="3" fill="currentColor" />
                    <circle cx="130" cy="60" r="3" fill="currentColor" />
                    <circle cx="160" cy="100" r="3" fill="currentColor" />
                    <circle cx="130" cy="140" r="3" fill="currentColor" />
                    <circle cx="70" cy="140" r="3" fill="currentColor" />
                    <circle cx="40" cy="100" r="3" fill="currentColor" />
                  </g>
                  
                  {/* Measurement Indicators */}
                  <path d="M20 190 L180 190" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M20 185 L20 195 M180 185 L180 195" stroke="currentColor" strokeWidth="0.5" />
                  <text x="100" y="188" fontSize="6" textAnchor="middle" fill="currentColor" className="font-mono-text">SPECIFICATIONS X-142</text>
                </svg>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Disciplines Section */}
      <section className="py-24 bg-gray-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl text-[#1A2B4C] tracking-tight">الأقسام الأكاديمية</h2>
              <div className="w-20 h-1 bg-[#FF4F00] mx-auto mt-4" />
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {disciplines.map((d, i) => (
              <ScrollReveal key={i} delay={i * 100}>
                <div className="bg-white border border-gray-200 p-10 text-center hover:border-[#1A2B4C] transition-all group">
                  <div className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">{d.icon}</div>
                  <h3 className="font-display text-2xl text-[#1A2B4C] mb-2">{d.name}</h3>
                  <p className="text-gray-500 font-mono-text text-xs uppercase tracking-widest">تحتوي على {d.count} مادة دراسية</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Grid - Textbook Style */}
      <section className="py-24 bg-white relative px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-gray-100 pb-8">
              <div>
                <span className="font-mono-text text-[#FF4F00] tracking-[0.3em] uppercase text-xs mb-4 block">المناهج الدراسية</span>
                <h2 className="font-display text-5xl text-[#1A2B4C] tracking-tighter leading-none">
                  المواد التعليمية المتاحة
                </h2>
              </div>
              <Link href="/courses" className="text-gray-500 font-mono-text text-sm hover:text-[#1A2B4C] mt-4 md:mt-0 border-b border-gray-300 pb-1">
                عرض الفهرس الأكاديمي الكامل
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200">
            {courses.slice(0, 6).map((course, idx) => (
              <ScrollReveal key={course.id} delay={idx * 50}>
                <Link
                  href={`/courses/${course.slug}`}
                  className="group relative bg-white border-r border-b border-gray-200 p-8 transition-all hover:bg-gray-50 block"
                >
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <span className="text-[#FF4F00] font-mono-text text-[10px] tracking-widest uppercase font-bold">
                        {course.category || 'GENERAL ENGINEERING'}
                      </span>
                      <span className="text-gray-300 font-display text-xl">#{String(idx + 1).padStart(2, '0')}</span>
                    </div>
                    <h3 className="font-display text-2xl text-[#1A2B4C] leading-tight group-hover:underline underline-offset-4">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-mono-text line-clamp-3">
                      {course.shortDescription || course.description}
                    </p>
                    <div className="pt-6 flex items-center justify-between text-gray-500">
                      <span className="font-mono-text text-[10px] uppercase border border-gray-200 px-2 py-1">
                        {course.level === 'BEGINNER' ? 'تأسيسي' : 'متقدم'}
                      </span>
                      <span className="font-display text-lg text-[#1A2B4C]">
                        {course.isFree ? 'إصدار مجاني' : `${course.price} ر.س`}
                      </span>
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Values */}
      <section className="py-24 bg-[#1A2B4C] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            <ScrollReveal>
              <div className="text-center md:text-right border-r-0 md:border-r border-white/10 pr-0 md:pr-12">
                <h3 className="font-display text-4xl mb-4">الدقة الهندسية</h3>
                <p className="text-gray-400 font-mono-text text-sm leading-relaxed">
                  نلتزم بالمعايير العالمية في صياغة المحتوى العلمي، حيث يتم مراجعة كل معلومة لضمان دقتها الفنية والعملية.
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={150}>
              <div className="text-center md:text-right border-r-0 md:border-r border-white/10 pr-0 md:pr-12">
                <h3 className="font-display text-4xl mb-4">التحليل الرياضي</h3>
                <p className="text-gray-400 font-mono-text text-sm leading-relaxed">
                  تركيز عميق على الأسس الرياضية والفيزيائية للمواد، لتمكين الطالب من فهم "لماذا" وليس فقط "كيف".
                </p>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="text-center md:text-right">
                <h3 className="font-display text-4xl mb-4">التطبيق العملي</h3>
                <p className="text-gray-400 font-mono-text text-sm leading-relaxed">
                  ربط النظريات الأكاديمية بواقع الصناعة من خلال نماذج هندسية حقيقية ودراسات حالة من الميدان.
                </p>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24 bg-white border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl text-[#1A2B4C] mb-4">المكتب الأكاديمي</h2>
              <p className="text-gray-500 font-mono-text text-sm leading-relaxed">للاستفسارات الرسمية المتعلقة بالتسجيل والمناهج الدراسية</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <form onSubmit={handleContact} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono-text uppercase text-gray-400 mb-2">الاسم بالكامل</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 text-[#1A2B4C] font-mono-text text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono-text uppercase text-gray-400 mb-2">البريد الجامعي / الرسمي</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 text-[#1A2B4C] font-mono-text text-sm outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-mono-text uppercase text-gray-400 mb-2">طبيعة الاستفسار</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 text-[#1A2B4C] font-mono-text text-sm outline-none resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1A2B4C] font-display text-lg tracking-widest uppercase px-12 py-3 text-white w-full"
              >
                {contactSent ? 'تم إرسال الاستفسار ✓' : 'إرسال الطلب الأكاديمي'}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
