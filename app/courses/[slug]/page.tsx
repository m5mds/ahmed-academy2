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
    <div className="min-h-screen bg-white pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-[#F3F4F6] p-8 border-r-4 border-r-[#1A2B4C] mb-8">
              <div className="flex items-center gap-3 mb-4">
                <span className="bg-[#1A2B4C] px-3 py-1 text-xs tracking-widest uppercase text-white">
                  {course.level === 'BEGINNER' ? 'تأسيسي' : course.level === 'INTERMEDIATE' ? 'متقدم' : 'احترافي'}
                </span>
                {course.category && (
                  <span className="bg-gray-200 px-3 py-1 text-xs tracking-widest uppercase text-gray-600">{course.category}</span>
                )}
              </div>
              <h1 className="font-display text-4xl md:text-5xl text-[#1A2B4C] mb-4">{course.title}</h1>
              <p className="text-gray-500 text-base">{course.shortDescription || course.description}</p>
              <div className="flex items-center gap-6 mt-6 text-gray-400 text-sm">
                <span>{course._count.enrollments} طالب</span>
                {course.durationHours && <span>{course.durationHours} ساعة</span>}
                <span>{course.lessons.length} درس</span>
              </div>
            </div>

            {course.description && (
              <div className="bg-white border border-gray-200 p-6 mb-8">
                <h2 className="font-display text-xl text-[#1A2B4C] mb-4 border-b border-gray-100 pb-3">وصف المادة</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{course.description}</p>
              </div>
            )}

            <div className="bg-white border border-gray-200 p-6">
              <h2 className="font-display text-xl text-[#1A2B4C] mb-4 border-b border-gray-100 pb-3">محتوى المادة</h2>
              {course.chapters.length > 0 ? (
                <div className="space-y-4">
                  {course.chapters.map((chapter) => (
                    <div key={chapter.id} className="border border-gray-100">
                      <div className="flex items-center gap-3 p-4 bg-gray-50">
                        <div className="w-1 h-6 bg-[#1A2B4C]" />
                        <h3 className="font-display text-lg text-[#1A2B4C]">{chapter.title}</h3>
                        <span className="bg-blue-50 text-[#1A2B4C] px-2 py-0.5 text-xs">{chapter.tier}</span>
                      </div>
                      <div className="divide-y divide-gray-50">
                        {chapter.lessons.map((lesson, idx) => (
                          <div key={lesson.id} className="flex items-center justify-between px-6 py-3">
                            <div className="flex items-center gap-3">
                              <span className="w-7 h-7 bg-blue-50 text-[#1A2B4C] flex items-center justify-center text-xs">{idx + 1}</span>
                              <span className="text-gray-600 text-sm">{lesson.title}</span>
                            </div>
                            <div className="flex items-center gap-3">
                              {lesson.durationMinutes && (
                                <span className="text-gray-400 text-xs font-mono-text">{lesson.durationMinutes} د</span>
                              )}
                              {lesson.isPreview && (
                                <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 text-xs">مجاني</span>
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
                    <div key={lesson.id} className="flex items-center justify-between p-4 border border-gray-100 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 bg-blue-50 text-[#1A2B4C] flex items-center justify-center text-sm">{index + 1}</span>
                        <div>
                          <span className="text-gray-700 text-sm">{lesson.title}</span>
                          {lesson.durationMinutes && (
                            <span className="text-gray-400 text-xs mr-3 font-mono-text">{lesson.durationMinutes} دقيقة</span>
                          )}
                        </div>
                      </div>
                      {lesson.isPreview && (
                        <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 text-xs">مجاني</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-center py-6 text-sm">سيتم إضافة الدروس قريباً</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-200 p-6 border-t-4 border-t-[#1A2B4C]">
              <div className="text-center mb-6">
                <div className="font-display text-4xl text-[#1A2B4C] mb-1">
                  {course.isFree ? 'مجاني' : `${course.price} ر.س`}
                </div>
              </div>
              <Link
                href="/login"
                className="block w-full bg-[#1A2B4C] text-lg py-3 text-white text-center hover:bg-[#1A2B4C]/90 transition-colors mb-6"
              >
                سجّل الآن
              </Link>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-400">عدد الدروس</span>
                  <span className="text-[#1A2B4C]">{course.lessons.length}</span>
                </div>
                {course.durationHours && (
                  <div className="flex justify-between border-b border-gray-100 pb-3">
                    <span className="text-gray-400">المدة</span>
                    <span className="text-[#1A2B4C]">{course.durationHours} ساعة</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-100 pb-3">
                  <span className="text-gray-400">المستوى</span>
                  <span className="text-[#1A2B4C]">
                    {course.level === 'BEGINNER' ? 'تأسيسي' : course.level === 'INTERMEDIATE' ? 'متقدم' : 'احترافي'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">عدد الطلاب</span>
                  <span className="text-[#1A2B4C]">{course._count.enrollments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
