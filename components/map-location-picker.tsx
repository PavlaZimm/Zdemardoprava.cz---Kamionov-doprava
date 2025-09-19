"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MapPin, Search } from 'lucide-react'

interface MapLocationPickerProps {
  value: string
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void
  placeholder: string
  buttonText: string
}

export function MapLocationPicker({ value, onChange, placeholder, buttonText }: MapLocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(value)
  const [suggestions, setSuggestions] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<any>(null)
  const markerRef = useRef<any>(null)
  const autocompleteService = useRef<any>(null)
  const placesService = useRef<any>(null)

  // Initialize Google Maps
  useEffect(() => {
    if (isOpen && !mapInstance.current) {
      initializeMap()
    }
  }, [isOpen])

  const initializeMap = async () => {
    try {
      // Check if we have a valid API key
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
      if (!apiKey || apiKey === 'demo-key') {
        console.log('No valid Google Maps API key, showing fallback interface')
        // Show fallback interface for manual coordinate entry
        if (mapRef.current) {
          mapRef.current.innerHTML = `
            <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
              <div class="text-center p-6">
                <div class="text-gray-500 mb-4 text-4xl">🗺️</div>
                <p class="text-gray-600 mb-4 font-medium">Mapa vyžaduje Google Maps API klíč</p>
                <p class="text-sm text-gray-500 mb-4">Pro plnou funkcionalnost přidejte NEXT_PUBLIC_GOOGLE_MAPS_API_KEY do nastavení</p>
                <p class="text-xs text-gray-400">Můžete stále zadávat adresy do vyhledávacího pole výše</p>
              </div>
            </div>
          `
        }
        return
      }

      // Load Google Maps API
      const { Loader } = await import('@googlemaps/js-api-loader')
      const loader = new Loader({
        apiKey: apiKey,
        version: 'weekly',
        libraries: ['places']
      })

      const google = await loader.load()

      if (mapRef.current && (window as any).google) {
        const googleMaps = (window as any).google.maps
        
        // Initialize map centered on Czech Republic
        mapInstance.current = new googleMaps.Map(mapRef.current, {
          center: { lat: 49.7437, lng: 15.3386 }, // Czech Republic center
          zoom: 7,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        })

        // Initialize services
        autocompleteService.current = new googleMaps.places.AutocompleteService()
        placesService.current = new googleMaps.places.PlacesService(mapInstance.current)

        // Add click listener to map
        mapInstance.current.addListener('click', (event: any) => {
          if (event.latLng) {
            placeMarker(event.latLng)
            reverseGeocode(event.latLng)
          }
        })
      }
    } catch (error) {
      console.error('Error loading Google Maps:', error)
      // Fallback: show message that map requires API key
      if (mapRef.current) {
        mapRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full bg-gray-100 rounded-lg">
            <div class="text-center p-6">
              <div class="text-gray-500 mb-4 text-4xl">🗺️</div>
              <p class="text-gray-600 mb-4 font-medium">Chyba při načítání mapy</p>
              <p class="text-sm text-gray-500 mb-4">Zkontrolujte Google Maps API klíč</p>
              <p class="text-xs text-gray-400">Můžete stále zadávat adresy do vyhledávacího pole výše</p>
            </div>
          </div>
        `
      }
    }
  }

  const placeMarker = (location: any) => {
    if (markerRef.current) {
      markerRef.current.setMap(null)
    }

    const googleMaps = (window as any).google.maps
    markerRef.current = new googleMaps.Marker({
      position: location,
      map: mapInstance.current,
      draggable: true,
      animation: googleMaps.Animation.DROP,
    })

    markerRef.current.addListener('dragend', () => {
      if (markerRef.current) {
        const position = markerRef.current.getPosition()
        if (position) {
          reverseGeocode(position)
        }
      }
    })
  }

  const reverseGeocode = (location: any) => {
    const googleMaps = (window as any).google.maps
    const geocoder = new googleMaps.Geocoder()
    geocoder.geocode({ location }, (results: any, status: any) => {
      if (status === 'OK' && results && results[0]) {
        const address = results[0].formatted_address
        setSearchValue(address)
      }
    })
  }

  const searchPlaces = async (query: string) => {
    if (!query.trim() || !autocompleteService.current) return

    setIsLoading(true)
    try {
      const request = {
        input: query,
        componentRestrictions: { country: ['cz', 'sk', 'at', 'de', 'pl'] }, // European countries
        types: ['geocode', 'establishment']
      }

      autocompleteService.current.getPlacePredictions(request, (predictions: any, status: any) => {
        const googleMaps = (window as any).google.maps
        if (status === googleMaps.places.PlacesServiceStatus.OK && predictions) {
          setSuggestions(predictions)
        } else {
          setSuggestions([])
        }
        setIsLoading(false)
      })
    } catch (error) {
      console.error('Error searching places:', error)
      setIsLoading(false)
    }
  }

  const selectPlace = (placeId: string, description: string) => {
    if (!placesService.current) return

    const request = {
      placeId,
      fields: ['geometry', 'formatted_address']
    }

    placesService.current.getDetails(request, (place: any, status: any) => {
      const googleMaps = (window as any).google.maps
      if (status === googleMaps.places.PlacesServiceStatus.OK && place && place.geometry?.location) {
        const location = place.geometry.location
        setSearchValue(description)
        setSuggestions([])

        // Center map and place marker
        if (mapInstance.current) {
          mapInstance.current.setCenter(location)
          mapInstance.current.setZoom(15)
          placeMarker(location)
        }
      }
    })
  }

  const confirmSelection = () => {
    const coordinates = markerRef.current?.getPosition()
    if (coordinates) {
      onChange(searchValue, { lat: coordinates.lat(), lng: coordinates.lng() })
    } else if (searchValue) {
      // If no marker but we have a search value, try to geocode it manually or use a fallback
      // For demo purposes, we'll use some common Czech cities coordinates
      const fallbackCoordinates = getFallbackCoordinates(searchValue)
      onChange(searchValue, fallbackCoordinates)
    } else {
      onChange(searchValue)
    }
    setIsOpen(false)
  }

  // Fallback coordinates for common Czech cities when API is not available
  const getFallbackCoordinates = (address: string): { lat: number; lng: number } | undefined => {
    const lowerAddress = address.toLowerCase()
    const cityCoordinates: { [key: string]: { lat: number; lng: number } } = {
      'praha': { lat: 50.0755, lng: 14.4378 },
      'prague': { lat: 50.0755, lng: 14.4378 },
      'brno': { lat: 49.1951, lng: 16.6068 },
      'ostrava': { lat: 49.8209, lng: 18.2625 },
      'plzeň': { lat: 49.7384, lng: 13.3736 },
      'pilsen': { lat: 49.7384, lng: 13.3736 },
      'liberec': { lat: 50.7663, lng: 15.0543 },
      'olomouc': { lat: 49.5938, lng: 17.2509 },
      'budějovice': { lat: 48.9744, lng: 14.4743 },
      'hradec králové': { lat: 50.2103, lng: 15.8327 },
      'pardubice': { lat: 50.0343, lng: 15.7812 },
      'zlín': { lat: 49.2265, lng: 17.6679 },
      'kladno': { lat: 50.1473, lng: 14.1027 },
      'most': { lat: 50.5030, lng: 13.6357 },
      'opava': { lat: 49.9387, lng: 17.9027 },
      'frýdek-místek': { lat: 49.6835, lng: 18.3488 },
      'karviná': { lat: 49.8540, lng: 18.5409 },
      'jihlava': { lat: 49.3961, lng: 15.5910 },
      'teplice': { lat: 50.6404, lng: 13.8249 },
      'děčín': { lat: 50.7820, lng: 14.2147 }
    }

    // Try to find a match
    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (lowerAddress.includes(city)) {
        return coords
      }
    }

    // If no match found, return Prague as default
    return { lat: 50.0755, lng: 14.4378 }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue && searchValue !== value) {
        searchPlaces(searchValue)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [searchValue])

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <MapPin className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Vyberte místo na mapě</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Vyhledejte adresu nebo klikněte na mapu..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />
            
            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                {suggestions.map((suggestion: any) => (
                  <button
                    key={suggestion.place_id}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    onClick={() => selectPlace(suggestion.place_id, suggestion.description)}
                  >
                    <div className="font-medium">{suggestion.structured_formatting.main_text}</div>
                    <div className="text-sm text-gray-600">{suggestion.structured_formatting.secondary_text}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div 
            ref={mapRef} 
            className="w-full h-96 rounded-lg border"
            style={{ minHeight: '400px' }}
          />

          {/* Instructions */}
          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <p><strong>Jak vybrat místo:</strong></p>
            <p>• Zadejte adresu do vyhledávacího pole</p>
            <p>• Nebo klikněte přímo na mapu</p>
            <p>• Marker můžete přetáhnout na přesné místo</p>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Zrušit
            </Button>
            <Button onClick={confirmSelection} disabled={!searchValue}>
              Potvrdit výběr
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

