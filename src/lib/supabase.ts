
import { createClient } from '@supabase/supabase-js';

// Updated with your new Supabase credentials
const supabaseUrl = 'https://gfpzygqegzakluihhkkr.supabase.co';
const supabaseAnonKey = 'sb_publishable_rOABDRbSThYBQmcUu38baA_NDbweBMw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
