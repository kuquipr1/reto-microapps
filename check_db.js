const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function checkTable() {
  const { data, error } = await supabase.from('micro_apps').select('*').limit(1);
  if (error) {
    if (error.code === '42P01') {
      console.log('TABLE DOES NOT EXIST');
    } else {
      console.log('ERROR:', error);
    }
  } else {
    console.log('TABLE EXISTS', data);
  }
}

checkTable();
