'use client'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ backgroundColor: '#F3F4F6', color: '#1A2B4C', fontFamily: 'Cairo, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>حدث خطأ</h1>
            <p style={{ color: '#6B7280', marginBottom: '2rem' }}>نعتذر، حدث خطأ غير متوقع</p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#1A2B4C',
                color: '#fff',
                border: 'none',
                padding: '12px 32px',
                fontSize: '1rem',
                cursor: 'pointer'
              }}
            >
              حاول مرة أخرى
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
