import { Metadata } from 'next'
import SectionTitle from '../components/SectionTitle'
import AnimatedFadeIn from '../components/AnimatedFadeIn'
import ContactForm from '../components/ContactForm'
import VolunteerForm from '../components/VolunteerForm'
import { supabase } from '../lib/supabaseClient'
import { ContactInfo } from '../lib/types'
import { Mail, Phone, MapPin, Heart, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us - DUAF',
  description: 'Get in touch with DUAF. Volunteer, partner with us, or learn how you can help.',
}

async function getContactInfo(): Promise<ContactInfo | null> {
  const { data } = await supabase
    .from('contact_info')
    .select('*')
    .eq('site', 'ngo')
    .single()

  return data
}

export default async function ContactPage() {
  const contactInfo = await getContactInfo()

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding container-padding bg-gradient-to-br from-primary/10 via-secondary/10 to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedFadeIn>
            <h1 className="heading-1 mb-6">Get In Touch</h1>
            <p className="text-xl text-gray-700">
              Whether you want to volunteer, partner with us, or learn how you can help, we'd love to hear from you.
            </p>
          </AnimatedFadeIn>
        </div>
      </section>

      {/* Contact Forms */}
      <section className="section-padding container-padding">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* General Contact */}
            <AnimatedFadeIn>
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-primary rounded-lg">
                    <Mail className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="heading-2">Send Us a Message</h2>
                </div>
                <ContactForm />
              </div>
            </AnimatedFadeIn>

            {/* Volunteer Form */}
            <AnimatedFadeIn delay={0.2}>
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 bg-secondary rounded-lg">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="heading-2">Become a Volunteer</h2>
                </div>
                <VolunteerForm />
              </div>
            </AnimatedFadeIn>
          </div>
        </div>
      </section>

      {/* Contact Info */}
      {contactInfo && (
        <section className="section-padding container-padding bg-gray-50">
          <div className="max-w-7xl mx-auto">
            <SectionTitle
              title="Contact Information"
              subtitle="Reach out to us through any of these channels"
              center
            />
            <div className="grid md:grid-cols-3 gap-8">
              {contactInfo.email && (
                <AnimatedFadeIn>
                  <div className="card text-center">
                    <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="heading-3 mb-2">Email</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-primary hover:text-primary-dark">
                      {contactInfo.email}
                    </a>
                  </div>
                </AnimatedFadeIn>
              )}
              {contactInfo.phone && (
                <AnimatedFadeIn delay={0.1}>
                  <div className="card text-center">
                    <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                      <Phone className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="heading-3 mb-2">Phone</h3>
                    <a href={`tel:${contactInfo.phone}`} className="text-primary hover:text-primary-dark">
                      {contactInfo.phone}
                    </a>
                  </div>
                </AnimatedFadeIn>
              )}
              {contactInfo.address && (
                <AnimatedFadeIn delay={0.2}>
                  <div className="card text-center">
                    <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                      <MapPin className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="heading-3 mb-2">Address</h3>
                    <p className="text-gray-600">{contactInfo.address}</p>
                  </div>
                </AnimatedFadeIn>
              )}
            </div>
            {contactInfo.map_embed_url && (
              <AnimatedFadeIn delay={0.3}>
                <div className="mt-12 rounded-lg overflow-hidden">
                  <iframe
                    src={contactInfo.map_embed_url}
                    width="100%"
                    height="400"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </AnimatedFadeIn>
            )}
          </div>
        </section>
      )}
    </div>
  )
}

