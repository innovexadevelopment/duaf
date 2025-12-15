'use client'

import { HeroSection } from '../lib/types'
import { getPublicUrl } from '../lib/supabaseClient'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface HeroProps {
  hero: HeroSection | null
}

export default function Hero({ hero }: HeroProps) {
  if (!hero) {
    return (
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/20">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>

        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <h1 className="heading-1 mb-6">
              Making a Difference Together
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Join us in creating positive change in our communities through impactful programs and initiatives.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn">
                Get Involved
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/programs" className="btn-outline">
                Our Programs
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    )
  }

  const backgroundImage = hero.background_image_path ? getPublicUrl(hero.background_image_path) : null
  const overlayOpacity = hero.overlay_opacity || 0.5

  return (
    <section 
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'linear-gradient(135deg, rgba(230, 57, 70, 0.1) 0%, rgba(69, 123, 157, 0.1) 100%)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Overlay with gradient */}
      {backgroundImage && (
        <div 
          className="absolute inset-0 bg-gradient-to-b from-gray-900/70 via-gray-900/60 to-gray-900/80"
        />
      )}

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }} />
      </div>

      {/* Content */}
      <div className="container relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="space-y-8"
        >
          <h1 className="heading-1 mb-6 text-white drop-shadow-2xl">
            {hero.title}
          </h1>
          {hero.subtitle && (
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-xl md:text-2xl lg:text-3xl text-white/95 mb-8 max-w-4xl mx-auto leading-relaxed font-light drop-shadow-lg"
            >
              {hero.subtitle}
            </motion.p>
          )}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            {hero.primary_cta_label && hero.primary_cta_url && (
              <Link 
                href={hero.primary_cta_url} 
                className="btn bg-white text-primary hover:bg-gray-50 shadow-xl"
              >
                {hero.primary_cta_label}
                <ArrowRight className="h-5 w-5" />
              </Link>
            )}
            {hero.secondary_cta_label && hero.secondary_cta_url && (
              <Link 
                href={hero.secondary_cta_url} 
                className="btn-outline border-2 border-white text-white hover:bg-white hover:text-primary"
              >
                {hero.secondary_cta_label}
              </Link>
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="text-white/80 text-sm flex flex-col items-center gap-2"
        >
          <span className="font-semibold">Scroll</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </motion.div>
      </motion.div>
    </section>
  )
}
