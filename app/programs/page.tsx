'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '../../components/navigation'
import { Footer } from '../../components/footer'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import type { Program, Media } from '../../lib/types'

export default function ProgramsPage() {
  const [programs, setPrograms] = useState<Program[]>([])
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({})
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [categories, setCategories] = useState<string[]>([])

  useEffect(() => {
    loadPrograms()
  }, [selectedCategory])

  async function loadPrograms() {
    let query = supabase
      .from('ngo_programs')
      .select('*')
      .eq('status', 'published')
      .order('order_index', { ascending: true })

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory)
    }

    const { data } = await query

    if (data) {
      setPrograms(data)

      // Extract unique categories
      const cats = Array.from(new Set(data.map(p => p.category).filter(Boolean))) as string[]
      setCategories(cats)

      // Load media
      const mediaIds = data.map(p => p.featured_image_id).filter(Boolean) as string[]
      if (mediaIds.length > 0) {
        const { data: mediaData } = await supabase
          .from('ngo_media')
          .select('*')
          .in('id', mediaIds)

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Programs</h1>
            <p className="text-xl text-green-100 max-w-2xl">
              Discover how we're making a difference through our various initiatives and programs
            </p>
          </div>
        </section>

        {/* Filter */}
        {categories.length > 0 && (
          <section className="bg-white border-b py-4">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
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
                    onClick={() => setSelectedCategory(cat)}
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

        {/* Programs Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {programs.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No programs found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {programs.map((program) => {
                  const image = program.featured_image_id ? mediaMap[program.featured_image_id] : null
                  return (
                    <div
                      key={program.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {image ? (
                        <img
                          src={image.file_url}
                          alt={image.alt_text || program.title}
                          className="w-full h-48 object-cover"
                        />
                      ) : (
                        <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
                      )}
                      <div className="p-6">
                        {program.category && (
                          <span className="text-sm text-green-600 font-semibold">
                            {program.category}
                          </span>
                        )}
                        <h3 className="text-xl font-semibold mb-2 text-gray-900 mt-2">
                          {program.title}
                        </h3>
                        {program.description && (
                          <p className="text-gray-600 mb-4 line-clamp-3">{program.description}</p>
                        )}
                        <Link
                          href={`/programs/${program.slug}`}
                          className="text-green-600 hover:text-green-700 font-semibold inline-flex items-center"
                        >
                          View Program <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

