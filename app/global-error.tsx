'use client'

export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="ar" dir="rtl">
      <body style={{ backgroundColor: '#0B0B0B', color: '#fff', fontFamily: 'Cairo, sans-serif' }}>
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>حدث خطأ</h1>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>نعتذر، حدث خطأ غير متوقع</p>
            <button
              onClick={reset}
              style={{
                backgroundColor: '#FF4F00',
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
