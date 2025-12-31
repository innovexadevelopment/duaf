'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '../../components/navigation'
import { Footer } from '../../components/footer'
import { supabase } from '../../lib/supabase/client'
import type { Page, Section, ContentBlock, Media } from '../../lib/types'

export default function DynamicPage() {
  const params = useParams()
  const slug = params.slug as string
  const [page, setPage] = useState<Page | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [blocks, setBlocks] = useState<Record<string, ContentBlock[]>>({})
  const [media, setMedia] = useState<Record<string, Media>>({})

  useEffect(() => {
    if (slug) {
      loadPage()
    }
  }, [slug])

  async function loadPage() {
    // Get page
    const { data: pageData } = await supabase
      .from('ngo_pages')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!pageData) return

    setPage(pageData)

    // Load sections
    const { data: sectionsData } = await supabase
      .from('ngo_sections')
      .select('*')
      .eq('page_id', pageData.id)
      .eq('is_visible', true)
      .order('order_index', { ascending: true })

    if (sectionsData) {
      setSections(sectionsData)

      // Load content blocks for each section
      const blocksMap: Record<string, ContentBlock[]> = {}
      for (const section of sectionsData) {
        const { data: blocksData } = await supabase
          .from('ngo_content_blocks')
          .select('*')
          .eq('section_id', section.id)
          .eq('is_visible', true)
          .order('order_index', { ascending: true })

        if (blocksData) {
          blocksMap[section.id] = blocksData

          // Load media for image blocks
          for (const block of blocksData) {
            if (block.type === 'image' && block.content.media_id) {
              const { data: mediaData } = await supabase
                .from('ngo_media')
                .select('*')
                .eq('id', block.content.media_id)
                .single()

              if (mediaData) {
                setMedia((prev) => ({
                  ...prev,
                  [block.content.media_id]: mediaData,
                }))
              }
            }
          }
        }
      }
      setBlocks(blocksMap)
    }
  }

  function renderBlock(block: ContentBlock) {
    switch (block.type) {
      case 'heading':
        const level = block.content.level || 2
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag className="text-3xl font-bold mb-4 text-gray-900">
            {block.content.text}
          </HeadingTag>
        )

      case 'paragraph':
        return (
          <p className="text-lg text-gray-700 mb-4 leading-relaxed">
            {block.content.text}
          </p>
        )

      case 'image':
        const imageMedia = block.content.media_id
          ? media[block.content.media_id]
          : null
        if (imageMedia) {
          return (
            <div className="my-8">
              <img
                src={imageMedia.file_url}
                alt={imageMedia.alt_text || ''}
                className="w-full rounded-lg shadow-lg"
              />
              {imageMedia.caption && (
                <p className="text-sm text-gray-600 mt-2 text-center">
                  {imageMedia.caption}
                </p>
              )}
            </div>
          )
        }
        return null

      case 'cta':
        return (
          <div className="my-8 text-center">
            <a
              href={block.content.url || '#'}
              className="inline-block bg-primary text-white px-8 py-3 rounded-full font-semibold hover:bg-primary-dark transition-colors"
            >
              {block.content.text || 'Learn More'}
            </a>
          </div>
        )

      default:
        return null
    }
  }

  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Page Not Found</h1>
          <p className="text-gray-600">The page you're looking for doesn't exist.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Page Header */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold">{page.title}</h1>
          </div>
        </section>

        {/* Page Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
            {sections.map((section) => (
              <div
                key={section.id}
                className="mb-12"
                style={{
                  backgroundColor: section.background_color || 'transparent',
                  paddingTop: `${section.padding_top || 0}px`,
                  paddingBottom: `${section.padding_bottom || 0}px`,
                }}
              >
                {section.background_image_url && (
                  <div
                    className="absolute inset-0 bg-cover bg-center opacity-10"
                    style={{ backgroundImage: `url(${section.background_image_url})` }}
                  />
                )}
                {section.title && (
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">{section.title}</h2>
                )}
                <div className="space-y-4">
                  {blocks[section.id]?.map((block) => (
                    <div key={block.id}>{renderBlock(block)}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

