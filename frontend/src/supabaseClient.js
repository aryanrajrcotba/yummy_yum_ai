import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://kbkqmroqrjvdblsymtmr.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtia3Ftcm9xcmp2ZGJsc3ltdG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc3NzE5ODUsImV4cCI6MjA2MzM0Nzk4NX0.gllvTFwdRdXgsE8VZChxa2PuPbJIuB5a5n_LsQnNCcc';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
