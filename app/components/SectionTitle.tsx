import AnimatedFadeIn from './AnimatedFadeIn'

interface SectionTitleProps {
  title: string
  subtitle?: string
  center?: boolean
}

export default function SectionTitle({ title, subtitle, center = false }: SectionTitleProps) {
  return (
    <AnimatedFadeIn className={`mb-10 md:mb-12 lg:mb-16 ${center ? 'text-center' : ''}`}>
      <div className={center ? 'max-w-4xl mx-auto' : 'max-w-3xl'}>
        <h2 className="heading-2 mb-3 md:mb-4 lg:mb-6">{title}</h2>
        {subtitle && (
          <p className="text-base md:text-lg lg:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
      </div>
    </AnimatedFadeIn>
  )
}
