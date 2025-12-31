'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, Heart } from 'lucide-react'
import { supabase } from '../lib/supabase/client'
import type { Website } from '../lib/types'

export function Footer() {
  const [website, setWebsite] = useState<Website | null>(null)

  useEffect(() => {
    loadWebsite()
  }, [])

  async function loadWebsite() {
    const { data } = await supabase
      .from('websites')
      .select('*')
      .eq('type', 'ngo')
      .single()

    if (data) setWebsite(data)
  }

  const socialLinks = website?.social_links || {}

  return (
    <footer className="bg-green-900 text-green-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Organization Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-6 w-6 text-green-400" />
              <h3 className="text-white text-xl font-bold">
                {website?.name || 'DUAF'}
              </h3>
            </div>
            <p className="text-green-200 mb-4">
              Dedicated to creating positive change and supporting communities in need.
              Together, we can make a difference.
            </p>
            <div className="flex space-x-4">
              {socialLinks.facebook && (
                <a
                  href={socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              )}
              {socialLinks.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-green-400 transition-colors"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-green-200 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-green-200 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/programs" className="text-green-200 hover:text-white transition-colors">
                  Programs
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-green-200 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2">
              {website?.contact_email && (
                <li className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-green-400" />
                  <a
                    href={`mailto:${website.contact_email}`}
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    {website.contact_email}
                  </a>
                </li>
              )}
              {website?.contact_phone && (
                <li className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-green-400" />
                  <a
                    href={`tel:${website.contact_phone}`}
                    className="text-green-200 hover:text-white transition-colors"
                  >
                    {website.contact_phone}
                  </a>
                </li>
              )}
              {website?.address && (
                <li className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-green-400 mt-1" />
                  <span className="text-green-200">{website.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="border-t border-green-800 mt-8 pt-8 text-center text-sm text-green-300">
          <p>
            &copy; {new Date().getFullYear()} {website?.name || 'DUAF'}. All rights reserved.
          </p>
          <p className="mt-2">Made with <Heart className="inline h-4 w-4 text-red-400" /> for the community</p>
        </div>
      </div>
    </footer>
  )
}

