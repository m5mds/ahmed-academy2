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
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-[#F3F4F6] pt-24">
      <div className="w-full max-w-md">
        <div className="bg-white p-8 border border-gray-200">
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#1A2B4C] flex items-center justify-center mx-auto mb-6">
              <span className="font-display text-white text-2xl">A</span>
            </div>
            <h1 className="font-display text-3xl text-[#1A2B4C]">تسجيل الدخول</h1>
            <p className="text-gray-500 mt-2 text-sm">أهلاً بعودتك! سجّل دخولك لمتابعة التعلم</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 p-3 mb-4 text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-2">البريد الإلكتروني</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 text-[#1A2B4C] text-sm focus:border-[#1A2B4C] outline-none transition-all"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-2">كلمة المرور</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 text-[#1A2B4C] text-sm focus:border-[#1A2B4C] outline-none transition-all"
                placeholder="••••••••"
                dir="ltr"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1A2B4C] text-lg py-3 text-white disabled:opacity-50 hover:bg-[#1A2B4C]/90 transition-colors"
            >
              {loading ? 'جاري التحميل...' : 'تسجيل الدخول'}
            </button>
          </form>

          <p className="text-center mt-6 text-gray-500 text-sm">
            ليس لديك حساب؟{' '}
            <Link href="/register" className="text-[#1A2B4C] font-semibold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
