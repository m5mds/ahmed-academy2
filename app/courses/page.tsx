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
    <div className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">جميع الدورات</h1>
          <p className="text-neutral-500 text-lg">اكتشف دوراتنا التعليمية واختر المناسب لك</p>
        </div>

        {courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                key={course.id}
                href={`/courses/${course.slug}`}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden group border border-neutral-100"
              >
                <div className="h-48 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center">
                  <span className="text-6xl text-white/30">📚</span>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                      {course.level === 'BEGINNER' ? 'مبتدئ' : course.level === 'INTERMEDIATE' ? 'متوسط' : 'متقدم'}
                    </span>
                    {course.isFree && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">مجاني</span>
                    )}
                  </div>
                  <h3 className="font-bold text-lg text-neutral-800 mb-2 group-hover:text-primary transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-neutral-500 text-sm mb-4 line-clamp-2">
                    {course.shortDescription || course.description || 'دورة تعليمية متميزة'}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-400">
                      {course._count.enrollments} طالب
                    </span>
                    <span className="font-bold text-primary">
                      {course.isFree ? 'مجاني' : `${course.price} ر.س`}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-neutral-50 rounded-xl">
            <p className="text-6xl mb-4">📚</p>
            <h2 className="text-xl font-bold text-neutral-700 mb-2">لا توجد دورات حالياً</h2>
            <p className="text-neutral-500">سيتم إضافة دورات جديدة قريباً</p>
          </div>
        )}
      </div>
    </div>
  )
}
