'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '../../../components/navigation'
import { Footer } from '../../../components/footer'
import { supabase } from '../../../lib/supabase/client'
import type { Page, Section, ContentBlock } from '../../../lib/types'

export default function LegalPage() {
  const params = useParams()
  const slug = params.slug as string
  const [page, setPage] = useState<Page | null>(null)
  const [sections, setSections] = useState<Section[]>([])
  const [blocks, setBlocks] = useState<Record<string, ContentBlock[]>>({})

  useEffect(() => {
    if (slug) {
      loadPage()
    }
  }, [slug])

  async function loadPage() {
    const { data: pageData } = await supabase
      .from('ngo_pages')
      .select('*')
      .eq('slug', `legal/${slug}`)
      .eq('status', 'published')
      .single()

    if (!pageData) return

    setPage(pageData)

    const { data: sectionsData } = await supabase
      .from('ngo_sections')
      .select('*')
      .eq('page_id', pageData.id)
      .eq('is_visible', true)
      .order('order_index', { ascending: true })

    if (sectionsData) {
      setSections(sectionsData)

      const sectionIds = sectionsData.map(s => s.id)
      const { data: blocksData } = await supabase
        .from('ngo_content_blocks')
        .select('*')
        .in('section_id', sectionIds)
        .eq('is_visible', true)
        .order('order_index', { ascending: true })

      if (blocksData) {
        const blocksMap: Record<string, ContentBlock[]> = {}
        blocksData.forEach(block => {
          if (!blocksMap[block.section_id]) blocksMap[block.section_id] = []
          blocksMap[block.section_id].push(block)
        })
        setBlocks(blocksMap)
      }
    }
  }

  function renderContentBlock(block: ContentBlock) {
    switch (block.type) {
      case 'heading':
        const level = block.content.level || 2
        const HeadingTag = `h${level}` as keyof JSX.IntrinsicElements
        return (
          <HeadingTag className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
            {block.content.text}
          </HeadingTag>
        )
      case 'paragraph':
        return (
          <p className="text-gray-600 mb-4 leading-relaxed">
            {block.content.text}
          </p>
        )
      default:
        return null
    }
  }

  if (!page) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p>Page not found.</p>
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
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gray-900">
              {page.title}
            </h1>

            {sections.map((section) => (
              <section
                key={section.id}
                className="mb-12"
                style={{
                  backgroundColor: section.background_color || undefined,
                  paddingTop: `${section.padding_top}px`,
                  paddingBottom: `${section.padding_bottom}px`,
                }}
              >
                {section.title && (
                  <h2 className="text-3xl font-bold mb-6 text-gray-900">{section.title}</h2>
                )}
                {blocks[section.id]?.map(block => (
                  <div key={block.id}>{renderContentBlock(block)}</div>
                ))}
              </section>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

