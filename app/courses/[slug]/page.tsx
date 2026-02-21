import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getCourse(slug: string) {
  try {
    return await prisma.course.findUnique({
      where: { slug },
      include: {
        chapters: {
          orderBy: { orderIndex: 'asc' },
          include: { lessons: { orderBy: { orderIndex: 'asc' } } },
        },
        lessons: { orderBy: { orderIndex: 'asc' } },
        _count: { select: { enrollments: true } },
      },
    })
  } catch {
    return null
  }
}

export default async function CourseDetailPage({ params }: { params: { slug: string } }) {
  const course = await getCourse(params.slug)

  if (!course) {
    notFound()
  }

  return (
    <div className="py-12 bg-background min-h-screen pt-28 relative">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="glass p-8 border-r-4 border-r-primary mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-primary px-3 py-1 font-display text-xs tracking-widest uppercase text-white">
                  {course.level === 'BEGINNER' ? 'تأسيسي' : course.level === 'INTERMEDIATE' ? 'متقدم' : 'احترافي'}
                </span>
                {course.category && (
                  <span className="bg-white/10 px-3 py-1 font-display text-xs tracking-widest uppercase text-white/60">{course.category}</span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-white tracking-tighter mb-4">{course.title}</h1>
              <p className="text-white/50 text-base font-mono-text">{course.shortDescription || course.description}</p>
              <div className="flex items-center gap-6 mt-6 text-white/40 font-display text-sm tracking-widest uppercase">
                <span>{course._count.enrollments} طالب</span>
                {course.durationHours && <span>{course.durationHours} ساعة</span>}
                <span>{course.lessons.length} درس</span>
              </div>
            </div>

            {course.description && (
              <div className="glass p-6 mb-8">
                <h2 className="font-display text-xl text-white tracking-tighter mb-4 border-b border-white/10 pb-3">وصف المادة</h2>
                <p className="text-white/50 leading-relaxed whitespace-pre-line font-mono-text text-sm">{course.description}</p>
              </div>
            )}

            <div className="glass p-6">
              <h2 className="font-display text-xl text-white tracking-tighter mb-4 border-b border-white/10 pb-3">محتوى المادة</h2>
              {course.chapters.length > 0 ? (
                <div className="space-y-4">
                  {course.chapters.map((chapter) => (
                    <div key={chapter.id} className="border border-white/5">
                      <div className="flex items-center gap-3 p-4 bg-white/5">
                        <div className="w-1 h-6 bg-primary" />
                        <h3 className="font-display text-lg text-white tracking-tight">{chapter.title}</h3>
                        <span className="bg-primary/10 text-primary px-2 py-0.5 font-display text-xs tracking-widest uppercase">{chapter.tier}</span>
                      </div>
                      <div className="divide-y divide-white/5">
                        {chapter.lessons.map((lesson, idx) => (
                          <div key={lesson.id} className="flex items-center justify-between px-6 py-3">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 bg-primary/10 text-primary flex items-center justify-center text-xs font-display">{idx + 1}</span>
                              <span className="text-white/60 text-sm font-mono-text">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {lesson.durationMinutes && (
                                <span className="text-white/30 text-xs font-mono-text">{lesson.durationMinutes} د</span>
                              )}
                              {lesson.isPreview && (
                                <span className="bg-primary/10 text-primary px-2 py-0.5 text-xs font-display tracking-widest">مجاني</span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : course.lessons.length > 0 ? (
                <div className="space-y-2">
                  {course.lessons.map((lesson, index) => (
                    <div key={lesson.id} className="flex items-center justify-between p-4 border border-white/5 hover:border-primary/20 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-primary/10 text-primary flex items-center justify-center text-sm font-display">{index + 1}</span>
                        <div>
                          <span className="text-white/70 text-sm font-mono-text">{lesson.title}</span>
                          {lesson.durationMinutes && (
                            <span className="text-white/30 text-xs mr-3 font-mono-text">{lesson.durationMinutes} دقيقة</span>
                          )}
                        </div>
                      </div>
                      {lesson.isPreview && (
                        <span className="bg-primary/10 text-primary px-2 py-0.5 text-xs font-display tracking-widest">مجاني</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-white/40 text-center py-6 font-mono-text text-sm">سيتم إضافة الدروس قريباً</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 glass p-6 border-t-2 border-t-primary">
              <div className="text-center mb-6">
                <div className="font-display text-4xl text-white mb-1">
                  {course.isFree ? 'مجاني' : `${course.price} ر.س`}
                </div>
              </div>
              <Link
                href="/login"
                className="block w-full accent-button font-display text-lg tracking-widest uppercase py-3 text-white text-center shadow-[0_0_20px_rgba(255,79,0,0.3)] mb-6"
              >
                سجّل الآن
              </Link>
              <div className="space-y-4 text-sm font-mono-text">
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/40">عدد الدروس</span>
                  <span className="text-white/70">{course.lessons.length}</span>
                </div>
                {course.durationHours && (
                  <div className="flex justify-between border-b border-white/5 pb-3">
                    <span className="text-white/40">المدة</span>
                    <span className="text-white/70">{course.durationHours} ساعة</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-white/40">المستوى</span>
                  <span className="text-white/70">
                    {course.level === 'BEGINNER' ? 'تأسيسي' : course.level === 'INTERMEDIATE' ? 'متقدم' : 'احترافي'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/40">عدد الطلاب</span>
                  <span className="text-white/70">{course._count.enrollments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
