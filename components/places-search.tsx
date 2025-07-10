"use client"
import React from 'react'
import { useEffect, useRef, useState } from "react"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Loader2 } from "lucide-react"

interface PlacesSearchProps {
  value: string
  onChange: (value: string) => void
  placeholder: string
  className?: string
}

interface SearchResult {
  display_name: string
  lat: string
  lon: string
  place_id: string
  type: string
}

export function PlacesSearch({ value, onChange, placeholder, className }: PlacesSearchProps) {
  const [predictions, setPredictions] = useState<SearchResult[]>([])
  const [showPredictions, setShowPredictions] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const debounceRef = useRef<NodeJS.Timeout>()

  // Suggestions locales pour Casablanca
  const casablancaLocations = [
    "Casa Port - Gare",
    "Place Mohammed V",
    "Ain Diab - Corniche",
    "Maarif - Centre Commercial",
    "Hay Hassani",
    "Sidi Bernoussi",
    "Derb Ghallef",
    "Quartier Gauthier",
    "Anfa Place",
    "Twin Center",
    "Mosquée Hassan II",
    "Medina de Casablanca",
    "Quartier des Habous",
    "Aéroport Mohammed V",
    "Université Hassan II",
    "Technopark",
    "Sidi Maarouf",
    "Bouskoura",
    "Mohammedia",
    "Nouaceur",
  ]

  const handleInputChange = (inputValue: string) => {
    onChange(inputValue)

    if (!inputValue.trim()) {
      setPredictions([])
      setShowPredictions(false)
      return
    }

    // Filtrer d'abord les suggestions locales
    const localMatches = casablancaLocations
      .filter((location) => location.toLowerCase().includes(inputValue.toLowerCase()))
      .slice(0, 5)
      .map((location) => ({
        display_name: `${location}, Casablanca, Maroc`,
        lat: "33.5731",
        lon: "-7.5898",
        place_id: `local_${location}`,
        type: "local",
      }))

    if (localMatches.length > 0) {
      setPredictions(localMatches)
      setShowPredictions(true)
    }

    // Recherche avec Nominatim (avec debounce)
    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      if (inputValue.length >= 3) {
        setIsLoading(true)
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
              inputValue + ", Casablanca, Morocco",
            )}&limit=5&countrycodes=ma&addressdetails=1`,
          )

          const data: SearchResult[] = await response.json()

          if (data && data.length > 0) {
            // Combiner les résultats locaux et Nominatim
            const combinedResults = [
              ...localMatches,
              ...data
                .filter(
                  (item) =>
                    !localMatches.some((local) =>
                      local.display_name.toLowerCase().includes(item.display_name.toLowerCase()),
                    ),
                )
                .slice(0, 3),
            ]

            setPredictions(combinedResults)
            setShowPredictions(true)
          }
        } catch (error) {
          console.error("Erreur de recherche:", error)
          // Garder seulement les résultats locaux en cas d'erreur
          if (localMatches.length === 0) {
            setPredictions([])
            setShowPredictions(false)
          }
        } finally {
          setIsLoading(false)
        }
      }
    }, 300)
  }

  const handlePredictionSelect = (prediction: SearchResult) => {
    // Extraire le nom principal de l'adresse
    const mainName = prediction.display_name.split(",")[0]
    onChange(mainName)
    setPredictions([])
    setShowPredictions(false)
  }

  const handleFocus = () => {
    if (value && predictions.length > 0) {
      setShowPredictions(true)
    }
  }

  const handleBlur = () => {
    // Délai pour permettre le clic sur une suggestion
    setTimeout(() => setShowPredictions(false), 200)
  }

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  return (
    <div className="relative">
      <div className="relative">
        <Input
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`pr-10 ${className}`}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {showPredictions && predictions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction, index) => (
            <button
              key={prediction.place_id || index}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 flex items-start gap-3 border-b border-gray-100 last:border-b-0 transition-colors"
              onClick={() => handlePredictionSelect(prediction)}
            >
              <MapPin
                className={`h-4 w-4 mt-0.5 flex-shrink-0 ${
                  prediction.type === "local" ? "text-blue-500" : "text-gray-400"
                }`}
              />
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">{prediction.display_name.split(",")[0]}</div>
                <div className="text-xs text-gray-500 truncate">
                  {prediction.display_name.split(",").slice(1).join(",").trim()}
                </div>
                {prediction.type === "local" && <div className="text-xs text-blue-600 mt-1">📍 Lieu populaire</div>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
