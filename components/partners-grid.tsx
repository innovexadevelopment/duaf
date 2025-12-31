'use client'

import { motion } from 'framer-motion'
import type { Partner, Media } from '../lib/types'

interface PartnersGridProps {
  partners: Partner[]
  mediaMap?: Record<string, Media>
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut' as const
    }
  }
}

export function PartnersGrid({ partners, mediaMap = {} }: PartnersGridProps) {
  if (partners.length === 0) {
    return null
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="py-20 bg-gray-50"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Partners & Supporters
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Together with our partners, we create lasting positive change
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center"
        >
          {partners.map((partner) => {
            const logo = partner.logo_id ? mediaMap[partner.logo_id] : null
            return (
              <motion.div
                key={partner.id}
                variants={itemVariants}
                whileHover={{ scale: 1.1, y: -5 }}
                className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-lg transition-all duration-300"
              >
                {partner.website_url ? (
                  <a
                    href={partner.website_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full h-20 flex items-center justify-center"
                  >
                    {logo ? (
                      <motion.img
                        src={logo.file_url}
                        alt={logo.alt_text || partner.name}
                        className="max-w-full max-h-full object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm text-center">{partner.name}</span>
                    )}
                  </a>
                ) : (
                  <div className="w-full h-20 flex items-center justify-center">
                    {logo ? (
                      <motion.img
                        src={logo.file_url}
                        alt={logo.alt_text || partner.name}
                        className="max-w-full max-h-full object-contain"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.3 }}
                      />
                    ) : (
                      <span className="text-gray-400 text-sm text-center">{partner.name}</span>
                    )}
                  </div>
                )}
              </motion.div>
            )
          })}
        </motion.div>
      </div>
    </motion.section>
  )
}

