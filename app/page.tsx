import Link from 'next/link'
import { prisma } from '@/lib/db'
import HomeClient from '@/components/HomeClient'

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

  const serializedCourses = courses.map(c => ({
    id: c.id,
    title: c.title,
    slug: c.slug,
    description: c.description,
    shortDescription: c.shortDescription,
    level: c.level,
    price: c.price ? Number(c.price) : null,
    isFree: c.isFree,
    category: c.category,
    _count: { enrollments: c._count.enrollments },
  }))

  return <HomeClient courses={serializedCourses} />
}
