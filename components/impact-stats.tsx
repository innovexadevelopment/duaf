'use client'

import { Users, Globe, Award, Hand, TrendingUp, Heart, Sparkles } from 'lucide-react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import type { ImpactStat } from '../lib/types'

interface ImpactStatsProps {
  stats: ImpactStat[]
}

const iconMap: Record<string, any> = {
  users: Users,
  globe: Globe,
  award: Award,
  hand: Hand,
  trending: TrendingUp,
  heart: Heart,
  sparkles: Sparkles,
}

function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const [displayValue, setDisplayValue] = useState<string>(value)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true)
          
          const numericValue = parseInt(value.replace(/[^0-9]/g, '')) || 0
          const suffix = value.replace(/[0-9]/g, '')
          
          if (numericValue === 0) {
            setDisplayValue(value)
            return
          }

          setDisplayValue('0' + suffix)
          const steps = 60
          const increment = numericValue / (steps * duration)
          let current = 0

          const timer = setInterval(() => {
            current += increment
            if (current >= numericValue) {
              setDisplayValue(suffix ? `${numericValue}${suffix}` : String(numericValue))
              clearInterval(timer)
            } else {
              setDisplayValue(suffix ? `${Math.floor(current)}${suffix}` : String(Math.floor(current)))
            }
          }, (duration * 1000) / steps)

          return () => clearInterval(timer)
        }
      },
      { threshold: 0.3 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [value, hasAnimated, duration])

  return <div ref={ref}>{displayValue}</div>
}

function StatCard3D({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  
  const mouseXSpring = useSpring(x, { stiffness: 500, damping: 100 })
  const mouseYSpring = useSpring(y, { stiffness: 500, damping: 100 })
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ['5deg', '-5deg'])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ['-5deg', '5deg'])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
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

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      className="perspective-1000"
      style={{ transformStyle: 'preserve-3d' }}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="transform-gpu"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}

export function ImpactStats({ stats }: ImpactStatsProps) {
  const [isVisible, setIsVisible] = useState(true)
  const sectionRef = useRef<HTMLElement>(null)

  // Filter stats to only show visible ones, or use fallback if no visible stats
  const visibleStats = (stats || []).filter(stat => stat.is_visible !== false)
  const displayStats = visibleStats.length > 0 ? visibleStats : [
    { id: '1', label: 'Lives Impacted', value: '10K+', icon: 'users', order_index: 0, is_visible: true },
    { id: '2', label: 'Communities', value: '50+', icon: 'globe', order_index: 1, is_visible: true },
    { id: '3', label: 'Programs', value: '100+', icon: 'award', order_index: 2, is_visible: true },
    { id: '4', label: 'Volunteers', value: '5K+', icon: 'hand', order_index: 3, is_visible: true },
  ]

  useEffect(() => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect()
      const isInView = rect.top < window.innerHeight && rect.bottom > 0
      if (isInView) {
        setIsVisible(true)
      }
    }
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    )
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }
    
    return () => {
      observer.disconnect()
    }
  }, [])

  return (
    <motion.section
      ref={sectionRef}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1
          }
        }
      }}
      className="py-24 bg-gradient-to-b from-white via-green-50/50 to-white relative z-10 overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-400 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-teal-400 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-6"
          >
            <TrendingUp className="h-8 w-8 text-green-600" />
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Our <span className="bg-gradient-to-r from-green-600 to-teal-600 bg-clip-text text-transparent">Impact</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Numbers that reflect our commitment to making a difference
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {displayStats.map((stat, index) => {
            const Icon = stat.icon ? iconMap[stat.icon.toLowerCase()] || Heart : Heart
            return (
              <StatCard3D key={stat.id} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -10, scale: 1.05 }}
                  className="relative h-full bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl hover:shadow-2xl border border-green-100 group cursor-pointer"
                  style={{
                    transformStyle: 'preserve-3d',
                  }}
                >
                  {/* Gradient overlay on hover */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl"
                  />
                  
                  {/* Icon with 3D effect */}
                  <div className="relative mb-6" style={{ transform: 'translateZ(20px)' }}>
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.2 }}
                      transition={{ duration: 0.6 }}
                      className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl shadow-lg group-hover:shadow-xl"
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>
                  </div>

                  {/* Value */}
                  <div 
                    className="text-4xl md:text-5xl font-extrabold text-black mb-3"
                    style={{ transform: 'translateZ(30px)' }}
                  >
                    <AnimatedCounter value={stat.value} />
                  </div>

                  {/* Label */}
                  <div 
                    className="text-gray-600 font-semibold"
                    style={{ transform: 'translateZ(25px)' }}
                  >
                    {stat.label}
                  </div>

                  {/* Corner accent */}
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-green-500/20 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </motion.div>
              </StatCard3D>
            )
          })}
        </div>
      </div>
    </motion.section>
  )
}
