import { createClient } from '@supabase/supabase-js';

// Updated with your NEW Supabase credentials
const supabaseUrl = 'https://kvpewsmhuqoopzqyhsjl.supabase.co';
const supabaseAnonKey = 'sb_publishable_YPfmRfKpZgFJVCu8Up49xw_ap5Zyecr';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
