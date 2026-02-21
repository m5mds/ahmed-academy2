'use client'

import Link from 'next/link'
import { useState } from 'react'
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

  return (
    <div className="overflow-hidden bg-white">
      {/* Hero Section - 50/50 Split */}
      <section className="relative min-h-screen flex items-center bg-white pt-20 overflow-hidden border-b border-gray-100">
        <div className="absolute inset-0 academic-grid opacity-20 pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Right Side - Academic Text (RTL) */}
          <div className="relative z-10 order-1 lg:order-2">
            <ScrollReveal delay={0}>
              <div className="mb-6">
                <span className="font-mono-text text-[#1A2B4C] tracking-[0.2em] uppercase text-[11px] font-bold border-r-4 border-[#1A2B4C] pr-4 py-1">
                  مؤسسة تعليمية هندسية متخصصة
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h1 className="font-display text-4xl md:text-6xl leading-tight text-[#1A2B4C] mb-8">
                أكاديمية أحمد
                <br />
                <span className="text-[#FF4F00]">للعلوم الهندسية</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <p className="text-gray-600 text-lg mb-10 max-w-xl leading-relaxed">
                توفير محتوى تعليمي هندسي رصين يركز على التطبيق العملي والأسس النظرية المتقدمة لتأهيل الكوادر الهندسية للمستقبل.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={600}>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/courses"
                  className="bg-[#1A2B4C] text-lg px-10 py-4 text-white hover:bg-[#1A2B4C]/90 transition-colors text-center"
                >
                  المناهج والمواد الدراسية
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-[#1A2B4C] text-lg px-10 py-4 text-[#1A2B4C] hover:bg-gray-50 transition-colors text-center"
                >
                  التسجيل الأكاديمي
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Left Side - Technical Blueprint */}
          <div className="relative order-2 lg:order-1 flex justify-center">
            <ScrollReveal delay={300}>
              <div className="w-full max-w-[480px] aspect-square relative">
                <svg viewBox="0 0 400 400" className="w-full h-full">
                  {/* Blueprint background */}
                  <rect x="0" y="0" width="400" height="400" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="1" />
                  
                  {/* Grid */}
                  {Array.from({length: 20}).map((_, i) => (
                    <g key={i}>
                      <line x1={i*20} y1="0" x2={i*20} y2="400" stroke="#E5E7EB" strokeWidth="0.5" />
                      <line x1="0" y1={i*20} x2="400" y2={i*20} stroke="#E5E7EB" strokeWidth="0.5" />
                    </g>
                  ))}
                  
                  {/* Structural Truss */}
                  <g stroke="#1A2B4C" fill="none" strokeWidth="1.5">
                    <polygon points="200,60 340,280 60,280" />
                    <line x1="130" y1="170" x2="270" y2="170" />
                    <line x1="200" y1="60" x2="130" y2="170" />
                    <line x1="200" y1="60" x2="270" y2="170" />
                    <line x1="130" y1="170" x2="60" y2="280" />
                    <line x1="270" y1="170" x2="340" y2="280" />
                    <line x1="200" y1="170" x2="200" y2="280" />
                    <line x1="130" y1="170" x2="200" y2="280" />
                    <line x1="270" y1="170" x2="200" y2="280" />
                  </g>
                  
                  {/* Joint circles */}
                  {[[200,60],[130,170],[270,170],[60,280],[200,280],[340,280],[200,170]].map(([cx,cy], i) => (
                    <circle key={i} cx={cx} cy={cy} r="4" fill="#1A2B4C" />
                  ))}
                  
                  {/* Dimension lines */}
                  <g stroke="#1A2B4C" strokeWidth="0.5" strokeDasharray="4 2">
                    <line x1="60" y1="300" x2="340" y2="300" />
                    <line x1="60" y1="295" x2="60" y2="305" />
                    <line x1="340" y1="295" x2="340" y2="305" />
                  </g>
                  <text x="200" y="318" fontSize="10" textAnchor="middle" fill="#1A2B4C" fontFamily="JetBrains Mono">280 mm</text>
                  
                  {/* Load arrows */}
                  <g stroke="#FF4F00" strokeWidth="1.2" fill="#FF4F00">
                    <line x1="200" y1="20" x2="200" y2="55" />
                    <polygon points="196,55 200,62 204,55" />
                  </g>
                  <text x="200" y="15" fontSize="9" textAnchor="middle" fill="#FF4F00" fontFamily="JetBrains Mono">F = 10 kN</text>
                  
                  {/* Title block */}
                  <rect x="240" y="340" width="150" height="50" fill="white" stroke="#1A2B4C" strokeWidth="1" />
                  <text x="315" y="358" fontSize="8" textAnchor="middle" fill="#1A2B4C" fontFamily="JetBrains Mono">AHMED ACADEMY</text>
                  <text x="315" y="372" fontSize="7" textAnchor="middle" fill="#6B7280" fontFamily="JetBrains Mono">STRUCTURAL ANALYSIS</text>
                  <text x="315" y="384" fontSize="7" textAnchor="middle" fill="#6B7280" fontFamily="JetBrains Mono">DWG: AA-2026-001</text>
                </svg>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Academic Values */}
      <section className="py-24 bg-[#1A2B4C] text-white">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl text-white mb-2">الأسس الأكاديمية</h2>
              <div className="w-16 h-1 bg-[#FF4F00] mx-auto" />
            </div>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'الدقة الهندسية', desc: 'نلتزم بالمعايير العالمية في صياغة المحتوى العلمي. كل معلومة مراجعة لضمان دقتها الفنية والعملية.' },
              { title: 'التحليل الرياضي', desc: 'تركيز عميق على الأسس الرياضية والفيزيائية للمواد، لتمكين الطالب من فهم "لماذا" وليس فقط "كيف".' },
              { title: 'التطبيق العملي', desc: 'ربط النظريات الأكاديمية بواقع الصناعة من خلال نماذج هندسية حقيقية ودراسات حالة من الميدان.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="text-center">
                  <h3 className="font-display text-3xl mb-4">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Materials Grid */}
      {courses.length > 0 && (
        <section className="py-24 bg-white px-6">
          <div className="max-w-7xl mx-auto">
            <ScrollReveal>
              <div className="flex flex-col md:flex-row items-end justify-between mb-16 border-b border-gray-100 pb-8">
                <div>
                  <span className="font-mono-text text-[#FF4F00] tracking-[0.2em] uppercase text-xs mb-3 block">المناهج الدراسية</span>
                  <h2 className="font-display text-5xl text-[#1A2B4C]">المواد التعليمية المتاحة</h2>
                </div>
                <Link href="/courses" className="text-gray-500 text-sm hover:text-[#1A2B4C] mt-4 md:mt-0 border-b border-gray-300 pb-1">
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
                          {course.category || 'GENERAL'}
                        </span>
                        <span className="text-gray-200 font-display text-xl">#{String(idx + 1).padStart(2, '0')}</span>
                      </div>
                      <h3 className="font-display text-2xl text-[#1A2B4C] leading-tight group-hover:underline underline-offset-4">
                        {course.title}
                      </h3>
                      <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                      <div className="pt-6 flex items-center justify-between text-gray-500">
                        <span className="font-mono-text text-[10px] uppercase border border-gray-200 px-2 py-1">
                          {course.level === 'BEGINNER' ? 'تأسيسي' : 'متقدم'}
                        </span>
                        <span className="font-display text-lg text-[#1A2B4C]">
                          {course.isFree ? 'مجاني' : `${course.price} ر.س`}
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section className="py-24 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <h2 className="font-display text-4xl text-[#1A2B4C] mb-4">المكتب الأكاديمي</h2>
              <p className="text-gray-500 text-sm">للاستفسارات الرسمية المتعلقة بالتسجيل والمناهج الدراسية</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <form onSubmit={handleContact} className="space-y-6 bg-white p-8 md:p-12 border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">الاسم بالكامل</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 text-[#1A2B4C] text-sm outline-none focus:border-[#1A2B4C]"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-2 uppercase">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 border border-gray-200 text-[#1A2B4C] text-sm outline-none focus:border-[#1A2B4C]"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-2 uppercase">طبيعة الاستفسار</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 text-[#1A2B4C] text-sm outline-none focus:border-[#1A2B4C] resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1A2B4C] text-lg px-12 py-3 text-white w-full hover:bg-[#1A2B4C]/90 transition-colors"
              >
                {contactSent ? 'تم الإرسال بنجاح ✓' : 'إرسال الاستفسار'}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
