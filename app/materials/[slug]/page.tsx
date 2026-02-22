import { prisma } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import MaterialCurriculum from '@/components/materials/MaterialCurriculum'
import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export const dynamic = 'force-dynamic'

async function getSession() {
  const token = cookies().get('session')?.value
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET || 'secret'))
    return payload as any
  } catch {
    return null
  }
}

async function getMaterial(slug: string) {
  try {
    return await prisma.material.findUnique({
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

async function getUserEnrollment(userId: string, materialId: string) {
  return await prisma.enrollment.findUnique({
    where: { userId_materialId: { userId, materialId } }
  })
}

export default async function MaterialDetailPage({ params }: { params: { slug: string } }) {
  const material = await getMaterial(params.slug)
  const session = await getSession()

  if (!material) {
    notFound()
  }

  let userTier = 'NONE'
  if (session) {
    const enrollment = await getUserEnrollment(session.id, material.id)
    if (enrollment) userTier = enrollment.tier
  }

  const isAdmin = session?.role === 'ADMIN' || session?.email === 'm7md7mshoo'

  return (
    <div className="min-h-screen bg-white pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="bg-gray-50 p-10 border-r-4 border-r-[#1A2B4C] mb-12 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <span className="bg-[#1A2B4C] px-3 py-1 text-[10px] tracking-[0.2em] font-mono-text uppercase text-white font-bold">
                  {material.level === 'BEGINNER' ? 'LEVEL: 01 / FOUNDATION' : material.level === 'INTERMEDIATE' ? 'LEVEL: 02 / ADVANCED' : 'LEVEL: 03 / EXPERT'}
                </span>
                {material.category && (
                  <span className="border border-gray-200 px-3 py-1 text-[10px] tracking-[0.2em] font-mono-text uppercase text-gray-400">{material.category}</span>
                )}
              </div>
              <h1 className="font-display text-5xl md:text-6xl text-[#1A2B4C] mb-6 uppercase leading-none">{material.title}</h1>
              <p className="text-gray-500 text-lg leading-relaxed max-w-2xl">{material.shortDescription || material.description}</p>
              <div className="flex items-center gap-8 mt-10 text-gray-400 font-mono-text text-[10px] uppercase tracking-widest">
                <span>Engaged: {material._count.enrollments} Students</span>
                {material.durationHours && <span>Hours: {material.durationHours} Units</span>}
                <span>Units: {material.lessons.length} Modules</span>
              </div>
            </div>

            {material.description && (
              <div className="bg-white border border-gray-100 p-8 mb-12">
                <h2 className="font-display text-2xl text-[#1A2B4C] mb-6 border-b border-gray-50 pb-4 uppercase tracking-wider underline underline-offset-8 decoration-[#FF4F00]">Technical Brief</h2>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm font-arabic">{material.description}</p>
              </div>
            )}

            <div className="mb-12">
              <h2 className="font-display text-2xl text-[#1A2B4C] mb-6 border-b border-gray-50 pb-4 uppercase tracking-wider underline underline-offset-8 decoration-[#FF4F00]">Engineering Curriculum</h2>
              <MaterialCurriculum
                chapters={material.chapters as any}
                userTier={userTier}
                isAdmin={isAdmin}
              />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-gray-100 p-10 border-t-8 border-t-[#1A2B4C] shadow-2xl">
              <div className="text-center mb-10">
                <p className="font-mono-text text-[9px] text-gray-400 uppercase tracking-[0.3em] mb-4">Investment Required</p>
                <div className="font-display text-6xl text-[#1A2B4C] mb-1">
                  {material.isFree ? 'FREE' : `${material.price} SAR`}
                </div>
              </div>

              {!session ? (
                <Link
                  href="/login"
                  className="block w-full bg-[#1A2B4C] text-2xl py-5 text-white text-center hover:bg-[#FF4F00] transition-all duration-300 mb-8 font-display uppercase tracking-widest"
                >
                  SECURE ACCESS
                </Link>
              ) : userTier === 'NONE' ? (
                <button
                  className="block w-full bg-[#1A2B4C] text-2xl py-5 text-white text-center hover:bg-[#FF4F00] transition-all duration-300 mb-8 font-display uppercase tracking-widest"
                >
                  ENROLL NOW
                </button>
              ) : (
                <Link
                  href="/content"
                  className="block w-full bg-[#FF4F00] text-2xl py-5 text-white text-center hover:bg-[#1A2B4C] transition-all duration-300 mb-8 font-display uppercase tracking-widest"
                >
                  CONTINUE STUDYING
                </Link>
              )}

              <div className="space-y-6 text-[10px] font-mono-text uppercase tracking-widest">
                <div className="flex justify-between border-b border-gray-50 pb-4">
                  <span className="text-gray-400">Project Modules</span>
                  <span className="text-[#1A2B4C] font-bold">{material.lessons.length}</span>
                </div>
                {material.durationHours && (
                  <div className="flex justify-between border-b border-gray-50 pb-4">
                    <span className="text-gray-400">Cycle Duration</span>
                    <span className="text-[#1A2B4C] font-bold">{material.durationHours} HR</span>
                  </div>
                )}
                <div className="flex justify-between border-b border-gray-50 pb-4">
                  <span className="text-gray-400">Difficulty Matrix</span>
                  <span className="text-[#1A2B4C] font-bold">
                    {material.level}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Active Licenses</span>
                  <span className="text-[#1A2B4C] font-bold">{material._count.enrollments}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

