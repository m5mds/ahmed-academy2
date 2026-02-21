# Arabic Academy - Project Structure

## 📂 Folder Structure

```
arabic-academy/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                   # Authentication routes group
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── reset-password/
│   │       └── page.tsx
│   ├── (student)/                # Protected student routes
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── my-courses/
│   │   │   └── page.tsx
│   │   ├── certificates/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   ├── courses/
│   │   ├── page.tsx              # Course list
│   │   └── [slug]/
│   │       └── page.tsx          # Course details
│   ├── learn/
│   │   └── [courseId]/
│   │       └── [lessonId]/
│   │           └── page.tsx      # Video player
│   ├── api/                      # API routes
│   │   ├── auth/
│   │   ├── courses/
│   │   ├── lessons/
│   │   └── enrollment/
│   ├── layout.tsx                # Root layout (RTL support)
│   ├── page.tsx                  # Landing page
│   └── globals.css
├── components/
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── Stats.tsx
│   │   ├── FeaturedCourses.tsx
│   │   ├── CreatorBio.tsx
│   │   ├── Testimonials.tsx
│   │   └── FAQ.tsx
│   ├── courses/
│   │   ├── CourseCard.tsx
│   │   ├── CourseGrid.tsx
│   │   ├── CourseFilter.tsx
│   │   ├── CourseCurriculum.tsx
│   │   └── PriceBox.tsx
│   ├── student/
│   │   ├── DashboardStats.tsx
│   │   ├── MyCourseCard.tsx
│   │   ├── ProgressBar.tsx
│   │   └── CertificateCard.tsx
│   ├── video/
│   │   ├── VideoPlayer.tsx
│   │   ├── LessonSidebar.tsx
│   │   ├── NotesSection.tsx
│   │   └── ResourceDownload.tsx
│   ├── ui/                       # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Modal.tsx
│   │   └── Badge.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Footer.tsx
│       ├── Sidebar.tsx
│       └── Container.tsx
├── lib/
│   ├── api.ts                    # API client
│   ├── auth.ts                   # Auth helpers
│   ├── db.ts                     # Database client
│   └── utils.ts                  # Utilities
├── types/
│   ├── course.ts
│   ├── user.ts
│   ├── lesson.ts
│   └── enrollment.ts
├── public/
│   ├── images/
│   ├── videos/
│   └── fonts/
├── styles/
│   └── rtl.css                   # RTL specific styles
├── middleware.ts                 # Auth middleware
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## 🎨 Design System

### Colors
```typescript
primary: '#2563EB'      // Deep Blue
secondary: '#10B981'    // Emerald Green
accent: '#F59E0B'       // Amber
neutral: {
  50: '#F9FAFB',
  100: '#F3F4F6',
  200: '#E5E7EB',
  300: '#D1D5DB',
  400: '#9CA3AF',
  500: '#6B7280',
  600: '#4B5563',
  700: '#374151',
  800: '#1F2937',
  900: '#111827',
}
success: '#10B981'
warning: '#F59E0B'
error: '#EF4444'
```

### Typography
- Primary Font: Cairo (Arabic optimized)
- Fallback: IBM Plex Sans Arabic
- Headings: 700 weight
- Body: 400 weight
- RTL direction enforced

### Spacing
- Container max-width: 1280px
- Section padding: py-16 md:py-24
- Card padding: p-6
- Grid gap: gap-6

### Borders & Shadows
- Border radius: rounded-lg (8px), rounded-xl (12px)
- Card shadow: shadow-md
- Hover shadow: shadow-lg
- Border: border-neutral-200

## 📊 Database Schema

### Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  avatar_url VARCHAR(500),
  role VARCHAR(50) DEFAULT 'student', -- 'admin' or 'student'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Courses Table
```sql
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug VARCHAR(255) UNIQUE NOT NULL,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  short_description VARCHAR(500),
  image_url VARCHAR(500),
  preview_video_url VARCHAR(500),
  price DECIMAL(10, 2) DEFAULT 0,
  is_free BOOLEAN DEFAULT false,
  category VARCHAR(100),
  level VARCHAR(50), -- 'beginner', 'intermediate', 'advanced'
  duration_hours INTEGER,
  students_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2) DEFAULT 0,
  is_published BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Lessons Table
```sql
CREATE TABLE lessons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT,
  video_url VARCHAR(500),
  duration_minutes INTEGER,
  order_index INTEGER NOT NULL,
  is_preview BOOLEAN DEFAULT false, -- Free preview lesson
  resources_url VARCHAR(500), -- Download resources
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Enrollments Table
```sql
CREATE TABLE enrollments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT NOW(),
  completed_at TIMESTAMP,
  progress DECIMAL(5, 2) DEFAULT 0, -- Percentage
  UNIQUE(user_id, course_id)
);
```

### Lesson Progress Table
```sql
CREATE TABLE lesson_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  is_completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  last_watched_position INTEGER DEFAULT 0, -- Seconds
  UNIQUE(user_id, lesson_id)
);
```

### Notes Table
```sql
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES lessons(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  timestamp_seconds INTEGER, -- Video timestamp
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### Certificates Table
```sql
CREATE TABLE certificates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  certificate_url VARCHAR(500),
  issued_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, course_id)
);
```

### Testimonials Table
```sql
CREATE TABLE testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new student
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `POST /api/auth/reset-password` - Request password reset
- `POST /api/auth/verify-token` - Verify JWT token

### Courses
- `GET /api/courses` - Get all published courses (with filters)
- `GET /api/courses/:slug` - Get course details
- `GET /api/courses/:id/curriculum` - Get course curriculum

### Enrollment
- `POST /api/enrollment/enroll` - Enroll in course (after payment)
- `GET /api/enrollment/my-courses` - Get user's enrolled courses
- `GET /api/enrollment/:courseId/progress` - Get course progress

### Lessons
- `GET /api/lessons/:id` - Get lesson details
- `POST /api/lessons/:id/complete` - Mark lesson as completed
- `PUT /api/lessons/:id/progress` - Update watch progress

### Notes
- `GET /api/notes/:lessonId` - Get lesson notes
- `POST /api/notes` - Create note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Certificates
- `GET /api/certificates/my-certificates` - Get user certificates
- `POST /api/certificates/generate` - Generate certificate (auto on course completion)

### Testimonials
- `GET /api/testimonials/featured` - Get featured testimonials
- `POST /api/testimonials` - Submit testimonial

## 📱 Responsive Breakpoints

```typescript
sm: '640px'   // Mobile
md: '768px'   // Tablet
lg: '1024px'  // Desktop
xl: '1280px'  // Large desktop
2xl: '1536px' // Extra large
```

## 🎯 Component Hierarchy

```
App Layout (RTL)
├── Header
│   ├── Logo
│   ├── Navigation Menu
│   └── User Menu / Login Button
├── Main Content
│   ├── Landing Page
│   │   ├── Hero
│   │   ├── Stats
│   │   ├── Featured Courses Slider
│   │   ├── Creator Bio
│   │   ├── Testimonials
│   │   └── FAQ
│   ├── Courses Page
│   │   ├── Course Filter
│   │   └── Course Grid
│   │       └── Course Card (x N)
│   ├── Course Details Page
│   │   ├── Course Banner
│   │   ├── What You'll Learn
│   │   ├── Course Curriculum
│   │   ├── Preview Video
│   │   └── Price Box (Sticky)
│   ├── Student Dashboard
│   │   ├── Dashboard Stats
│   │   ├── Continue Learning
│   │   ├── My Courses Grid
│   │   └── Recent Certificates
│   └── Video Player Page
│       ├── Video Player
│       ├── Lesson Sidebar
│       ├── Notes Section
│       └── Resources Download
└── Footer
    ├── Quick Links
    ├── Privacy Policy
    └── Contact Info
```

## 🚀 Performance Optimizations

1. **Image Optimization**
   - Next.js Image component
   - WebP format
   - Lazy loading

2. **Code Splitting**
   - Route-based splitting (automatic)
   - Dynamic imports for heavy components
   - React.lazy for modals

3. **Caching Strategy**
   - Static pages: ISR (revalidate every 3600s)
   - Course list: SSR with cache
   - User data: Client-side cache (SWR)

4. **Bundle Size**
   - Tree shaking
   - Minimize dependencies
   - Use next/dynamic for video player

## 🔒 Security Features

1. JWT authentication
2. Protected routes middleware
3. API rate limiting (from security templates)
4. Input sanitization (XSS protection)
5. CSRF tokens
6. Secure password hashing (bcrypt)
7. Environment variables for secrets

## 📦 Key Dependencies

```json
{
  "next": "^14.1.0",
  "react": "^18.2.0",
  "typescript": "^5.3.3",
  "tailwindcss": "^3.4.0",
  "@react-pdf/renderer": "^3.1.14",
  "axios": "^1.6.2",
  "zod": "^3.22.4",
  "bcrypt": "^5.1.1",
  "jsonwebtoken": "^9.0.2",
  "swr": "^2.2.4",
  "react-player": "^2.14.0",
  "swiper": "^11.0.5",
  "framer-motion": "^10.16.16"
}
```
