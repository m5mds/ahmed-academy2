# Arabic Academy (أكاديمية أحمد)

## Overview
A formal Engineering Academy platform built with Next.js 14 (App Router), Prisma ORM with PostgreSQL, and Tailwind CSS. The platform features a Professional Academic design system (Light Mode, Navy Blue #1A2B4C headings, textbook-style UI, technical blueprint graphics), RTL layout, JWT authentication, tiered subscription model, and multi-level content locking.

## Recent Changes
- **Feb 21, 2026**: Transitioned to professional Light-Mode Academic UI. Replaced Dark-Industrial theme with Navy Blue (#1A2B4C) and White palette. Refactored Hero to a formal split-layout with technical blueprints.
- **Feb 21, 2026**: Refined all content to remove marketing slogans. Updated terminology to formal academic headers (e.g., 'أكاديمية أحمد للعلوم الهندسية المتقدمة'). Removed all certificate references.
- **Feb 21, 2026**: Restructured materials section by engineering sub-disciplines (Mechanical, Electrical, Civil) with a textbook-style grid layout.
- **Feb 21, 2026**: Cleaned up project dependencies and removed conflicting pages/ directory.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Replit built-in)
- **Styling**: Tailwind CSS (Academic Light Theme)
- **Fonts**: Cairo (Arabic body), Bebas Neue (Headers), JetBrains Mono (Technical)

## Design System — Professional Academic
- **Background**: #FFFFFF (White)
- **Primary/Heading**: #1A2B4C (Navy Blue)
- **Accent**: #FF4F00 (Safety Orange - minimal use)
- **Border**: #E5E7EB (Light Grey)
- **Layout**: Split Hero, Bordered Grid, RTL support
- **Terminology**: مادة (Material), منهج (Curriculum), استفسار أكاديمي (Academic Inquiry)

## Project Architecture

### Directory Structure
```
app/                    # Next.js App Router pages
  (auth)/               # Auth pages (login, register)
  (student)/            # Student dashboard & content page
  admin/                # Admin dashboard & content management
  courses/              # Material listing & details
  api/                  # API routes
    auth/               # Auth endpoints
    admin/              # Admin APIs (chapters, locks, content, stats)
    content/            # Student content APIs (chapters, video)
    courses/            # Course APIs
    dashboard/          # Dashboard APIs
components/             # React components
  layout/               # Header, Footer
lib/                    # Utilities
  auth.ts               # JWT sign/verify functions
  auth-server.ts        # Server-side token extraction
  db.ts                 # Prisma client with PrismaPg adapter
  api.ts                # Client-side API helper
  access-control.ts     # Multi-level lock check logic
  content-protection.ts # Cloudflare Stream signed URLs
  utils.ts              # General utilities
  generated/prisma/     # Generated Prisma client (gitignored)
prisma/
  schema.prisma         # Database schema
  seed.ts               # Database seed script
```

### Key Configuration
- **Port**: 5000 (frontend, bound to 0.0.0.0)
- **Database**: Replit PostgreSQL via DATABASE_URL env var
- **Prisma**: Uses prisma.config.ts with PrismaPg adapter (Prisma 7 pattern - no URL in schema)

### Environment Variables
- `DATABASE_URL` - PostgreSQL connection string (auto-set by Replit)
- `JWT_SECRET` - JWT signing secret
- `JWT_REFRESH_SECRET` - Refresh token signing secret
- `ADMIN_EMAIL_1` / `ADMIN_PASSWORD_1` - Default admin credentials for seeding
- `NEXT_PUBLIC_APP_URL` - App base URL
- `CLOUDFLARE_STREAM_API_TOKEN` - Cloudflare Stream API token (optional)
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID (optional)

### Database
- Uses Replit built-in PostgreSQL
- Prisma 7 with `@prisma/adapter-pg` (driver adapter pattern)
- Schema has: users, courses, chapters, lessons, enrollments, lesson_progress, notes, testimonials, content_locks, lock_audit, payments, attendance, daily_activity, achievements
- Run `npx prisma db push` to sync schema
- Run `node prisma/seed.ts` to seed

### Access Control System
- **Tiers**: MID1, MID2, FINAL, FULL
- **Lock Scopes**: GLOBAL (all students), PER_STUDENT (individual)
- **Lock Levels**: TIER, CHAPTER, LESSON
- **Precedence Order**: Per-student unlock > Global lock > Enrollment expiration > Tier entitlement
- Course → Chapter (tier-based) → Lesson hierarchy
- All lock/unlock operations logged in LockAudit table

### Terminology
- دورة → مادة (Course → Material/Subject)
- دورات → مواد (Courses → Materials/Subjects)
- Engineering context: وحدات تقنية (Technical Modules), مخططات (Schematics), هندسة الأنظمة (Systems Engineering)

### Admin Login
- Email: admin@ahmedacademy.com
- Password: adminpassword

## User Preferences
- Arabic (RTL) interface
- Dark-Industrial design system
- Bebas Neue for display headings, JetBrains Mono for sub-text, Cairo for Arabic body
- Safety orange primary (#FF4F00)
- Sharp corners (0 border-radius)
- Carbon texture backgrounds with glassmorphism cards
