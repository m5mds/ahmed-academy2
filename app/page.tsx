import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getFeaturedCourses() {
  try {
    return await prisma.course.findMany({
      where: { isPublished: true },
      take: 6,
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { enrollments: true } } },
    })
  } catch {
    return []
  }
}

export default async function HomePage() {
  const courses = await getFeaturedCourses()

  return (
    <div>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background pt-20">
        <div className="absolute inset-0 carbon-texture opacity-10 pointer-events-none" />
        <div className="bokeh-streak top-1/4 -left-20 rotate-12" />
        <div className="bokeh-streak bottom-1/3 -right-20 -rotate-12" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 text-center">
          <div className="mb-6">
            <span className="font-display text-primary tracking-[0.4em] uppercase text-sm">أكاديمية الهندسة</span>
          </div>
          <h1 className="font-display text-6xl md:text-[8rem] uppercase leading-none text-white tracking-tighter mb-6">
            أتقن
            <br />
            <span className="text-glow text-primary">الحرفة</span>
          </h1>
          <p className="text-white/50 tracking-[0.2em] uppercase text-sm mb-12 max-w-xl mx-auto font-mono-text">
            الأكاديمية المتقدمة للوحدات التقنية وهندسة الأنظمة — مواد تعليمية عالية الأداء
          </p>
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
              سجّل الآن
            </Link>
          </div>
        </div>

        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="font-display text-xs tracking-[0.5em] uppercase opacity-40">اكتشف المزيد</span>
          <div className="w-[1px] h-16 bg-gradient-to-b from-primary to-transparent" />
        </div>
      </section>

      <section className="relative py-24 bg-background overflow-hidden">
        <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { value: '١٠٠٠+', label: 'طالب مسجل' },
            { value: '٥٠+', label: 'وحدة تعليمية' },
            { value: '١٠+', label: 'مادة متخصصة' },
            { value: '٤.٨', label: 'تقييم الطلاب' },
          ].map((stat, i) => (
            <div key={i} className="glass p-8 flex flex-col items-center justify-center border-r-2 border-r-primary">
              <div className="font-display text-4xl md:text-5xl text-white tracking-tighter mb-2">
                {stat.value}
              </div>
              <div className="font-display text-xs tracking-[0.3em] uppercase text-white/50">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-24 md:py-32 bg-background relative px-6 md:px-12">
        <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16">
            <div className="max-w-2xl">
              <span className="font-display text-primary tracking-[0.4em] uppercase text-sm mb-4 block">اختر مسارك</span>
              <h2 className="font-display text-5xl md:text-7xl text-white tracking-tighter leading-none mb-4">
                المواد
                <br /><span className="text-glow">التعليمية</span>
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

          {courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <Link
                  key={course.id}
                  href={`/courses/${course.slug}`}
                  className="group relative bg-black border border-white/10 p-4 transition-all duration-500 hover:border-primary/50"
                >
                  <div className="relative aspect-video overflow-hidden mb-6 bg-gradient-to-br from-primary/20 to-black flex items-center justify-center">
                    <span className="text-6xl opacity-20 group-hover:opacity-40 transition-opacity">&#9881;</span>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                    <div className="absolute bottom-3 right-3 flex gap-2">
                      <span className="bg-primary px-3 py-1 font-display text-xs tracking-widest uppercase text-white">
                        {course.level === 'BEGINNER' ? 'تأسيسي' : course.level === 'INTERMEDIATE' ? 'متقدم' : 'احترافي'}
                      </span>
                      {course.isFree && (
                        <span className="bg-white/10 backdrop-blur-md px-3 py-1 font-display text-xs tracking-widest uppercase text-white">مجاني</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-3 px-2">
                    <h3 className="font-display text-2xl md:text-3xl text-white tracking-tighter group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-white/40 text-sm leading-relaxed font-mono-text">
                      {course.shortDescription || course.description || 'وحدة تعليمية تقنية متقدمة'}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <span className="text-white/40 font-display text-xs tracking-widest uppercase">
                        {course._count.enrollments} طالب
                      </span>
                      <span className="font-display text-lg text-white/40 italic">
                        {course.isFree ? 'مجاني' : `${course.price} ر.س`}
                      </span>
                    </div>
                  </div>

                  <div className="absolute top-0 left-0 w-8 h-8 border-t border-l border-transparent group-hover:border-primary/50 transition-colors" />
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b border-r border-transparent group-hover:border-primary/50 transition-colors" />
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass">
              <p className="text-5xl mb-6 opacity-30">&#9881;</p>
              <p className="text-white/50 font-display text-xl tracking-widest uppercase">سيتم إضافة المواد قريباً</p>
              <p className="text-white/30 text-sm mt-2 font-mono-text">تابعنا للحصول على أحدث الوحدات التقنية</p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/courses"
              className="accent-button inline-block font-display text-lg tracking-widest px-10 py-3 text-white uppercase shadow-[0_0_20px_rgba(255,79,0,0.3)]"
            >
              عرض جميع المواد
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background relative">
        <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="font-display text-4xl md:text-6xl text-white tracking-tighter mb-4">
              لماذا <span className="text-glow text-primary">أكاديمية أحمد</span>؟
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '&#9881;', title: 'وحدات تقنية متقدمة', desc: 'مواد مصممة بدقة هندسية من قبل خبراء في الأنظمة التقنية' },
              { icon: '&#128421;', title: 'تعلم في أي مكان', desc: 'منصة متوافقة مع جميع الأجهزة — تعلم في أي وقت ومن أي مكان' },
              { icon: '&#128295;', title: 'مخططات عملية', desc: 'مشاريع تطبيقية حقيقية مع مخططات ورسوم هندسية تفصيلية' },
            ].map((feature, i) => (
              <div key={i} className="glass p-8 border-r-2 border-r-primary/50 hover:border-r-primary transition-colors">
                <div className="text-4xl mb-4 text-primary" dangerouslySetInnerHTML={{ __html: feature.icon }} />
                <h3 className="font-display text-xl text-white tracking-tight mb-2">{feature.title}</h3>
                <p className="text-white/40 text-sm font-mono-text leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
