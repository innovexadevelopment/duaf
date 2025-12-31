'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '../components/navigation'
import { Footer } from '../components/footer'
import { HomeHero } from '../components/home-hero'
import { ImpactStats } from '../components/impact-stats'
import { ProgramsPreview } from '../components/programs-preview'
import { BlogPreviewList } from '../components/blog-preview-list'
import { PartnersGrid } from '../components/partners-grid'
import { CTASection } from '../components/cta-section'
import { supabase } from '../lib/supabase/client'
import type { Program, BlogPost, Partner, ImpactStat, Media } from '../lib/types'

export default function HomePage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [impactStats, setImpactStats] = useState<ImpactStat[]>([])
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({})
  const [heroImage, setHeroImage] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      // Load homepage and hero section
      const { data: homepage, error: homepageError } = await supabase
        .from('ngo_pages')
        .select('*')
        .eq('slug', 'home')
        .eq('is_homepage', true)
        .maybeSingle()

      if (homepageError) {
        console.error('Error loading homepage:', homepageError)
      }

      if (homepage) {
        // Load hero section
        const { data: heroSection, error: heroError } = await supabase
          .from('ngo_sections')
          .select('*')
          .eq('page_id', homepage.id)
          .eq('type', 'hero')
          .eq('is_visible', true)
          .order('order_index', { ascending: true })
          .limit(1)
          .maybeSingle()

        if (heroError) {
          console.error('Error loading hero section:', heroError)
        }

        if (heroSection?.background_image_url) {
          console.log('Hero image URL:', heroSection.background_image_url)
          setHeroImage(heroSection.background_image_url)
        }
      } else {
        console.warn('Homepage not found - check if page with slug "home" and is_homepage=true exists')
      }
    } catch (error) {
      console.error('Error in loadData:', error)
    }
    // Load featured programs
    const { data: programsData } = await supabase
      .from('ngo_programs')
      .select('*')
      .eq('status', 'published')
      .eq('is_featured', true)
      .order('order_index', { ascending: true })
      .limit(6)

    if (programsData) setPrograms(programsData)

    // Load latest blogs
    const { data: blogsData } = await supabase
      .from('ngo_blogs')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(3)

    if (blogsData) setBlogs(blogsData)

    // Load partners
    const { data: partnersData } = await supabase
      .from('ngo_partners')
      .select('*')
      .eq('is_visible', true)
      .order('order_index', { ascending: true })
      .limit(12)

    if (partnersData) setPartners(partnersData)

    // Load impact stats
    const { data: statsData, error: statsError } = await supabase
      .from('ngo_impact_stats')
      .select('*')
      .eq('is_visible', true)
      .order('order_index', { ascending: true })
      .limit(6)

    if (statsError) {
      console.error('Error loading impact stats:', statsError)
    } else {
      if (statsData && statsData.length > 0) {
        console.log('Loaded impact stats:', statsData)
        setImpactStats(statsData)
      } else {
        console.warn('No impact stats found in database (will use fallback)')
        setImpactStats([]) // Empty array will trigger fallback in component
      }
    }

    // Load media for featured images
    const allMediaIds = [
      ...(programsData || []).map(p => p.featured_image_id).filter(Boolean),
      ...(blogsData || []).map(b => b.featured_image_id).filter(Boolean),
      ...(partnersData || []).map(p => p.logo_id).filter(Boolean),
    ] as string[]

    if (allMediaIds.length > 0) {
      const { data: mediaData } = await supabase
        .from('ngo_media')
        .select('*')
        .in('id', allMediaIds)

      if (mediaData) {
        const map: Record<string, Media> = {}
        mediaData.forEach(m => { map[m.id] = m })
        setMediaMap(map)
      }
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <HomeHero backgroundImage={heroImage || undefined} />
        <ImpactStats stats={impactStats} />
        <ProgramsPreview programs={programs} mediaMap={mediaMap} />
        <BlogPreviewList posts={blogs} mediaMap={mediaMap} />
        <PartnersGrid partners={partners} mediaMap={mediaMap} />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}

