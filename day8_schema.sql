-- This function runs with the privileges of the definer (superuser),
-- bypassing RLS on the users table to avoid infinite recursion.
-- MUST be plpgsql — sql functions get inlined and lose SECURITY DEFINER behavior.
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN (SELECT role FROM public.users WHERE id = auth.uid());
END;
$$;


CREATE TABLE IF NOT EXISTS public.plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name_en TEXT NOT NULL,
  name_es TEXT NOT NULL,
  description_en TEXT,
  description_es TEXT,
  price_monthly DECIMAL(10,2) NOT NULL DEFAULT 0,
  items_en JSONB NOT NULL DEFAULT '[]',
  items_es JSONB NOT NULL DEFAULT '[]',
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;

-- Anyone authenticated can read plans (needed for user-facing Plans page)
CREATE POLICY "plans_select_authenticated" ON public.plans
  FOR SELECT TO authenticated USING (true);

-- Only admins can insert/update/delete plans — uses SECURITY DEFINER function
CREATE POLICY "plans_admin_all" ON public.plans
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');


CREATE TABLE IF NOT EXISTS public.plan_apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID NOT NULL REFERENCES public.plans(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.micro_apps(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(plan_id, app_id)
);

ALTER TABLE public.plan_apps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "plan_apps_select_authenticated" ON public.plan_apps
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "plan_apps_admin_all" ON public.plan_apps
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');


CREATE TABLE IF NOT EXISTS public.user_app_overrides (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  app_id UUID NOT NULL REFERENCES public.micro_apps(id) ON DELETE CASCADE,
  granted_by UUID REFERENCES public.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, app_id)
);

ALTER TABLE public.user_app_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "overrides_admin_all" ON public.user_app_overrides
  FOR ALL TO authenticated
  USING (public.get_user_role() = 'admin');


ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS plan_id UUID REFERENCES public.plans(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS plan_assigned_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan_source TEXT;


CREATE POLICY "users_admin_select_all" ON public.users
  FOR SELECT TO authenticated
  USING (public.get_user_role() = 'admin');

CREATE POLICY "users_admin_update_all" ON public.users
  FOR UPDATE TO authenticated
  USING (public.get_user_role() = 'admin');


DO $$
DECLARE
  basic_id UUID;
  intermediary_id UUID;
  professional_id UUID;
  app_ids UUID[];
BEGIN
  -- Only seed if plans table is empty
  IF (SELECT COUNT(*) FROM public.plans) = 0 THEN

    -- Fetch all app IDs ordered by creation date
    SELECT ARRAY(SELECT id FROM public.micro_apps ORDER BY created_at ASC) INTO app_ids;

    -- Insert 3 plans
    INSERT INTO public.plans (slug, name_en, name_es, description_en, description_es, price_monthly, sort_order, items_en, items_es)
    VALUES
      ('basic', 'Basic', 'Básico', 'Perfect for getting started', 'Perfecto para empezar', 29.00, 1,
        '["Access to 1 AI app", "Up to 50 generations/month", "Email support"]',
        '["Acceso a 1 app de IA", "Hasta 50 generaciones/mes", "Soporte por email"]'),
      ('intermediary', 'Intermediary', 'Intermedio', 'For growing businesses', 'Para negocios en crecimiento', 49.00, 2,
        '["Access to 3 AI apps", "Up to 200 generations/month", "Priority email support"]',
        '["Acceso a 3 apps de IA", "Hasta 200 generaciones/mes", "Soporte prioritario por email"]'),
      ('professional', 'Professional', 'Profesional', 'Unlimited power for professionals', 'Poder ilimitado para profesionales', 97.00, 3,
        '["Access to ALL AI apps", "Unlimited generations", "Priority support + onboarding call"]',
        '["Acceso a TODAS las apps de IA", "Generaciones ilimitadas", "Soporte prioritario + llamada de onboarding"]')
    RETURNING id INTO basic_id;

    -- Re-fetch individual IDs since RETURNING only gets last row
    SELECT id INTO basic_id FROM public.plans WHERE slug = 'basic';
    SELECT id INTO intermediary_id FROM public.plans WHERE slug = 'intermediary';
    SELECT id INTO professional_id FROM public.plans WHERE slug = 'professional';

    -- Basic: assign 1st app
    IF array_length(app_ids, 1) >= 1 THEN
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (basic_id, app_ids[1]);
    END IF;

    -- Intermediary: assign first 3 apps
    IF array_length(app_ids, 1) >= 1 THEN
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (intermediary_id, app_ids[1]);
    END IF;
    IF array_length(app_ids, 1) >= 2 THEN
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (intermediary_id, app_ids[2]);
    END IF;
    IF array_length(app_ids, 1) >= 3 THEN
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (intermediary_id, app_ids[3]);
    END IF;

    -- Professional: assign ALL apps
    FOR i IN 1..array_length(app_ids, 1) LOOP
      INSERT INTO public.plan_apps (plan_id, app_id) VALUES (professional_id, app_ids[i]);
    END LOOP;

  END IF;
END $$;


-- Promote the earliest-registered user to admin
UPDATE public.users
SET role = 'admin'
WHERE id = (SELECT id FROM public.users ORDER BY created_at ASC LIMIT 1)
AND role = 'user';


NOTIFY pgrst, 'reload schema';
NOTIFY pgrst, 'reload config';
