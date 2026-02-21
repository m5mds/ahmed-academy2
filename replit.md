# Arabic Academy (أكاديمية أحمد)

## Overview
An Arabic language learning platform built with Next.js 14 (App Router), Prisma ORM with PostgreSQL, and Tailwind CSS. The platform supports RTL layout, JWT authentication, course management, student enrollment, tiered subscription model, multi-level content locking, and an admin dashboard with content management.

## Recent Changes
- **Feb 21, 2026**: Added multi-level content locking system with Chapter model, ContentLock and LockAudit models. Admin UI for chapter CRUD, tier/chapter/lesson lock controls. Student content page with MID1/MID2/FINAL tabs.
- **Feb 2026**: Initial setup from GitHub import. Rebuilt missing source files from project documentation. Set up Prisma 7 with PrismaPg adapter, seeded database with sample courses and admin user.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL (Replit built-in, via Prisma 7 with `@prisma/adapter-pg`)
- **Styling**: Tailwind CSS with Cairo Arabic font
- **Auth**: JWT (jose library) with httpOnly cookies
- **ORM**: Prisma 7

## Project Architecture

### Directory Structure
```
app/                    # Next.js App Router pages
  (auth)/               # Auth pages (login, register)
  (student)/            # Student dashboard & content page
  admin/                # Admin dashboard & content management
  courses/              # Course listing & details
  api/                  # API routes
    auth/               # Auth endpoints
    admin/              # Admin APIs (chapters, locks, content, stats)
    content/            # Student content APIs (chapters, video)
    courses/            # Course APIs
    dashboard/          # Dashboard APIs
components/             # React components
  layout/               # Header, Footer
  landing/              # Landing page components
  ui/                   # Reusable UI components
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
- Schema has: users, courses, chapters, lessons, enrollments, lesson_progress, notes, certificates, testimonials, content_locks, lock_audit, payments, attendance, daily_activity, achievements
- Run `npx prisma db push` to sync schema
- Run `node prisma/seed.ts` to seed

### Access Control System
- **Tiers**: MID1, MID2, FINAL, FULL
- **Lock Scopes**: GLOBAL (all students), PER_STUDENT (individual)
- **Lock Levels**: TIER, CHAPTER, LESSON
- **Precedence Order**: Per-student unlock > Global lock > Enrollment expiration > Tier entitlement
- Course → Chapter (tier-based) → Lesson hierarchy
- All lock/unlock operations logged in LockAudit table

### Admin Login
- Email: admin@ahmedacademy.com
- Password: adminpassword

## User Preferences
- Arabic (RTL) interface
- Cairo font family
- Blue primary (#2563EB), Green secondary (#10B981), Amber accent (#F59E0B)
