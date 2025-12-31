'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Menu, X, Heart, ChevronDown, Hand } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../lib/supabase/client'
import type { Website } from '../lib/types'

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [isGetInvolvedOpen, setIsGetInvolvedOpen] = useState(false)
  const [website, setWebsite] = useState<Website | null>(null)
  const [pages, setPages] = useState<any[]>([])
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsGetInvolvedOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function loadData() {
    // Load website data
    const { data: websiteData } = await supabase
      .from('websites')
      .select('*')
      .eq('type', 'ngo')
      .single()

    if (websiteData) setWebsite(websiteData)

    // Load published pages
    const { data: pagesData } = await supabase
      .from('ngo_pages')
      .select('*')
      .eq('status', 'published')
      .order('order_index', { ascending: true })

    if (pagesData) setPages(pagesData)
  }

  const navLinks = pages
    .filter(p => !p.is_homepage && !['about', 'programs', 'impact', 'partners', 'blog', 'get-involved', 'contact'].includes(p.slug))
    .map(p => ({ href: `/${p.slug}`, label: p.title }))

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 shadow-2xl"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px) saturate(180%)',
        WebkitBackdropFilter: 'blur(20px) saturate(180%)',
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            whileHover={{ scale: 1.05, rotate: [0, -5, 5, -5, 0] }}
            whileTap={{ scale: 0.95 }}
          >
            <Link href="/" className="flex items-center space-x-3 group">
              {website?.logo_url ? (
                <motion.img 
                  src={website.logo_url} 
                  alt={website.name} 
                  className="h-10 transition-transform"
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    className="w-10 h-10 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg"
                  >
                    <Heart className="h-6 w-6 text-white fill-white" />
                  </motion.div>
                  <span className="text-2xl font-extrabold bg-gradient-to-r from-green-600 via-teal-600 to-green-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-[shimmer_3s_linear_infinite]">
                    DUAF
                  </span>
                </div>
              )}
            </Link>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <NavLink href="/">Home</NavLink>
            <NavLink href="/programs">Programs</NavLink>
            <NavLink href="/impact">Impact</NavLink>
            <NavLink href="/blog">Stories</NavLink>
            <NavLink href="/about">About</NavLink>
            
            {/* Get Involved Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsGetInvolvedOpen(!isGetInvolvedOpen)}
                className="flex items-center space-x-1 text-gray-700 hover:text-green-600 transition-colors px-4 py-2 rounded-lg hover:bg-green-50"
              >
                <span>Get Involved</span>
                <motion.div
                  animate={{ rotate: isGetInvolvedOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="h-4 w-4" />
                </motion.div>
              </motion.button>
              
              <AnimatePresence>
                {isGetInvolvedOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-green-100 overflow-hidden"
                  >
                    <Link
                      href="/get-involved"
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setIsGetInvolvedOpen(false)}
                    >
                      Volunteer
                    </Link>
                    <Link
                      href="/get-involved#donate"
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setIsGetInvolvedOpen(false)}
                    >
                      Donate
                    </Link>
                    <Link
                      href="/get-involved#partner"
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                      onClick={() => setIsGetInvolvedOpen(false)}
                    >
                      Partner With Us
                    </Link>
                    <Link
                      href="/contact"
                      className="block px-4 py-3 text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors border-t border-green-100"
                      onClick={() => setIsGetInvolvedOpen(false)}
                    >
                      Contact
                    </Link>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {navLinks.length > 0 && (
              <div className="h-6 w-px bg-gray-300 mx-2" />
            )}
            
            {navLinks.map((link) => (
              <NavLink key={link.href} href={link.href}>
                {link.label}
              </NavLink>
            ))}

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="ml-4"
            >
              <Link
                href="/get-involved"
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2.5 rounded-full hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-md hover:shadow-lg inline-flex items-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span>Donate</span>
              </Link>
            </motion.div>
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="lg:hidden p-2"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-6 w-6" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu className="h-6 w-6" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden overflow-hidden border-t border-green-100"
            >
              <div className="py-4 space-y-1">
                <MobileNavLink href="/" onClick={() => setIsOpen(false)}>Home</MobileNavLink>
                <MobileNavLink href="/programs" onClick={() => setIsOpen(false)}>Programs</MobileNavLink>
                <MobileNavLink href="/impact" onClick={() => setIsOpen(false)}>Impact</MobileNavLink>
                <MobileNavLink href="/blog" onClick={() => setIsOpen(false)}>Stories</MobileNavLink>
                <MobileNavLink href="/about" onClick={() => setIsOpen(false)}>About</MobileNavLink>
                <MobileNavLink href="/get-involved" onClick={() => setIsOpen(false)}>Get Involved</MobileNavLink>
                <MobileNavLink href="/contact" onClick={() => setIsOpen(false)}>Contact</MobileNavLink>
                {navLinks.map((link) => (
                  <MobileNavLink key={link.href} href={link.href} onClick={() => setIsOpen(false)}>
                    {link.label}
                  </MobileNavLink>
                ))}
                <motion.div
                  whileTap={{ scale: 0.95 }}
                  className="px-4 pt-4"
                >
                  <Link
                    href="/get-involved"
                    className="block bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-full text-center hover:from-green-700 hover:to-green-800 transition-all font-semibold shadow-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Donate Now
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.nav>
  )
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      whileTap={{ y: 0 }}
    >
      <Link
        href={href}
        className="relative text-gray-700 hover:text-green-600 transition-colors px-4 py-2 rounded-lg hover:bg-white/50 font-semibold group"
      >
        {children}
        <motion.span
          className="absolute bottom-0 left-0 w-0 h-1 bg-gradient-to-r from-green-600 to-teal-600 rounded-full group-hover:w-full transition-all duration-300"
          initial={{ width: 0 }}
          whileHover={{ width: '100%' }}
        />
      </Link>
    </motion.div>
  )
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <motion.div
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <Link
        href={href}
        className="block text-gray-700 hover:text-green-600 hover:bg-green-50 transition-colors px-4 py-3 rounded-lg font-medium"
        onClick={onClick}
      >
        {children}
      </Link>
    </motion.div>
  )
}

