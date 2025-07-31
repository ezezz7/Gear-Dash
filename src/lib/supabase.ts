import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wcvmmmusyigzogaljhws.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indjdm1tbXVzeWlnem9nYWxqaHdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5MDE5ODQsImV4cCI6MjA2OTQ3Nzk4NH0.dp_J9JV3fjmwgbHe-9ERhLBjPADwovyfFESXsme1H4c'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
