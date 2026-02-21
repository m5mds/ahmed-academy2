import Link from 'next/link'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

async function getCourses() {
  try {
    return await prisma.course.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { enrollments: true } } },
    })
  } catch {
    return []
  }
}

export default async function CoursesPage() {
  const courses = await getCourses()

  return (
    <div className="py-12 md:py-16 bg-background min-h-screen pt-28 relative">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-16">
          <span className="font-display text-primary tracking-[0.4em] uppercase text-sm mb-4 block">المنهج التعليمي</span>
          <h1 className="font-display text-5xl md:text-7xl text-white tracking-tighter leading-none mb-4">
            جميع <span className="text-glow">المواد</span>
          </h1>
          <p className="text-white/40 font-mono-text text-sm tracking-wide">اكتشف الوحدات التقنية واختر المسار المناسب لك</p>
          <div className="w-32 h-[2px] bg-primary mt-6 shadow-[0_0_10px_rgba(255,79,0,0.8)]" />
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
            <h2 className="font-display text-2xl text-white tracking-tighter uppercase mb-2">لا توجد مواد حالياً</h2>
            <p className="text-white/40 font-mono-text text-sm">سيتم إضافة وحدات تقنية جديدة قريباً</p>
          </div>
        )}
      </div>
    </div>
  )
}
