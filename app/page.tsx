import Link from 'next/link'
import { prisma } from '@/lib/db'
import HomeClient from '@/components/HomeClient'

export const dynamic = 'force-dynamic'

async function getFeaturedMaterials() {
  try {
    return await prisma.material.findMany({
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
  const materials = await getFeaturedMaterials()

  const serializedMaterials = materials.map(m => ({
    id: m.id,
    title: m.title,
    slug: m.slug,
    description: m.description,
    shortDescription: m.shortDescription,
    level: m.level,
    price: m.price ? Number(m.price) : null,
    isFree: m.isFree,
    category: m.category,
    _count: { enrollments: m._count.enrollments },
  }))

  return <HomeClient materials={serializedMaterials} />
}
