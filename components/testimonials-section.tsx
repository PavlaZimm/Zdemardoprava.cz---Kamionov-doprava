import { Card, CardContent } from '@/components/ui/card'
import { Star } from 'lucide-react'

export function TestimonialsSection() {
  const testimonials = [
    {
      name: 'Petr Novák',
      position: 'logistický manažer',
      text: 'Spolehlivá kamionová doprava. Zdemardoprava zajišťuje pravidelné převozy našich dílů mezi závody. Vždy včas a bez problémů.',
      rating: 5
    },
    {
      name: 'Jana Svobodová',
      position: 'recenze',
      text: 'Přeprava strojního zařízení. Potřebovali jsme převézt těžké stroje do nového závodu. Profesionální přístup a bezpečná přeprava.',
      rating: 5
    },
    {
      name: 'Tomáš Dvořák',
      position: 'vedoucí skladu',
      text: 'Rychlé nakládání a vykládání. Jejich řidiči jsou zkušení a vždy dodržují termíny. Spolupracujeme s nimi už několik let.',
      rating: 5
    },
    {
      name: 'Martin Procházka',
      position: 'jednatel',
      text: 'Mezinárodní přeprava. Využíváme jejich služby pro přepravu po celé Evropě. Výborná komunikace.',
      rating: 5
    }
  ]

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-8">Vážíme si názoru našich zákazníků</h2>
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-8">
          <div className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-md">
            <span className="text-3xl font-bold text-primary">4.8</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600 font-medium ml-2">Google Reviews</span>
          </div>
          <div className="flex items-center space-x-3 bg-white rounded-lg p-4 shadow-md">
            <span className="text-3xl font-bold text-primary">4.9</span>
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              ))}
            </div>
            <span className="text-gray-600 font-medium ml-2">Firmy.cz</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 lg:gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-0 shadow-lg">
            <CardContent className="p-6 lg:p-8">
              <div className="flex items-center mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center mr-4 shadow-md">
                  <span className="text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 text-lg">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                </div>
              </div>
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 text-base leading-relaxed italic">"{testimonial.text}"</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

