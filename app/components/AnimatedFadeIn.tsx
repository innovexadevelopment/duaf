'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedFadeInProps {
  children: ReactNode
  delay?: number
}

export default function AnimatedFadeIn({ children, delay = 0 }: AnimatedFadeInProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.6, delay }}
    >
      {children}
    </motion.div>
  )
}

