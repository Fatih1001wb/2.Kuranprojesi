import { createClient } from '@supabase/supabase-js';

const URL = process.env.REACT_APP_SUPABASE_URL;
const KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!URL || URL.includes('placeholder')) {
  console.warn('⚠️  .env dosyasına Supabase bilgilerini ekleyin!');
}

export const supabase = createClient(
  URL  || 'https://placeholder.supabase.co',
  KEY  || 'placeholder'
);
