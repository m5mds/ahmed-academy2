import Link from 'next/link'
import { prisma } from '@/lib/db'
import MaterialCard from '@/components/ui/MaterialCard'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const dynamic = 'force-dynamic'

async function getMaterials() {
  try {
    return await prisma.material.findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      include: { _count: { select: { enrollments: true } } },
    })
  } catch {
    return []
  }
}

export default async function MaterialsPage() {
  const materials = await getMaterials()

  const categorySet = new Set<string>()
  materials.forEach(m => categorySet.add(m.category || 'GENERAL ENGINEERING'))
  const categories = Array.from(categorySet)

  return (
    <div className="min-h-screen bg-white pt-28 pb-24 relative overflow-hidden">
      <div className="absolute inset-0 academic-grid opacity-5 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10">
        <div className="mb-20 border-r-8 border-[#1A2B4C] pr-10">
          <span className="font-mono-text text-[#FF4F00] tracking-[0.4em] uppercase text-[10px] mb-4 block font-bold">Academic Registry 2026</span>
          <h1 className="font-display text-6xl md:text-8xl text-[#1A2B4C] leading-none mb-8 uppercase">
            المواد التقنية
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl leading-relaxed font-arabic">
            الفهرس المرجعي للمواد الهندسية المعتمدة. كل وحدة تدريبية تخضع لمعايير الجودة الصارمة لضمان نقل المعرفة التقنية بأعلى دقة ممكنة.
          </p>
        </div>

        {categories.length > 0 ? (
          categories.map((cat, catIdx) => {
            const catMaterials = materials.filter(m => (m.category || 'GENERAL ENGINEERING') === cat)
            if (catMaterials.length === 0) return null

            return (
              <div key={cat} className="mb-32">
                <ScrollReveal delay={catIdx * 100}>
                  <div className="flex items-center gap-6 mb-12 flex-row-reverse md:flex-row">
                    <h2 className="font-display text-4xl text-[#1A2B4C] uppercase tracking-wider">{cat}</h2>
                    <div className="flex-1 h-[1px] bg-gray-100" />
                    <span className="font-mono-text text-[10px] text-gray-300">MOD: {catMaterials.length}</span>
                  </div>
                </ScrollReveal>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {catMaterials.map((material, idx) => (
                    <ScrollReveal key={material.id} delay={idx * 50}>
                      <MaterialCard
                        id={material.id}
                        title={material.title}
                        slug={material.slug}
                        description={material.shortDescription || material.description || ''}
                        idx={idx}
                        category={material.category || cat}
                        level={material.level}
                        price={material.price ? Number(material.price) : undefined}
                        isFree={material.isFree}
                      />
                    </ScrollReveal>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-40 border-2 border-dashed border-gray-100">
            <p className="text-gray-300 font-display text-3xl uppercase tracking-widest">Database Empty: No Resources Found</p>
          </div>
        )}
      </div>
    </div>
  )
}

