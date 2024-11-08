import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'
const {SB_URL, SB_ANON } = process.env
export const supabase = createClient(SB_URL!, SB_ANON!)