'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import EngineTurbine from '@/components/ui/EngineTurbine'
import FloatingTechnicalShapes from '@/components/ui/FloatingShapes'
import MaterialCard from '@/components/ui/MaterialCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface MaterialItem {
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

export default function HomeClient({ materials }: { materials: MaterialItem[] }) {
  const [contactForm, setContactForm] = useState({ name: '', email: '', message: '' })
  const [contactSent, setContactSent] = useState(false)
  const { scrollYProgress } = useScroll()
  const turbineY = useTransform(scrollYProgress, [0, 0.2], [0, 100])
  const turbineOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    setContactSent(true)
    setTimeout(() => setContactSent(false), 4000)
    setContactForm({ name: '', email: '', message: '' })
  }

  return (
    <div className="overflow-hidden bg-white selection:bg-[#FF4F00] selection:text-white">
      {/* Hero Section - 3D Blueprint Grid */}
      <section className="relative h-screen flex items-center justify-center bg-white px-6 overflow-hidden">
        {/* 3D Blueprint Grid Background */}
        <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 academic-grid opacity-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/0 via-white/50 to-white" />

          {/* Floating Technical Shapes */}
          <FloatingTechnicalShapes />
        </div>

        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
          {/* Right Side - Institutional Text (RTL) */}
          <div className="order-1 lg:order-2 text-right">
            <ScrollReveal delay={0}>
              <div className="mb-6 inline-block">
                <span className="font-mono-text text-[#1A2B4C] tracking-[0.3em] uppercase text-[10px] font-bold border-r-4 border-[#FF4F00] pr-4 py-1">
                  ADVANCED ENGINEERING SYSTEMS
                </span>
              </div>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <h1 className="font-display text-5xl md:text-8xl leading-[0.9] text-[#1A2B4C] mb-8 uppercase">
                أكاديمية أحمد
                <br />
                <span className="text-[#FF4F00]">للهندسة المتقدمة</span>
              </h1>
            </ScrollReveal>
            <ScrollReveal delay={400}>
              <p className="text-gray-500 text-lg mb-10 max-w-xl ml-auto leading-relaxed font-arabic">
                تطوير الكفاءات الهندسية من خلال محتوى تقني رصين يجمع بين العمق الأكاديمي والتطبيق العملي في مجالات الابتكار الصناعي.
              </p>
            </ScrollReveal>
            <ScrollReveal delay={600}>
              <div className="flex flex-col sm:flex-row-reverse gap-6">
                <Link
                  href="/materials"
                  className="bg-[#1A2B4C] text-lg px-12 py-5 text-white hover:bg-[#FF4F00] transition-all duration-300 text-center font-display tracking-wider"
                >
                  فهرس المواد الدراسية
                </Link>
                <Link
                  href="/register"
                  className="border-2 border-[#1A2B4C] text-lg px-12 py-5 text-[#1A2B4C] hover:bg-gray-50 transition-all text-center font-display tracking-wider"
                >
                  التسجيل الأكاديمي
                </Link>
              </div>
            </ScrollReveal>
          </div>

          {/* Left Side - 3D Engine Turbine */}
          <motion.div
            className="order-2 lg:order-1 flex justify-center h-[400px] md:h-[600px] relative"
            style={{ y: turbineY, opacity: turbineOpacity }}
          >
            <EngineTurbine />

            {/* Technical Annotations */}
            <div className="absolute top-0 left-0 p-4 border-l border-t border-gray-200 hidden md:block">
              <p className="font-mono-text text-[8px] text-gray-400 uppercase tracking-widest mb-1">System status</p>
              <p className="font-mono-text text-[10px] text-[#FF4F00] uppercase font-bold">Operational: 100%</p>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <span className="font-mono-text text-[8px] text-gray-400 uppercase tracking-[0.5em] mb-2">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-[#1A2B4C] to-transparent" />
        </div>
      </section>

      {/* Materials Grid - 3D Tilt Cards */}
      <section className="py-32 bg-white px-6">
        <div className="max-w-7xl mx-auto">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-end justify-between mb-20 border-b border-gray-100 pb-10">
              <div className="text-right w-full md:w-auto">
                <span className="font-mono-text text-[#FF4F00] tracking-[0.4em] uppercase text-[10px] mb-4 block">Archive 2026</span>
                <h2 className="font-display text-5xl md:text-7xl text-[#1A2B4C] uppercase leading-none">المواد الدراسية</h2>
              </div>
              <Link href="/materials" className="text-gray-400 text-xs hover:text-[#FF4F00] mt-8 md:mt-0 transition-colors font-mono-text tracking-widest flex items-center gap-2">
                VIEW TECHNICAL INDEX
                <span className="w-8 h-[1px] bg-gray-300 group-hover:bg-[#FF4F00]" />
              </Link>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {materials.slice(0, 6).map((material, idx) => (
              <ScrollReveal key={material.id} delay={idx * 100}>
                <MaterialCard
                  id={material.id}
                  title={material.title}
                  slug={material.slug}
                  description={material.shortDescription || material.description || ''}
                  idx={idx}
                  category={material.category || 'ENGINEERING'}
                  level={material.level}
                  price={material.price ? Number(material.price) : undefined}
                  isFree={material.isFree}
                />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Academic Integrity Section */}
      <section className="py-32 bg-[#1A2B4C] text-white relative overflow-hidden">
        <div className="absolute inset-0 academic-grid opacity-5" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-20">
            {[
              { id: '01', title: 'الدقة الهندسية', desc: 'الالتزام الصارم بالمعايير التقنية العالمية في كافة المواد المطروحة.' },
              { id: '02', title: 'التحليل الرياضي', desc: 'التركيز على النمذجة الرياضية لتطوير التفكير التحليلي لدى المهندس.' },
              { id: '03', title: 'التصميم المستدام', desc: 'دمج مفاهيم الاستدامة والكفاءة في كافة الحلول الهندسية المقترحة.' },
            ].map((item, i) => (
              <ScrollReveal key={i} delay={i * 200}>
                <div className="space-y-6">
                  <span className="font-mono-text text-[#FF4F00] text-sm font-bold tracking-[0.5em]">{item.id}</span>
                  <h3 className="font-display text-4xl uppercase">{item.title}</h3>
                  <div className="w-10 h-1 bg-[#FF4F00]" />
                  <p className="text-gray-400 text-sm leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Institutional Contact */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-4xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="font-display text-5xl text-[#1A2B4C] mb-4 uppercase">المكتب الأكاديمي</h2>
              <p className="font-mono-text text-[10px] text-gray-400 tracking-[0.3em] uppercase">Academic Inquiry Office</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <form onSubmit={handleContact} className="space-y-8 bg-white p-10 md:p-16 border border-gray-100 shadow-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <label className="block font-mono-text text-[9px] text-gray-400 mb-2 uppercase tracking-widest">Full Name / الاسم</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full px-5 py-4 border border-gray-100 text-[#1A2B4C] text-sm outline-none focus:border-[#FF4F00] transition-colors"
                  />
                </div>
                <div>
                  <label className="block font-mono-text text-[9px] text-gray-400 mb-2 uppercase tracking-widest">Email / البريد</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full px-5 py-4 border border-gray-100 text-[#1A2B4C] text-sm outline-none focus:border-[#FF4F00] transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block font-mono-text text-[9px] text-gray-400 mb-2 uppercase tracking-widest">Inquiry Details / التفاصيل</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-5 py-4 border border-gray-100 text-[#1A2B4C] text-sm outline-none focus:border-[#FF4F00] transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="bg-[#1A2B4C] text-white font-display text-2xl py-5 w-full hover:bg-[#FF4F00] transition-all duration-300 uppercase tracking-widest"
              >
                {contactSent ? 'ENVOYÉ AVEC SUCCÈS ✓' : 'Submit Technical Inquiry'}
              </button>
            </form>
          </ScrollReveal>
        </div>
      </section>

      {/* Institutional Footer */}
      <footer className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-16 items-start">
          <div>
            <div className="flex flex-col mb-8">
              <span className="font-display text-4xl text-[#1A2B4C] leading-none">أكاديمية أحمد</span>
              <span className="font-mono-text text-[8px] tracking-[0.4em] uppercase text-gray-400">Engineering Academy</span>
            </div>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs uppercase font-mono-text">
              Dedicated to the pursuit of engineering excellence and industrial innovation.
            </p>
          </div>

          <div className="text-right">
            <h4 className="font-display text-xl text-[#1A2B4C] mb-6 uppercase">فهرس الأكاديمية</h4>
            <ul className="space-y-3 font-arabic text-sm text-gray-500">
              <li><Link href="/materials" className="hover:text-[#FF4F00]">المواد الدراسية</Link></li>
              <li><Link href="/about" className="hover:text-[#FF4F00]">عن الأكاديمية</Link></li>
              <li><Link href="/login" className="hover:text-[#FF4F00]">دخول الطلاب</Link></li>
            </ul>
          </div>

          <div className="text-right">
            <h4 className="font-display text-xl text-[#1A2B4C] mb-6 uppercase">المكتب الأكاديمي</h4>
            <p className="text-gray-500 text-sm font-mono-text mb-2">info@ahmedacademy.com</p>
            <p className="text-gray-500 text-sm font-arabic italic">المملكة العربية السعودية</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 pt-20 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-mono-text text-[8px] text-gray-300 uppercase tracking-widest">© 2026 AHMED ENGINEERING ACADEMY. ALL SYSTEMS OPERATIONAL.</p>
          <div className="flex gap-8 font-mono-text text-[8px] text-gray-400 uppercase tracking-widest">
            <Link href="#" className="hover:text-[#1A2B4C]">Policies</Link>
            <Link href="#" className="hover:text-[#1A2B4C]">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
