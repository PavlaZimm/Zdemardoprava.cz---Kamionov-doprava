import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Truck, Package, Weight, ArrowUpDown, Box } from 'lucide-react'

export function FleetSection() {
  const vehicles = [
    {
      name: 'Návěsy se sklápěním dozadu',
      volume: '50-57 m³',
      capacity: '25,9 t / 30,9 t',
      unloading: 'Vrchem a zezadu',
      pallets: '-',
      cargo: 'Obilniny, řepkový šrot, slunečnice, uhlí, ovoce, zelenina, zemědělské produkty',
      equipment: '2× výsypné okénko, výsypný rukáv',
      icon: '🚛'
    },
    {
      name: 'Návěsy s posuvnou podlahou (Walking Floor)',
      volume: '84-92 m³',
      capacity: '24,5 t / 29,5 t',
      unloading: 'Vrchem a zezadu',
      pallets: 'Max. 32 europalet',
      cargo: 'Obilniny, řepkový šrot, slunečnice, uhlí, ovoce, zelenina, zemědělské produkty',
      equipment: '-',
      icon: '🚚'
    },
    {
      name: 'Návěsy Hardoxy',
      volume: '55-63 m³',
      capacity: '23,5 t / 28,5 t',
      unloading: 'Vrchem a zezadu',
      pallets: '-',
      cargo: 'Drobný ocelový odpad, železný a neželezný šrot, hliníkové součástky, kovový i nekovový odpad, sklářský písek, posypová sůl, stavební materiál, kamenivo, obalovaná drť, drtě, sutě, štěrky, písky, zemina',
      equipment: '-',
      icon: '🏗️'
    },
    {
      name: 'Dodávky do 3,5 t se zaplachtovanou korbou (Express)',
      volume: '28 m³',
      dimensions: '5 × 2,6 × 2,2 m',
      capacity: '0,92 t',
      unloading: 'Z boku a zezadu',
      pallets: 'Max. 10 europalet',
      cargo: 'Expresní přeprava zboží a zásilek',
      equipment: 'Upínací pásy, protiskluzové podložky, plachtová nástavba',
      icon: '🚐'
    },
    {
      name: 'Plachtové návěsy',
      volume: '92 m³',
      dimensions: '13,6 × 2,6 × 2,5 m',
      capacity: '25,2 t / 27,2 t',
      unloading: 'Z boku a zezadu',
      pallets: 'Max. 32 europalet',
      cargo: 'Paletované zboží, velkoobjemové zboží',
      equipment: 'Upínací pásy, protiskluzové podložky, certifikát EN 12642 CODE XL, paletový koš, 32 latí',
      icon: '📦'
    },
    {
      name: 'Plachtové návěsy MEGA',
      volume: '100 m³',
      dimensions: '13,6 × 3,0 × 2,5 m',
      capacity: '25,6 t / 27,6 t',
      unloading: 'Z boku a zezadu',
      pallets: 'Max. 32 europalet',
      cargo: 'Paletované zboží, velkoobjemové zboží',
      equipment: 'Upínací pásy, protiskluzové podložky, certifikát EN 12642 CODE XL, 48 latí',
      icon: '📦'
    }
  ]

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Náš vozový park</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Disponujeme moderní flotilou vozidel pro všechny typy přeprav
        </p>
      </div>

      <div className="grid gap-6 lg:gap-8">
        {vehicles.map((vehicle, index) => (
          <Card key={index} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-accent/10 border-b">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl sm:text-2xl text-gray-900 mb-2 flex items-center gap-3">
                    <span className="text-3xl">{vehicle.icon}</span>
                    {vehicle.name}
                  </CardTitle>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="text-sm font-medium">
                      <Box className="w-4 h-4 mr-1" />
                      {vehicle.volume}
                    </Badge>
                    <Badge variant="secondary" className="text-sm font-medium">
                      <Weight className="w-4 h-4 mr-1" />
                      {vehicle.capacity}
                    </Badge>
                    {vehicle.pallets !== '-' && (
                      <Badge variant="secondary" className="text-sm font-medium">
                        <Package className="w-4 h-4 mr-1" />
                        {vehicle.pallets}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-6 space-y-4">
              {vehicle.dimensions && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    Rozměry
                  </h4>
                  <p className="text-gray-600">{vehicle.dimensions}</p>
                </div>
              )}

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <ArrowUpDown className="w-5 h-5 text-primary" />
                  Vykládka
                </h4>
                <p className="text-gray-600">{vehicle.unloading}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-primary" />
                  Co umí převézt
                </h4>
                <p className="text-gray-600 leading-relaxed">{vehicle.cargo}</p>
              </div>

              {vehicle.equipment !== '-' && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Vybavení
                  </h4>
                  <p className="text-gray-600 leading-relaxed">{vehicle.equipment}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
