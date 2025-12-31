'use client'

import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import type { BlogPost, Media } from '../lib/types'

interface BlogPreviewListProps {
  posts: BlogPost[]
  mediaMap?: Record<string, Media>
  limit?: number
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut' as const
    }
  }
}

export function BlogPreviewList({ posts, mediaMap = {}, limit = 3 }: BlogPreviewListProps) {
  const displayPosts = posts.slice(0, limit)

  if (displayPosts.length === 0) {
    return null
  }

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      variants={containerVariants}
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={itemVariants}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Latest Stories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Read about our impact, stories from the field, and updates on our programs
          </p>
        </motion.div>
        <motion.div
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {displayPosts.map((post) => {
            const image = post.featured_image_id ? mediaMap[post.featured_image_id] : null
            return (
              <motion.article
                key={post.id}
                variants={itemVariants}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 group cursor-pointer"
              >
                <div className="relative overflow-hidden">
                  {image && (
                    <motion.img
                      src={image.file_url}
                      alt={image.alt_text || post.title}
                      className="w-full h-48 object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  />
                </div>
                <div className="p-6">
                  {post.published_at && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center text-sm text-gray-500 mb-2"
                    >
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(post.published_at).toLocaleDateString()}
                    </motion.div>
                  )}
                  <h3 className="text-xl font-semibold mb-2 text-gray-900 group-hover:text-green-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.excerpt && (
                    <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                  )}
                  <motion.div
                    whileHover={{ x: 5 }}
                  >
                    <Link
                      href={`/blog/${post.slug}`}
                      className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center group/link"
                    >
                      Read More <ArrowRight className="ml-2 h-4 w-4 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                  </motion.div>
                </div>
              </motion.article>
            )
          })}
        </motion.div>
        <motion.div
          variants={itemVariants}
          className="text-center mt-12"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
            >
              View All Posts <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  )
}

