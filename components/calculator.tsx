"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Route, Calculator as CalcIcon, Loader2 } from 'lucide-react'
import { MapLocationPicker } from '@/components/map-location-picker'

export function Calculator() {
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [fromCoordinates, setFromCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [toCoordinates, setToCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [duration, setDuration] = useState<string | null>(null)
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false)
  const [isGeocodingFrom, setIsGeocodingFrom] = useState(false)
  const [isGeocodingTo, setIsGeocodingTo] = useState(false)

  const [cargoType, setCargoType] = useState('')
  const [vehicleType, setVehicleType] = useState('')
  const [fullTruckType, setFullTruckType] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')

  // Geocode any address using Nominatim API (OpenStreetMap)
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    if (!address || address.length < 3) {
      return null
    }

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(address)}` +
        `&format=json` +
        `&limit=1` +
        `&addressdetails=1` +
        `&countrycodes=cz,sk,at,de,pl,hu,si,hr,ba,rs,me,mk,al,bg,ro,md,ua,by,lt,lv,ee,fi,se,no,dk,nl,be,lu,fr,ch,it,es,pt,gb,ie,mt,gr,cy`,
        {
          headers: {
            'Accept-Language': 'cs,en',
            'User-Agent': 'ZdemarDoprava-App/1.0'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        if (data && data.length > 0) {
          const result = data[0]
          return {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
          }
        }
      }
      console.error('Nominatim geocoding failed:', response.status)
      return null
    } catch (error) {
      console.error('Error geocoding address:', error)
      return null
    }
  }

  // Auto-detect coordinates when user types in address fields
  useEffect(() => {
    if (fromLocation && fromLocation.length > 2) {
      setIsGeocodingFrom(true)
      const timer = setTimeout(() => {
        geocodeAddress(fromLocation).then((coords) => {
          if (coords) {
            setFromCoordinates(coords)
            console.log('FROM geocoded:', fromLocation, coords)
          }
          setIsGeocodingFrom(false)
        })
      }, 800) // Debounce 800ms

      return () => clearTimeout(timer)
    } else {
      setFromCoordinates(null)
      setIsGeocodingFrom(false)
    }
  }, [fromLocation])

  useEffect(() => {
    if (toLocation && toLocation.length > 2) {
      setIsGeocodingTo(true)
      const timer = setTimeout(() => {
        geocodeAddress(toLocation).then((coords) => {
          if (coords) {
            setToCoordinates(coords)
            console.log('TO geocoded:', toLocation, coords)
          }
          setIsGeocodingTo(false)
        })
      }, 800) // Debounce 800ms

      return () => clearTimeout(timer)
    } else {
      setToCoordinates(null)
      setIsGeocodingTo(false)
    }
  }, [toLocation])

  // Calculate distance when both coordinates are available
  useEffect(() => {
    if (fromCoordinates && toCoordinates) {
      console.log('Both coordinates available, calculating distance...')
      calculateDistance()
    }
  }, [fromCoordinates, toCoordinates])

  const calculateDistance = async () => {
    if (!fromCoordinates || !toCoordinates) {
      return
    }

    setIsCalculatingDistance(true)
    try {
      // Try using OSRM (Open Source Routing Machine) for accurate road distance
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/` +
        `${fromCoordinates.lng},${fromCoordinates.lat};` +
        `${toCoordinates.lng},${toCoordinates.lat}?` +
        `overview=false&steps=false`
      )

      if (response.ok) {
        const data = await response.json()
        if (data.code === 'Ok' && data.routes && data.routes.length > 0) {
          const route = data.routes[0]
          const distanceInKm = Math.round(route.distance / 1000)
          const durationInHours = Math.round(route.duration / 3600 * 10) / 10 // Round to 1 decimal

          console.log('OSRM distance:', distanceInKm, 'km, duration:', durationInHours, 'hours')
          setDistance(distanceInKm)
          setDuration(`Přibližně ${durationInHours} hodin`)
          setIsCalculatingDistance(false)
          return
        }
      }

      // Fallback to straight-line distance with road approximation
      console.log('OSRM failed, using fallback calculation')
      const straightDistance = calculateStraightLineDistance(fromCoordinates, toCoordinates)
      const roadDistance = Math.round(straightDistance * 1.3) // Add 30% for road distance
      const estimatedDuration = Math.round(roadDistance / 80 * 10) / 10 // 80 km/h average

      setDistance(roadDistance)
      setDuration(`Přibližně ${estimatedDuration} hodin`)
    } catch (error) {
      console.error('Error calculating distance:', error)
      // Fallback to straight-line distance
      const straightDistance = calculateStraightLineDistance(fromCoordinates, toCoordinates)
      const roadDistance = Math.round(straightDistance * 1.3)
      const estimatedDuration = Math.round(roadDistance / 80 * 10) / 10

      setDistance(roadDistance)
      setDuration(`Přibližně ${estimatedDuration} hodin`)
    } finally {
      setIsCalculatingDistance(false)
    }
  }

  const calculateStraightLineDistance = (from: { lat: number; lng: number }, to: { lat: number; lng: number }) => {
    const R = 6371 // Earth's radius in kilometers
    const dLat = (to.lat - from.lat) * Math.PI / 180
    const dLng = (to.lng - from.lng) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  // Calculate distance-based pricing
  const getDistanceMultiplier = () => {
    if (!distance) return 1
    if (distance <= 50) return 1 // Local transport
    if (distance <= 200) return 1.3 // Regional transport
    if (distance <= 500) return 1.6 // Long distance
    return 2.0 // International/very long distance
  }

  const cargoOptions = [
    { id: 'small', name: 'Přepravit náklad sypký', description: 'menší náklady, balíky' },
    { id: 'medium', name: 'Přepravit náklad balený', description: 'střední náklady, palety' },
  ]

  const vehicleOptions = [
    { id: 'small-truck', name: 'Malý kamion 7.5t', price: 3500, capacity: '7500kg' },
    { id: 'medium-truck', name: 'Střední kamion 12t', price: 5500, capacity: '12000kg' },
    { id: 'large-truck', name: 'Velký kamion 24t', price: 8500, capacity: '24000kg' },
  ]

  const fullTruckOptions = [
    {
      id: 'van-tarpaulin',
      name: 'Dodávka s plachtou',
      price: 4500,
      capacity: '3500kg',
      icon: '🚐'
    },
    {
      id: 'hardox-truck',
      name: 'Nákladák Hardox',
      price: 7500,
      capacity: '15000kg',
      icon: '🚛'
    },
    {
      id: 'truck-tarpaulin',
      name: 'Nákladák s plachtou',
      price: 6500,
      capacity: '12000kg',
      icon: '🚚'
    },
  ]

  // Calculate final price with distance multiplier
  const basePrice = cargoType ? 0 : fullTruckType ? fullTruckOptions.find(v => v.id === fullTruckType)?.price || 0 : vehicleType ? vehicleOptions.find(v => v.id === vehicleType)?.price || 0 : 0
  const finalPrice = Math.round(basePrice * getDistanceMultiplier())

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Kalkulátor ceny přepravy</h2>
        <p className="text-lg text-gray-600">Vyberte si typ kamionové přepravy a získejte okamžitou cenu</p>
      </div>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Route className="w-5 h-5" />
            Detail trasy
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="from">Odkud</Label>
              <Input
                id="from"
                placeholder="Zadejte jakoukoliv adresu (město, ulici, PSČ...)"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
              />
              {isGeocodingFrom && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Hledám adresu...
                </div>
              )}
              <MapLocationPicker
                value={fromLocation}
                onChange={(value, coords) => {
                  setFromLocation(value)
                  if (coords) setFromCoordinates(coords)
                }}
                placeholder="Vyberte místo na mapě"
                buttonText="Vybrat na mapě"
              />
            </div>
            <div>
              <Label htmlFor="to">Kam</Label>
              <Input
                id="to"
                placeholder="Zadejte jakoukoliv adresu (město, ulici, PSČ...)"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
              />
              {isGeocodingTo && (
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Hledám adresu...
                </div>
              )}
              <MapLocationPicker
                value={toLocation}
                onChange={(value, coords) => {
                  setToLocation(value)
                  if (coords) setToCoordinates(coords)
                }}
                placeholder="Vyberte místo na mapě"
                buttonText="Vybrat na mapě"
              />
            </div>
          </div>

          {/* Helper text */}
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p><strong>💡 Nová funkce:</strong></p>
            <ul className="list-disc list-inside space-y-1 mt-1">
              <li>Zadejte jakoukoliv adresu v Evropě - automatické vyhledávání</li>
              <li>Nebo klikněte na "Vybrat na mapě" pro přesný výběr</li>
              <li>Používá OpenStreetMap - zdarma, bez omezení</li>
            </ul>
          </div>

          {/* Distance Information */}
          {(distance || isCalculatingDistance || isGeocodingFrom || isGeocodingTo) && (
            <div className="bg-gradient-to-r from-blue-50 to-primary/10 p-4 rounded-lg border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <CalcIcon className="w-5 h-5 text-primary" />
                <h4 className="font-semibold text-primary">Vypočítaná trasa</h4>
              </div>
              {isGeocodingFrom || isGeocodingTo ? (
                <p className="text-sm text-gray-600">Hledám souřadnice adresy...</p>
              ) : isCalculatingDistance ? (
                <p className="text-sm text-gray-600">Počítám vzdálenost po silnici...</p>
              ) : (
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Vzdálenost:</span>
                    <span className="ml-2 text-lg font-bold text-primary">{distance} km</span>
                  </div>
                  <div>
                    <span className="font-medium">Doba jízdy:</span>
                    <span className="ml-2">{duration}</span>
                  </div>
                </div>
              )}
            </div>
          )}

        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6 lg:gap-8 mb-8">
        {/* Cargo Selection */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl">Přepravit náklad</CardTitle>
            <p className="text-sm text-gray-600">Vhodné pro různé typy nákladů</p>
          </CardHeader>
          <CardContent>
            <RadioGroup value={cargoType} onValueChange={setCargoType}>
              {cargoOptions.map((option) => (
                <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted/50 hover:border-primary/20 transition-all duration-200 cursor-pointer">
                  <RadioGroupItem value={option.id} id={option.id} />
                  <div className="flex-1">
                    <Label htmlFor={option.id} className="font-semibold cursor-pointer text-base">
                      {option.name}
                    </Label>
                    <p className="text-sm text-gray-600">{option.description}</p>
                  </div>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Vehicle Selection */}
        <Card className="hover:shadow-lg transition-shadow duration-200">
          <CardHeader>
            <CardTitle className="text-xl">Objednat celý kamion</CardTitle>
            <p className="text-sm text-gray-600">Využijte kapacitu celého kamionu</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-semibold mb-3 block">Vyberte auto</Label>
                <RadioGroup value={fullTruckType} onValueChange={setFullTruckType}>
                  {fullTruckOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 cursor-pointer">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <div className="flex items-center space-x-3 flex-1">
                        <span className="text-2xl">{option.icon}</span>
                        <div className="flex-1">
                          <Label htmlFor={option.id} className="font-semibold cursor-pointer text-base">
                            {option.name}
                          </Label>
                          <p className="text-sm text-gray-600">Nosnost: {option.capacity}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div className="border-t pt-4">
                <Label className="text-base font-semibold mb-3 block">Nebo standardní vozidla</Label>
                <RadioGroup value={vehicleType} onValueChange={setVehicleType}>
                  {vehicleOptions.map((option) => (
                    <div key={option.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 hover:border-blue-200 transition-all duration-200 cursor-pointer">
                      <RadioGroupItem value={option.id} id={option.id} />
                      <div className="flex-1">
                        <Label htmlFor={option.id} className="font-semibold cursor-pointer text-base">
                          {option.name}
                        </Label>
                        <p className="text-sm text-gray-600">Nosnost: {option.capacity}</p>
                      </div>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Date and Payment */}
      <div className="grid md:grid-cols-1 gap-8 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Vyberte termín nakládky</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="datetime-local"
              value={pickupDate}
              onChange={(e) => setPickupDate(e.target.value)}
            />
            <p className="text-sm text-gray-600 mt-2">
              Standardní termín do 24 hodin nebo expresní přeprava
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Kontaktní informace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">Jméno</Label>
              <Input
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="lastName">Příjmení</Label>
              <Input
                id="lastName"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="companyName">Název společnosti</Label>
            <Input
              id="companyName"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Telefon</Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="address">Adresa</Label>
            <Input
              id="address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card className="bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20 shadow-lg">
        <CardContent className="p-6 lg:p-8">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Přehled objednávky</h3>
            <p className="text-gray-600">Vaše volby</p>
          </div>
          <div className="space-y-4 mb-6">
            {fromLocation && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Odkud</span>
                <span className="font-semibold">{fromLocation}</span>
              </div>
            )}
            {toLocation && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Kam</span>
                <span className="font-semibold">{toLocation}</span>
              </div>
            )}
            {cargoType && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Typ nákladu</span>
                <span className="font-semibold">{cargoOptions.find(c => c.id === cargoType)?.name}</span>
              </div>
            )}
            {vehicleType && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Typ vozidla</span>
                <span className="font-semibold">{vehicleOptions.find(v => v.id === vehicleType)?.name}</span>
              </div>
            )}
            {fullTruckType && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Vybrané auto</span>
                <span className="font-semibold flex items-center gap-2">
                  <span>{fullTruckOptions.find(v => v.id === fullTruckType)?.icon}</span>
                  {fullTruckOptions.find(v => v.id === fullTruckType)?.name}
                </span>
              </div>
            )}
            {pickupDate && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Termín nakládky</span>
                <span className="font-semibold">{new Date(pickupDate).toLocaleString('cs-CZ')}</span>
              </div>
            )}
            {distance && (
              <div className="flex justify-between items-center py-2 border-t pt-4">
                <span className="text-gray-600">Vzdálenost</span>
                <span className="font-semibold">{distance} km</span>
              </div>
            )}
            {firstName && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Jméno</span>
                <span className="font-semibold">{firstName}</span>
              </div>
            )}
            {lastName && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Příjmení</span>
                <span className="font-semibold">{lastName}</span>
              </div>
            )}
            {companyName && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Společnost</span>
                <span className="font-semibold">{companyName}</span>
              </div>
            )}
            {phone && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Telefon</span>
                <span className="font-semibold">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Email</span>
                <span className="font-semibold">{email}</span>
              </div>
            )}
            {address && (
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Adresa</span>
                <span className="font-semibold">{address}</span>
              </div>
            )}
          </div>
          <Button onClick={() => {
            const orderData = {
              fromLocation,
              toLocation,
              fromCoordinates,
              toCoordinates,
              distance,
              duration,
              cargoType,
              vehicleType,
              fullTruckType,
              pickupDate,
              firstName,
              lastName,
              companyName,
              phone,
              email,
              address
            }
            console.log('Order submitted:', orderData)
            alert('Objednávka byla odeslána! (V produkci by se poslala na backend)')
            // Here you would send to backend
          }} className="w-full bg-accent hover:bg-accent/90 text-white py-4 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200">
            Odeslat
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">
            Odesláním objednávky souhlasíte s obchodními podmínkami a podmínkami pro ochranu osobních údajů
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
