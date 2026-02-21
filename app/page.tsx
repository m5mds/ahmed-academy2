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
      <section className="bg-gradient-to-bl from-blue-600 via-blue-700 to-blue-900 text-white py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            تعلّم اللغة العربية
            <br />
            <span className="text-amber-400">باحترافية</span>
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            دورات تعليمية متميزة مصممة لتطوير مهاراتك في اللغة العربية من البداية وحتى الاحتراف
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/courses"
              className="bg-white text-blue-700 px-8 py-3 rounded-xl font-bold text-lg hover:bg-blue-50 transition-colors"
            >
              تصفح الدورات
            </Link>
            <Link
              href="/register"
              className="border-2 border-white text-white px-8 py-3 rounded-xl font-bold text-lg hover:bg-white/10 transition-colors"
            >
              سجّل مجاناً
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '١٠٠٠+', label: 'طالب مسجل' },
              { value: '٥٠+', label: 'درس تعليمي' },
              { value: '١٠+', label: 'دورة متخصصة' },
              { value: '٤.٨', label: 'تقييم الطلاب' },
            ].map((stat, i) => (
              <div key={i} className="text-center p-6 bg-white rounded-xl shadow-sm">
                <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                <div className="text-neutral-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">الدورات المتاحة</h2>
            <p className="text-neutral-500 text-lg">اختر الدورة المناسبة لمستواك وابدأ رحلة التعلم</p>
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
            <div className="text-center py-12 bg-neutral-50 rounded-xl">
              <p className="text-6xl mb-4">📚</p>
              <p className="text-neutral-500 text-lg">سيتم إضافة الدورات قريباً</p>
              <p className="text-neutral-400 text-sm mt-2">تابعنا للحصول على أحدث الدورات التعليمية</p>
            </div>
          )}

          <div className="text-center mt-8">
            <Link
              href="/courses"
              className="inline-block bg-primary text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
            >
              عرض جميع الدورات
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-4">لماذا أكاديمية أحمد؟</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: '🎓', title: 'محتوى احترافي', desc: 'دورات مصممة بعناية من قبل خبراء في تعليم اللغة العربية' },
              { icon: '📱', title: 'تعلم في أي مكان', desc: 'منصة متوافقة مع جميع الأجهزة - تعلم في أي وقت ومن أي مكان' },
              { icon: '📜', title: 'شهادات معتمدة', desc: 'احصل على شهادة عند إتمام كل دورة لتعزيز سيرتك الذاتية' },
            ].map((feature, i) => (
              <div key={i} className="text-center p-8 bg-white rounded-xl shadow-sm">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-neutral-800 mb-2">{feature.title}</h3>
                <p className="text-neutral-500">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
