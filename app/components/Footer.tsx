import Link from 'next/link'
import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react'
import { supabase, getPublicUrl } from '../lib/supabaseClient'

async function getContactInfo() {
  const { data } = await supabase
    .from('contact_info')
    .select('*')
    .eq('site', 'ngo')
    .single()

  return data
}

export default async function Footer() {
  const contactInfo = await getContactInfo()
  const socials = contactInfo?.socials as Record<string, string> | null

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container-padding max-w-7xl mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-primary rounded-lg">
                <Heart className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">DUAF</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Making a difference together. We are committed to creating positive change in our communities through impactful programs and initiatives.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Our Programs
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Campaigns
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Events
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Get Involved */}
          <div>
            <h3 className="font-bold text-lg mb-4">Get Involved</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Volunteer
                </Link>
              </li>
              <li>
                <Link href="/campaigns" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Donate
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Partner With Us
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="text-gray-400 hover:text-primary transition-colors text-sm">
                  Gallery
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-3">
              {contactInfo?.email && (
                <li className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <a href={`mailto:${contactInfo.email}`} className="text-gray-400 hover:text-primary transition-colors text-sm">
                    {contactInfo.email}
                  </a>
                </li>
              )}
              {contactInfo?.phone && (
                <li className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <a href={`tel:${contactInfo.phone}`} className="text-gray-400 hover:text-primary transition-colors text-sm">
                    {contactInfo.phone}
                  </a>
                </li>
              )}
              {contactInfo?.address && (
                <li className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-gray-400 text-sm">{contactInfo.address}</span>
                </li>
              )}
            </ul>

            {/* Social Media */}
            {socials && (
              <div className="flex gap-4 mt-6">
                {socials.facebook && (
                  <a href={socials.facebook} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                    <Facebook className="h-5 w-5" />
                  </a>
                )}
                {socials.twitter && (
                  <a href={socials.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                )}
                {socials.instagram && (
                  <a href={socials.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                    <Instagram className="h-5 w-5" />
                  </a>
                )}
                {socials.linkedin && (
                  <a href={socials.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © {new Date().getFullYear()} DUAF. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy" className="text-gray-400 hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-primary transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

