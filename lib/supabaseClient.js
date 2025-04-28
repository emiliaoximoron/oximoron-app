
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://your-supabase-project-url.supabase.co';
const supabaseKey = 'your-public-anon-key';
export const supabase = createClient(supabaseUrl, supabaseKey);
