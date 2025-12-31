'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '../../components/navigation'
import { Footer } from '../../components/footer'
import { supabase } from '../../lib/supabase/client'
import type { Partner, Media } from '../../lib/types'
import Link from 'next/link'
import { ExternalLink } from 'lucide-react'

export default function PartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({})
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  useEffect(() => {
    loadPartners()
  }, [selectedCategory])

  async function loadPartners() {
    let query = supabase
      .from('ngo_partners')
      .select('*')
      .eq('is_visible', true)
      .order('order_index', { ascending: true })

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory)
    }

    const { data } = await query

    if (data) {
      setPartners(data)

      const cats = Array.from(new Set(data.map(p => p.category).filter(Boolean))) as string[]
      setCategories(cats)

      const logoIds = data.map(p => p.logo_id).filter(Boolean) as string[]
      if (logoIds.length > 0) {
        const { data: mediaData } = await supabase
          .from('ngo_media')
          .select('*')
          .in('id', logoIds)

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
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Partners</h1>
            <p className="text-xl text-green-100 max-w-2xl">
              Together with our partners and supporters, we create lasting positive change
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

        {/* Partners Grid */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {partners.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No partners found.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                {partners.map((partner) => {
                  const logo = partner.logo_id ? mediaMap[partner.logo_id] : null
                  return (
                    <div
                      key={partner.id}
                      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow flex items-center justify-center"
                    >
                      {partner.website_url ? (
                        <a
                          href={partner.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full h-24 flex flex-col items-center justify-center"
                        >
                          {logo ? (
                            <>
                              <img
                                src={logo.file_url}
                                alt={logo.alt_text || partner.name}
                                className="max-w-full max-h-16 object-contain mb-2"
                              />
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            </>
                          ) : (
                            <span className="text-gray-400 text-sm text-center">{partner.name}</span>
                          )}
                        </a>
                      ) : (
                        <div className="w-full h-24 flex items-center justify-center">
                          {logo ? (
                            <img
                              src={logo.file_url}
                              alt={logo.alt_text || partner.name}
                              className="max-w-full max-h-16 object-contain"
                            />
                          ) : (
                            <span className="text-gray-400 text-sm text-center">{partner.name}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-green-600 text-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Become a Partner</h2>
            <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
              Join us in creating positive change. Partner with us to make a lasting impact.
            </p>
            <Link
              href="/get-involved"
              className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors inline-block"
            >
              Get Involved
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

