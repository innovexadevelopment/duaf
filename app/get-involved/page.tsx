'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Navigation } from '../../components/navigation'
import { Footer } from '../../components/footer'
import { Heart, Hand, Users, DollarSign, CheckCircle, ArrowLeft } from 'lucide-react'
import { supabase } from '../../lib/supabase/client'
import { QRCodeSVG } from 'qrcode.react'

export default function GetInvolvedPage() {
  const [selectedType, setSelectedType] = useState<'volunteer' | 'donate' | 'partner' | 'general' | null>(null)
  const [upiId, setUpiId] = useState<string>('')
  const [loadingUpi, setLoadingUpi] = useState(true)
  const [donationData, setDonationData] = useState({
    donor_name: '',
    donor_email: '',
    donor_phone: '',
    amount: '',
    notes: '',
  })
  const [submissionData, setSubmissionData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [donationSubmitted, setDonationSubmitted] = useState(false)
  const [submissionSubmitted, setSubmissionSubmitted] = useState(false)
  const [donationId, setDonationId] = useState<string | null>(null)

  useEffect(() => {
    loadUPISettings()
  }, [])

  async function loadUPISettings() {
    try {
      const { data, error } = await supabase
        .from('websites')
        .select('settings')
        .eq('type', 'ngo')
        .single()

      if (error) {
        console.error('Error loading UPI settings:', error)
        return
      }

      if (data?.settings?.upi_id) {
        setUpiId(data.settings.upi_id)
      }
    } catch (error) {
      console.error('Error loading UPI settings:', error)
    } finally {
      setLoadingUpi(false)
    }
  }

  async function handleDonationSubmit(e: React.FormEvent) {
    e.preventDefault()
    
    // Validate amount
    const amount = parseFloat(donationData.amount)
    if (isNaN(amount) || amount <= 0) {
      alert('Please enter a valid donation amount')
      return
    }

    setSubmitting(true)

    try {
      const { data, error } = await supabase
        .from('ngo_donations')
        .insert([{
          donor_name: donationData.donor_name,
          donor_email: donationData.donor_email,
          donor_phone: donationData.donor_phone || null,
          amount: amount,
          currency: 'INR',
          payment_status: 'pending',
          notes: donationData.notes || null,
        }])
        .select()
        .single()

      if (error) {
        console.error('Donation submission error:', error)
        console.error('Error details:', JSON.stringify(error, null, 2))
        alert(`Error submitting donation: ${error.message || 'Please check if the donations table exists and has proper permissions.'}`)
        setSubmitting(false)
        return
      }

      if (!data) {
        alert('No data returned from donation submission')
        setSubmitting(false)
        return
      }

      setDonationId(data.id)
      setDonationSubmitted(true)
    } catch (err: any) {
      console.error('Unexpected error:', err)
      alert(`Unexpected error: ${err.message || 'Please try again.'}`)
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSubmissionSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)

    const { error } = await supabase
      .from('ngo_contact_submissions')
      .insert([{
        name: submissionData.name,
        email: submissionData.email,
        phone: submissionData.phone || null,
        message: submissionData.message,
        type: selectedType || 'general',
        subject: `Get Involved - ${selectedType || 'general'}`,
        status: 'new',
      }])

    setSubmitting(false)

    if (error) {
      alert('Error submitting form. Please try again.')
      console.error(error)
      return
    }

    setSubmissionSubmitted(true)
    setSubmissionData({
      name: '',
      email: '',
      phone: '',
      message: '',
    })
  }

  // Generate UPI payment URL
  function getUPIPaymentURL(upi: string, amount?: string) {
    if (!upi) return ''
    const amountParam = amount ? `&am=${amount}` : ''
    return `upi://pay?pa=${upi}&pn=DUAF&cu=INR${amountParam}`
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-green-500 to-green-700 text-white py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Get Involved</h1>
            <p className="text-xl text-green-100 max-w-2xl">
              Join us in creating positive change. There are many ways to make a difference.
            </p>
          </div>
        </section>

        {/* Options */}
        {!selectedType && !donationSubmitted && !submissionSubmitted && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border-2 border-green-100 hover:border-green-300 transition-all shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-6"
                  >
                    <Hand className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Volunteer</h3>
                <p className="text-gray-600 mb-6">
                  Give your time and skills to support our programs and make a direct impact.
                </p>
                  <motion.button
                    onClick={() => setSelectedType('volunteer')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Volunteer Now
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border-2 border-green-100 hover:border-green-300 transition-all shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-6"
                  >
                    <DollarSign className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Donate</h3>
                <p className="text-gray-600 mb-6">
                  Your financial support helps us continue our mission and expand our impact.
                </p>
                  <motion.button
                    onClick={() => setSelectedType('donate')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                  >
                    Donate Now
                  </motion.button>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 text-center border-2 border-green-100 hover:border-green-300 transition-all shadow-lg hover:shadow-xl"
                >
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-2xl mb-6"
                  >
                    <Users className="h-8 w-8 text-white" />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">Partner</h3>
                <p className="text-gray-600 mb-6">
                  Partner with us to create sustainable change and amplify our collective impact.
                </p>
                  <motion.button
                    onClick={() => setSelectedType('partner')}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-green-600 text-white px-8 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  Become a Partner
                  </motion.button>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* Donation Form */}
        {selectedType === 'donate' && !donationSubmitted && (
          <section className="py-20 bg-gradient-to-b from-white to-green-50/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <motion.button
                  onClick={() => setSelectedType(null)}
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to options
                </motion.button>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-center mb-8"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-6 shadow-lg">
                      <DollarSign className="h-10 w-10 text-white" />
                </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Make a Donation</h2>
                    <p className="text-gray-600 text-lg">Your contribution makes a real difference</p>
                  </motion.div>

                  <motion.form
                    onSubmit={handleDonationSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                  <input
                    type="text"
                    required
                        value={donationData.donor_name}
                        onChange={(e) => setDonationData({ ...donationData, donor_name: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none bg-white hover:border-gray-300 text-gray-900 font-medium"
                        placeholder="John Doe"
                  />
                </div>

                <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                  <input
                    type="email"
                    required
                        value={donationData.donor_email}
                        onChange={(e) => setDonationData({ ...donationData, donor_email: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none bg-white hover:border-gray-300 text-gray-900 font-medium"
                        placeholder="john@example.com"
                  />
                </div>

                <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Phone Number <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                      </label>
                  <input
                    type="tel"
                        value={donationData.donor_phone}
                        onChange={(e) => setDonationData({ ...donationData, donor_phone: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none bg-white hover:border-gray-300 text-gray-900 font-medium"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Amount (INR) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        required
                        min="1"
                        step="0.01"
                        value={donationData.amount}
                        onChange={(e) => setDonationData({ ...donationData, amount: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none bg-white hover:border-gray-300 text-gray-900 font-medium text-lg"
                        placeholder="500"
                      />
                      <p className="text-sm text-gray-500 mt-2">Enter the amount you wish to donate</p>
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Message <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                      </label>
                      <textarea
                        rows={4}
                        value={donationData.notes}
                        onChange={(e) => setDonationData({ ...donationData, notes: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none resize-none bg-white hover:border-gray-300 text-gray-900 font-medium"
                        placeholder="Any message you'd like to share..."
                      />
                    </div>

                    <motion.button
                      type="submit"
                      disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02, y: -2 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-5 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl"
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                          />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Heart className="h-5 w-5" />
                          Proceed to Payment
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Payment Instructions (After Donation Submission) */}
        {donationSubmitted && donationId && (
          <section className="py-20 bg-gradient-to-b from-green-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-3xl mx-auto"
              >
                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-green-100">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="text-center mb-8"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg">
                      <CheckCircle className="h-12 w-12 text-white" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Thank You for Your Donation!</h2>
                    <p className="text-gray-600 text-lg">Please complete the payment by scanning the QR code below</p>
                  </motion.div>

                  {loadingUpi ? (
                    <div className="text-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <p className="text-gray-600">Loading payment information...</p>
                    </div>
                  ) : !upiId ? (
                    <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-6 text-center">
                      <p className="text-yellow-800 font-medium">
                        Payment information is not configured. Please contact the administrator.
                      </p>
                    </div>
                  ) : (
                    <div className="flex justify-center mb-8">
                      {/* QR Code */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 md:p-12 border-2 border-green-200 max-w-md w-full"
                      >
                        <h3 className="text-xl font-bold mb-6 text-gray-900 text-center">Scan QR Code to Pay</h3>
                        <div className="flex flex-col items-center">
                          <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">
                            <QRCodeSVG
                              value={getUPIPaymentURL(upiId, donationData.amount)}
                              size={256}
                              level={'M' as const}
                              includeMargin={true}
                            />
                          </div>
                          <p className="text-sm text-gray-600 text-center mb-2">Scan with any UPI app to pay instantly</p>
                          <p className="text-xs text-gray-500 text-center">Supported apps: GPay, PhonePe, Paytm, BHIM, and more</p>
                        </div>
                      </motion.div>
                    </div>
                  )}

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-blue-50 border-2 border-blue-200 rounded-xl p-6"
                  >
                    <p className="text-sm text-blue-800 font-medium">
                      <strong>Important:</strong> After making the payment, our team will verify and confirm your donation. 
                      You'll receive a confirmation email once the payment is verified.
                    </p>
                  </motion.div>

                  <motion.button
                    onClick={() => {
                      setDonationSubmitted(false)
                      setSelectedType(null)
                      setDonationData({
                        donor_name: '',
                        donor_email: '',
                        donor_phone: '',
                        amount: '',
                        notes: '',
                      })
                    }}
                    whileHover={{ x: -5 }}
                    className="mt-8 flex items-center gap-2 text-gray-600 hover:text-green-600 transition-colors font-medium"
                  >
                    <ArrowLeft className="h-5 w-5" />
                    Make Another Donation
                  </motion.button>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Other Forms (Volunteer, Partner, General) */}
        {selectedType && selectedType !== 'donate' && !submissionSubmitted && (
          <section className="py-20 bg-gradient-to-b from-white to-green-50/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl mx-auto"
              >
                <motion.button
                  onClick={() => setSelectedType(null)}
                  whileHover={{ x: -5 }}
                  className="flex items-center gap-2 text-gray-600 hover:text-green-600 mb-6 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                  Back to options
                </motion.button>

                <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200 }}
                    className="text-center mb-8"
                  >
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl mb-6 shadow-lg">
                      {selectedType === 'volunteer' && <Hand className="h-10 w-10 text-white" />}
                      {selectedType === 'partner' && <Users className="h-10 w-10 text-white" />}
                      {selectedType === 'general' && <Heart className="h-10 w-10 text-white" />}
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
                      {selectedType === 'volunteer' && 'Become a Volunteer'}
                      {selectedType === 'partner' && 'Partner With Us'}
                      {selectedType === 'general' && 'Get in Touch'}
                    </h2>
                    <p className="text-gray-600 text-lg">Fill out the form below and we'll get back to you soon</p>
                  </motion.div>

                  <motion.form
                    onSubmit={handleSubmissionSubmit}
                    className="space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={submissionData.name}
                        onChange={(e) => setSubmissionData({ ...submissionData, name: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none bg-white hover:border-gray-300 text-gray-900 font-medium"
                        placeholder="John Doe"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Email Address <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={submissionData.email}
                        onChange={(e) => setSubmissionData({ ...submissionData, email: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none bg-white hover:border-gray-300 text-gray-900 font-medium"
                        placeholder="john@example.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Phone Number <span className="text-gray-400 text-xs font-normal">(Optional)</span>
                      </label>
                      <input
                        type="tel"
                        value={submissionData.phone}
                        onChange={(e) => setSubmissionData({ ...submissionData, phone: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none bg-white hover:border-gray-300 text-gray-900 font-medium"
                        placeholder="+91 98765 43210"
                      />
                    </div>

                <div>
                      <label className="block text-sm font-bold mb-2 text-gray-700">
                        Message <span className="text-red-500">*</span>
                      </label>
                  <textarea
                    required
                    rows={6}
                        value={submissionData.message}
                        onChange={(e) => setSubmissionData({ ...submissionData, message: e.target.value })}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl focus:border-green-500 focus:ring-4 focus:ring-green-500/20 transition-all duration-300 outline-none resize-none bg-white hover:border-gray-300 text-gray-900 font-medium"
                        placeholder={`Tell us how you'd like to ${selectedType === 'volunteer' ? 'volunteer' : selectedType === 'partner' ? 'partner with us' : 'get involved'}...`}
                  />
                </div>

                    <motion.button
                  type="submit"
                  disabled={submitting}
                      whileHover={{ scale: submitting ? 1 : 1.02, y: -2 }}
                      whileTap={{ scale: submitting ? 1 : 0.98 }}
                      className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-5 rounded-xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl"
                    >
                      {submitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                          />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <Heart className="h-5 w-5" />
                          Submit
                        </>
                      )}
                    </motion.button>
                  </motion.form>
                </div>
              </motion.div>
            </div>
          </section>
        )}

        {/* Submission Success */}
        {submissionSubmitted && (
          <section className="py-20 bg-gradient-to-b from-green-50 to-white">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-2xl mx-auto bg-white rounded-3xl shadow-2xl p-12 border border-green-100 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                  className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full mb-6 shadow-lg"
                >
                  <CheckCircle className="h-12 w-12 text-white" />
                </motion.div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">Thank You!</h2>
                <p className="text-gray-600 text-lg mb-8">
                  We've received your message and will get back to you soon.
                </p>
                <motion.button
                  onClick={() => {
                    setSubmissionSubmitted(false)
                    setSelectedType(null)
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Submit Another Request
                </motion.button>
              </motion.div>
          </div>
        </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
