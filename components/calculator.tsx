

"use client"

import { useState, useEffect } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Route, Calculator as CalcIcon } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export function Calculator() {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const submitOrder = useMutation(api.orders.submitOrder)
  const [fromLocation, setFromLocation] = useState('')
  const [toLocation, setToLocation] = useState('')
  const [fromCoordinates, setFromCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [toCoordinates, setToCoordinates] = useState<{ lat: number; lng: number } | null>(null)
  const [distance, setDistance] = useState<number | null>(null)
  const [duration, setDuration] = useState<string | null>(null)
  const [isCalculatingDistance, setIsCalculatingDistance] = useState(false)
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
  const [isGeocodingFrom, setIsGeocodingFrom] = useState(false)
  const [isGeocodingTo, setIsGeocodingTo] = useState(false)

  // Auto-assign coordinates when user types common city names
  const getCoordinatesForCity = (address: string): { lat: number; lng: number } | null => {
    const lowerAddress = address.toLowerCase().trim()
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'praha': { lat: 50.0755, lng: 14.4378 },
      'prague': { lat: 50.0755, lng: 14.4378 },
      'brno': { lat: 49.1951, lng: 16.6068 },
      'ostrava': { lat: 49.8209, lng: 18.2625 },
      'plzeň': { lat: 49.7384, lng: 13.3736 },
      'plzen': { lat: 49.7384, lng: 13.3736 },
      'pilsen': { lat: 49.7384, lng: 13.3736 },
      'liberec': { lat: 50.7663, lng: 15.0543 },
      'olomouc': { lat: 49.5938, lng: 17.2509 },
      'budějovice': { lat: 48.9744, lng: 14.4743 },
      'české budějovice': { lat: 48.9744, lng: 14.4743 },
      'ceske budejovice': { lat: 48.9744, lng: 14.4743 },
      'hradec králové': { lat: 50.2103, lng: 15.8327 },
      'hradec kralove': { lat: 50.2103, lng: 15.8327 },
      'pardubice': { lat: 50.0343, lng: 15.7812 },
      'zlín': { lat: 49.2265, lng: 17.6679 },
      'zlin': { lat: 49.2265, lng: 17.6679 },
      'kladno': { lat: 50.1473, lng: 14.1027 },
      'most': { lat: 50.5030, lng: 13.6357 },
      'opava': { lat: 49.9387, lng: 17.9027 },
      'frýdek-místek': { lat: 49.6835, lng: 18.3488 },
      'frydek-mistek': { lat: 49.6835, lng: 18.3488 },
      'karviná': { lat: 49.8540, lng: 18.5409 },
      'karvina': { lat: 49.8540, lng: 18.5409 },
      'jihlava': { lat: 49.3961, lng: 15.5910 },
      'teplice': { lat: 50.6404, lng: 13.8249 },
      'děčín': { lat: 50.7820, lng: 14.2147 },
      'decin': { lat: 50.7820, lng: 14.2147 },
      'ústí nad labem': { lat: 50.6607, lng: 14.0322 },
      'usti nad labem': { lat: 50.6607, lng: 14.0322 },
      'chomutov': { lat: 50.4607, lng: 13.4175 },
      'mladá boleslav': { lat: 50.4113, lng: 14.9033 },
      'mlada boleslav': { lat: 50.4113, lng: 14.9033 },
      'třebíč': { lat: 49.2144, lng: 15.8819 },
      'trebic': { lat: 49.2144, lng: 15.8819 },
      'havířov': { lat: 49.7797, lng: 18.4371 },
      'havirov': { lat: 49.7797, lng: 18.4371 },
      'kolín': { lat: 50.0281, lng: 15.2018 },
      'kolin': { lat: 50.0281, lng: 15.2018 },
      'přerov': { lat: 49.4551, lng: 17.4510 },
      'prerov': { lat: 49.4551, lng: 17.4510 },
      'prostějov': { lat: 49.4719, lng: 17.1118 },
      'prostejov': { lat: 49.4719, lng: 17.1118 },
      'karlovy vary': { lat: 50.2329, lng: 12.8713 },
      'jablonec nad nisou': { lat: 50.7244, lng: 15.1710 },
      'jablonec': { lat: 50.7244, lng: 15.1710 },
      'cheb': { lat: 50.0796, lng: 12.3739 },
      'trutnov': { lat: 50.5615, lng: 15.9127 },
      'znojmo': { lat: 48.8555, lng: 16.0488 },
      'vsetín': { lat: 49.3386, lng: 17.9974 },
      'vsetin': { lat: 49.3386, lng: 17.9974 },
      'hodonín': { lat: 48.8488, lng: 17.1322 },
      'hodonin': { lat: 48.8488, lng: 17.1322 },
      'břeclav': { lat: 48.7589, lng: 16.8821 },
      'breclav': { lat: 48.7589, lng: 16.8821 },
      'uherské hradiště': { lat: 49.0697, lng: 17.4594 },
      'uherske hradiste': { lat: 49.0697, lng: 17.4594 },
      'kroměříž': { lat: 49.2978, lng: 17.3928 },
      'kromeriz': { lat: 49.2978, lng: 17.3928 },
      // Přidávám Chabařovice a Dresden
      'chabařovice': { lat: 50.6667, lng: 13.9667 },
      'chabarovice': { lat: 50.6667, lng: 13.9667 },
      'dresden': { lat: 51.0504, lng: 13.7373 },
      'drážďany': { lat: 51.0504, lng: 13.7373 },
      'drazdany': { lat: 51.0504, lng: 13.7373 }
    }

    console.log('Looking for coordinates for:', lowerAddress)

    // Try exact match first
    if (cityCoordinates[lowerAddress]) {
      console.log('Found exact match:', cityCoordinates[lowerAddress])
      return cityCoordinates[lowerAddress]
    }

    // Try to find a match by checking if any city name is contained in the address
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (lowerAddress.includes(city) || city.includes(lowerAddress)) {
        console.log('Found partial match:', city, coords)
        return coords
      }
    }

    console.log('No coordinates found in hardcoded list for:', lowerAddress)
    return null
  }

  // Geocode any address using Google Maps API
  const geocodeAddress = async (address: string): Promise<{ lat: number; lng: number } | null> => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    if (!apiKey || apiKey === 'demo-key') {
      console.log('No valid API key for geocoding')
      return null
    }

    try {
      // Load Google Maps API if not already loaded
      if (!(window as any).google) {
        const { Loader } = await import('@googlemaps/js-api-loader')
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['geometry']
        })
        await loader.load()
      }

      const geocoder = new (window as any).google.maps.Geocoder()
      return new Promise((resolve) => {
        geocoder.geocode({
          address: address,
          componentRestrictions: {
            country: ['CZ', 'SK', 'AT', 'DE', 'PL', 'HU', 'SI', 'HR', 'BA', 'RS', 'ME', 'MK', 'AL', 'BG', 'RO', 'MD', 'UA', 'BY', 'LT', 'LV', 'EE', 'FI', 'SE', 'NO', 'DK', 'NL', 'BE', 'LU', 'FR', 'CH', 'IT', 'ES', 'PT', 'GB', 'IE', 'MT', 'GR', 'CY']
          }
        }, (results: any, status: any) => {
          if (status === 'OK' && results && results[0] && results[0].geometry) {
            const location = results[0].geometry.location
            const coords = { lat: location.lat(), lng: location.lng() }
            console.log('Geocoded address:', address, 'to:', coords)
            resolve(coords)
          } else {
            console.log('Geocoding failed for:', address, 'status:', status)
            resolve(null)
          }
        })
      })
    } catch (error) {
      console.error('Error geocoding address:', error)
      return null
    }
  }

  // Auto-detect coordinates when user types in address fields
  useEffect(() => {
    console.log('FROM location changed:', fromLocation, 'length:', fromLocation?.length)
    if (fromLocation && fromLocation.length > 2) {
      const coords = getCoordinatesForCity(fromLocation)
      if (coords && (!fromCoordinates || fromCoordinates.lat !== coords.lat)) {
        console.log('Setting FROM coordinates from hardcoded list:', fromLocation, coords)
        setFromCoordinates(coords)
        setIsGeocodingFrom(false)
      } else if (!coords) {
        // Try geocoding
        console.log('No hardcoded coords, trying geocoding for FROM:', fromLocation)
        setIsGeocodingFrom(true)
        geocodeAddress(fromLocation).then((geocodedCoords) => {
          if (geocodedCoords && (!fromCoordinates || fromCoordinates.lat !== geocodedCoords.lat)) {
            console.log('Setting FROM coordinates from geocoding:', fromLocation, geocodedCoords)
            setFromCoordinates(geocodedCoords)
          }
          setIsGeocodingFrom(false)
        })
      }
    } else if (fromLocation && fromLocation.length <= 2) {
      console.log('FROM location too short, clearing coordinates')
      setFromCoordinates(null)
      setIsGeocodingFrom(false)
    }
  }, [fromLocation])

  useEffect(() => {
    console.log('TO location changed:', toLocation, 'length:', toLocation?.length)
    if (toLocation && toLocation.length > 2) {
      const coords = getCoordinatesForCity(toLocation)
      if (coords && (!toCoordinates || toCoordinates.lat !== coords.lat)) {
        console.log('Setting TO coordinates from hardcoded list:', toLocation, coords)
        setToCoordinates(coords)
        setIsGeocodingTo(false)
      } else if (!coords) {
        // Try geocoding
        console.log('No hardcoded coords, trying geocoding for TO:', toLocation)
        setIsGeocodingTo(true)
        geocodeAddress(toLocation).then((geocodedCoords) => {
          if (geocodedCoords && (!toCoordinates || toCoordinates.lat !== geocodedCoords.lat)) {
            console.log('Setting TO coordinates from geocoding:', toLocation, geocodedCoords)
            setToCoordinates(geocodedCoords)
          }
          setIsGeocodingTo(false)
        })
      }
    } else if (toLocation && toLocation.length <= 2) {
      console.log('TO location too short, clearing coordinates')
      setToCoordinates(null)
      setIsGeocodingTo(false)
    }
  }, [toLocation])

  // Calculate distance when both coordinates are available
  useEffect(() => {
    console.log('Coordinates changed:', { fromCoordinates, toCoordinates })
    if (fromCoordinates && toCoordinates) {
      console.log('Both coordinates available, calculating distance...')
      calculateDistance()
    }
  }, [fromCoordinates, toCoordinates])

  const calculateDistance = async () => {
    if (!fromCoordinates || !toCoordinates) {
      console.log('Missing coordinates:', { fromCoordinates, toCoordinates })
      return
    }

    console.log('Starting distance calculation between:', fromCoordinates, 'and', toCoordinates)
    setIsCalculatingDistance(true)
    try {
      // Check if we have a valid API key
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey || apiKey === 'demo-key') {
        console.log('Using fallback distance calculation (no valid API key)')
        // Use fallback straight-line distance immediately
        const straightDistance = calculateStraightLineDistance(fromCoordinates, toCoordinates)
        const roadDistance = Math.round(straightDistance * 1.3) // Add 30% for road distance approximation
        const estimatedDuration = Math.round(straightDistance * 1.3 / 80)
        
        console.log('Calculated distance:', roadDistance, 'km, duration:', estimatedDuration, 'hours')
        setDistance(roadDistance)
        setDuration('Přibližně ' + estimatedDuration + ' hodin')
        setIsCalculatingDistance(false)
        return
      }

      // Load Google Maps API if not already loaded
      if (!(window as any).google) {
        console.log('Loading Google Maps API...')
        const { Loader } = await import('@googlemaps/js-api-loader')
        const loader = new Loader({
          apiKey: apiKey,
          version: 'weekly',
          libraries: ['geometry']
        })
        await loader.load()
        console.log('Google Maps API loaded')
      }

      const service = new (window as any).google.maps.DistanceMatrixService()
      
      service.getDistanceMatrix({
        origins: [fromCoordinates],
        destinations: [toCoordinates],
        travelMode: (window as any).google.maps.TravelMode.DRIVING,
        unitSystem: (window as any).google.maps.UnitSystem.METRIC,
        avoidHighways: false,
        avoidTolls: false
      }, (response: any, status: any) => {
        console.log('Google Maps API response:', { response, status })
        if (status === 'OK' && response.rows[0].elements[0].status === 'OK') {
          const element = response.rows[0].elements[0]
          const distanceInKm = Math.round(element.distance.value / 1000)
          console.log('Google Maps distance:', distanceInKm, 'km')
          setDistance(distanceInKm)
          setDuration(element.duration.text)
        } else {
          console.error('Distance calculation failed:', status)
          // Fallback to straight-line distance
          const straightDistance = calculateStraightLineDistance(fromCoordinates, toCoordinates)
          const roadDistance = Math.round(straightDistance * 1.3)
          console.log('Fallback distance:', roadDistance, 'km')
          setDistance(roadDistance)
          setDuration('Přibližně ' + Math.round(straightDistance * 1.3 / 80) + ' hodin')
        }
        setIsCalculatingDistance(false)
      })
    } catch (error) {
      console.error('Error calculating distance:', error)
      // Fallback to straight-line distance
      if (fromCoordinates && toCoordinates) {
        const straightDistance = calculateStraightLineDistance(fromCoordinates, toCoordinates)
        const roadDistance = Math.round(straightDistance * 1.3)
        console.log('Error fallback distance:', roadDistance, 'km')
        setDistance(roadDistance)
        setDuration('Přibližně ' + Math.round(straightDistance * 1.3 / 80) + ' hodin')
      }
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
                placeholder="Zadejte město (např. Praha, Brno, Ostrava...)"
                value={fromLocation}
                onChange={(e) => setFromLocation(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="to">Kam</Label>
              <Input
                id="to"
                placeholder="Zadejte město (např. Praha, Brno, Ostrava...)"
                value={toLocation}
                onChange={(e) => setToLocation(e.target.value)}
              />
            </div>
          </div>

          {/* Helper text */}
          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p><strong>💡 Tip:</strong> Stačí zadat název města (Praha, Brno, Ostrava...) a vzdálenost se automaticky vypočítá!</p>
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
                <p className="text-sm text-gray-600">Počítám vzdálenost...</p>
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
          <Button onClick={async () => {
            if (!fromLocation || !toLocation || (!cargoType && !vehicleType && !fullTruckType) || !firstName || !lastName || !phone || !email || !address) {
              toast({
                title: "Chyba",
                description: "Prosím vyplňte všechna povinná pole",
                variant: "destructive",
              })
              return
            }

            setIsSubmitting(true)

            try {
              await submitOrder({
                fromLocation,
                toLocation,
                distance: distance || undefined,
                duration: duration || undefined,
                cargoType,
                vehicleType,
                fullTruckType,
                pickupDate,
                firstName,
                lastName,
                companyName,
                phone,
                email,
                address,
                finalPrice
              })

              console.log('Order submitted successfully')
              setIsSubmitted(true)
              toast({
                title: "Objednávka odeslána!",
                description: "Brzy vás budeme kontaktovat s potvrzením a dalšími detaily.",
              })

              // Reset form after successful submission
              setFromLocation('')
              setToLocation('')
              setFromCoordinates(null)
              setToCoordinates(null)
              setDistance(null)
              setDuration(null)
              setCargoType('')
              setVehicleType('')
              setFullTruckType('')
              setPickupDate('')
              setFirstName('')
              setLastName('')
              setCompanyName('')
              setPhone('')
              setEmail('')
              setAddress('')
            } catch (error) {
              console.error('Error submitting order:', error)
              toast({
                title: "Chyba při odesílání",
                description: "Nepodařilo se odeslat objednávku. Zkuste to prosím znovu.",
                variant: "destructive",
              })
            } finally {
              setIsSubmitting(false)
            }
          }} 
            className="w-full bg-primary hover:bg-primary/90 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!fromLocation || !toLocation || (!cargoType && !vehicleType && !fullTruckType) || !firstName || !lastName || !phone || !email || !address || isSubmitting}
          >
            {isSubmitting ? 'Odesílám...' : finalPrice > 0 ? `Objednat za ${finalPrice.toLocaleString('cs-CZ')} Kč` : 'Objednat přepravu'}
          </Button>
          <p className="text-xs text-gray-500 text-center mt-4">
            Odesláním objednávky souhlasíte s obchodními podmínkami a podmínkami pro ochranu osobních údajů
          </p>
        </CardContent>
      </Card>
    </div>
  )
}










