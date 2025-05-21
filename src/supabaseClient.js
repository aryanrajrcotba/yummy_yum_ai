import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Anon Key:', supabaseAnonKey ? 'Present' : 'Missing');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please check your .env file.');
  console.error('Make sure you have created a .env file with REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY');
}

if (!supabaseUrl?.startsWith('https://')) {
  console.error('Invalid Supabase URL format. URL should start with https://');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 