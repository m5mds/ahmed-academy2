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

  const categories = ['Mechanical', 'Electrical', 'Civil', 'General']

  return (
    <div className="py-12 md:py-24 bg-white min-h-screen pt-32 relative">
      <div className="absolute inset-0 academic-grid opacity-10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-20 border-b border-gray-200 pb-12">
          <span className="font-mono-text text-[#FF4F00] tracking-[0.3em] uppercase text-xs mb-4 block">الفهرس الأكاديمي</span>
          <h1 className="font-display text-5xl md:text-7xl text-[#1A2B4C] tracking-tighter leading-none mb-6">
            المناهج والمواد الدراسية
          </h1>
          <p className="text-gray-500 font-mono-text text-sm max-w-2xl leading-relaxed">
            استكشف المواد الهندسية المتخصصة المصنفة حسب الأقسام الأكاديمية. كل مادة مصممة لتوفير رحلة تعليمية متكاملة من الأساسيات إلى المستويات المتقدمة.
          </p>
        </div>

        {categories.map((cat) => {
          const catCourses = courses.filter(c => c.category?.includes(cat) || (cat === 'General' && !c.category))
          if (catCourses.length === 0) return null

          return (
            <div key={cat} className="mb-24">
              <div className="flex items-center gap-4 mb-10">
                <h2 className="font-display text-3xl text-[#1A2B4C] uppercase tracking-tight">
                  {cat === 'Mechanical' ? 'قسم الهندسة الميكانيكية' : 
                   cat === 'Electrical' ? 'قسم الهندسة الكهربائية' : 
                   cat === 'Civil' ? 'قسم الهندسة المدنية' : 'المواد الهندسية العامة'}
                </h2>
                <div className="flex-1 h-[1px] bg-gray-200" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-t border-l border-gray-200">
                {catCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/courses/${course.slug}`}
                    className="group relative bg-white border-r border-b border-gray-200 p-8 transition-all hover:bg-gray-50 block"
                  >
                    <div className="space-y-4">
                      <div className="flex justify-between items-center mb-2">
                         <span className="bg-[#1A2B4C]/5 px-2 py-1 text-[#1A2B4C] font-mono-text text-[10px] tracking-widest uppercase font-bold">
                          {course.level === 'BEGINNER' ? 'LEVEL: 101' : 'LEVEL: 201'}
                        </span>
                        {course.isFree && (
                          <span className="text-[#FF4F00] font-mono-text text-[10px] uppercase font-bold">OPEN ACCESS</span>
                        )}
                      </div>
                      <h3 className="font-display text-2xl text-[#1A2B4C] leading-tight group-hover:underline underline-offset-4">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed font-mono-text line-clamp-2">
                        {course.shortDescription || course.description}
                      </p>
                      <div className="pt-6 flex items-center justify-between border-t border-gray-50">
                        <span className="text-gray-400 font-mono-text text-[10px] uppercase">
                          {course._count.enrollments} ENROLLED STUDENTS
                        </span>
                        <span className="font-display text-lg text-[#1A2B4C]">
                          {course.isFree ? '0.00 ر.س' : `${course.price} ر.س`}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })}

        {courses.length === 0 && (
          <div className="text-center py-20 border border-dashed border-gray-200">
            <p className="text-gray-400 font-display text-xl tracking-widest uppercase">لا توجد مواد مسجلة حالياً في النظام الأكاديمي</p>
          </div>
        )}
      </div>
    </div>
  )
}
