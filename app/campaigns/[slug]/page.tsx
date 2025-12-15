import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { supabase, getPublicUrl } from '@/app/lib/supabaseClient'
import { Campaign } from '@/app/lib/types'
import AnimatedFadeIn from '@/app/components/AnimatedFadeIn'
import Link from 'next/link'
import { ArrowLeft, Heart, DollarSign } from 'lucide-react'

interface PageProps {
  params: Promise<{ slug: string }>
}

async function getCampaign(slug: string): Promise<Campaign | null> {
  const { data } = await supabase
    .from('campaigns')
    .select('*')
    .eq('site', 'ngo')
    .eq('slug', slug)
    .single()

  return data
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params
  const campaign = await getCampaign(resolvedParams.slug)

  if (!campaign) {
    return {
      title: 'Campaign Not Found',
    }
  }

  return {
    title: `${campaign.title} - DUAF Campaigns`,
    description: campaign.short_description || `Support ${campaign.title}`,
  }
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const resolvedParams = await params
  const campaign = await getCampaign(resolvedParams.slug)

  if (!campaign) {
    notFound()
  }

  const progress = campaign.goal_amount && campaign.raised_amount
    ? Math.min((campaign.raised_amount / campaign.goal_amount) * 100, 100)
    : 0

  return (
    <div className="pt-20">
      {/* Hero Image */}
      {campaign.banner_image_path && (
        <div className="relative h-[50vh] min-h-[400px]">
          <img
            src={getPublicUrl(campaign.banner_image_path)}
            alt={campaign.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 container-padding pb-12">
            <div className="max-w-4xl mx-auto">
              <Link href="/campaigns" className="inline-flex items-center gap-2 text-white mb-4 hover:text-primary transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Campaigns
              </Link>
              <h1 className="heading-1 text-white mb-4">{campaign.title}</h1>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <section className="section-padding container-padding">
        <div className="max-w-4xl mx-auto">
          {!campaign.banner_image_path && (
            <div className="mb-8">
              <Link href="/campaigns" className="inline-flex items-center gap-2 text-primary mb-4 hover:text-primary-dark transition-colors">
                <ArrowLeft className="h-4 w-4" />
                Back to Campaigns
              </Link>
              <h1 className="heading-1 mb-4">{campaign.title}</h1>
            </div>
          )}

          {/* Progress Bar */}
          {campaign.goal_amount && (
            <AnimatedFadeIn>
              <div className="card bg-primary/5 border-2 border-primary/20 mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-primary rounded-lg">
                    <DollarSign className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Raised</span>
                      <span className="font-bold text-primary text-lg">
                        ${campaign.raised_amount?.toLocaleString() || '0'} / ${campaign.goal_amount.toLocaleString()}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-4">
                      <div
                        className="bg-primary h-4 rounded-full transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="text-xs text-gray-500 text-right mt-2">
                      {progress.toFixed(0)}% funded
                    </div>
                  </div>
                </div>
                {campaign.is_active && (
                  <Link href="/contact" className="btn w-full text-center">
                    Support This Campaign
                  </Link>
                )}
              </div>
            </AnimatedFadeIn>
          )}

          {/* Description */}
          <AnimatedFadeIn delay={0.1}>
            <div className="prose prose-lg max-w-none mb-12">
              {campaign.short_description && (
                <p className="text-xl text-gray-700 font-medium mb-6">{campaign.short_description}</p>
              )}
              {campaign.long_description && (
                <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                  {campaign.long_description}
                </div>
              )}
            </div>
          </AnimatedFadeIn>

          {/* CTA */}
          {campaign.is_active && (
            <AnimatedFadeIn delay={0.2}>
              <div className="card bg-gradient-to-r from-primary to-secondary text-white text-center">
                <div className="inline-flex p-3 bg-white/20 rounded-full mb-4">
                  <Heart className="h-6 w-6" />
                </div>
                <h3 className="heading-3 mb-4 text-white">Make a Difference Today</h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                  Your support helps us reach our goal and create lasting impact in our community. 
                  Every contribution, no matter the size, makes a difference.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/contact" className="btn bg-white text-primary hover:bg-gray-100">
                    Donate Now
                  </Link>
                  <Link href="/contact" className="btn-outline border-white text-white hover:bg-white hover:text-primary">
                    Learn More
                  </Link>
                </div>
              </div>
            </AnimatedFadeIn>
          )}
        </div>
      </section>
    </div>
  )
}

