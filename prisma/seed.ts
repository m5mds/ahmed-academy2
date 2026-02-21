const pg = require('pg')
const { PrismaPg } = require('@prisma/adapter-pg')
const { PrismaClient } = require('../lib/generated/prisma')
const bcrypt = require('bcrypt')

async function main() {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('DATABASE_URL is not set')
  }

  const pool = new pg.Pool({ connectionString })
  const adapter = new PrismaPg(pool)
  const prisma = new PrismaClient({ adapter })

  try {
    const adminEmail = process.env.ADMIN_EMAIL_1 || 'admin@ahmedacademy.com'
    const adminPassword = process.env.ADMIN_PASSWORD_1 || 'adminpassword'

    const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } })
    if (!existingAdmin) {
      const passwordHash = await bcrypt.hash(adminPassword, 10)
      await prisma.user.create({
        data: {
          name: 'المدير',
          email: adminEmail,
          passwordHash,
          role: 'ADMIN',
        },
      })
      console.log(`Admin user created: ${adminEmail}`)
    } else {
      console.log('Admin user already exists')
    }

    const existingCourse = await prisma.course.findFirst()
    if (!existingCourse) {
      await prisma.course.create({
        data: {
          slug: 'arabic-fundamentals',
          title: 'أساسيات اللغة العربية',
          description: 'دورة شاملة لتعلم أساسيات اللغة العربية من الصفر. تشمل الدورة قواعد النحو والصرف، المفردات الأساسية، والمحادثة اليومية.',
          shortDescription: 'تعلم أساسيات اللغة العربية من الصفر وحتى الاحتراف',
          isFree: true,
          isPublished: true,
          level: 'BEGINNER',
          category: 'أساسيات',
          durationHours: 20,
          lessons: {
            create: [
              { title: 'مقدمة في اللغة العربية', orderIndex: 1, isPreview: true, durationMinutes: 15 },
              { title: 'الحروف الأبجدية', orderIndex: 2, isPreview: true, durationMinutes: 30 },
              { title: 'الحركات والتنوين', orderIndex: 3, durationMinutes: 25 },
              { title: 'الأسماء والأفعال', orderIndex: 4, durationMinutes: 35 },
              { title: 'الجملة الاسمية', orderIndex: 5, durationMinutes: 40 },
            ],
          },
        },
      })

      await prisma.course.create({
        data: {
          slug: 'arabic-grammar',
          title: 'قواعد النحو العربي',
          description: 'دورة متقدمة في قواعد النحو العربي. تغطي الدورة جميع قواعد النحو من المبتدأ والخبر إلى الإعراب والبناء.',
          shortDescription: 'إتقان قواعد النحو العربي بأسلوب مبسط',
          price: 199,
          isFree: false,
          isPublished: true,
          level: 'INTERMEDIATE',
          category: 'نحو',
          durationHours: 35,
          lessons: {
            create: [
              { title: 'المبتدأ والخبر', orderIndex: 1, isPreview: true, durationMinutes: 30 },
              { title: 'الفعل والفاعل', orderIndex: 2, durationMinutes: 35 },
              { title: 'المفعول به', orderIndex: 3, durationMinutes: 25 },
              { title: 'الحال والتمييز', orderIndex: 4, durationMinutes: 30 },
            ],
          },
        },
      })

      await prisma.course.create({
        data: {
          slug: 'arabic-conversation',
          title: 'المحادثة باللغة العربية',
          description: 'تعلم المحادثة باللغة العربية الفصحى والعامية. دورة عملية تركز على مهارات التحدث والاستماع.',
          shortDescription: 'طوّر مهارات المحادثة باللغة العربية',
          price: 149,
          isFree: false,
          isPublished: true,
          level: 'BEGINNER',
          category: 'محادثة',
          durationHours: 15,
          lessons: {
            create: [
              { title: 'التحية والتعارف', orderIndex: 1, isPreview: true, durationMinutes: 20 },
              { title: 'التسوق والمطاعم', orderIndex: 2, durationMinutes: 25 },
              { title: 'السفر والسياحة', orderIndex: 3, durationMinutes: 30 },
            ],
          },
        },
      })

      console.log('Sample courses created')
    } else {
      console.log('Courses already exist')
    }
  } finally {
    await prisma.$disconnect()
    await pool.end()
  }
}

main().catch(console.error)
