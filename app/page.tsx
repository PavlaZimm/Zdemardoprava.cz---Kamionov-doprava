

import { Calculator } from '@/components/calculator'
import { ServicesSection } from '@/components/services-section'
import { TestimonialsSection } from '@/components/testimonials-section'
import { Footer } from '@/components/footer'
import { Header } from '@/components/header'

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Hero Section with Truck Background */}
      <section 
        className="relative bg-gradient-to-br from-primary/20 via-background to-accent/20 py-16 sm:py-20 overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.7)), url('https://assets.macaly-user-data.dev/wdlcbbeq5qohf2tih2zarfwh/qa5wlbmt85y3dons2lotc9s7/w-mpW0sQB1uJGKQWpaVfj/tmpixd48hop.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
        aria-labelledby="hero-heading"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 id="hero-heading" className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            Kamionová doprava
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow">
            Profesionální přeprava nákladů po celé Evropě
          </p>
          <div className="flex justify-center">
            <a href="tel:+420725215531" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl hover:bg-primary/90 transition-all duration-200 font-semibold text-base shadow-md hover:shadow-lg inline-block">
              Rychlý kontakt
            </a>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section id="calculator" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Calculator />
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ServicesSection />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsSection />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  )
}
















