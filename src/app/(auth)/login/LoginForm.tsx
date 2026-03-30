'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { GlassCard } from '@/components/ui/GlassCard'
import { GlowButton } from '@/components/ui/GlowButton'
import { Input } from '@/components/ui/Input'
import { useToast } from '@/components/ui/Toast'
import { Mail, Lock } from 'lucide-react'
import { t } from '@/lib/i18n'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast: addToast } = useToast()
  const supabase = createClient()

  useEffect(() => {
    const verified = searchParams?.get('verified')
    if (verified === 'true') {
      addToast(t('emailConfirmed'), 'success')
      window.history.replaceState({}, '', '/login')
    }
    const error = searchParams?.get('error')
    if (error === 'auth-link-failed') {
      addToast(t('authLinkFailed'), 'error')
      window.history.replaceState({}, '', '/login')
    }
  }, [searchParams, addToast])

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        router.push('/')
      }
    })
    return () => subscription.unsubscribe()
  }, [router, supabase])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      addToast(error.message, 'error')
    } else {
      router.push('/')
    }
    setLoading(false)
  }

  return (
    <GlassCard>
      <div className="text-center mb-6">
        <div className="mx-auto w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-accent-pink)] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(124,58,237,0.4)]">
          <span className="text-2xl font-bold text-white">M</span>
        </div>
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent-pink)]">
          Micro-Apps Portal
        </h1>
        <p className="text-sm text-[var(--color-base-content)] opacity-70 mt-2">
          {t('tagline')}
        </p>
      </div>

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <Input
          type="email"
          placeholder={t('email')}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<Mail size={18} />}
          required
        />
        <Input
          type="password"
          placeholder={t('password')}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<Lock size={18} />}
          required
        />
        
        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-xs text-[var(--color-accent-blue)] hover:underline opacity-80 hover:opacity-100 transition-opacity">
            {t('forgotPassword')}
          </Link>
        </div>

        <GlowButton type="submit" isLoading={loading} className="mt-2">
          {t('login')}
        </GlowButton>
      </form>

      <div className="mt-6 text-center">
        <Link href="/signup" className="text-sm text-[var(--color-base-content)] opacity-70 hover:opacity-100 hover:text-[var(--color-accent-pink)] transition-all">
          {t('noAccount')}
        </Link>
      </div>
    </GlassCard>
  )
}
