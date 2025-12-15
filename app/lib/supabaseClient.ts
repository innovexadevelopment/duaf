import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client for DUAF website
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * Get public URL for a file in the public-assets storage bucket
 * @param path - Path to the file in the bucket (e.g., 'hero/banner.jpg')
 * @returns Public URL string
 */
export function getPublicUrl(path: string): string {
  if (!path) return ''
  if (path.startsWith('http')) return path
  
  const { data } = supabase.storage
    .from('public-assets')
    .getPublicUrl(path)
  
  return data.publicUrl
}

