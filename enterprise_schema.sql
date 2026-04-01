-- Insertar el nuevo plan 'Enterprise'
INSERT INTO plans (slug, name_en, name_es, description_en, description_es, price_monthly, stripe_price_id, features_en, features_es, is_active, sort_order)
VALUES (
  'enterprise',
  'Enterprise',
  'Enterprise',
  'Unlimited power, all apps, and VIP priority support.',
  'Poder ilimitado, todas las apps y soporte prioritario VIP.',
  197.00,
  'price_enterprise_simulated',
  ARRAY['All apps included', 'Unlimited generations', '24/7 Priority support', 'Early access to new apps', 'Personalized onboarding session'],
  ARRAY['Todas las apps incluidas', 'Generaciones ilimitadas', 'Soporte prioritario 24/7', 'Acceso anticipado a nuevas apps', 'Sesión de onboarding personalizada'],
  true,
  4
);

-- Vincular TODAS las micro aplicaciones al plan 'Enterprise'
INSERT INTO plan_apps (plan_id, app_id)
SELECT 
  (SELECT id FROM plans WHERE slug = 'enterprise'),
  id
FROM micro_apps;
