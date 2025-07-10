"use client"
import React from 'react'
import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Navigation, RotateCcw, AlertCircle } from "lucide-react"

interface Station {
  name: string
  coordinates: [number, number]
  lines: string[]
  crowdLevel: "faible" | "moyen" | "fort"
  confidence: number
  lastUpdate?: string
}

interface HomeMapProps {
  stations: Station[]
}

declare global {
  interface Window {
    L: any
  }
}

export function HomeMap({ stations }: HomeMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const markersRef = useRef<any[]>([])

  // Initialisation de Leaflet
  useEffect(() => {
    let scriptElement: HTMLScriptElement | null = null
    let linkElement: HTMLLinkElement | null = null

    const initializeMap = () => {
      if (!window.L || !mapRef.current) return

      try {
        // Vérifier si une carte existe déjà et la supprimer
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

        // Ajouter les tuiles OpenStreetMap
        window.L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(mapInstance)

        mapInstanceRef.current = mapInstance
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
      // Nettoyer les marqueurs
      if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => {
          if (mapInstanceRef.current && marker) {
            mapInstanceRef.current.removeLayer(marker)
          }
        })
        markersRef.current = []
      }

      // Supprimer la carte
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Ajouter les stations sur la carte
  useEffect(() => {
    if (mapInstanceRef.current && stations.length > 0) {
      addStationsToMap()
    }
  }, [stations])

  const addStationsToMap = () => {
    if (!mapInstanceRef.current) return

    // Nettoyer les anciens marqueurs
    markersRef.current.forEach((marker) => {
      if (marker) {
        mapInstanceRef.current.removeLayer(marker)
      }
    })
    markersRef.current = []

    // Ajouter les marqueurs pour chaque station
    stations.forEach((station) => {
      const color = getMarkerColor(station.crowdLevel)

      // Créer une icône personnalisée
      const customIcon = window.L.divIcon({
        className: "custom-station-marker",
        html: `
          <div style="
            background-color: ${color};
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 8px;
              height: 8px;
              background-color: white;
              border-radius: 50%;
            "></div>
          </div>
        `,
        iconSize: [26, 26],
        iconAnchor: [13, 13],
      })

      const marker = window.L.marker(station.coordinates, { icon: customIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="min-width: 200px;">
            <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #1f2937;">${station.name}</h3>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Lignes:</strong> ${station.lines.join(", ")}
            </p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Affluence:</strong>
              <span style="color: ${color}; font-weight: bold; text-transform: capitalize;">
                ${station.crowdLevel}
              </span>
            </p>
            <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 14px;">
              <strong>Confiance:</strong> ${Math.round(station.confidence)}%
            </p>
            ${
              station.lastUpdate
                ? `
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                Mis à jour: ${formatTimeAgo(station.lastUpdate)}
              </p>
            `
                : ""
            }
          </div>
        `)

      markersRef.current.push(marker)
    })

    // Ajuster la vue pour inclure toutes les stations
    if (stations.length > 0) {
      const group = window.L.featureGroup(markersRef.current)
      mapInstanceRef.current.fitBounds(group.getBounds(), { padding: [20, 20] })
    }
  }

  const getMarkerColor = (crowdLevel: "faible" | "moyen" | "fort"): string => {
    switch (crowdLevel) {
      case "faible":
        return "#10b981" // vert
      case "moyen":
        return "#f59e0b" // jaune/orange
      case "fort":
        return "#ef4444" // rouge
      default:
        return "#6b7280" // gris
    }
  }

  const formatTimeAgo = (dateString: string): string => {
    const now = new Date()
    const reportTime = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - reportTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "à l'instant"
    if (diffInMinutes < 60) return `il y a ${diffInMinutes} min`
    return `il y a ${Math.floor(diffInMinutes / 60)}h`
  }

  const recenterMap = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView([33.5731, -7.5898], 12)
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
          <Navigation className="h-5 w-5" />
          Carte en temps réel des stations
          {isLoading && <span className="text-sm text-gray-500">(Chargement...)</span>}
        </CardTitle>
        <CardDescription>
          Visualisez l'affluence actuelle dans les {stations.length} stations de transport en commun surveillées
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

        {/* Légende */}
        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Affluence faible</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>Affluence modérée</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Affluence élevée</span>
          </div>
        </div>

        {/* Statistiques des stations */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <MapPin className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-green-600">
              {stations.filter((s) => s.crowdLevel === "faible").length}
            </div>
            <div className="text-sm text-gray-600">Stations fluides</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <MapPin className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-yellow-600">
              {stations.filter((s) => s.crowdLevel === "moyen").length}
            </div>
            <div className="text-sm text-gray-600">Stations modérées</div>
          </div>
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <MapPin className="h-6 w-6 text-red-600 mx-auto mb-2" />
            <div className="text-lg font-semibold text-red-600">
              {stations.filter((s) => s.crowdLevel === "fort").length}
            </div>
            <div className="text-sm text-gray-600">Stations chargées</div>
          </div>
        </div>

        {/* Note sur la technologie */}
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-xs text-gray-600 text-center">
            🗺️ Carte fournie par OpenStreetMap • Données mises à jour en temps réel
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
