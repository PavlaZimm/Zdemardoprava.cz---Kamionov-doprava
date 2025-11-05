"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { MapPin, Search, Loader2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the entire map component to avoid SSR issues
const LeafletMap = dynamic(
  () => import('./leaflet-map-component'),
  { ssr: false }
)

interface MapLocationPickerProps {
  value: string
  onChange: (value: string, coordinates?: { lat: number; lng: number }) => void
  placeholder: string
  buttonText: string
}

interface NominatimResult {
  place_id: number
  display_name: string
  lat: string
  lon: string
  address: {
    road?: string
    city?: string
    town?: string
    village?: string
    country?: string
  }
}

export function MapLocationPicker({ value, onChange, placeholder, buttonText }: MapLocationPickerProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchValue, setSearchValue] = useState(value)
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null)
  const [mapCenter, setMapCenter] = useState<{ lat: number; lng: number }>({ lat: 49.7437, lng: 15.3386 }) // Czech Republic center

  // Geocode address using Nominatim (OpenStreetMap)
  const geocodeAddress = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      // Using Nominatim API for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?` +
        `q=${encodeURIComponent(query)}` +
        `&format=json` +
        `&limit=5` +
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
        setSuggestions(data)
      } else {
        console.error('Nominatim API error:', response.status)
        setSuggestions([])
      }
    } catch (error) {
      console.error('Error geocoding address:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Reverse geocode coordinates using Nominatim
  const reverseGeocode = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?` +
        `lat=${lat}&lon=${lng}` +
        `&format=json` +
        `&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'cs,en',
            'User-Agent': 'ZdemarDoprava-App/1.0'
          }
        }
      )

      if (response.ok) {
        const data = await response.json()
        setSearchValue(data.display_name)
      }
    } catch (error) {
      console.error('Error reverse geocoding:', error)
    }
  }

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue && searchValue !== value) {
        geocodeAddress(searchValue)
      }
    }, 500)

    return () => clearTimeout(timer)
  }, [searchValue])

  const selectPlace = (result: NominatimResult) => {
    const lat = parseFloat(result.lat)
    const lng = parseFloat(result.lon)

    setSearchValue(result.display_name)
    setSelectedPosition({ lat, lng })
    setMapCenter({ lat, lng })
    setSuggestions([])
  }

  const confirmSelection = () => {
    if (selectedPosition) {
      onChange(searchValue, selectedPosition)
    } else if (searchValue) {
      onChange(searchValue)
    }
    setIsOpen(false)
  }

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedPosition({ lat, lng })
    reverseGeocode(lat, lng)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <MapPin className="w-4 h-4 mr-2" />
          {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vyberte místo na mapě</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={placeholder || "Vyhledejte adresu nebo klikněte na mapu..."}
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10"
            />

            {/* Loading indicator */}
            {isLoading && (
              <Loader2 className="absolute right-3 top-3 h-4 w-4 animate-spin text-muted-foreground" />
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg z-50 max-h-60 overflow-y-auto mt-1">
                {suggestions.map((suggestion) => (
                  <button
                    key={suggestion.place_id}
                    className="w-full text-left px-4 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-b-0"
                    onClick={() => selectPlace(suggestion)}
                  >
                    <div className="font-medium text-sm">{suggestion.display_name}</div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Map */}
          <div className="w-full h-96 rounded-lg border overflow-hidden">
            <LeafletMap
              center={mapCenter}
              zoom={7}
              selectedPosition={selectedPosition}
              onMapClick={handleMapClick}
            />
          </div>

          {/* Instructions */}
          <div className="text-sm text-muted-foreground bg-blue-50 p-3 rounded-lg">
            <p><strong>Jak vybrat místo:</strong></p>
            <ul className="list-disc list-inside space-y-1">
              <li>Zadejte adresu do vyhledávacího pole (min. 3 znaky)</li>
              <li>Nebo klikněte přímo na mapu</li>
              <li>Používá OpenStreetMap - zdarma, bez API klíče</li>
            </ul>
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
