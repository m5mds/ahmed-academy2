# Arabic Academy - Quick Start 🚀

## Structure Created ✅

```
arabic-academy/
├── app/                 # Next.js 14 pages (RTL)
├── components/          # React components
├── lib/                 # Utils, API, DB
├── types/              # TypeScript types
├── public/             # Static files
└── styles/             # CSS (RTL specific)
```

## Key Pages

1. **Landing** (`app/page.tsx`)
   - Hero + Stats + Featured Materials + Creator Bio + Testimonials + FAQ

2. **Materials** (`app/materials/page.tsx`)
   - Grid + Filters + Material Cards

3. **Material Details** (`app/materials/[slug]/page.tsx`)
   - Banner + Curriculum + Price Box + Preview Video

4. **Student Dashboard** (`app/(student)/dashboard/page.tsx`)
   - My Materials + Progress + Certificates

5. **Video Player** (`app/learn/[materialId]/[lessonId]/page.tsx`)
   - Video + Lessons Sidebar + Notes + Resources

6. **Auth** (`app/(auth)/login|register/page.tsx`)
   - Login + Register + Reset Password

## Design System

**Colors:**
- Primary: `#2563EB` (Deep Blue)
- Secondary: `#10B981` (Green)
- Accent: `#F59E0B` (Amber)

**Fonts:**
- Cairo (Arabic optimized)
- IBM Plex Sans Arabic (fallback)

**Layout:**
- RTL by default
- Max width: 1280px
- Rounded cards + Soft shadows
- Smooth transitions

## Database Schema

- **users** - Students + Admin
- **materials** - Single creator materials
- **lessons** - Material content
- **enrollments** - User enrollments
- **lesson_progress** - Watch progress
- **notes** - Lesson notes
- **certificates** - Material certificates
- **testimonials** - Student reviews

## API Routes

- `/api/auth/*` - Authentication
- `/api/materials/*` - Material CRUD
- `/api/enrollment/*` - Enrollment logic
- `/api/lessons/*` - Lesson progress
- `/api/notes/*` - Notes CRUD
- `/api/certificates/*` - Certificate generation

## Setup

```bash
npm install
cp .env.example .env
# Edit .env with real values
npm run dev
```

## Security

Use `/security-standards` skill to add:
- Rate limiting (100/15min)
- Security headers
- Input sanitization
- JWT auth

## Component Examples

**Material Card:**
- Image + Title + Description + Price + Students Count + CTA

**Price Box:**
- Fixed sidebar + Price + Enroll Button + Material Stats

**Video Player:**
- React Player + Sidebar + Mark Complete + Notes

## RTL Support

All components use `dir="rtl"` and Arabic fonts. Text alignment is automatic.

## Next Steps

1. Setup database (PostgreSQL)
2. Configure `.env`
3. Run migrations
4. Add creator data
5. Upload materials
6. Test enrollment flow
7. Apply security standards
