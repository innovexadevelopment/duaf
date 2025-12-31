'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../../components/navigation'
import { Footer } from '../../components/footer'
import { Mail, Phone, MapPin, Send, Heart, CheckCircle2 } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import type { Website } from '../../lib/types'

export default function ContactPage() {
  const [website, setWebsite] = useState<Website | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase
      .from('ngo_contact_submissions')
      .insert([{
        ...formData,
        type: 'general',
        subject: 'Contact Form Submission',
      }])

    setSubmitting(false)

    if (error) {
      alert('Error submitting form. Please try again.')
      return
    }

    setSubmitted(true)
    setFormData({ name: '', email: '', phone: '', message: '' })
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Header */}
        <section className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
            <p className="text-xl text-green-100">
              We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Contact Info */}
              <div>
                <h2 className="text-3xl font-bold mb-6 text-gray-900">Contact Information</h2>
                <div className="space-y-6">
                  {website?.contact_email && (
                    <div className="flex items-start space-x-4">
                      <Mail className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Email</h3>
                        <a
                          href={`mailto:${website.contact_email}`}
                          className="text-gray-600 hover:text-primary transition-colors"
                        >
                          {website.contact_email}
                        </a>
                      </div>
                    </div>
                  )}
                  {website?.contact_phone && (
                    <div className="flex items-start space-x-4">
                      <Phone className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Phone</h3>
                        <a
                          href={`tel:${website.contact_phone}`}
                          className="text-gray-600 hover:text-primary transition-colors"
                        >
                          {website.contact_phone}
                        </a>
                      </div>
                    </div>
                  )}
                  {website?.address && (
                    <div className="flex items-start space-x-4">
                      <MapPin className="h-6 w-6 text-primary mt-1" />
                      <div>
                        <h3 className="font-semibold mb-1">Address</h3>
                        <p className="text-gray-600">{website.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100"
              >
                <h2 className="text-3xl font-bold mb-2 text-gray-900">Send Us a Message</h2>
                <p className="text-gray-600 mb-8">We'd love to hear from you!</p>
                
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                      className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-8 text-center"
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                        className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4"
                      >
                        <CheckCircle2 className="h-10 w-10 text-white" />
                      </motion.div>
                      <h3 className="text-2xl font-bold text-green-800 mb-2">
                        Thank you for your message!
                      </h3>
                      <p className="text-green-700">
                        We'll get back to you as soon as possible.
                      </p>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onSubmit={handleSubmit}
                      className="space-y-6"
                    >
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                      >
                        <label htmlFor="name" className="block text-sm font-semibold mb-2 text-gray-700">
                          Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-gray-300"
                          placeholder="Your full name"
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                      >
                        <label htmlFor="email" className="block text-sm font-semibold mb-2 text-gray-700">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          required
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-gray-300"
                          placeholder="your.email@example.com"
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                      >
                        <label htmlFor="phone" className="block text-sm font-semibold mb-2 text-gray-700">
                          Phone <span className="text-gray-400 text-xs">(Optional)</span>
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none hover:border-gray-300"
                          placeholder="+1 (555) 123-4567"
                        />
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                      >
                        <label htmlFor="message" className="block text-sm font-semibold mb-2 text-gray-700">
                          Message <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={(e) =>
                            setFormData({ ...formData, message: e.target.value })
                          }
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-300 outline-none resize-none hover:border-gray-300"
                          placeholder="Tell us how we can help..."
                        />
                      </motion.div>
                      
                      <motion.button
                        type="submit"
                        disabled={submitting}
                        whileHover={{ scale: submitting ? 1 : 1.02, y: -2 }}
                        whileTap={{ scale: submitting ? 1 : 0.98 }}
                        className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                      >
                        {submitting ? (
                          <>
                            <motion.div
                              animate={{ rotate: 360 }}
                              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                            />
                            Sending...
                          </>
                        ) : (
                          <>
                            Send Message <Send className="h-5 w-5" />
                          </>
                        )}
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

