'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Truck, Package, Weight, ArrowUpDown, Box, ChevronRight } from 'lucide-react'

export function FleetSection() {
  const [selectedVehicle, setSelectedVehicle] = useState<number | null>(null)

  const vehicles = [
    {
      name: 'Návěsy se sklápěním',
      shortName: 'Sklápěcí návěsy',
      volume: '50-57 m³',
      capacity: '25,9 t / 30,9 t',
      unloading: 'Vrchem a zezadu',
      pallets: '-',
      cargo: 'Obilniny, řepkový šrot, slunečnice, uhlí, ovoce, zelenina, zemědělské produkty',
      equipment: '2× výsypné okénko, výsypný rukáv',
      icon: '🚛',
      color: 'from-blue-500 to-blue-600'
    },
    {
      name: 'Walking Floor',
      shortName: 'Posuvná podlaha',
      volume: '84-92 m³',
      capacity: '24,5 t / 29,5 t',
      unloading: 'Vrchem a zezadu',
      pallets: 'Max. 32 europalet',
      cargo: 'Obilniny, řepkový šrot, slunečnice, uhlí, ovoce, zelenina, zemědělské produkty',
      equipment: '-',
      icon: '🚚',
      color: 'from-green-500 to-green-600'
    },
    {
      name: 'Hardoxy',
      shortName: 'Hardoxy návěsy',
      volume: '55-63 m³',
      capacity: '23,5 t / 28,5 t',
      unloading: 'Vrchem a zezadu',
      pallets: '-',
      cargo: 'Drobný ocelový odpad, železný a neželezný šrot, hliníkové součástky, kovový i nekovový odpad, sklářský písek, posypová sůl, stavební materiál, kamenivo, obalovaná drť, drtě, sutě, štěrky, písky, zemina',
      equipment: '-',
      icon: '🏗️',
      color: 'from-orange-500 to-orange-600'
    },
    {
      name: 'Express',
      shortName: 'Dodávky do 3,5 t',
      volume: '28 m³',
      dimensions: '5 × 2,6 × 2,2 m',
      capacity: '0,92 t',
      unloading: 'Z boku a zezadu',
      pallets: 'Max. 10 europalet',
      cargo: 'Expresní přeprava zboží a zásilek',
      equipment: 'Upínací pásy, protiskluzové podložky, plachtová nástavba',
      icon: '🚐',
      color: 'from-purple-500 to-purple-600'
    },
    {
      name: 'Plachtové návěsy',
      shortName: 'Plachta Standard',
      volume: '92 m³',
      dimensions: '13,6 × 2,6 × 2,5 m',
      capacity: '25,2 t / 27,2 t',
      unloading: 'Z boku a zezadu',
      pallets: 'Max. 32 europalet',
      cargo: 'Paletované zboží, velkoobjemové zboží',
      equipment: 'Upínací pásy, protiskluzové podložky, certifikát EN 12642 CODE XL, paletový koš, 32 latí',
      icon: '📦',
      color: 'from-indigo-500 to-indigo-600'
    },
    {
      name: 'Plachtové MEGA',
      shortName: 'Plachta MEGA',
      volume: '100 m³',
      dimensions: '13,6 × 3,0 × 2,5 m',
      capacity: '25,6 t / 27,6 t',
      unloading: 'Z boku a zezadu',
      pallets: 'Max. 32 europalet',
      cargo: 'Paletované zboží, velkoobjemové zboží',
      equipment: 'Upínací pásy, protiskluzové podložky, certifikát EN 12642 CODE XL, 48 latí',
      icon: '📦',
      color: 'from-pink-500 to-pink-600'
    }
  ]

  const selectedVehicleData = selectedVehicle !== null ? vehicles[selectedVehicle] : null

  return (
    <div>
      <div className="text-center mb-12">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Vyberte si typ vozidla</h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Nabízíme širokou škálu vozidel pro každý typ přepravy
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {vehicles.map((vehicle, index) => (
          <Card
            key={index}
            className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-primary/30 overflow-hidden group"
            onClick={() => setSelectedVehicle(index)}
          >
            <div className={`bg-gradient-to-br ${vehicle.color} p-6 text-white relative overflow-hidden`}>
              <div className="absolute top-0 right-0 text-8xl opacity-10 -mr-4 -mt-4">
                {vehicle.icon}
              </div>
              <div className="relative z-10">
                <div className="text-5xl mb-3">{vehicle.icon}</div>
                <h3 className="text-xl font-bold mb-1">{vehicle.name}</h3>
                <p className="text-sm text-white/90">{vehicle.shortName}</p>
              </div>
            </div>

            <CardContent className="p-5">
              <div className="space-y-3 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Box className="w-4 h-4" />
                    Objem:
                  </span>
                  <span className="font-semibold text-gray-900">{vehicle.volume}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center gap-1">
                    <Weight className="w-4 h-4" />
                    Nosnost:
                  </span>
                  <span className="font-semibold text-gray-900">{vehicle.capacity}</span>
                </div>
                {vehicle.pallets !== '-' && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      Palety:
                    </span>
                    <span className="font-semibold text-gray-900">{vehicle.pallets}</span>
                  </div>
                )}
              </div>

              <Button
                className="w-full group-hover:bg-primary group-hover:text-white transition-colors"
                variant="outline"
              >
                Zobrazit detaily
                <ChevronRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={selectedVehicle !== null} onOpenChange={() => setSelectedVehicle(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedVehicleData && (
            <>
              <DialogHeader>
                <div className={`bg-gradient-to-br ${selectedVehicleData.color} -mx-6 -mt-6 mb-6 p-8 text-white`}>
                  <div className="text-6xl mb-3">{selectedVehicleData.icon}</div>
                  <DialogTitle className="text-3xl text-white">{selectedVehicleData.name}</DialogTitle>
                  <DialogDescription className="text-white/90 text-lg mt-2">
                    {selectedVehicleData.shortName}
                  </DialogDescription>
                </div>
              </DialogHeader>

              <div className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                      <Box className="w-5 h-5" />
                      Objem
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedVehicleData.volume}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                      <Weight className="w-5 h-5" />
                      Nosnost EU/CZ
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{selectedVehicleData.capacity}</p>
                  </div>

                  {selectedVehicleData.dimensions && (
                    <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                      <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                        </svg>
                        Rozměry
                      </div>
                      <p className="text-xl font-bold text-gray-900">{selectedVehicleData.dimensions}</p>
                    </div>
                  )}

                  {selectedVehicleData.pallets !== '-' && (
                    <div className="bg-gray-50 p-4 rounded-lg sm:col-span-2">
                      <div className="flex items-center gap-2 text-primary font-semibold mb-2">
                        <Package className="w-5 h-5" />
                        Kapacita palet
                      </div>
                      <p className="text-xl font-bold text-gray-900">{selectedVehicleData.pallets}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                    <ArrowUpDown className="w-5 h-5" />
                    Vykládka
                  </div>
                  <p className="text-gray-700">{selectedVehicleData.unloading}</p>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                    <Truck className="w-5 h-5" />
                    Co umí převézt
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedVehicleData.cargo}</p>
                </div>

                {selectedVehicleData.equipment !== '-' && (
                  <div className="border-t pt-6">
                    <div className="flex items-center gap-2 text-primary font-semibold mb-3">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Vybavení
                    </div>
                    <p className="text-gray-700 leading-relaxed">{selectedVehicleData.equipment}</p>
                  </div>
                )}

                <div className="border-t pt-6">
                  <Button
                    className="w-full text-lg py-6"
                    size="lg"
                    onClick={() => window.location.href = 'tel:+420725215531'}
                  >
                    Mám zájem - zavolat 725 215 531
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
