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
   - Hero + Stats + Featured Courses + Creator Bio + Testimonials + FAQ

2. **Courses** (`app/courses/page.tsx`)
   - Grid + Filters + Course Cards

3. **Course Details** (`app/courses/[slug]/page.tsx`)
   - Banner + Curriculum + Price Box + Preview Video

4. **Student Dashboard** (`app/(student)/dashboard/page.tsx`)
   - My Courses + Progress + Certificates

5. **Video Player** (`app/learn/[courseId]/[lessonId]/page.tsx`)
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
- **courses** - Single creator courses
- **lessons** - Course content
- **enrollments** - User enrollments
- **lesson_progress** - Watch progress
- **notes** - Lesson notes
- **certificates** - Course certificates
- **testimonials** - Student reviews

## API Routes

- `/api/auth/*` - Authentication
- `/api/courses/*` - Course CRUD
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

**Course Card:**
- Image + Title + Description + Price + Students Count + CTA

**Price Box:**
- Fixed sidebar + Price + Enroll Button + Course Stats

**Video Player:**
- React Player + Sidebar + Mark Complete + Notes

## RTL Support

All components use `dir="rtl"` and Arabic fonts. Text alignment is automatic.

## Next Steps

1. Setup database (PostgreSQL)
2. Configure `.env`
3. Run migrations
4. Add creator data
5. Upload courses
6. Test enrollment flow
7. Apply security standards
