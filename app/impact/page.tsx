'use client'

import { useEffect, useState } from 'react'
import { Navigation } from '../../components/navigation'
import { Footer } from '../../components/footer'
import { supabase } from '../../lib/supabase/client'
import type { ImpactStat, CaseStudy, Report, Media } from '../../lib/types'
import Link from 'next/link'
import { ArrowRight, Download, Calendar } from 'lucide-react'

export default function ImpactPage() {
  const [stats, setStats] = useState<ImpactStat[]>([])
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([])
  const [reports, setReports] = useState<Report[]>([])
  const [mediaMap, setMediaMap] = useState<Record<string, Media>>({})

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    // Load impact stats
    const { data: statsData } = await supabase
      .from('ngo_impact_stats')
      .select('*')
      .eq('is_visible', true)
      .order('order_index', { ascending: true })

    if (statsData) setStats(statsData)

    // Load case studies
    const { data: caseData } = await supabase
      .from('ngo_case_studies')
      .select('*')
      .eq('status', 'published')
      .order('order_index', { ascending: true })
      .limit(6)

    if (caseData) setCaseStudies(caseData)

    // Load reports
    const { data: reportsData } = await supabase
      .from('ngo_reports')
      .select('*')
      .eq('status', 'published')
      .order('year', { ascending: false })

    if (reportsData) setReports(reportsData)

    // Load media
    const mediaIds = [
      ...(caseData || []).map(c => c.featured_image_id).filter(Boolean),
      ...(reportsData || []).map(r => r.file_id).filter(Boolean),
    ] as string[]

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

  // Group stats by year
  const statsByYear = stats.reduce((acc, stat) => {
    const year = stat.year || 'Overall'
    if (!acc[year]) acc[year] = []
    acc[year].push(stat)
    return acc
  }, {} as Record<string | number, ImpactStat[]>)

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-500 to-green-700 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Our Impact</h1>
            <p className="text-xl text-green-100 max-w-2xl">
              See the measurable difference we're making in communities around the world
            </p>
          </div>
        </section>

        {/* Overall Stats */}
        {stats.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">Overall Impact</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {stats.filter(s => !s.year).map((stat) => (
                  <div key={stat.id} className="text-center p-6 bg-green-50 rounded-lg">
                    <div className="text-4xl font-bold text-green-600 mb-2">{stat.value}</div>
                    <div className="text-gray-700">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Year-wise Impact */}
        {Object.keys(statsByYear).filter(k => k !== 'Overall').length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">Year-wise Impact</h2>
              {Object.entries(statsByYear)
                .filter(([year]) => year !== 'Overall')
                .sort(([a], [b]) => Number(b) - Number(a))
                .map(([year, yearStats]) => (
                  <div key={year} className="mb-12">
                    <h3 className="text-2xl font-semibold mb-6">{year}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      {yearStats.map((stat) => (
                        <div key={stat.id} className="bg-white p-6 rounded-lg shadow-sm">
                          <div className="text-3xl font-bold text-green-600 mb-2">{stat.value}</div>
                          <div className="text-gray-700">{stat.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Case Studies */}
        {caseStudies.length > 0 && (
          <section className="py-20 bg-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">Case Studies</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study) => {
                  const image = study.featured_image_id ? mediaMap[study.featured_image_id] : null
                  return (
                    <Link
                      key={study.id}
                      href={`/case-studies/${study.slug}`}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                    >
                      {image && (
                        <img
                          src={image.file_url}
                          alt={image.alt_text || study.title}
                          className="w-full h-48 object-cover"
                        />
                      )}
                      <div className="p-6">
                        <h3 className="text-xl font-semibold mb-2">{study.title}</h3>
                        {study.description && (
                          <p className="text-gray-600 mb-4 line-clamp-3">{study.description}</p>
                        )}
                        {study.location && (
                          <p className="text-sm text-gray-500 mb-2">📍 {study.location}</p>
                        )}
                        {study.year && (
                          <p className="text-sm text-gray-500">📅 {study.year}</p>
                        )}
                      </div>
                    </Link>
                  )
                })}
              </div>
            </div>
          </section>
        )}

        {/* Reports */}
        {reports.length > 0 && (
          <section className="py-20 bg-gray-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold mb-12 text-center">Reports & Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reports.map((report) => {
                  const file = report.file_id ? mediaMap[report.file_id] : null
                  return (
                    <div
                      key={report.id}
                      className="bg-white rounded-lg shadow-md p-6 hover:shadow-xl transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold mb-2">{report.title}</h3>
                          {report.description && (
                            <p className="text-gray-600 text-sm mb-2">{report.description}</p>
                          )}
                        </div>
                        {report.year && (
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-1" />
                            {report.year}
                          </div>
                        )}
                      </div>
                      {file && (
                        <a
                          href={file.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-green-600 hover:text-green-700 font-semibold"
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}

