import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase, getPublicUrl } from '@/app/lib/supabaseClient'
import { Project } from '@/app/lib/types'
import AnimatedFadeIn from '@/app/components/AnimatedFadeIn'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getProject(slug: string): Promise<Project | null> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('site', 'ngo')
    .eq('slug', slug)
    .single()

  return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const project = await getProject(resolvedParams.slug)

  if (!project) {
    return {
      title: 'Program Not Found',
    }
  }

  return {
    title: `${project.title} - DUAF Programs`,
    description: project.short_description || `Learn more about ${project.title}`,
  }
}

export default async function ProgramDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const project = await getProject(resolvedParams.slug)

  if (!project) {
    notFound()
  }

  return (
    <div className="pt-20">
      {/* Hero Image */}
      {project.cover_image_path && (
        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={getPublicUrl(project.cover_image_path)}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container-padding pb-12">
            <div className="max-w-4xl mx-auto">
              <Link href="/programs" className="inline-flex items-center gap-2 text-white mb-4 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Programs
              </Link>
              <h1 className="heading-1 text-white mb-4">{project.title}</h1>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="section-padding container-padding">
        <div className="max-w-4xl mx-auto">
          {!project.cover_image_path && (
            <div className="mb-8">
              <Link href="/programs" className="inline-flex items-center gap-2 text-primary mb-4 hover:text-primary-dark transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Programs
              </Link>
              <h1 className="heading-1 mb-4">{project.title}</h1>
            </div>
          )}

          {/* Meta Info */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-gray-200">
            {project.category && (
              <div>
                <span className="text-sm text-gray-500">Category</span>
                <p className="font-semibold">{project.category}</p>
              </div>
            )}
            {project.start_date && (
              <div>
                <span className="text-sm text-gray-500 flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Timeline
                </span>
                <p className="font-semibold">
                  {project.is_ongoing ? (
                    <>Started {new Date(project.start_date).toLocaleDateString()} • Ongoing</>
                  ) : (
                    <>
                      {new Date(project.start_date).toLocaleDateString()}
                      {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString()}`}
                    </>
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <AnimatedFadeIn>
            <div className="prose prose-lg max-w-none mb-12">
              {project.short_description && (
                <p className="text-xl text-gray-700 font-medium mb-6">{project.short_description}</p>
              )}
              {project.long_description && (
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {project.long_description}
                </div>
              )}
            </div>
          </AnimatedFadeIn>

          {/* Gallery */}
          {project.gallery_image_paths && project.gallery_image_paths.length > 0 && (
            <AnimatedFadeIn delay={0.2}>
              <div className="grid md:grid-cols-2 gap-4 mb-12">
                {project.gallery_image_paths.map((imagePath, index) => (
                  <div key={index} className="aspect-video rounded-lg overflow-hidden">
                    <img
                      src={getPublicUrl(imagePath)}
                      alt={`${project.title} - Image ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </AnimatedFadeIn>
          )}

          {/* CTA */}
          <AnimatedFadeIn delay={0.3}>
            <div className="card bg-primary/5 border-2 border-primary/20 text-center">
              <h3 className="heading-3 mb-4">Want to Get Involved?</h3>
              <p className="text-gray-700 mb-6">
                Learn how you can support this program and make a difference in your community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact" className="btn">
                  Contact Us
                </Link>
                <Link href="/campaigns" className="btn-outline">
                  Support a Campaign
                </Link>
              </div>
            </div>
          </AnimatedFadeIn>
        </div>
      </section>
    </div>
  )
}

