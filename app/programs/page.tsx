import { Metadata } from 'next'
import SectionTitle from '../components/SectionTitle'
import AnimatedFadeIn from '../components/AnimatedFadeIn'
import { supabase, getPublicUrl } from '../lib/supabaseClient'
import { Project } from '../lib/types'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Our Programs - DUAF',
  description: 'Explore the impactful programs and initiatives we run to create positive change.',
}

async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('site', 'ngo')
    .order('created_at', { ascending: false })

  return data || []
}

export default async function ProgramsPage() {
  const projects = await getProjects()

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding container-padding bg-gradient-to-br from-primary/10 via-secondary/10 to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedFadeIn>
            <h1 className="heading-1 mb-6">Our Programs</h1>
            <p className="text-xl text-gray-700">
              Discover the impactful initiatives we're running to create positive change in our communities.
            </p>
          </AnimatedFadeIn>
        </div>
      </section>

      {/* Programs Grid */}
      <section className="section-padding container-padding">
        <div className="max-w-7xl mx-auto">
          {projects.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <AnimatedFadeIn key={project.id} delay={index * 0.1}>
                  <Link href={`/programs/${project.slug}`} className="card group hover:shadow-xl transition-all block">
                    {project.cover_image_path && (
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                        <img
                          src={getPublicUrl(project.cover_image_path)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {project.category && (
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-3">
                        {project.category}
                      </span>
                    )}
                    <h3 className="heading-3 mb-2 group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {project.short_description}
                    </p>
                    {project.start_date && (
                      <div className="text-sm text-gray-500 mb-4">
                        {project.is_ongoing ? (
                          <span>Started {new Date(project.start_date).toLocaleDateString()} • Ongoing</span>
                        ) : (
                          <span>
                            {new Date(project.start_date).toLocaleDateString()}
                            {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                </AnimatedFadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">No programs available at the moment.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

