// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mxkionmglzxjuoafhnvx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im14a2lvbm1nbHp4anVvYWZobnZ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTE4NTM0NjksImV4cCI6MjA2NzQyOTQ2OX0.uXRrAApcNMWBXfh_YUIb2goUnzrOTOUKx0LvShmBIVM';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
