/**
 * Smooth scroll utility for better cross-browser compatibility
 */

export function smoothScrollTo(element: HTMLElement | null, offset: number = 80) {
  if (!element) return

  const elementPosition = element.getBoundingClientRect().top
  const offsetPosition = elementPosition + window.pageYOffset - offset

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth'
  })
}

export function smoothScrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

export function smoothScrollToId(id: string, offset: number = 80) {
  const element = document.getElementById(id)
  smoothScrollTo(element, offset)
}

/**
 * Initialize smooth scrolling for all anchor links and enhance native smooth scroll
 */
export function initSmoothScroll() {
  if (typeof window === 'undefined') return

  // Force smooth scroll behavior on document
  if (document.documentElement) {
    document.documentElement.style.scrollBehavior = 'smooth'
  }
  if (document.body) {
    document.body.style.scrollBehavior = 'smooth'
  }

  // Handle all anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href')
      if (!href || href === '#') return

      const targetId = href.substring(1)
      const targetElement = document.getElementById(targetId)

      if (targetElement) {
        e.preventDefault()
        smoothScrollTo(targetElement, 100)
      }
    })
  })

  // Enhanced smooth scrolling with polyfill for older browsers
  if (!('scrollBehavior' in document.documentElement.style)) {
    // Fallback: Use requestAnimationFrame for smooth scrolling
    const originalScrollTo = window.scrollTo
    window.scrollTo = function(options: ScrollToOptions | number, y?: number) {
      if (typeof options === 'object' && options.behavior === 'smooth') {
        const start = window.pageYOffset
        const target = typeof options.top === 'number' ? options.top : start
        const distance = target - start
        const duration = 500
        let startTime: number | null = null

        function animate(currentTime: number) {
          if (startTime === null) startTime = currentTime
          const timeElapsed = currentTime - startTime
          const progress = Math.min(timeElapsed / duration, 1)
          
          // Easing function (ease-in-out)
          const ease = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2

          window.scrollTo(0, start + distance * ease)

          if (timeElapsed < duration) {
            requestAnimationFrame(animate)
          }
        }

        requestAnimationFrame(animate)
      } else {
        originalScrollTo.call(window, options as any, y)
      }
    }
  }
}

