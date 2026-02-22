import { prisma } from './db'

export interface AccessCheckResult {
  allowed: boolean
  reason?: string
}

export async function checkLessonAccess(
  userId: string,
  lessonId: string
): Promise<AccessCheckResult> {
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: true, material: true },
  })

  if (!lesson) {
    return { allowed: false, reason: 'Technical Error: Unit not identified.' }
  }

  // 1. Preview Entitlement
  if (lesson.isPreview) {
    return { allowed: true }
  }

  // 2. Enrollment Verification
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_materialId: {
        userId,
        materialId: lesson.materialId,
      },
    },
  })

  if (!enrollment) {
    return { allowed: false, reason: 'Access Denied: Enrollment required.' }
  }

  // 3. Subscription Expiry Protocol
  if (enrollment.expiresAt && new Date(enrollment.expiresAt) < new Date()) {
    return { allowed: false, reason: 'Cycle Expired: Subscription renewal required.' }
  }

  // 4. Per-Student Implementation Override (Unlocks content even if global lock exists)
  const perStudentUnlock = await prisma.contentLock.findFirst({
    where: {
      scope: 'PER_STUDENT',
      studentId: userId,
      locked: false,
      OR: [
        { level: 'LESSON', targetId: lessonId },
        ...(lesson.chapterId
          ? [{ level: 'CHAPTER' as const, targetId: lesson.chapterId }]
          : []),
        { level: 'TIER', targetId: lesson.tier },
      ],
    },
  })

  if (perStudentUnlock) {
    return { allowed: true }
  }

  // 5. Global System Lock Check
  const globalLocks = await prisma.contentLock.findMany({
    where: {
      scope: 'GLOBAL',
      locked: true,
      OR: [
        { level: 'LESSON', targetId: lessonId },
        ...(lesson.chapterId
          ? [{ level: 'CHAPTER' as const, targetId: lesson.chapterId }]
          : []),
        { level: 'TIER', targetId: lesson.tier },
      ],
    },
  })

  if (globalLocks.length > 0) {
    return { allowed: false, reason: 'System Lock: Content currently restricted by HQ.' }
  }

  // 6. Tier Entitlement Matrix
  const tierAllowed = checkTierEntitlement(enrollment.tier, lesson.tier)
  if (!tierAllowed) {
    return { allowed: false, reason: 'Tier Mismatch: Access restricted to authorized levels.' }
  }

  return { allowed: true }
}

function checkTierEntitlement(userTier: string, contentTier: string): boolean {
  if (userTier === 'FULL') return true
  if (contentTier === userTier) return true
  return false
}

export async function getContentLockStatus(
  userId: string,
  lessonId: string,
  lessonTier: string,
  chapterId: string | null,
  enrollmentTier: string | null,
  isExpired: boolean
): Promise<{ locked: boolean; reason?: string }> {
  if (isExpired) {
    return { locked: true, reason: 'Subscription Expired' }
  }

  const perStudentUnlock = await prisma.contentLock.findFirst({
    where: {
      scope: 'PER_STUDENT',
      studentId: userId,
      locked: false,
      OR: [
        { level: 'LESSON', targetId: lessonId },
        ...(chapterId ? [{ level: 'CHAPTER' as const, targetId: chapterId }] : []),
        { level: 'TIER', targetId: lessonTier },
      ],
    },
  })

  if (perStudentUnlock) {
    return { locked: false }
  }

  const globalLock = await prisma.contentLock.findFirst({
    where: {
      scope: 'GLOBAL',
      locked: true,
      OR: [
        { level: 'LESSON', targetId: lessonId },
        ...(chapterId ? [{ level: 'CHAPTER' as const, targetId: chapterId }] : []),
        { level: 'TIER', targetId: lessonTier },
      ],
    },
  })

  if (globalLock) {
    return { locked: true, reason: 'System Lock' }
  }

  if (enrollmentTier && !checkTierEntitlement(enrollmentTier, lessonTier)) {
    return { locked: true, reason: 'Tier Restricted' }
  }

  return { locked: false }
}

