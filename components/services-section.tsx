import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export function ServicesSection() {
  const stats = [
    { number: '24/7', label: 'Dostupnost', description: 'Jsme k dispozici 24 hodin denně, 7 dní v týdnu pro vaše přepravní potřeby. Rychlá reakce na vaše požadavky.' },
    { number: '40+', label: 'Kamionů ve flotile', description: 'Moderní flotila kamionů různých velikostí a typů pro přepravu všech druhů nákladů po celé Evropě.' },
    { number: '20+', label: 'Let zkušeností', description: 'Dlouholeté zkušenosti v kamionové dopravě. Specializujeme se na přepravu těžkých a objemných nákladů.' },
  ]

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Naše služby v číslech</h2>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-16">
        {stats.map((stat, index) => (
          <Card key={index} className="text-center hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border-0 shadow-lg">
            <CardContent className="p-6 lg:p-8">
              <div className="text-6xl font-bold text-primary mb-4">{stat.number}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{stat.label}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

