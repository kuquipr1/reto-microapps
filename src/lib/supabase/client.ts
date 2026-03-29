import { createBrowserClient } from '@supabase/ssr'

export function isMockMode() {
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return !anonKey || anonKey.startsWith('sb_publishable_sb_publishable');
}

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
