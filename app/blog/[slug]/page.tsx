import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase, getPublicUrl } from '@/app/lib/supabaseClient'
import { BlogPost } from '@/app/lib/types'
import AnimatedFadeIn from '@/app/components/AnimatedFadeIn'
import Link from 'next/link'
import { ArrowLeft, Calendar, User } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('site', 'ngo')
    .eq('slug', slug)
    .eq('is_published', true)
    .single()

  return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  return {
    title: `${post.title} - DUAF Blog`,
    description: post.excerpt || post.title,
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  const resolvedParams = await params
  const post = await getBlogPost(resolvedParams.slug)

  if (!post) {
    notFound()
  }

  return (
    <div className="pt-20">
      {/* Hero Image */}
      {post.featured_image_path && (
        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={getPublicUrl(post.featured_image_path)}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container-padding pb-12">
            <div className="max-w-4xl mx-auto">
              <Link href="/blog" className="inline-flex items-center gap-2 text-white mb-4 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
              <h1 className="heading-1 text-white mb-4">{post.title}</h1>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="section-padding container-padding">
        <div className="max-w-4xl mx-auto">
          {!post.featured_image_path && (
            <div className="mb-8">
              <Link href="/blog" className="inline-flex items-center gap-2 text-primary mb-4 hover:text-primary-dark transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Blog
              </Link>
              <h1 className="heading-1 mb-4">{post.title}</h1>
            </div>
          )}

          {/* Meta Info */}
          <AnimatedFadeIn>
            <div className="flex flex-wrap items-center gap-6 mb-8 pb-8 border-b border-gray-200">
              {post.published_at && (
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(post.published_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
              {post.author_name && (
                <div className="flex items-center gap-2 text-gray-600">
                  <User className="h-4 w-4" />
                  <span>{post.author_name}</span>
                </div>
              )}
              {post.category && (
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full">
                  {post.category}
                </span>
              )}
            </div>
          </AnimatedFadeIn>

          {/* Content */}
          <AnimatedFadeIn delay={0.1}>
            <div className="prose prose-lg max-w-none">
              {post.excerpt && (
                <p className="text-xl text-gray-700 font-medium mb-6">{post.excerpt}</p>
              )}
              <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                {post.content}
              </div>
            </div>
          </AnimatedFadeIn>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <AnimatedFadeIn delay={0.2}>
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </AnimatedFadeIn>
          )}
        </div>
      </section>
    </div>
  )
}

