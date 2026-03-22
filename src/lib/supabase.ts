
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://csgdgbbwhmiyafwwxvxd.supabase.co';
const supabaseAnonKey = 'sb_publishable_RAPOD-ngcc2EWPPgP6oBVA_EkI3UYeE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
