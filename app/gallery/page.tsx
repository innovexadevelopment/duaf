import { Metadata } from 'next'
import SectionTitle from '../components/SectionTitle'
import AnimatedFadeIn from '../components/AnimatedFadeIn'
import { supabase, getPublicUrl } from '../lib/supabaseClient'
import { GalleryImage } from '../lib/types'
import { Camera } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Gallery - DUAF',
  description: 'View photos from our programs, events, and community initiatives.',
}

async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data } = await supabase
    .from('gallery_images')
    .select('*')
    .eq('site', 'ngo')
    .order('order_index', { ascending: true })

  return data || []
}

export default async function GalleryPage() {
  const images = await getGalleryImages()

  return (
    <div className="pt-20">
      {/* Hero Section */}
      <section className="section-padding container-padding bg-gradient-to-br from-primary/10 via-secondary/10 to-accent">
        <div className="max-w-4xl mx-auto text-center">
          <AnimatedFadeIn>
            <div className="inline-flex p-4 bg-primary/20 rounded-full mb-6">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <h1 className="heading-1 mb-6">Photo Gallery</h1>
            <p className="text-xl text-gray-700">
              View photos from our programs, events, and community initiatives.
            </p>
          </AnimatedFadeIn>
        </div>
      </section>

      {/* Gallery Grid */}
      {images.length > 0 ? (
        <section className="section-padding container-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {images.map((image, index) => (
                <AnimatedFadeIn key={image.id} delay={index * 0.05}>
                  <div className="aspect-square rounded-lg overflow-hidden group cursor-pointer">
                    <img
                      src={getPublicUrl(image.image_path)}
                      alt={image.title || `Gallery image ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    {(image.title || image.description) && (
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        {image.title && (
                          <h3 className="text-white font-semibold mb-1">{image.title}</h3>
                        )}
                        {image.description && (
                          <p className="text-white/90 text-sm line-clamp-2">{image.description}</p>
                        )}
                      </div>
                    )}
                  </div>
                </AnimatedFadeIn>
              ))}
            </div>
          </div>
        </section>
      ) : (
        <section className="section-padding container-padding">
          <div className="max-w-2xl mx-auto text-center">
            <div className="card">
              <div className="inline-flex p-4 bg-primary/10 rounded-full mb-4">
                <Camera className="h-8 w-8 text-primary" />
              </div>
              <h3 className="heading-3 mb-4">No Photos Yet</h3>
              <p className="text-gray-600">
                We're working on adding photos from our programs and events. Check back soon!
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

