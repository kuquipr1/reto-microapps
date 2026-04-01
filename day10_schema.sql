CREATE TABLE public.smtp_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  host TEXT NOT NULL DEFAULT '',
  port INTEGER NOT NULL DEFAULT 587,
  username TEXT NOT NULL DEFAULT '',
  password TEXT NOT NULL DEFAULT '',
  from_email TEXT NOT NULL DEFAULT '',
  from_name TEXT NOT NULL DEFAULT '',
  is_verified BOOLEAN NOT NULL DEFAULT false,
  verified_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.smtp_settings ENABLE ROW LEVEL SECURITY;

-- Only admins can read/write SMTP settings — uses existing SECURITY DEFINER function
CREATE POLICY "smtp_settings_admin_all" ON public.smtp_settings
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');

NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
