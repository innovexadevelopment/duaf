'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Navigation } from '../../../components/navigation'
import { Footer } from '../../../components/footer'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { supabase } from '../../../lib/supabase/client'
import type { Program, Media } from '../../../lib/types'

export default function ProgramDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [program, setProgram] = useState<Program | null>(null)
  const [featuredImage, setFeaturedImage] = useState<Media | null>(null)
  const [relatedPrograms, setRelatedPrograms] = useState<Program[]>([])

  useEffect(() => {
    if (slug) {
      loadProgram()
    }
  }, [slug])

  async function loadProgram() {
    const { data: programData } = await supabase
      .from('ngo_programs')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'published')
      .single()

    if (!programData) return

    setProgram(programData)

    // Load featured image
    if (programData.featured_image_id) {
      const { data: imageData } = await supabase
        .from('ngo_media')
        .select('*')
        .eq('id', programData.featured_image_id)
        .single()

      if (imageData) setFeaturedImage(imageData)
    }

    // Load related programs
    const { data: relatedData } = await supabase
      .from('ngo_programs')
      .select('*')
      .eq('status', 'published')
      .eq('category', programData.category)
      .neq('id', programData.id)
      .limit(3)

    if (relatedData) setRelatedPrograms(relatedData)
  }

  if (!program) {
    return (
      <div className="min-h-screen">
        <Navigation />
        <main className="pt-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <p>Program not found.</p>
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
              href="/programs"
              className="inline-flex items-center text-green-100 hover:text-white mb-4"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Programs
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{program.title}</h1>
            {program.description && (
              <p className="text-xl text-green-100 max-w-3xl">{program.description}</p>
            )}
          </div>
        </section>

        {/* Content */}
        <section className="py-12 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              {featuredImage && (
                <img
                  src={featuredImage.file_url}
                  alt={featuredImage.alt_text || program.title}
                  className="w-full rounded-lg mb-8"
                />
              )}

              {program.content && (
                <div
                  className="prose prose-lg max-w-none mb-8"
                  dangerouslySetInnerHTML={{ __html: program.content }}
                />
              )}

              {program.metadata && (
                <div className="bg-green-50 rounded-lg p-6 mb-8">
                  <h3 className="text-xl font-semibold mb-4">Program Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {program.category && (
                      <div>
                        <span className="text-sm text-gray-600">Category</span>
                        <p className="font-semibold">{program.category}</p>
                      </div>
                    )}
                    {program.metadata.location && (
                      <div>
                        <span className="text-sm text-gray-600">Location</span>
                        <p className="font-semibold">{program.metadata.location}</p>
                      </div>
                    )}
                    {program.metadata.duration && (
                      <div>
                        <span className="text-sm text-gray-600">Duration</span>
                        <p className="font-semibold">{program.metadata.duration}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* CTA */}
              <div className="bg-green-600 text-white rounded-lg p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Want to Support This Program?</h3>
                <p className="mb-6">Your contribution helps us continue this important work</p>
                <Link
                  href="/get-involved"
                  className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors inline-block"
                >
                  Get Involved
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Related Programs */}
        {relatedPrograms.length > 0 && (
          <section className="py-12 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-8">Related Programs</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {relatedPrograms.map((related) => (
                  <Link
                    key={related.id}
                    href={`/programs/${related.slug}`}
                    className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                  >
                    <div className="h-48 bg-gradient-to-br from-green-400 to-green-600"></div>
                    <div className="p-6">
                      <h3 className="text-xl font-semibold mb-2">{related.title}</h3>
                      {related.description && (
                        <p className="text-gray-600 line-clamp-2">{related.description}</p>
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

