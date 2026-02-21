import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getCourse(slug: string) {
  try {
    return await prisma.course.findUnique({
      where: { slug },
      include: {
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
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white mb-8">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm bg-white/20 px-3 py-1 rounded-full">
                  {course.level === 'BEGINNER' ? 'مبتدئ' : course.level === 'INTERMEDIATE' ? 'متوسط' : 'متقدم'}
                </span>
                {course.category && (
                  <span className="text-sm bg-white/20 px-3 py-1 rounded-full">{course.category}</span>
                )}
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4">{course.title}</h1>
              <p className="text-blue-100 text-lg">{course.shortDescription || course.description}</p>
              <div className="flex items-center gap-6 mt-6 text-blue-100">
                <span>{course._count.enrollments} طالب</span>
                {course.durationHours && <span>{course.durationHours} ساعة</span>}
                <span>{course.lessons.length} درس</span>
              </div>
            </div>

            {course.description && (
              <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-8">
                <h2 className="text-xl font-bold text-neutral-800 mb-4">وصف الدورة</h2>
                <p className="text-neutral-600 leading-relaxed whitespace-pre-line">{course.description}</p>
              </div>
            )}

            <div className="bg-white rounded-xl border border-neutral-200 p-6">
              <h2 className="text-xl font-bold text-neutral-800 mb-4">محتوى الدورة</h2>
              {course.lessons.length > 0 ? (
                <div className="space-y-3">
                  {course.lessons.map((lesson, index) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <div>
                          <h3 className="font-medium text-neutral-800">{lesson.title}</h3>
                          {lesson.durationMinutes && (
                            <span className="text-sm text-neutral-400">{lesson.durationMinutes} دقيقة</span>
                          )}
                        </div>
                      </div>
                      {lesson.isPreview && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">مجاني</span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-neutral-500 text-center py-4">سيتم إضافة الدروس قريباً</p>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 bg-white rounded-xl border border-neutral-200 p-6 shadow-lg">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-neutral-800 mb-1">
                  {course.isFree ? 'مجاني' : `${course.price} ر.س`}
                </div>
              </div>
              <Link
                href="/login"
                className="block w-full bg-primary text-white py-3 rounded-lg font-bold text-center hover:bg-blue-700 transition-colors mb-4"
              >
                سجّل الآن
              </Link>
              <div className="space-y-3 text-sm text-neutral-500">
                <div className="flex justify-between">
                  <span>عدد الدروس</span>
                  <span className="font-medium text-neutral-700">{course.lessons.length}</span>
                </div>
                {course.durationHours && (
                  <div className="flex justify-between">
                    <span>المدة</span>
                    <span className="font-medium text-neutral-700">{course.durationHours} ساعة</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>المستوى</span>
                  <span className="font-medium text-neutral-700">
                    {course.level === 'BEGINNER' ? 'مبتدئ' : course.level === 'INTERMEDIATE' ? 'متوسط' : 'متقدم'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>عدد الطلاب</span>
                  <span className="font-medium text-neutral-700">{course._count.enrollments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
