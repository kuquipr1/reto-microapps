CREATE TABLE public.webhook_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT NOT NULL,
  event_type TEXT NOT NULL,
  raw_payload JSONB NOT NULL DEFAULT '{}',
  normalized_payload JSONB NOT NULL DEFAULT '{}',
  user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.webhook_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write webhook logs — uses existing SECURITY DEFINER function
CREATE POLICY "webhook_logs_admin_all" ON public.webhook_logs
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

-- Allow the webhook endpoint to INSERT logs without authentication (service role handles this)
-- The API route uses the admin client (SUPABASE_SECRET_KEY) which bypasses RLS entirely.

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
