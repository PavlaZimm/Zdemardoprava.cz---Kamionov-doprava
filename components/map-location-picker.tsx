"use client"

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MapPin, Search } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import Leaflet components to avoid SSR issues
const MapContainer = dynamic(
  () => import('react-leaflet').then((mod) => mod.MapContainer),
  { ssr: false }
)
const TileLayer = dynamic(
  () => import('react-leaflet').then((mod) => mod.TileLayer),
  { ssr: false }
)
const Marker = dynamic(
  () => import('react-leaflet').then((mod) => mod.Marker),
  { ssr: false }
)
const useMapEvents = dynamic(
  () => import('react-leaflet').then((mod) => mod.useMapEvents),
  { ssr: false }
)

interface MapLocationPickerProps {
  value: string
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void
  placeholder: string
  buttonText: string
}

interface Suggestion {
  place_id: string
  display_name: string
  lat: string
  lon: string
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click: (e) => {
      onLocationSelect(e.latlng.lat, e.latlng.lng)
    },
  })
  return null
}

export function MapLocationPicker({ value, onChange, placeholder, buttonText }: MapLocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(value)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null)
  const [mapCenter, setMapCenter] = useState<[number, number]>([49.7437, 15.3386]) // Czech Republic center
  const mapRef = useRef<any>(null)

  // Geocode address to get coordinates using Nominatim
  const geocodeAddress = async (address: string) => {
    if (!address.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=5&countrycodes=cz,sk,at,de,pl`
      )
      const data = await response.json()

      if (data && data.length > 0) {
        setSuggestions(data)
      } else {
        setSuggestions([])
      }
    } catch (error) {
      console.error('Error geocoding address:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Reverse geocode coordinates to get address
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
      )
      const data = await response.json()

      if (data && data.display_name) {
        setSearchValue(data.display_name)
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
    }
  }

  // Handle place selection from suggestions
  const selectPlace = (suggestion: Suggestion) => {
    const lat = parseFloat(suggestion.lat)
    const lng = parseFloat(suggestion.lon)

    setSearchValue(suggestion.display_name)
    setMarkerPosition([lat, lng])
    setMapCenter([lat, lng])
    setSuggestions([])

    // Pan map to the selected location
    if (mapRef.current) {
      mapRef.current.setView([lat, lng], 15)
    }
  }

  // Handle map click
  const handleMapClick = (lat: number, lng: number) => {
    setMarkerPosition([lat, lng])
    reverseGeocode(lat, lng)
  }

  // Confirm selection
  const confirmSelection = () => {
    if (markerPosition) {
      onChange(searchValue, { lat: markerPosition[0], lng: markerPosition[1] })
    } else if (searchValue) {
      // If no marker but we have a search value, try to use fallback coordinates
      const fallbackCoords = getFallbackCoordinates(searchValue)
      onChange(searchValue, fallbackCoords)
    } else {
      onChange(searchValue)
    }
    setIsOpen(false)
  }

  // Fallback coordinates for common Czech cities
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

    for (const [city, coords] of Object.entries(cityCoordinates)) {
      if (lowerAddress.includes(city)) {
        return coords
      }
    }

    return { lat: 50.0755, lng: 14.4378 } // Prague as default
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue && searchValue !== value && searchValue.length > 2) {
        geocodeAddress(searchValue)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue])

  // Fix for default marker icon in Leaflet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('leaflet').then((L) => {
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
          iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
          shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        })
      })
    }
  }, [])

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
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    onClick={() => selectPlace(suggestion)}
                  >
                    <div className="text-sm">{suggestion.display_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="w-full h-96 rounded-lg border overflow-hidden" style={{ minHeight: '400px' }}>
            {typeof window !== 'undefined' && (
              <MapContainer
                center={mapCenter}
                zoom={7}
                scrollWheelZoom={true}
                style={{ height: '100%', width: '100%' }}
                ref={mapRef}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markerPosition && <Marker position={markerPosition} />}
                <MapClickHandler onLocationSelect={handleMapClick} />
              </MapContainer>
            )}
          </div>

          {/* Instructions */}
          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <p><strong>Jak vybrat místo:</strong></p>
            <p>• Zadejte adresu do vyhledávacího pole</p>
            <p>• Nebo klikněte přímo na mapu</p>
            <p>• Marker se automaticky umístí na vybrané místo</p>
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
