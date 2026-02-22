# Arabic Academy (أكاديمية أحمد)

## Overview
A formal Engineering Academy platform built with Next.js 14 (App Router), Prisma ORM with PostgreSQL, and Tailwind CSS. The platform features a Professional Academic design system (Light Mode, Navy Blue #1A2B4C headings, textbook-style UI, technical blueprint graphics), RTL layout, JWT authentication, tiered subscription model, and multi-level content locking.

## Recent Changes
- **Feb 21, 2026**: Production-ready overhaul: Removed Certificate model from schema, fixed access-control precedence (Expiry → Per-Student → Global Lock → Tier), updated student toast messages, build passes with zero errors.
- **Feb 21, 2026**: Complete UI overhaul to Professional Light-Mode Academic theme. White cards (#FFFFFF), Navy Blue (#1A2B4C) headings, Light Grey (#F3F4F6) dashboard backgrounds. Removed ALL glows, shadows, carbon textures, and dark-mode remnants.
- **Feb 21, 2026**: Conditional header navigation: Shows Dashboard/Logout when logged in, Login/Register when logged out.
- **Feb 21, 2026**: Replaced all emoji icons with professional lucide-react icons (Users, BookOpen, Lock, Settings, etc.).
- **Feb 21, 2026**: Admin route protection: /admin routes redirect to home if user is not authenticated as admin.
- **Feb 21, 2026**: Full terminology scrub: 100% replaced مادة→مادة across all files including seed data. Removed all certificate references.
- **Feb 21, 2026**: Dynamic material categories on materials page (derived from DB data, not hardcoded English).

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Replit built-in)
- **Styling**: Tailwind CSS (Academic Light Theme)
- **Icons**: lucide-react
- **Fonts**: Cairo (Arabic body), Bebas Neue (Headers), JetBrains Mono (Technical)

## Design System — Professional Academic (Light Mode)
- **Background (Landing)**: #FFFFFF (White)
- **Background (Dashboard)**: #F3F4F6 (Light Grey)
- **Cards**: #FFFFFF with border #E5E7EB
- **Primary/Heading**: #1A2B4C (Navy Blue)
- **Accent**: #FF4F00 (Safety Orange - minimal use)
- **Border**: #E5E7EB (Light Grey)
- **Text**: #1A2B4C (headings), #6B7280 (body), #9CA3AF (muted)
- **Layout**: Split Hero (RTL), Bordered Grid, Clean Forms
- **Icons**: lucide-react (Users, BookOpen, Lock, Settings, etc.)
- **NO**: Glows, shadows, carbon textures, glassmorphism, dark backgrounds

## Project Architecture

### Directory Structure
```
app/                    # Next.js App Router pages
  (auth)/               # Auth pages (login, register)
  (student)/            # Student dashboard & content page
  admin/                # Admin dashboard & content management
  materials/              # Material listing & details
  contact/              # Contact page
  api/                  # API routes
    auth/               # Auth endpoints (login, register, logout, me)
    admin/              # Admin APIs (chapters, locks, content, stats)
    content/            # Student content APIs (chapters, video)
    materials/            # Material APIs
    dashboard/          # Dashboard APIs
components/             # React components
  layout/               # Header, Footer
  ui/                   # ScrollReveal, AnimatedCounter
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
- Schema has: users, materials, chapters, lessons, enrollments, lesson_progress, notes, testimonials, content_locks, lock_audit, payments, attendance, daily_activity, achievements (Certificate model removed)
- Run `npx prisma db push` to sync schema
- Run `node prisma/seed.ts` to seed

### Access Control System
- **Tiers**: MID1, MID2, FINAL, FULL
- **Lock Scopes**: GLOBAL (all students), PER_STUDENT (individual)
- **Lock Levels**: TIER, CHAPTER, LESSON
- **Precedence Order (Triple-Check Pipeline)**: JWT → Enrollment → Expiry check → Per-student unlock → Global lock → Tier entitlement
- Material → Chapter (tier-based) → Lesson hierarchy
- All lock/unlock operations logged in LockAudit table

### Terminology
- مادة → مادة (Material → Material/Subject)
- مواد → مواد (Materials → Materials/Subjects)
- Engineering context: وحدات تقنية (Technical Modules), مخططات (Schematics), هندسة الأنظمة (Systems Engineering)

### Admin Login
- Email: admin@ahmedacademy.com
- Password: adminpassword

## User Preferences
- Arabic (RTL) interface
- Professional Light-Mode Academic design
- Bebas Neue for display headings, JetBrains Mono for sub-text, Cairo for Arabic body
- Navy Blue primary (#1A2B4C), Safety Orange accent (#FF4F00 - minimal)
- Clean borders, no glows or shadows
- Institutional clarity, formal academic language throughout
