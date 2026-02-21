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

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="absolute inset-0 carbon-texture opacity-10 pointer-events-none" />

        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] opacity-[0.03]">
            <svg viewBox="0 0 200 200" className="w-full h-full animate-spin-slow">
              <circle cx="100" cy="100" r="80" fill="none" stroke="#FF4F00" strokeWidth="0.5" strokeDasharray="4 4" />
              <circle cx="100" cy="100" r="60" fill="none" stroke="#ffffff" strokeWidth="0.3" strokeDasharray="2 6" />
              <circle cx="100" cy="100" r="40" fill="none" stroke="#FF4F00" strokeWidth="0.3" />
              <line x1="20" y1="100" x2="180" y2="100" stroke="#ffffff" strokeWidth="0.2" />
              <line x1="100" y1="20" x2="100" y2="180" stroke="#ffffff" strokeWidth="0.2" />
              <path d="M100 60 L120 90 L100 120 L80 90 Z" fill="none" stroke="#FF4F00" strokeWidth="0.5" />
            </svg>
          </div>
          <div className="absolute bottom-1/3 left-1/6 w-[400px] h-[400px] opacity-[0.04]">
            <svg viewBox="0 0 200 200" className="w-full h-full">
              <rect x="30" y="30" width="140" height="140" fill="none" stroke="#FF4F00" strokeWidth="0.5" strokeDasharray="8 4" />
              <rect x="50" y="50" width="100" height="100" fill="none" stroke="#ffffff" strokeWidth="0.3" />
              <line x1="30" y1="30" x2="50" y2="50" stroke="#ffffff" strokeWidth="0.2" />
              <line x1="170" y1="30" x2="150" y2="50" stroke="#ffffff" strokeWidth="0.2" />
              <line x1="30" y1="170" x2="50" y2="150" stroke="#ffffff" strokeWidth="0.2" />
              <line x1="170" y1="170" x2="150" y2="150" stroke="#ffffff" strokeWidth="0.2" />
            </svg>
          </div>
        </div>

        <div className="bokeh-streak top-1/4 -left-20 rotate-12" />
        <div className="bokeh-streak bottom-1/3 -right-20 -rotate-12" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
          <ScrollReveal delay={0}>
            <div className="mb-6">
              <span className="font-mono-text text-primary tracking-[0.5em] uppercase text-xs border border-primary/30 px-4 py-2 inline-block">
                أكاديمية الهندسة المتقدمة
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <h1 className="font-display text-6xl md:text-[8rem] uppercase leading-none text-white tracking-tighter mb-6">
              أتقن
              <br />
              <span className="text-glow text-primary">الحرفة</span>
            </h1>
          </ScrollReveal>
          <ScrollReveal delay={400}>
            <p className="text-white/50 tracking-[0.2em] uppercase text-sm mb-12 max-w-xl mx-auto font-mono-text">
              الأكاديمية المتقدمة للوحدات التقنية وهندسة الأنظمة — مواد تعليمية عالية الأداء
            </p>
          </ScrollReveal>
          <ScrollReveal delay={600}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/courses"
                className="accent-button font-display text-xl tracking-widest px-10 py-4 text-white uppercase shadow-[0_0_30px_rgba(255,79,0,0.4)]"
              >
                تصفح المواد
              </Link>
              <Link
                href="/register"
                className="sharp-button font-display text-xl tracking-widest px-10 py-4 text-white uppercase"
              >
                انضم الآن
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce-slow">
          <span className="font-display text-xs tracking-[0.5em] uppercase opacity-40">اكتشف المزيد</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      <section className="relative py-28 bg-[#0A0A0A] overflow-hidden">
        <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="font-mono-text text-primary tracking-[0.4em] uppercase text-xs">أرقامنا تتحدث</span>
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-tighter mt-3">الإنجازات بالأرقام</h2>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { end: 1000, suffix: '+', label: 'طالب مسجل', sublabel: 'المتدربين النشطين' },
              { end: 500, suffix: '+', label: 'ساعات التدريب التقني', sublabel: 'TECHNICAL HOURS' },
              { end: 50, suffix: '+', label: 'النماذج الهندسية', sublabel: 'ENGINEERING MODELS' },
              { end: 10, suffix: '+', label: 'مادة متخصصة', sublabel: 'SPECIALIZED TRACKS' },
            ].map((stat, i) => (
              <ScrollReveal key={i} delay={i * 150}>
                <div className="glass p-8 flex flex-col items-center justify-center text-center group hover:border-primary/50 transition-all duration-500 border border-white/10">
                  <AnimatedCounter end={stat.end} suffix={stat.suffix} duration={2000 + i * 300} />
                  <div className="font-display text-sm tracking-[0.2em] uppercase text-white/60 mt-3">
                    {stat.label}
                  </div>
                  <div className="font-mono-text text-[10px] tracking-[0.3em] uppercase text-primary/60 mt-1">
                    {stat.sublabel}
                  </div>
                  <div className="w-8 h-[2px] bg-primary/30 mt-4 group-hover:w-16 group-hover:bg-primary transition-all duration-500" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 md:py-36 bg-background relative px-6 md:px-12">
        <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
              <div className="max-w-2xl">
                <span className="font-mono-text text-primary tracking-[0.4em] uppercase text-xs mb-4 block">المسارات الهندسية</span>
                <h2 className="font-display text-5xl md:text-7xl text-white tracking-tighter leading-none mb-4">
                  المواد
                  <br /><span className="text-glow">المتوفرة</span>
                </h2>
              </div>
              <div className="mt-6 md:mt-0 max-w-xs">
                <p className="text-white/40 uppercase tracking-widest text-xs mb-6 font-mono-text">
                  سرّع مسيرتك المهنية مع منهج هندسي عالمي مصمم للدقة والسرعة.
                </p>
                <div className="w-full h-[1px] bg-white/20 relative">
                  <div className="absolute top-0 right-0 w-1/2 h-full bg-primary shadow-[0_0_10px_rgba(255,79,0,0.8)]" />
                </div>
              </div>
            </div>
          </ScrollReveal>

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course, idx) => (
                <ScrollReveal key={course.id} delay={idx * 100}>
                  <Link
                    href={`/courses/${course.slug}`}
                    className="group relative bg-[#0A0A0A] border border-white/10 p-4 transition-all duration-500 hover:border-primary/50 block"
                  >
                    <div className="relative aspect-video overflow-hidden mb-6 bg-gradient-to-br from-primary/20 to-black flex items-center justify-center">
                      <svg viewBox="0 0 100 100" className="w-24 h-24 opacity-10 group-hover:opacity-30 transition-opacity duration-500">
                        <circle cx="50" cy="50" r="35" fill="none" stroke="#FF4F00" strokeWidth="1" />
                        <path d="M30 50 L50 30 L70 50 L50 70 Z" fill="none" stroke="#fff" strokeWidth="0.5" />
                        <circle cx="50" cy="50" r="8" fill="none" stroke="#FF4F00" strokeWidth="0.5" />
                      </svg>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                      <div className="absolute bottom-3 right-3 flex gap-2">
                        <span className="bg-primary px-3 py-1 font-display text-xs tracking-widest uppercase text-white">
                          {course.level === 'BEGINNER' ? 'تأسيسي' : course.level === 'INTERMEDIATE' ? 'متقدم' : 'احترافي'}
                        </span>
                        {course.isFree && (
                          <span className="bg-white/10 backdrop-blur-md px-3 py-1 font-display text-xs tracking-widest uppercase text-white">مجاني</span>
                        )}
                      </div>
                      <div className="absolute top-3 left-3 font-mono-text text-[10px] text-white/20 tracking-widest uppercase">
                        {course.category || 'TECH MODULE'}
                      </div>
                    </div>

                    <div className="space-y-3 px-2">
                      <h3 className="font-display text-2xl md:text-3xl text-white tracking-tighter group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-white/40 text-sm leading-relaxed font-mono-text line-clamp-2">
                        {course.shortDescription || course.description || 'وحدة تعليمية تقنية متقدمة'}
                      </p>
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <span className="text-white/40 font-mono-text text-xs tracking-widest uppercase">
                          {course._count.enrollments} طالب
                        </span>
                        <span className="font-display text-lg text-primary">
                          {course.isFree ? 'مجاني' : `${course.price} ر.س`}
                        </span>
                      </div>
                    </div>

                    <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-transparent group-hover:border-primary/50 transition-colors" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-transparent group-hover:border-primary/50 transition-colors" />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass">
              <p className="text-5xl mb-6 opacity-30">&#9881;</p>
              <p className="text-white/50 font-display text-xl tracking-widest uppercase">سيتم إضافة المواد قريباً</p>
            </div>
          )}

          <ScrollReveal>
            <div className="text-center mt-12">
              <Link
                href="/courses"
                className="accent-button inline-block font-display text-lg tracking-widest px-10 py-3 text-white uppercase shadow-[0_0_20px_rgba(255,79,0,0.3)]"
              >
                عرض جميع المواد
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <section className="py-28 bg-[#0A0A0A] relative">
        <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-16">
              <span className="font-mono-text text-primary tracking-[0.4em] uppercase text-xs">قيمنا الهندسية</span>
              <h2 className="font-display text-4xl md:text-6xl text-white tracking-tighter mt-3 mb-4">
                لماذا <span className="text-glow text-primary">أكاديمية أحمد</span>؟
              </h2>
              <p className="text-white/30 font-mono-text text-sm max-w-lg mx-auto">
                نبني المهندسين على أسس ثلاثة — كل قيمة تمثل ركيزة في رحلة الإتقان
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                iconPath: 'M30 15 L30 45 M15 30 L45 30 M30 30 m-15 0 a15 15 0 1 0 30 0 a15 15 0 1 0 -30 0 M30 30 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
                title: 'الدقة',
                subtitle: 'PRECISION',
                desc: 'نقدم مواد تعليمية مصممة بدقة هندسية متناهية — كل درس مقاس بعناية لضمان أعلى مستوى من الفهم والإتقان'
              },
              {
                iconPath: 'M10 40 L20 20 L30 30 L40 10 L50 25 M5 45 L55 45 M5 5 L5 45',
                title: 'الكفاءة',
                subtitle: 'EFFICIENCY',
                desc: 'نظام تعليمي محسّن للأداء العالي — أقصر وقت للإتقان مع أعلى جودة في المخرجات والمهارات التطبيقية'
              },
              {
                iconPath: 'M30 5 L55 22 L48 52 L12 52 L5 22 Z M30 15 L45 27 L40 45 L20 45 L15 27 Z M30 30 m-5 0 a5 5 0 1 0 10 0 a5 5 0 1 0 -10 0',
                title: 'الابتكار',
                subtitle: 'INNOVATION',
                desc: 'نتبنى أحدث التقنيات والأساليب التعليمية — من المحاكاة ثلاثية الأبعاد إلى المشاريع التطبيقية الحقيقية'
              },
            ].map((value, i) => (
              <ScrollReveal key={i} delay={i * 200}>
                <div className="group glass p-10 border border-white/10 hover:border-primary/50 transition-all duration-500 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-20 h-20 border-b border-l border-primary/10 group-hover:border-primary/30 transition-colors" />

                  <div className="mb-6 text-primary opacity-70 group-hover:opacity-100 transition-opacity">
                    <svg viewBox="0 0 60 60" className="w-16 h-16">
                      <path d={value.iconPath} fill="none" stroke="#FF4F00" strokeWidth="1" />
                    </svg>
                  </div>
                  <h3 className="font-display text-3xl text-white tracking-tighter mb-1">{value.title}</h3>
                  <span className="font-mono-text text-[10px] tracking-[0.4em] uppercase text-primary/60 block mb-4">{value.subtitle}</span>
                  <p className="text-white/40 text-sm font-mono-text leading-relaxed">{value.desc}</p>

                  <div className="mt-6 w-8 h-[2px] bg-primary/30 group-hover:w-full group-hover:bg-primary/50 transition-all duration-700" />
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-28 bg-background relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,79,0,0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,79,0,0.3) 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          />
        </div>

        <div className="max-w-3xl mx-auto px-6 relative z-10">
          <ScrollReveal>
            <div className="text-center mb-12">
              <span className="font-mono-text text-primary tracking-[0.4em] uppercase text-xs">تواصل معنا</span>
              <h2 className="font-display text-4xl md:text-5xl text-white tracking-tighter mt-3">سجّل اهتمامك</h2>
              <p className="text-white/30 font-mono-text text-sm mt-3">أرسل لنا رسالتك وسنتواصل معك في أقرب وقت</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <form onSubmit={handleContact} className="glass p-8 md:p-12 border border-white/10 space-y-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(255,79,0,0.5) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,79,0,0.5) 1px, transparent 1px)
                  `,
                  backgroundSize: '30px 30px'
                }}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
                <div>
                  <label className="block text-sm font-display tracking-widest uppercase text-white/60 mb-2">الاسم</label>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white font-mono-text text-sm focus:border-primary outline-none transition-all"
                    placeholder="أدخل اسمك"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display tracking-widest uppercase text-white/60 mb-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                    className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white font-mono-text text-sm focus:border-primary outline-none transition-all"
                    placeholder="example@email.com"
                    dir="ltr"
                  />
                </div>
              </div>
              <div className="relative z-10">
                <label className="block text-sm font-display tracking-widest uppercase text-white/60 mb-2">الرسالة</label>
                <textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white font-mono-text text-sm focus:border-primary outline-none transition-all resize-none"
                  placeholder="اكتب رسالتك هنا..."
                />
              </div>
              <div className="relative z-10">
                <button
                  type="submit"
                  className="accent-button font-display text-lg tracking-widest uppercase px-10 py-3 text-white shadow-[0_0_20px_rgba(255,79,0,0.3)] w-full md:w-auto"
                >
                  {contactSent ? 'تم الإرسال بنجاح ✓' : 'إرسال'}
                </button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
