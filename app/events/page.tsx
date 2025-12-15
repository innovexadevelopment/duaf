import { Metadata } from 'next'
import SectionTitle from '../components/SectionTitle'
import AnimatedFadeIn from '../components/AnimatedFadeIn'
import { supabase, getPublicUrl } from '../lib/supabaseClient'
import { Event } from '../lib/types'
import Link from 'next/link'
import { Calendar, MapPin, ArrowRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Events - DUAF',
  description: 'Join us at our upcoming events and community gatherings.',
}

async function getEvents(): Promise<Event[]> {
  const { data } = await supabase
    .from('events')
    .select('*')
    .eq('site', 'ngo')
    .eq('is_active', true)
    .order('start_date', { ascending: true })

  return data || []
}

export default async function EventsPage() {
  const events = await getEvents()
  const now = new Date()
  const upcomingEvents = events.filter(e => new Date(e.start_date) >= now)
  const pastEvents = events.filter(e => new Date(e.start_date) < now)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding container-padding bg-gradient-to-br from-primary/10 via-secondary/10 to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedFadeIn>
            <div className="inline-flex p-4 bg-primary/20 rounded-full mb-6">
              <Calendar className="h-8 w-8 text-primary" />
            </div>
            <h1 className="heading-1 mb-6">Upcoming Events</h1>
            <p className="text-xl text-gray-700">
              Join us at our community events, workshops, and gatherings. Together we can create positive change.
            </p>
          </AnimatedFadeIn>
        </div>
      </section>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="section-padding container-padding">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="Upcoming Events" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {upcomingEvents.map((event, index) => (
                <AnimatedFadeIn key={event.id} delay={index * 0.1}>
                  <Link href={`/events/${event.slug}`} className="card group hover:shadow-xl transition-all block">
                    {event.cover_image_path && (
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                        <img
                          src={getPublicUrl(event.cover_image_path)}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    {event.is_featured && (
                      <span className="inline-block px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full mb-3">
                        Featured
                      </span>
                    )}
                    <h3 className="heading-3 mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.short_description}
                    </p>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>
                          {new Date(event.start_date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span>{event.location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-primary font-semibold mt-4 group-hover:gap-2 transition-all">
                      Learn More
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </div>
                  </Link>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="section-padding container-padding bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <SectionTitle title="Past Events" />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {pastEvents.map((event, index) => (
                <AnimatedFadeIn key={event.id} delay={index * 0.1}>
                  <Link href={`/events/${event.slug}`} className="card group hover:shadow-xl transition-all block opacity-75">
                    {event.cover_image_path && (
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                        <img
                          src={getPublicUrl(event.cover_image_path)}
                          alt={event.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <h3 className="heading-3 mb-2 group-hover:text-primary transition-colors">
                      {event.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {event.short_description}
                    </p>
                    <div className="text-sm text-gray-500">
                      {new Date(event.start_date).toLocaleDateString()}
                    </div>
                  </Link>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {events.length === 0 && (
        <section className="section-padding container-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <h3 className="heading-3 mb-4">No Events Scheduled</h3>
              <p className="text-gray-600 mb-6">
                We're planning exciting events for the future. Check back soon or contact us to stay updated.
              </p>
              <Link href="/contact" className="btn">
                Get In Touch
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

