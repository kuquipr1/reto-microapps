require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supaUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supaKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SECRET_KEY || '';

if (!supaUrl || !supaKey) {
  console.error("Missing Supabase credentials in .env.local");
  process.exit(1);
}

const supabase = createClient(supaUrl, supaKey);

(async () => {
  const { data: existing } = await supabase.from('plans').select('id').eq('slug', 'enterprise').single();
  if (existing) {
    console.log('Enterprise plan already exists');
    return;
  }

  const { data: plan, error: pe } = await supabase.from('plans').insert({
    slug: 'enterprise',
    name_en: 'Enterprise',
    name_es: 'Enterprise',
    description_en: 'Ultimate power for massive scale operations',
    description_es: 'Poder absoluto para operaciones a gran escala',
    price_monthly: 197.00,
    stripe_price_id: 'price_enterprise_simulated',
    features_en: ['All apps included', 'Unlimited generations', '24/7 Priority support', 'Early access to new apps', 'Personalized onboarding session'],
    features_es: ['Todas las apps incluidas', 'Generaciones ilimitadas', 'Soporte prioritario 24/7', 'Acceso anticipado a nuevas apps', 'Sesión de onboarding personalizada'],
    is_active: true,
    sort_order: 4
  }).select('id').single();
  
  if (pe) {
    console.error('Plan Error:', pe);
    return;
  }
  
  const { data: apps } = await supabase.from('micro_apps').select('id');
  if (apps && apps.length > 0) {
    const planAppsToInsert = apps.map(app => ({ plan_id: plan.id, app_id: app.id }));
    const { error: paError } = await supabase.from('plan_apps').insert(planAppsToInsert);
    if (paError) console.error('Plan Apps Error:', paError);
    else console.log('Enterprise plan added successfully with all apps assigned!');
  } else {
    console.log('Enterprise plan added but no apps found to assign.');
  }
})();
