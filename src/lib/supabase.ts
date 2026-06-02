import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://zixbpwwjweonianynvsq.supabase.co'
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InppeGJwd3dqd2VvbmlhbnludnNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAyNTYyOTQsImV4cCI6MjA5NTgzMjI5NH0.5ndkLhjM5v8xtW-BfenVwPEdQlQs_a6DWXXffCRD0N8'

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
