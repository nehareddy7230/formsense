import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://kjileujbyupzwmfgxiow.supabase.co"
const supabaseKey = "sb_publishable_HXKSCuitMaLcevwLPjWG9g_MxLHvsF9"
export const supabase = createClient(supabaseUrl, supabaseKey)