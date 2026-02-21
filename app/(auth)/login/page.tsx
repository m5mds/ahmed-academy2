'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = await api<{ user: { role: string } }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })
      if (data.user.role === 'ADMIN') {
        router.push('/admin/dashboard')
      } else {
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'حدث خطأ')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-background relative pt-24">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
      <div className="bokeh-streak top-1/3 -left-20 rotate-12" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass p-8 border border-white/10">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-primary rotate-45 flex items-center justify-center mx-auto mb-6">
              <span className="font-display text-white -rotate-45 text-2xl">A</span>
            </div>
            <h1 className="font-display text-3xl text-white tracking-tighter uppercase">تسجيل الدخول</h1>
            <p className="text-white/40 mt-2 font-mono-text text-sm">أهلاً بعودتك! سجّل دخولك لمتابعة التعلم</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 mb-4 text-sm text-center font-mono-text">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-display tracking-widest uppercase text-white/60 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white font-mono-text text-sm focus:border-primary outline-none transition-all"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-display tracking-widest uppercase text-white/60 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-black/50 border border-white/10 text-white font-mono-text text-sm focus:border-primary outline-none transition-all"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full accent-button font-display text-lg tracking-widest uppercase py-3 text-white disabled:opacity-50 shadow-[0_0_20px_rgba(255,79,0,0.3)]"
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="text-center mt-6 text-white/40 text-sm font-mono-text">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-primary hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
