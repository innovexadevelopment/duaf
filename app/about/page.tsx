import { Metadata } from 'next'
import SectionTitle from '../components/SectionTitle'
import AnimatedFadeIn from '../components/AnimatedFadeIn'
import { supabase, getPublicUrl } from '../lib/supabaseClient'
import { TeamMember, TimelineItem } from '../lib/types'
import { Heart, Target, Eye, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About Us - DUAF',
  description: 'Learn about DUAF\'s mission, vision, values, and the team behind our impactful work.',
}

async function getAboutSection() {
  const { data } = await supabase
    .from('about_sections')
    .select('*')
    .eq('site', 'ngo')
    .single()

  return data
}

async function getTeamMembers(): Promise<TeamMember[]> {
  const { data } = await supabase
    .from('team_members')
    .select('*')
    .eq('site', 'ngo')
    .order('order_index', { ascending: true })

  return data || []
}

async function getTimeline(): Promise<TimelineItem[]> {
  const { data } = await supabase
    .from('timeline_items')
    .select('*')
    .eq('site', 'ngo')
    .order('order_index', { ascending: true })

  return data || []
}

export default async function AboutPage() {
  const [aboutSection, teamMembers, timeline] = await Promise.all([
    getAboutSection(),
    getTeamMembers(),
    getTimeline(),
  ])

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding container-padding bg-gradient-to-br from-primary/10 via-secondary/10 to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedFadeIn>
            <h1 className="heading-1 mb-6">About DUAF</h1>
            <p className="text-xl text-gray-700">
              We are a non-profit organization committed to creating positive change in our communities 
              through impactful programs and initiatives.
            </p>
          </AnimatedFadeIn>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding container-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            <AnimatedFadeIn>
              <div className="card bg-primary/5 border-2 border-primary/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-primary rounded-lg">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="heading-2">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  {aboutSection?.body || 'To create positive change in our communities through impactful programs, dedicated volunteers, and generous supporters. We work tirelessly to address critical needs and build a better future for all.'}
                </p>
              </div>
            </AnimatedFadeIn>
            <AnimatedFadeIn delay={0.2}>
              <div className="card bg-secondary/5 border-2 border-secondary/20">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-secondary rounded-lg">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="heading-2">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-700 leading-relaxed">
                  A world where every community thrives, where compassion and support are accessible to all, 
                  and where positive change is driven by collective action and shared responsibility.
                </p>
              </div>
            </AnimatedFadeIn>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding container-padding bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <SectionTitle
            title="Our Values"
            subtitle="The principles that guide everything we do"
            center
          />
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { icon: Heart, title: 'Compassion', desc: 'At the heart of everything we do' },
              { icon: Users, title: 'Community', desc: 'Building stronger communities together' },
              { icon: Target, title: 'Impact', desc: 'Measurable change in people\'s lives' },
              { icon: Eye, title: 'Transparency', desc: 'Open and honest in all our work' },
            ].map((value, index) => (
              <AnimatedFadeIn key={value.title} delay={index * 0.1}>
                <div className="card text-center">
                  <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                    <value.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="heading-3 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.desc}</p>
                </div>
              </AnimatedFadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      {timeline.length > 0 && (
        <section className="section-padding container-padding">
          <div className="max-w-4xl mx-auto">
            <SectionTitle
              title="Our Journey"
              subtitle="Key milestones in our organization's history"
              center
            />
            <div className="space-y-8">
              {timeline.map((item, index) => (
                <AnimatedFadeIn key={item.id} delay={index * 0.1}>
                  <div className="relative pl-8 border-l-2 border-primary">
                    <div className="absolute -left-2 top-0 w-4 h-4 bg-primary rounded-full" />
                    <div className="card ml-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-2">
                        <h3 className="heading-3">{item.title}</h3>
                        {item.start_date && (
                          <span className="text-sm text-gray-500 font-medium">
                            {new Date(item.start_date).getFullYear()}
                            {item.end_date && ` - ${new Date(item.end_date).getFullYear()}`}
                            {item.is_current && ' - Present'}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-primary font-semibold mb-2">{item.subtitle}</p>
                      )}
                      {item.location && (
                        <p className="text-sm text-gray-600 mb-2">{item.location}</p>
                      )}
                      {item.description && (
                        <p className="text-gray-700">{item.description}</p>
                      )}
                    </div>
                  </div>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Team */}
      {teamMembers.length > 0 && (
        <section className="section-padding container-padding bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title="Our Team"
              subtitle="Meet the dedicated individuals making a difference"
              center
            />
            <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-8">
              {teamMembers.map((member, index) => (
                <AnimatedFadeIn key={member.id} delay={index * 0.1}>
                  <div className="card text-center">
                    {member.avatar_image_path ? (
                      <img
                        src={getPublicUrl(member.avatar_image_path)}
                        alt={member.name}
                        className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-primary/20 flex items-center justify-center">
                        <Users className="h-12 w-12 text-primary" />
                      </div>
                    )}
                    <h3 className="heading-3 mb-1">{member.name}</h3>
                    <p className="text-primary font-semibold mb-3">{member.role}</p>
                    {member.bio && (
                      <p className="text-sm text-gray-600">{member.bio}</p>
                    )}
                  </div>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

