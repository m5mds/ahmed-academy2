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

  const categorySet = new Set<string>()
  courses.forEach(c => categorySet.add(c.category || 'عام'))
  const categories = Array.from(categorySet)

  return (
    <div className="min-h-screen bg-white pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="mb-16 border-b border-gray-200 pb-12">
          <span className="font-mono-text text-[#FF4F00] tracking-[0.3em] uppercase text-xs mb-4 block">الفهرس الأكاديمي</span>
          <h1 className="font-display text-5xl md:text-7xl text-[#1A2B4C] leading-none mb-6">
            المناهج والمواد الدراسية
          </h1>
          <p className="text-gray-500 text-sm max-w-2xl leading-relaxed">
            استكشف المواد الهندسية المتخصصة المصنفة حسب الأقسام الأكاديمية. كل مادة مصممة لتوفير رحلة تعليمية متكاملة من الأساسيات إلى المستويات المتقدمة.
          </p>
        </div>

        {categories.length > 0 ? (
          categories.map((cat) => {
            const catCourses = courses.filter(c => (c.category || 'عام') === cat)
            if (catCourses.length === 0) return null

            return (
              <div key={cat} className="mb-20">
                <div className="flex items-center gap-4 mb-10">
                  <h2 className="font-display text-3xl text-[#1A2B4C] uppercase tracking-tight">{cat}</h2>
                  <div className="flex-1 h-[1px] bg-gray-200" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200">
                  {catCourses.map((course, idx) => (
                    <Link
                      key={course.id}
                      href={`/courses/${course.slug}`}
                      className="group bg-white border-r border-b border-gray-200 p-8 hover:bg-gray-50 transition-all block"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-center mb-2">
                          <span className="bg-[#1A2B4C]/5 px-2 py-1 text-[#1A2B4C] font-mono-text text-[10px] tracking-widest uppercase font-bold">
                            {course.level === 'BEGINNER' ? 'تأسيسي' : 'متقدم'}
                          </span>
                          {course.isFree && (
                            <span className="text-emerald-600 font-mono-text text-[10px] uppercase font-bold">مجاني</span>
                          )}
                        </div>
                        <h3 className="font-display text-2xl text-[#1A2B4C] leading-tight group-hover:underline underline-offset-4">
                          {course.title}
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                          {course.shortDescription || course.description}
                        </p>
                        <div className="pt-6 flex items-center justify-between border-t border-gray-100">
                          <span className="text-gray-400 text-xs">
                            {course._count.enrollments} طالب مسجل
                          </span>
                          <span className="font-display text-lg text-[#1A2B4C]">
                            {course.isFree ? 'مجاني' : `${course.price} ر.س`}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-20 border border-dashed border-gray-200">
            <p className="text-gray-400 font-display text-xl">لا توجد مواد مسجلة حالياً في النظام الأكاديمي</p>
          </div>
        )}
      </div>
    </div>
  )
}
