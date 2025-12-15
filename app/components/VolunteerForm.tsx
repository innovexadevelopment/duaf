'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function VolunteerForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    skills: '',
    availability: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')

    try {
      const skillsArray = formData.skills.split(',').map(s => s.trim()).filter(Boolean)

      // Insert volunteer application
      const { error } = await supabase
        .from('volunteers')
        .insert({
          site: 'ngo',
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          skills: skillsArray.length > 0 ? skillsArray : null,
          availability: formData.availability || null,
          message: formData.message || null,
          status: 'pending',
        })

      if (error) throw error

      // Track form submission
      await supabase
        .from('form_submissions')
        .insert({
          site: 'ngo',
          form_type: 'volunteer',
          form_data: formData,
        })

      setSubmitStatus('success')
      setFormData({ name: '', email: '', phone: '', skills: '', availability: '', message: '' })
    } catch (error) {
      console.error('Error submitting form:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="volunteer-name" className="block text-sm font-medium text-gray-700 mb-2">
          Name *
        </label>
        <input
          type="text"
          id="volunteer-name"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="Your name"
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="volunteer-email" className="block text-sm font-medium text-gray-700 mb-2">
            Email *
          </label>
          <input
            type="email"
            id="volunteer-email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="your.email@example.com"
          />
        </div>
        <div>
          <label htmlFor="volunteer-phone" className="block text-sm font-medium text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="tel"
            id="volunteer-phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>
      <div>
        <label htmlFor="volunteer-skills" className="block text-sm font-medium text-gray-700 mb-2">
          Skills (comma-separated)
        </label>
        <input
          type="text"
          id="volunteer-skills"
          value={formData.skills}
          onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="e.g. Teaching, Marketing, Event Planning"
        />
      </div>
      <div>
        <label htmlFor="volunteer-availability" className="block text-sm font-medium text-gray-700 mb-2">
          Availability
        </label>
        <input
          type="text"
          id="volunteer-availability"
          value={formData.availability}
          onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
          placeholder="e.g. Weekends, Evenings, Flexible"
        />
      </div>
      <div>
        <label htmlFor="volunteer-message" className="block text-sm font-medium text-gray-700 mb-2">
          Why do you want to volunteer?
        </label>
        <textarea
          id="volunteer-message"
          rows={4}
          value={formData.message}
          onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
          placeholder="Tell us about yourself and why you'd like to volunteer..."
        />
      </div>
      {submitStatus === 'success' && (
        <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800">
          Thank you! Your volunteer application has been submitted. We'll get back to you soon.
        </div>
      )}
      {submitStatus === 'error' && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
          Something went wrong. Please try again later.
        </div>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn w-full disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  )
}

