'use client'

import { useEffect } from 'react'
import { initSmoothScroll } from '../lib/utils/smooth-scroll'

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode
}) {
  useEffect(() => {
    // Initialize smooth scrolling
    initSmoothScroll()

    // Enhanced smooth scroll for better performance
    let ticking = false

    function smoothScrollHandler() {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // This ensures smooth scrolling behavior
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', smoothScrollHandler, { passive: true })

    // Force smooth scroll behavior
    if (typeof window !== 'undefined') {
      document.documentElement.style.scrollBehavior = 'smooth'
      document.body.style.scrollBehavior = 'smooth'
    }

    return () => {
      window.removeEventListener('scroll', smoothScrollHandler)
    }
  }, [])

  return <>{children}</>
}

