'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Menu, X, Heart } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Programs', href: '/programs' },
    { name: 'Campaigns', href: '/campaigns' },
    { name: 'Events', href: '/events' },
    { name: 'Blog', href: '/blog' },
    { name: 'Gallery', href: '/gallery' },
  ]

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white shadow-lg border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-md'
      }`}>
        <div className="container">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group relative z-50">
              <div className="relative">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2.5 bg-gradient-to-br from-primary to-primary-dark rounded-xl shadow-lg group-hover:shadow-xl transition-all"
                >
                  <Heart className="h-6 w-6 text-white" fill="currentColor" />
                </motion.div>
              </div>
              <div>
                <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-primary-dark to-secondary bg-clip-text text-transparent block leading-tight">
                  DUAF
                </span>
                <span className="text-[10px] text-gray-500 font-medium uppercase tracking-wider block -mt-0.5">
                  Foundation
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative px-4 py-2.5 text-sm font-semibold transition-all duration-300 rounded-lg group ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-gray-700 hover:text-primary'
                    }`}
                  >
                    <span className="relative z-10">{link.name}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNav"
                        className="absolute inset-0 bg-primary/10 rounded-lg"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    {!isActive && (
                      <div className="absolute inset-0 bg-primary/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </Link>
                )
              })}
              <div className="ml-2 pl-4 border-l border-gray-200">
                <Link 
                  href="/contact" 
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-primary to-primary-dark text-white text-sm font-semibold rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Get Involved
                </Link>
              </div>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="lg:hidden p-2.5 text-gray-700 hover:text-primary hover:bg-gray-100 rounded-lg transition-all z-50"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Overlay */}
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsOpen(false)}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed top-0 right-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
              >
                <div className="p-6 pt-24">
                  <div className="space-y-2">
                    {navLinks.map((link, index) => {
                      const isActive = pathname === link.href
                      return (
                        <motion.div
                          key={link.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                        >
                          <Link
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                              isActive
                                ? 'bg-primary text-white shadow-md'
                                : 'text-gray-700 hover:bg-gray-100 hover:text-primary'
                            }`}
                          >
                            {link.name}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    className="mt-8"
                  >
                    <Link
                      href="/contact"
                      onClick={() => setIsOpen(false)}
                      className="block w-full text-center px-6 py-3.5 bg-gradient-to-r from-primary to-primary-dark text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      Get Involved
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>
      
      {/* Spacer */}
      <div className="h-20" />
    </>
  )
}
