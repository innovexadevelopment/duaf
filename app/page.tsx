import { Metadata } from 'next'
import Hero from './components/Hero'
import SectionTitle from './components/SectionTitle'
import AnimatedFadeIn from './components/AnimatedFadeIn'
import { supabase, getPublicUrl } from './lib/supabaseClient'
import { HeroSection, Project, Campaign, ImpactStat, Testimonial } from './lib/types'
import Link from 'next/link'
import { ArrowRight, Heart, Users, Target, Award, Sparkles } from 'lucide-react'
import { motion } from 'framer-motion'

export const metadata: Metadata = {
  title: 'Home - DUAF',
  description: 'DUAF is a non-profit organization dedicated to creating positive change in our communities.',
}

async function getHero(): Promise<HeroSection | null> {
  const { data } = await supabase
    .from('hero_sections')
    .select('*')
    .eq('site', 'ngo')
    .eq('is_active', true)
    .order('order_index', { ascending: true })
    .limit(1)
    .single()

  return data
}

async function getFeaturedProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from('projects')
    .select('*')
    .eq('site', 'ngo')
    .eq('highlight', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return data || []
}

async function getActiveCampaigns(): Promise<Campaign[]> {
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('site', 'ngo')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(3)

  return data || []
}

async function getImpactStats(): Promise<ImpactStat[]> {
  const { data } = await supabase
    .from('impact_stats')
    .select('*')
    .eq('site', 'ngo')
    .order('order_index', { ascending: true })
    .limit(4)

  return data || []
}

async function getTestimonials(): Promise<Testimonial[]> {
  const { data } = await supabase
    .from('testimonials')
    .select('*')
    .eq('site', 'ngo')
    .order('order_index', { ascending: true })
    .limit(3)

  return data || []
}

export default async function Home() {
  const [hero, featuredProjects, activeCampaigns, impactStats, testimonials] = await Promise.all([
    getHero(),
    getFeaturedProjects(),
    getActiveCampaigns(),
    getImpactStats(),
    getTestimonials(),
  ])

  return (
    <>
      {/* Hero Section */}
      <Hero hero={hero} />

      {/* Impact Stats - Modern Design */}
      {impactStats.length > 0 && (
        <section className="section-padding bg-gradient-to-br from-primary/5 via-white to-secondary/5 relative overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -z-0" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/5 rounded-full blur-3xl -z-0" />
          
          <div className="container relative z-10">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {impactStats.map((stat, index) => (
                <AnimatedFadeIn key={stat.id} delay={index * 0.1}>
                  <div className="card text-center group hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl md:text-5xl lg:text-6xl font-black bg-gradient-to-br from-primary to-secondary bg-clip-text text-transparent mb-3">
                      {stat.value}{stat.suffix || ''}
                    </div>
                    <div className="text-sm md:text-base font-bold text-gray-800 mb-2">{stat.label}</div>
                    {stat.description && (
                      <div className="text-xs md:text-sm text-gray-600">{stat.description}</div>
                    )}
                  </div>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Section - Enhanced */}
      <section className="section-padding bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <AnimatedFadeIn>
              <div className="space-y-6 md:space-y-8">
                <div className="inline-block px-4 py-2 bg-primary/10 text-primary font-bold text-sm rounded-full mb-4">
                  About Us
                </div>
                <h2 className="heading-2">Who We Are</h2>
                <div className="space-y-4">
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                    DUAF is a non-profit organization committed to creating positive change in our communities. 
                    Through impactful programs, dedicated volunteers, and generous supporters, we work tirelessly 
                    to address critical needs and build a better future for all.
                  </p>
                  <p className="text-base md:text-lg lg:text-xl text-gray-700 leading-relaxed">
                    Our mission is driven by compassion, integrity, and the belief that together, we can make 
                    a meaningful difference in the lives of those who need it most.
                  </p>
                </div>
                <Link href="/about" className="btn inline-flex items-center gap-2">
                  Learn More About Us
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </AnimatedFadeIn>
            <AnimatedFadeIn delay={0.2}>
              <div className="grid grid-cols-2 gap-4 md:gap-6">
                <div className="card bg-gradient-to-br from-primary to-primary-dark text-white group hover:scale-105 transition-transform">
                  <div className="p-3 bg-white/20 rounded-xl w-fit mb-4">
                    <Heart className="h-6 w-6 md:h-8 md:w-8" fill="currentColor" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl mb-2">Compassion</h3>
                  <p className="text-xs md:text-sm text-white/90">At the heart of everything we do</p>
                </div>
                <div className="card bg-gradient-to-br from-secondary to-secondary-dark text-white group hover:scale-105 transition-transform">
                  <div className="p-3 bg-white/20 rounded-xl w-fit mb-4">
                    <Users className="h-6 w-6 md:h-8 md:w-8" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl mb-2">Community</h3>
                  <p className="text-xs md:text-sm text-white/90">Building stronger communities together</p>
                </div>
                <div className="card bg-primary/5 border-2 border-primary/20 group hover:border-primary/40 transition-all">
                  <div className="p-3 bg-primary/10 rounded-xl w-fit mb-4">
                    <Target className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Impact</h3>
                  <p className="text-xs md:text-sm text-gray-600">Measurable change in people's lives</p>
                </div>
                <div className="card bg-secondary/5 border-2 border-secondary/20 group hover:border-secondary/40 transition-all">
                  <div className="p-3 bg-secondary/10 rounded-xl w-fit mb-4">
                    <Award className="h-6 w-6 md:h-8 md:w-8 text-secondary" />
                  </div>
                  <h3 className="font-bold text-lg md:text-xl mb-2 text-gray-900">Excellence</h3>
                  <p className="text-xs md:text-sm text-gray-600">Highest standards in all we do</p>
                </div>
              </div>
            </AnimatedFadeIn>
          </div>
        </div>
      </section>

      {/* Featured Programs - Premium Design */}
      {featuredProjects.length > 0 && (
        <section className="section-padding bg-gradient-to-b from-gray-50 to-white">
          <div className="container">
            <SectionTitle
              title="Our Programs"
              subtitle="Discover the impactful initiatives we're running to create positive change"
              center
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
              {featuredProjects.map((project, index) => (
                <AnimatedFadeIn key={project.id} delay={index * 0.1}>
                  <Link href={`/programs/${project.slug}`} className="card group overflow-hidden p-0 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                    {project.cover_image_path && (
                      <div className="aspect-video overflow-hidden relative">
                        <img
                          src={getPublicUrl(project.cover_image_path)}
                          alt={project.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col">
                      <h3 className="heading-3 mb-3 group-hover:text-primary transition-colors">
                        {project.title}
                      </h3>
                      <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed flex-1">
                        {project.short_description}
                      </p>
                      <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </div>
                  </Link>
                </AnimatedFadeIn>
              ))}
            </div>
            <div className="text-center mt-10 md:mt-12">
              <Link href="/programs" className="btn">
                View All Programs
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Active Campaigns - Enhanced */}
      {activeCampaigns.length > 0 && (
        <section className="section-padding bg-white">
          <div className="container">
            <SectionTitle
              title="Active Campaigns"
              subtitle="Support our current initiatives and make a direct impact"
              center
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
              {activeCampaigns.map((campaign, index) => {
                const progress = campaign.goal_amount && campaign.raised_amount
                  ? Math.min((campaign.raised_amount / campaign.goal_amount) * 100, 100)
                  : 0

                return (
                  <AnimatedFadeIn key={campaign.id} delay={index * 0.1}>
                    <Link href={`/campaigns/${campaign.slug}`} className="card group overflow-hidden p-0 hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                      {campaign.banner_image_path && (
                        <div className="aspect-video overflow-hidden relative">
                          <img
                            src={getPublicUrl(campaign.banner_image_path)}
                            alt={campaign.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="heading-3 mb-3 group-hover:text-primary transition-colors">
                          {campaign.title}
                        </h3>
                        <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed flex-1">
                          {campaign.short_description}
                        </p>
                        {campaign.goal_amount && (
                          <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600 font-medium">Raised</span>
                              <span className="font-bold text-primary text-base md:text-lg">
                                ${campaign.raised_amount?.toLocaleString()} / ${campaign.goal_amount.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-primary to-primary-dark h-3 rounded-full transition-all duration-1000"
                                style={{ width: `${progress}%` }}
                              />
                            </div>
                            <div className="text-xs text-gray-500 text-right">
                              {progress.toFixed(0)}% Complete
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </AnimatedFadeIn>
                )
              })}
            </div>
            <div className="text-center mt-10 md:mt-12">
              <Link href="/campaigns" className="btn">
                View All Campaigns
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Testimonials - Premium Design */}
      {testimonials.length > 0 && (
        <section className="section-padding bg-gradient-to-br from-primary/5 via-white to-secondary/5">
          <div className="container">
            <SectionTitle
              title="What People Say"
              subtitle="Hear from our community members and partners"
              center
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16">
              {testimonials.map((testimonial, index) => (
                <AnimatedFadeIn key={testimonial.id} delay={index * 0.1}>
                  <div className="card group hover:shadow-xl h-full flex flex-col">
                    <div className="flex items-start gap-4 mb-6">
                      {testimonial.avatar_image_path ? (
                        <img
                          src={getPublicUrl(testimonial.avatar_image_path)}
                          alt={testimonial.name}
                          className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-4 ring-primary/10 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center ring-4 ring-primary/10 flex-shrink-0">
                          <Heart className="h-7 w-7 md:h-8 md:w-8 text-white" fill="currentColor" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-base md:text-lg text-gray-900">{testimonial.name}</div>
                        {testimonial.role && (
                          <div className="text-xs md:text-sm text-gray-600">
                            {testimonial.role}
                            {testimonial.organization && `, ${testimonial.organization}`}
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-700 italic text-base md:text-lg leading-relaxed relative pl-4 border-l-4 border-primary/30 flex-1">
                      "{testimonial.quote}"
                    </p>
                  </div>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section - Enhanced */}
      <section className="section-padding bg-gradient-to-r from-primary via-primary-dark to-secondary relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
        
        <div className="container max-w-4xl mx-auto text-center text-white relative z-10">
          <AnimatedFadeIn>
            <Sparkles className="h-10 w-10 md:h-12 md:w-12 mx-auto mb-6 text-white/80" />
            <h2 className="heading-2 mb-6 text-white">Join Us in Making a Difference</h2>
            <p className="text-lg md:text-xl lg:text-2xl mb-8 md:mb-10 text-white/95 leading-relaxed max-w-2xl mx-auto">
              Whether you want to volunteer, donate, or partner with us, there are many ways to get involved 
              and create positive change in your community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="btn bg-white text-primary hover:bg-gray-100 shadow-2xl text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                Get Involved
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link href="/campaigns" className="btn-outline border-2 border-white text-white hover:bg-white hover:text-primary text-base md:text-lg px-6 md:px-8 py-3 md:py-4">
                Support a Campaign
              </Link>
            </div>
          </AnimatedFadeIn>
        </div>
      </section>
    </>
  )
}
