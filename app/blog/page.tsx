import { Metadata } from 'next'
import SectionTitle from '../components/SectionTitle'
import AnimatedFadeIn from '../components/AnimatedFadeIn'
import { supabase, getPublicUrl } from '../lib/supabaseClient'
import { BlogPost } from '../lib/types'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Blog - DUAF',
  description: 'Stay updated with our latest news, stories, and insights.',
}

async function getBlogPosts(): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('site', 'ngo')
    .eq('is_published', true)
    .order('published_at', { ascending: false })

  return data || []
}

export default async function BlogPage() {
  const posts = await getBlogPosts()

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding container-padding bg-gradient-to-br from-primary/10 via-secondary/10 to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedFadeIn>
            <h1 className="heading-1 mb-6">Our Blog</h1>
            <p className="text-xl text-gray-700">
              Stay updated with our latest news, stories, and insights from the field.
            </p>
          </AnimatedFadeIn>
        </div>
      </section>

      {/* Blog Posts */}
      {posts.length > 0 ? (
        <section className="section-padding container-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post, index) => (
                <AnimatedFadeIn key={post.id} delay={index * 0.1}>
                  <Link href={`/blog/${post.slug}`} className="card group hover:shadow-xl transition-all block">
                    {post.featured_image_path && (
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                        <img
                          src={getPublicUrl(post.featured_image_path)}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {post.category && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-full mb-3">
                        {post.category}
                      </span>
                    )}
                    <h3 className="heading-3 mb-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {post.excerpt}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {post.published_at && (
                          <span>
                            {new Date(post.published_at).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="section-padding container-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <h3 className="heading-3 mb-4">No Posts Yet</h3>
              <p className="text-gray-600">
                We're working on creating great content. Check back soon!
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

