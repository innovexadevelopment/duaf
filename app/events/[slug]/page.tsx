import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase, getPublicUrl } from '@/app/lib/supabaseClient'
import { Event } from '@/app/lib/types'
import AnimatedFadeIn from '@/app/components/AnimatedFadeIn'
import Link from 'next/link'
import { ArrowLeft, Calendar, MapPin, ExternalLink } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getEvent(slug: string): Promise<Event | null> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('site', 'ngo')
    .eq('slug', slug)
    .single()

  return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const event = await getEvent(resolvedParams.slug)

  if (!event) {
    return {
      title: 'Event Not Found',
    }
  }

  return {
    title: `${event.title} - DUAF Events`,
    description: event.short_description || `Join us at ${event.title}`,
  }
}

export default async function EventDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const event = await getEvent(resolvedParams.slug)

  if (!event) {
    notFound()
  }

  const isPast = new Date(event.start_date) < new Date()

  return (
    <div className="pt-20">
      {/* Hero Image */}
      {event.cover_image_path && (
        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={getPublicUrl(event.cover_image_path)}
            alt={event.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container-padding pb-12">
            <div className="max-w-4xl mx-auto">
              <Link href="/events" className="inline-flex items-center gap-2 text-white mb-4 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Link>
              <h1 className="heading-1 text-white mb-4">{event.title}</h1>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="section-padding container-padding">
        <div className="max-w-4xl mx-auto">
          {!event.cover_image_path && (
            <div className="mb-8">
              <Link href="/events" className="inline-flex items-center gap-2 text-primary mb-4 hover:text-primary-dark transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Events
              </Link>
              <h1 className="heading-1 mb-4">{event.title}</h1>
            </div>
          )}

          {/* Event Details */}
          <AnimatedFadeIn>
            <div className="card bg-primary/5 border-2 border-primary/20 mb-8">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <div className="text-sm text-gray-600 mb-1">Date & Time</div>
                    <div className="font-semibold">
                      {new Date(event.start_date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <div className="text-sm text-gray-600">
                      {new Date(event.start_date).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                      {event.end_date && (
                        <> - {new Date(event.end_date).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}</>
                      )}
                    </div>
                  </div>
                </div>
                {event.location && (
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="text-sm text-gray-600 mb-1">Location</div>
                      <div className="font-semibold">{event.location}</div>
                      {event.location_url && (
                        <a
                          href={event.location_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary-dark text-sm inline-flex items-center gap-1 mt-1"
                        >
                          View on map
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </AnimatedFadeIn>

          {/* Description */}
          <AnimatedFadeIn delay={0.1}>
            <div className="prose prose-lg max-w-none mb-12">
              {event.short_description && (
                <p className="text-xl text-gray-700 font-medium mb-6">{event.short_description}</p>
              )}
              {event.description && (
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {event.description}
                </div>
              )}
            </div>
          </AnimatedFadeIn>

          {/* Registration CTA */}
          {event.registration_url && !isPast && (
            <AnimatedFadeIn delay={0.2}>
              <div className="card bg-gradient-to-r from-primary to-secondary text-white text-center">
                <h3 className="heading-3 mb-4 text-white">Join Us!</h3>
                <p className="text-white/90 mb-6">
                  Register now to secure your spot at this event.
                </p>
                <a
                  href={event.registration_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn bg-white text-primary hover:bg-gray-100 inline-flex items-center gap-2"
                >
                  Register Now
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </AnimatedFadeIn>
          )}
        </div>
      </section>
    </div>
  )
}

