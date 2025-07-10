"use client"
import React from 'react'
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, Clock, AlertCircle, RotateCcw } from "lucide-react"

interface LeafletMapProps {
  departure: string
  destination: string
  onRouteCalculated?: (route: any) => void
  selectedItinerary?: any
}

declare global {
  interface Window {
    L: any
  }
}

export function LeafletMap({ departure, destination, onRouteCalculated, selectedItinerary }: LeafletMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [routeInfo, setRouteInfo] = useState<any>(null)
  const routeLayerRef = useRef<any>(null)
  const markersRef = useRef<any[]>([])
  const mapInstanceRef = useRef<any>(null)

  // Initialisation de Leaflet
  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null
    let linkElement: HTMLLinkElement | null = null

    const initializeMap = () => {
      if (!window.L || !mapRef.current) return

      try {
        // Vérifier si la carte existe déjà
        if (mapInstanceRef.current) {
          mapInstanceRef.current.remove()
          mapInstanceRef.current = null
        }

        // Centre sur Casablanca
        const casablancaCenter = [33.5731, -7.5898]

        const mapInstance = window.L.map(mapRef.current, {
          center: casablancaCenter,
          zoom: 12,
          zoomControl: true,
          scrollWheelZoom: true,
          doubleClickZoom: true,
          touchZoom: true,
        })

        mapInstanceRef.current = mapInstance

        // Ajouter les tuiles OpenStreetMap
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstance)

        // Ajouter un marqueur pour Casablanca
        const casablancaMarker = window.L.marker(casablancaCenter)
          .addTo(mapInstance)
          .bindPopup("<b>Casablanca</b><br>Centre-ville")

        markersRef.current.push(casablancaMarker)

        setMap(mapInstance)
        setIsLoading(false)
      } catch (err) {
        console.error("Erreur lors de l'initialisation de la carte:", err)
        setError("Erreur lors du chargement de la carte")
        setIsLoading(false)
      }
    }

    // Charger Leaflet si pas déjà chargé
    if (!window.L) {
      // Charger le CSS de Leaflet
      linkElement = document.createElement("link")
      linkElement.rel = "stylesheet"
      linkElement.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
      linkElement.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
      linkElement.crossOrigin = ""
      document.head.appendChild(linkElement)

      // Charger le JS de Leaflet
      scriptElement = document.createElement("script")
      scriptElement.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
      scriptElement.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
      scriptElement.crossOrigin = ""
      scriptElement.async = true

      scriptElement.onload = () => {
        // Attendre un peu pour que Leaflet soit complètement initialisé
        setTimeout(initializeMap, 100)
      }

      scriptElement.onerror = () => {
        setError("Impossible de charger Leaflet")
        setIsLoading(false)
      }

      document.head.appendChild(scriptElement)
    } else {
      initializeMap()
    }

    return () => {
      // Nettoyage
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
      setMap(null)
    }
  }, [])

  // Calculer et afficher l'itinéraire
  useEffect(() => {
    if (map && departure && destination) {
      calculateRoute()
    }
  }, [departure, destination, map, selectedItinerary])

  const calculateRoute = async () => {
    if (!map) return

    setIsLoading(true)
    setError(null)

    try {
      // Nettoyer les anciens marqueurs et routes
      markersRef.current.forEach((marker) => map.removeLayer(marker))
      markersRef.current = []

      if (routeLayerRef.current) {
        map.removeLayer(routeLayerRef.current)
      }

      // Géocoder les adresses avec Nominatim
      const departureCoords = await geocodeAddress(`${departure}, Casablanca, Morocco`)
      const destinationCoords = await geocodeAddress(`${destination}, Casablanca, Morocco`)

      if (!departureCoords || !destinationCoords) {
        throw new Error("Impossible de localiser les adresses")
      }

      // Ajouter les marqueurs
      const departureMarker = window.L.marker(departureCoords).addTo(map).bindPopup(`<b>Départ</b><br>${departure}`)

      const destinationMarker = window.L.marker(destinationCoords)
        .addTo(map)
        .bindPopup(`<b>Arrivée</b><br>${destination}`)

      markersRef.current.push(departureMarker, destinationMarker)

      // Calculer la route avec OSRM (Open Source Routing Machine)
      const routeData = await calculateOSRMRoute(departureCoords, destinationCoords)

      if (routeData) {
        // Décoder la géométrie de la route
        const routeCoordinates = decodePolyline(routeData.routes[0].geometry)

        // Créer la ligne de route
        const routeLine = window.L.polyline(routeCoordinates, {
          color: selectedItinerary ? "#3B82F6" : "#10B981",
          weight: selectedItinerary ? 6 : 4,
          opacity: 0.8,
        }).addTo(map)

        routeLayerRef.current = routeLine

        // Ajuster la vue pour inclure toute la route
        const group = window.L.featureGroup([departureMarker, destinationMarker, routeLine])
        map.fitBounds(group.getBounds(), { padding: [20, 20] })

        // Extraire les informations de la route
        const route = routeData.routes[0]
        setRouteInfo({
          distance: `${(route.distance / 1000).toFixed(1)} km`,
          duration: `${Math.round(route.duration / 60)} min`,
          steps: route.legs[0]?.steps?.length || 0,
        })

        if (onRouteCalculated) {
          onRouteCalculated(routeData)
        }
      } else {
        // Route simple en ligne droite si OSRM échoue
        const simpleLine = window.L.polyline([departureCoords, destinationCoords], {
          color: "#6B7280",
          weight: 3,
          opacity: 0.6,
          dashArray: "10, 10",
        }).addTo(map)

        routeLayerRef.current = simpleLine

        const group = window.L.featureGroup([departureMarker, destinationMarker, simpleLine])
        map.fitBounds(group.getBounds(), { padding: [20, 20] })

        // Calculer la distance approximative
        const distance = calculateDistance(departureCoords, destinationCoords)
        setRouteInfo({
          distance: `${distance.toFixed(1)} km`,
          duration: `${Math.round(distance * 3)} min`, // Estimation: 3 min par km
          steps: 2,
        })
      }

      setIsLoading(false)
    } catch (err) {
      console.error("Erreur lors du calcul de l'itinéraire:", err)
      setError("Impossible de calculer l'itinéraire")
      setIsLoading(false)
    }
  }

  // Géocoder une adresse avec Nominatim
  const geocodeAddress = async (address: string): Promise<[number, number] | null> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1&countrycodes=ma`,
      )
      const data = await response.json()

      if (data && data.length > 0) {
        return [Number.parseFloat(data[0].lat), Number.parseFloat(data[0].lon)]
      }
      return null
    } catch (error) {
      console.error("Erreur de géocodage:", error)
      return null
    }
  }

  // Calculer la route avec OSRM
  const calculateOSRMRoute = async (start: [number, number], end: [number, number]) => {
    try {
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/driving/${start[1]},${start[0]};${end[1]},${end[0]}?overview=full&geometries=polyline`,
      )
      const data = await response.json()

      if (data.code === "Ok") {
        return data
      }
      return null
    } catch (error) {
      console.error("Erreur OSRM:", error)
      return null
    }
  }

  // Décoder une polyline
  const decodePolyline = (encoded: string): [number, number][] => {
    const points: [number, number][] = []
    let index = 0
    let lat = 0
    let lng = 0

    while (index < encoded.length) {
      let b,
        shift = 0,
        result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lat += dlat

      shift = 0
      result = 0
      do {
        b = encoded.charCodeAt(index++) - 63
        result |= (b & 0x1f) << shift
        shift += 5
      } while (b >= 0x20)
      const dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
      lng += dlng

      points.push([lat / 1e5, lng / 1e5])
    }

    return points
  }

  // Calculer la distance entre deux points
  const calculateDistance = (coord1: [number, number], coord2: [number, number]): number => {
    const R = 6371 // Rayon de la Terre en km
    const dLat = ((coord2[0] - coord1[0]) * Math.PI) / 180
    const dLon = ((coord2[1] - coord1[1]) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((coord1[0] * Math.PI) / 180) *
        Math.cos((coord2[0] * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  const recenterMap = () => {
    if (map) {
      map.setView([33.5731, -7.5898], 12)
    }
  }

  if (error) {
    return (
      <Card className="bg-red-50 border-red-200">
        <CardContent className="p-6 text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-800 mb-2">Erreur de carte</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Recharger la page
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Carte de l'itinéraire
          {isLoading && <span className="text-sm text-gray-500">(Chargement...)</span>}
          {selectedItinerary && <span className="text-sm text-blue-600 font-medium">• Itinéraire sélectionné</span>}
        </CardTitle>
        <CardDescription>
          Trajet de <strong>{departure}</strong> vers <strong>{destination}</strong>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div ref={mapRef} className="w-full h-[500px] bg-gray-100 rounded-lg border" style={{ minHeight: "500px" }}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg z-10">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                  <p className="text-gray-600">Chargement de la carte...</p>
                </div>
              </div>
            )}
          </div>

          {/* Contrôles personnalisés */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
            <Button size="sm" variant="secondary" onClick={recenterMap} title="Recentrer sur Casablanca">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Informations du trajet */}
        {routeInfo && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-blue-600">{routeInfo.duration}</div>
              <div className="text-sm text-gray-600">Durée estimée</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <MapPin className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-green-600">{routeInfo.distance}</div>
              <div className="text-sm text-gray-600">Distance totale</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Navigation className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-lg font-semibold text-orange-600">{routeInfo.steps}</div>
              <div className="text-sm text-gray-600">Étapes</div>
            </div>
          </div>
        )}

        {/* Informations sur l'itinéraire sélectionné */}
        {selectedItinerary && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Navigation className="h-4 w-4" />
              Itinéraire sélectionné affiché sur la carte
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Durée:</span>
                <div className="font-semibold text-blue-600">{selectedItinerary.duration}</div>
              </div>
              <div>
                <span className="text-gray-600">Distance:</span>
                <div className="font-semibold text-green-600">{selectedItinerary.distance}</div>
              </div>
              <div>
                <span className="text-gray-600">Prix:</span>
                <div className="font-semibold text-orange-600">{selectedItinerary.price}</div>
              </div>
              <div>
                <span className="text-gray-600">Affluence:</span>
                <div
                  className={`font-semibold capitalize ${
                    selectedItinerary.crowdLevel === "faible"
                      ? "text-green-600"
                      : selectedItinerary.crowdLevel === "moyen"
                        ? "text-yellow-600"
                        : "text-red-600"
                  }`}
                >
                  {selectedItinerary.crowdLevel}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Note sur la technologie */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🗺️ Carte fournie par OpenStreetMap • Itinéraires calculés avec OSRM
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
