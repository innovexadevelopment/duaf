'use client'

import Link from 'next/link'
import { Heart, Hand, Users } from 'lucide-react'
import { motion } from 'framer-motion'

interface CTASectionProps {
  title?: string
  description?: string
  primaryCTA?: { text: string; href: string; icon?: any }
  secondaryCTA?: { text: string; href: string; icon?: any }
}

export function CTASection({
  title = "Together, We Can Make a Difference",
  description = "Your support helps us continue our mission to create positive change in communities around the world",
  primaryCTA = { text: "Donate Now", href: "/get-involved", icon: Heart },
  secondaryCTA = { text: "Become a Volunteer", href: "/get-involved", icon: Hand }
}: CTASectionProps) {
  const PrimaryIcon = primaryCTA.icon || Heart
  const SecondaryIcon = secondaryCTA?.icon || Users

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.2
          }
        }
      }}
      className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white relative overflow-hidden"
    >
      {/* Animated background pattern */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%'],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          repeatType: 'reverse',
          ease: 'linear'
        }}
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <motion.h2
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          {title}
        </motion.h2>
        <motion.p
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="text-xl text-green-100 mb-8 max-w-2xl mx-auto"
        >
          {description}
        </motion.p>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.div
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href={primaryCTA.href}
              className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-all inline-flex items-center justify-center shadow-lg hover:shadow-xl"
            >
              {primaryCTA.text} <PrimaryIcon className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
          {secondaryCTA && (
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link
                href={secondaryCTA.href}
                className="bg-green-800/80 backdrop-blur-sm text-white px-8 py-3 rounded-full font-semibold hover:bg-green-700 transition-all inline-flex items-center justify-center border-2 border-white/20 hover:border-white/40 shadow-lg hover:shadow-xl"
              >
                {secondaryCTA.text} <SecondaryIcon className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.section>
  )
}

