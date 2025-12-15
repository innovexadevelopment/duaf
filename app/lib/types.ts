export interface HeroSection {
  id: string
  title: string
  subtitle: string | null
  primary_cta_label: string | null
  primary_cta_url: string | null
  secondary_cta_label: string | null
  secondary_cta_url: string | null
  background_image_path: string | null
  overlay_opacity: number | null
  is_active: boolean
}

export interface Project {
  id: string
  title: string
  slug: string
  short_description: string | null
  long_description: string | null
  category: string | null
  start_date: string | null
  end_date: string | null
  is_ongoing: boolean
  highlight: boolean
  cover_image_path: string | null
  gallery_image_paths: string[] | null
  created_at: string
}

export interface Campaign {
  id: string
  title: string
  slug: string
  short_description: string | null
  long_description: string | null
  goal_amount: number | null
  raised_amount: number | null
  banner_image_path: string | null
  is_active: boolean
  created_at: string
}

export interface Event {
  id: string
  title: string
  slug: string
  description: string | null
  short_description: string | null
  start_date: string
  end_date: string | null
  location: string | null
  location_url: string | null
  cover_image_path: string | null
  registration_url: string | null
  is_featured: boolean
  is_active: boolean
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_path: string | null
  author_name: string | null
  category: string | null
  tags: string[] | null
  is_published: boolean
  published_at: string | null
  views_count: number
  created_at: string
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string | null
  avatar_image_path: string | null
}

export interface Testimonial {
  id: string
  name: string
  role: string | null
  organization: string | null
  quote: string
  avatar_image_path: string | null
}

export interface ImpactStat {
  id: string
  label: string
  value: number | null
  suffix: string | null
  description: string | null
  icon: string | null
}

export interface GalleryImage {
  id: string
  title: string | null
  description: string | null
  image_path: string
  taken_at: string | null
}

export interface ContactInfo {
  id: string
  email: string | null
  phone: string | null
  address: string | null
  map_embed_url: string | null
  socials: Record<string, string> | null
}

export interface TimelineItem {
  id: string
  title: string
  subtitle: string | null
  location: string | null
  description: string | null
  start_date: string | null
  end_date: string | null
  is_current: boolean
  type: string | null
  order_index: number
}

