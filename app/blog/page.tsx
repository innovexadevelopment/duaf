'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '../../components/navigation'
import { Footer } from '../../components/footer'
import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import type { BlogPost, Media } from '../../lib/types'

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 9

  useEffect(() => {
    loadPosts()
  }, [selectedCategory, currentPage])

  async function loadPosts() {
    let query = supabase
      .from('ngo_blogs')
      .select('*')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range((currentPage - 1) * postsPerPage, currentPage * postsPerPage - 1)

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory)
    }

    const { data } = await query

    if (data) {
      setPosts(data)

      const cats = Array.from(new Set(data.map(p => p.category).filter(Boolean))) as string[]
      setCategories(cats)

      const imageIds = data.map(p => p.featured_image_id).filter(Boolean) as string[]
      if (imageIds.length > 0) {
        const { data: mediaData } = await supabase
          .from('ngo_media')
          .select('*')
          .in('id', imageIds)

        if (mediaData) {
          const map: Record<string, Media> = {}
          mediaData.forEach(m => { map[m.id] = m })
          setMediaMap(map)
        }
      }
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-500 to-green-700 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl text-green-100 max-w-2xl">
              Stories from the field, impact updates, and insights from our work
            </p>
          </div>
        </section>

        {/* Filter */}
        {categories.length > 0 && (
          <section className="bg-white border-b py-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => { setSelectedCategory('all'); setCurrentPage(1) }}
                  className={`px-4 py-2 rounded-full transition-colors ${
                    selectedCategory === 'all'
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1) }}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      selectedCategory === cat
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Posts Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {posts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No posts found.</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {posts.map((post) => {
                    const image = post.featured_image_id ? mediaMap[post.featured_image_id] : null
                    return (
                      <article
                        key={post.id}
                        className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                      >
                        {image && (
                          <img
                            src={image.file_url}
                            alt={image.alt_text || post.title}
                            className="w-full h-48 object-cover"
                          />
                        )}
                        <div className="p-6">
                          {post.published_at && (
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <Calendar className="h-4 w-4 mr-2" />
                              {new Date(post.published_at).toLocaleDateString()}
                            </div>
                          )}
                          {post.category && (
                            <div className="flex items-center text-sm text-green-600 mb-2">
                              <Tag className="h-4 w-4 mr-1" />
                              {post.category}
                            </div>
                          )}
                          <h3 className="text-xl font-semibold mb-2 text-gray-900">
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-gray-600 mb-4 line-clamp-3">{post.excerpt}</p>
                          )}
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center"
                          >
                            Read More <ArrowRight className="ml-2 h-4 w-4" />
                          </Link>
                        </div>
                      </article>
                    )
                  })}
                </div>

                {/* Pagination */}
                <div className="flex justify-center mt-12 gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={posts.length < postsPerPage}
                    className="px-4 py-2 bg-white border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

