import { createClient } from '@supabase/supabase-js';

interface PlanAppRow {
  micro_apps: { slug: string } | null;
}

export async function getUserAccessibleApps(userId: string): Promise<string[]> {
  // Use admin client to bypass RLS — this function may be called
  // for users other than the current authenticated user (e.g., admin viewing another user's apps).
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Get user's plan_id
  const { data: user } = await supabase
    .from('users')
    .select('plan_id')
    .eq('id', userId)
    .single();

  const slugs = new Set<string>();

  // Get apps from plan
  if (user?.plan_id) {
    const { data: planApps } = await supabase
      .from('plan_apps')
      .select('micro_apps(slug)')
      .eq('plan_id', user.plan_id);

    (planApps as PlanAppRow[] | null)?.forEach((row: PlanAppRow) => {
      if (row.micro_apps?.slug) slugs.add(row.micro_apps.slug);
    });
  }

  // Get apps from individual overrides
  const { data: overrides } = await supabase
    .from('user_app_overrides')
    .select('micro_apps(slug)')
    .eq('user_id', userId);

  (overrides as PlanAppRow[] | null)?.forEach((row: PlanAppRow) => {
    if (row.micro_apps?.slug) slugs.add(row.micro_apps.slug);
  });

  return Array.from(slugs);
}
