'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '../../../components/navigation'
import { Footer } from '../../../components/footer'
import Link from 'next/link'
import { ArrowLeft, Calendar, Tag, Share2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase/client'
import type { BlogPost, Media } from '../../../lib/types'

export default function BlogPostPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [featuredImage, setFeaturedImage] = useState<Media | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])

  useEffect(() => {
    if (slug) {
      loadPost()
    }
  }, [slug])

  async function loadPost() {
    const { data: postData } = await supabase
      .from('ngo_blogs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!postData) return

    setPost(postData)

    // Increment view count
    await supabase
      .from('ngo_blogs')
      .update({ view_count: (postData.view_count || 0) + 1 })
      .eq('id', postData.id)

    // Load featured image
    if (postData.featured_image_id) {
      const { data: imageData } = await supabase
        .from('ngo_media')
        .select('*')
        .eq('id', postData.featured_image_id)
        .single()

      if (imageData) setFeaturedImage(imageData)
    }

    // Load related posts
    const { data: relatedData } = await supabase
      .from('ngo_blogs')
      .select('*')
      .eq('status', 'published')
      .eq('category', postData.category)
      .neq('id', postData.id)
      .limit(3)

    if (relatedData) setRelatedPosts(relatedData)
  }

  if (!post) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p>Post not found.</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative bg-gradient-to-br from-green-500 to-green-700 text-white py-20">
          {featuredImage && (
            <div className="absolute inset-0 opacity-20">
              <img src={featuredImage.file_url} alt="" className="w-full h-full object-cover" />
            </div>
          )}
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <Link
              href="/blog"
              className="inline-flex items-center text-green-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Blog
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-green-100">
              {post.published_at && (
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  {new Date(post.published_at).toLocaleDateString()}
                </div>
              )}
              {post.category && (
                <div className="flex items-center">
                  <Tag className="h-4 w-4 mr-2" />
                  {post.category}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {featuredImage && (
                <img
                  src={featuredImage.file_url}
                  alt={featuredImage.alt_text || post.title}
                  className="w-full rounded-lg mb-8"
                />
              )}

              <div
                className="prose prose-lg max-w-none mb-8"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />

              {/* Share */}
              <div className="border-t pt-8 mt-8">
                <h3 className="text-lg font-semibold mb-4">Share this post</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: post.title,
                          url: window.location.href,
                        })
                      }
                    }}
                    className="flex items-center text-green-600 hover:text-green-700"
                  >
                    <Share2 className="h-5 w-5 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPosts.map((related) => (
                  <Link
                    key={related.id}
                    href={`/blog/${related.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{related.title}</h3>
                      {related.excerpt && (
                        <p className="text-gray-600 line-clamp-2">{related.excerpt}</p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

