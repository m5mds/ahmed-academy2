# Arabic Academy (أكاديمية أحمد)

## Overview
An Arabic language learning platform built with Next.js 14 (App Router), Prisma ORM with PostgreSQL, and Tailwind CSS. The platform supports RTL layout, JWT authentication, course management, student enrollment, and an admin dashboard.

## Recent Changes
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
  (student)/            # Student dashboard
  admin/                # Admin dashboard
  courses/              # Course listing & details
  api/                  # API routes (auth, courses, dashboard, admin)
components/             # React components
  layout/               # Header, Footer
  landing/              # Landing page components
  ui/                   # Reusable UI components
lib/                    # Utilities
  auth.ts               # JWT sign/verify functions
  auth-server.ts        # Server-side token extraction
  db.ts                 # Prisma client with PrismaPg adapter
  api.ts                # Client-side API helper
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

### Database
- Uses Replit built-in PostgreSQL
- Prisma 7 with `@prisma/adapter-pg` (driver adapter pattern)
- Schema has: users, courses, lessons, enrollments, lesson_progress, notes, certificates, testimonials
- Run `npx prisma db push` to sync schema
- Run `node prisma/seed.ts` to seed

### Admin Login
- Email: admin@ahmedacademy.com
- Password: adminpassword

## User Preferences
- Arabic (RTL) interface
- Cairo font family
- Blue primary (#2563EB), Green secondary (#10B981), Amber accent (#F59E0B)
