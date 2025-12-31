'use client'

import { Heart, ArrowRight, Users, Hand, Sparkles, Globe } from 'lucide-react'
import Link from 'next/link'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useState, useEffect, useRef } from 'react'

interface HomeHeroProps {
  title?: string
  subtitle?: string
  primaryCTA?: { text: string; href: string }
  secondaryCTA?: { text: string; href: string }
  backgroundImage?: string
}

export function HomeHero({
  title = "Making a Difference, One Life at a Time",
  subtitle = "Join us in our mission to create positive change and support communities in need",
  primaryCTA = { text: "Donate Now", href: "/get-involved" },
  secondaryCTA = { text: "Our Programs", href: "/programs" },
  backgroundImage
}: HomeHeroProps) {
  const [dimensions, setDimensions] = useState({ width: 1920, height: 1080 })
  const cardRef = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['7.5deg', '-7.5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-7.5deg', '7.5deg'])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setDimensions({ width: window.innerWidth, height: window.innerHeight })
      
      const handleMouseMove = (e: MouseEvent) => {
        if (!cardRef.current) return
        const rect = cardRef.current.getBoundingClientRect()
        const width = rect.width
        const height = rect.height
        const mouseX = e.clientX - rect.left
        const mouseY = e.clientY - rect.top
        const xPct = mouseX / width - 0.5
        const yPct = mouseY / height - 0.5
        x.set(xPct)
        y.set(yPct)
      }
      
      const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
      }
      
      cardRef.current?.addEventListener('mousemove', handleMouseMove)
      cardRef.current?.addEventListener('mouseleave', handleMouseLeave)
      
      return () => {
        cardRef.current?.removeEventListener('mousemove', handleMouseMove)
        cardRef.current?.removeEventListener('mouseleave', handleMouseLeave)
      }
    }
  }, [x, y])

  return (
    <section className={`relative text-white py-20 lg:py-32 overflow-hidden min-h-screen flex items-center ${backgroundImage ? 'bg-black' : 'bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700'}`}>
      {backgroundImage ? (
        <>
          <motion.div
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
            className="absolute inset-0"
          >
            <img src={backgroundImage} alt="" className="w-full h-full object-cover" />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/60"></div>
        </>
      ) : (
        <>
          {/* Animated gradient mesh */}
          <div className="absolute inset-0 opacity-30">
            <motion.div 
              className="absolute top-0 left-0 w-96 h-96 bg-green-400 rounded-full blur-3xl"
              animate={{ 
                x: [0, 100, 0],
                y: [0, 100, 0],
              }}
              transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div 
              className="absolute bottom-0 right-0 w-96 h-96 bg-teal-500 rounded-full blur-3xl"
              animate={{ 
                x: [0, -100, 0],
                y: [0, -100, 0],
              }}
              transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            />
            <motion.div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500 rounded-full blur-3xl"
              animate={{ 
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
            />
          </div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div ref={cardRef} className="perspective-1000">
            <motion.div
              style={{
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }}
              className="transform-gpu"
            >
              <div className="text-center space-y-8">
                {/* Icon badge with 3D effect */}
                <motion.div
                  initial={{ scale: 0, rotateY: -180 }}
                  animate={{ scale: 1, rotateY: 0 }}
                  transition={{ duration: 0.8, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center justify-center"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <div className="relative">
                    <motion.div
                      animate={{ 
                        rotateY: [0, 360],
                      }}
                      transition={{ 
                        duration: 20,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className="inline-flex items-center justify-center w-24 h-24 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-2xl"
                      style={{ transformStyle: 'preserve-3d' }}
                    >
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          rotate: [0, 10, -10, 0]
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                        }}
                      >
                        <Heart className="h-12 w-12 text-white fill-white" />
                      </motion.div>
                    </motion.div>
                    {/* Floating icons around badge */}
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        rotate: { duration: 20, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 2, repeat: Infinity }
                      }}
                      className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Users className="h-4 w-4 text-white" />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        rotate: -360,
                        scale: [1, 1.2, 1],
                      }}
                      transition={{ 
                        rotate: { duration: 15, repeat: Infinity, ease: 'linear' },
                        scale: { duration: 3, repeat: Infinity }
                      }}
                      className="absolute -bottom-2 -left-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Hand className="h-4 w-4 text-white" />
                    </motion.div>
                    <motion.div
                      animate={{ 
                        rotate: 360,
                        y: [0, -10, 0],
                      }}
                      transition={{ 
                        rotate: { duration: 18, repeat: Infinity, ease: 'linear' },
                        y: { duration: 2, repeat: Infinity }
                      }}
                      className="absolute -top-2 left-1/2 transform -translate-x-1/2 -translate-y-full w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center shadow-lg"
                    >
                      <Globe className="h-4 w-4 text-white" />
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.h1
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
                  style={{
                    textShadow: '0 10px 40px rgba(0,0,0,0.3)',
                    transformStyle: 'preserve-3d',
                  }}
                >
                  <span className="bg-gradient-to-r from-white via-green-100 to-white bg-clip-text text-transparent">
                    {title}
                  </span>
                </motion.h1>
                
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  className="text-xl md:text-2xl text-green-100/90 mb-10 max-w-3xl mx-auto leading-relaxed"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  {subtitle}
                </motion.p>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="flex flex-col sm:flex-row gap-6 justify-center"
                  style={{ transformStyle: 'preserve-3d' }}
                >
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className="group"
                  >
                    <Link
                      href={primaryCTA.href}
                      className="relative bg-white text-green-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-green-50 transition-all inline-flex items-center justify-center shadow-2xl hover:shadow-green-500/50 overflow-hidden"
                      style={{
                        transformStyle: 'preserve-3d',
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-green-400 to-teal-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                        style={{ transform: 'translateZ(20px)' }}
                      />
                      <span className="relative z-10 flex items-center gap-3">
                        {primaryCTA.text}
                        <motion.div
                          animate={{ x: [0, 5, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          <Heart className="h-5 w-5 fill-current" />
                        </motion.div>
                      </span>
                    </Link>
                  </motion.div>
                  
                  {secondaryCTA && (
                    <motion.div
                      whileHover={{ scale: 1.05, y: -5 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Link
                        href={secondaryCTA.href}
                        className="relative bg-white/10 backdrop-blur-xl text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/20 transition-all inline-flex items-center justify-center border-2 border-white/30 hover:border-white/50 shadow-2xl"
                        style={{
                          transformStyle: 'preserve-3d',
                        }}
                      >
                        <span className="flex items-center gap-3">
                          {secondaryCTA.text}
                          <ArrowRight className="h-5 w-5" />
                        </span>
                      </Link>
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Floating 3D elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-white/30 rounded-full backdrop-blur-sm"
            initial={{
              x: Math.random() * dimensions.width,
              y: dimensions.height + 100,
              opacity: 0,
            }}
            animate={{
              y: -100,
              x: Math.random() * dimensions.width,
              opacity: [0, 0.8, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 4 + 3,
              repeat: Infinity,
              delay: Math.random() * 3,
              ease: 'linear'
            }}
            style={{
              boxShadow: '0 0 20px rgba(255,255,255,0.5)',
            }}
          />
        ))}
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2"
        >
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1 h-3 bg-white/50 rounded-full"
          />
        </motion.div>
      </motion.div>
    </section>
  )
}
