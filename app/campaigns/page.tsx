import { Metadata } from 'next'
import SectionTitle from '../components/SectionTitle'
import AnimatedFadeIn from '../components/AnimatedFadeIn'
import { supabase, getPublicUrl } from '../lib/supabaseClient'
import { Campaign } from '../lib/types'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Campaigns - DUAF',
  description: 'Support our active campaigns and make a direct impact in your community.',
}

async function getCampaigns(): Promise<Campaign[]> {
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('site', 'ngo')
    .order('created_at', { ascending: false })

  return data || []
}

export default async function CampaignsPage() {
  const campaigns = await getCampaigns()
  const activeCampaigns = campaigns.filter(c => c.is_active)
  const inactiveCampaigns = campaigns.filter(c => !c.is_active)

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding container-padding bg-gradient-to-br from-primary/10 via-secondary/10 to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedFadeIn>
            <div className="inline-flex p-4 bg-primary/20 rounded-full mb-6">
              <Heart className="h-8 w-8 text-primary" />
            </div>
            <h1 className="heading-1 mb-6">Our Campaigns</h1>
            <p className="text-xl text-gray-700">
              Support our active initiatives and make a direct impact in your community. Every contribution helps us create positive change.
            </p>
          </AnimatedFadeIn>
        </div>
      </section>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <section className="section-padding container-padding">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title="Active Campaigns"
              subtitle="Help us reach our goals and create lasting impact"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {activeCampaigns.map((campaign, index) => {
                const progress = campaign.goal_amount && campaign.raised_amount
                  ? Math.min((campaign.raised_amount / campaign.goal_amount) * 100, 100)
                  : 0

                return (
                  <AnimatedFadeIn key={campaign.id} delay={index * 0.1}>
                    <Link href={`/campaigns/${campaign.slug}`} className="card group hover:shadow-xl transition-all block">
                      {campaign.banner_image_path && (
                        <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                          <img
                            src={getPublicUrl(campaign.banner_image_path)}
                            alt={campaign.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      )}
                      <h3 className="heading-3 mb-2 group-hover:text-primary transition-colors">
                        {campaign.title}
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">
                        {campaign.short_description}
                      </p>
                      {campaign.goal_amount && (
                        <div className="space-y-2 mb-4">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Raised</span>
                            <span className="font-bold text-primary">
                              ${campaign.raised_amount?.toLocaleString() || '0'} / ${campaign.goal_amount.toLocaleString()}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-primary h-3 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <div className="text-xs text-gray-500 text-right">
                            {progress.toFixed(0)}% funded
                          </div>
                        </div>
                      )}
                      <div className="flex items-center text-primary font-semibold group-hover:gap-2 transition-all">
                        Learn More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </div>
                    </Link>
                  </AnimatedFadeIn>
                )
              })}
            </div>
          </div>
        </section>
      )}

      {/* Completed Campaigns */}
      {inactiveCampaigns.length > 0 && (
        <section className="section-padding container-padding bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title="Completed Campaigns"
              subtitle="Celebrating our past successes"
            />
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {inactiveCampaigns.map((campaign, index) => (
                <AnimatedFadeIn key={campaign.id} delay={index * 0.1}>
                  <Link href={`/campaigns/${campaign.slug}`} className="card group hover:shadow-xl transition-all block opacity-75">
                    {campaign.banner_image_path && (
                      <div className="aspect-video mb-4 rounded-lg overflow-hidden">
                        <img
                          src={getPublicUrl(campaign.banner_image_path)}
                          alt={campaign.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="inline-block px-3 py-1 bg-green-100 text-green-800 text-xs font-semibold rounded-full mb-3">
                      Completed
                    </div>
                    <h3 className="heading-3 mb-2 group-hover:text-primary transition-colors">
                      {campaign.title}
                    </h3>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {campaign.short_description}
                    </p>
                    {campaign.goal_amount && campaign.raised_amount && (
                      <div className="text-sm text-gray-600">
                        Raised ${campaign.raised_amount.toLocaleString()} of ${campaign.goal_amount.toLocaleString()}
                      </div>
                    )}
                  </Link>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Empty State */}
      {campaigns.length === 0 && (
        <section className="section-padding container-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h3 className="heading-3 mb-4">No Campaigns Yet</h3>
              <p className="text-gray-600 mb-6">
                We're working on launching new campaigns soon. Check back later or contact us to learn how you can help.
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

