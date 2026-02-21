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
    include: { chapter: true, course: true },
  })

  if (!lesson) {
    return { allowed: false, reason: 'الدرس غير موجود' }
  }

  if (lesson.isPreview) {
    return { allowed: true }
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: lesson.courseId,
      },
    },
  })

  if (!enrollment) {
    return { allowed: false, reason: 'يجب الاشتراك في المادة أولاً' }
  }

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
    return { allowed: false, reason: 'هذا المحتوى مقفل حالياً' }
  }

  if (enrollment.expiresAt && new Date(enrollment.expiresAt) < new Date()) {
    return { allowed: false, reason: 'انتهت صلاحية اشتراكك. يرجى التجديد' }
  }

  const tierAllowed = checkTierEntitlement(enrollment.tier, lesson.tier)
  if (!tierAllowed) {
    return { allowed: false, reason: 'مستواك الحالي لا يسمح بالوصول لهذا الدرس' }
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
    return { locked: true, reason: 'محتوى مقفل' }
  }

  if (isExpired) {
    return { locked: true, reason: 'اشتراك منتهي' }
  }

  if (enrollmentTier && !checkTierEntitlement(enrollmentTier, lessonTier)) {
    return { locked: true, reason: 'غير مشمول في اشتراكك' }
  }

  return { locked: false }
}
