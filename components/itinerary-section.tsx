"use client"
import React from 'react'
import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Navigation, Clock, Users, Info } from "lucide-react"
import { SelectedItineraryPanel } from "@/components/selected-itinerary-panel"
import { LeafletMap } from "@/components/leaflet-map"
import { StationSearch } from "@/components/station-search"
import { getCommonLines, type Station } from "@/lib/transport-data"

export function ItinerarySection() {
  const [departure, setDeparture] = useState("")
  const [destination, setDestination] = useState("")
  const [departureStation, setDepartureStation] = useState<Station | null>(null)
  const [destinationStation, setDestinationStation] = useState<Station | null>(null)
  const [showMap, setShowMap] = useState(false)
  const [calculatedRoute, setCalculatedRoute] = useState<any>(null)
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null)

  const mapRef = useRef<HTMLDivElement>(null)

  const itineraries = [
    {
      id: 1,
      duration: "35 min",
      transfers: 1,
      crowdLevel: "faible",
      crowdColor: "bg-green-500",
      distance: "12.5 km",
      price: "8 MAD",
      steps: [
        {
          type: "walk",
          duration: "5 min",
          description: "Marche jusqu'\u00e0 la station",
          distance: "400m",
          instructions: "Dirigez-vous vers la station",
        },
        {
          type: "tramway",
          line: "T1",
          duration: "20 min",
          description: "Tramway Ligne 1",
          crowdLevel: "faible",
          departure_time: "14:25",
          arrival_time: "14:45",
          stations: ["D\u00e9part", "Place Mohammed V", "Maarif", "Destination"],
        },
        {
          type: "bus",
          line: "B10",
          duration: "10 min",
          description: "Bus Ligne 10",
          crowdLevel: "moyen",
          departure_time: "14:50",
          arrival_time: "15:00",
          stations: ["Correspondance", "Destination"],
        },
      ],
    },
    {
      id: 2,
      duration: "28 min",
      transfers: 0,
      crowdLevel: "moyen",
      crowdColor: "bg-yellow-500",
      distance: "8.2 km",
      price: "6 MAD",
      steps: [
        {
          type: "walk",
          duration: "3 min",
          description: "Marche jusqu'\u00e0 la station",
          distance: "200m",
          instructions: "Dirigez-vous vers la station",
        },
        {
          type: "tramway",
          line: "T1",
          duration: "25 min",
          description: "Tramway Ligne 1 direct",
          crowdLevel: "moyen",
          departure_time: "14:30",
          arrival_time: "14:55",
          stations: ["D\u00e9part", "Casa Port", "Place Mohammed V", "Maarif", "Destination"],
        },
      ],
    },
  ]

  const handleDepartureChange = (value: string, station?: Station) => {
    setDeparture(value)
    setDepartureStation(station || null)
    if (station && destinationStation) {
      const commonLines = getCommonLines(station.id, destinationStation.id)
      if (commonLines.length === 0) {
        setDestination("")
        setDestinationStation(null)
      }
    }
  }

  const handleDestinationChange = (value: string, station?: Station) => {
    setDestination(value)
    setDestinationStation(station || null)
  }

  const handleCalculateRoute = () => {
    if (!departureStation || !destinationStation) {
      alert("Veuillez s\u00e9lectionner une station de d\u00e9part et une station de destination")
      return
    }

    const commonLines = getCommonLines(departureStation.id, destinationStation.id)
    if (commonLines.length === 0) {
      alert("Aucune ligne directe trouv\u00e9e entre ces stations. Veuillez choisir des stations sur la m\u00eame ligne.")
      return
    }

    setCalculatedRoute({
      departure: departureStation.name,
      destination: destinationStation.name,
      departureStation,
      destinationStation,
      commonLines,
      calculatedAt: new Date().toLocaleTimeString(),
    })
    setShowMap(true)
  }

  const handleSelectItinerary = (itinerary: any) => {
    setSelectedItinerary({
      ...itinerary,
      departure: departureStation?.name || departure,
      destination: destinationStation?.name || destination,
      departureStation,
      destinationStation,
      selectedAt: new Date().toLocaleTimeString(),
    })
    setTimeout(() => {
      if (mapRef.current) {
        mapRef.current.scrollIntoView({ behavior: "smooth" })
      }
    }, 100)
  }

  const getConnectionInfo = () => {
    if (!departureStation || !destinationStation) return null
    const commonLines = getCommonLines(departureStation.id, destinationStation.id)
    return (
      <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-blue-800 mb-2">Connexions disponibles</h4>
            {commonLines.length > 0 ? (
              <div className="space-y-2">
                {commonLines.map((line) => (
                  <div key={line.id} className="flex items-center gap-2">
                    <div className={`w-4 h-4 rounded text-white text-xs flex items-center justify-center font-bold ${
                      line.type === "tramway" ? "bg-blue-500" : "bg-green-500"
                    }`}>
                      {line.type === "tramway" ? "T" : "B"}
                    </div>
                    <span className="text-sm font-medium">{line.name}</span>
                    <Badge variant="outline" className="text-xs">Ligne directe</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-orange-600">⚠️ Aucune ligne directe. Correspondance nécessaire.</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Navigation className="h-5 w-5" />
            Calculateur d'itinéraires
          </CardTitle>
          <CardDescription>
            Sélectionnez vos stations de départ et d'arrivée sur le réseau de transport de Casablanca
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                Station de départ
              </label>
              <StationSearch placeholder="Rechercher une station de départ..." value={departure} onChange={handleDepartureChange} />
              {departureStation && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>Zone {departureStation.zone}</span>
                  <span>•</span>
                  <span className="capitalize">{departureStation.type}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                Station de destination
              </label>
              <StationSearch
                placeholder={departureStation ? "Destinations sur les mêmes lignes..." : "Sélectionnez d'abord un départ"}
                value={destination}
                onChange={handleDestinationChange}
                departureStationId={departureStation?.id}
                isDestination={true}
              />
              {destinationStation && (
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <MapPin className="h-3 w-3" />
                  <span>Zone {destinationStation.zone}</span>
                  <span>•</span>
                  <span className="capitalize">{destinationStation.type}</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium invisible">Action</label>
              <Button onClick={handleCalculateRoute} className="w-full h-10" disabled={!departureStation || !destinationStation}>
                <MapPin className="h-4 w-4 mr-2" />
                Calculer l'itinéraire
              </Button>
            </div>
          </div>

          {getConnectionInfo()}
        </CardContent>
      </Card>

      {selectedItinerary && (
        <SelectedItineraryPanel itinerary={selectedItinerary} onClose={() => setSelectedItinerary(null)} />
      )}

      {showMap && calculatedRoute && (
        <div ref={mapRef}>
          <LeafletMap
            departure={calculatedRoute.departure}
            destination={calculatedRoute.destination}
            onRouteCalculated={(route) => console.log("Route calculée:", route)}
            selectedItinerary={selectedItinerary}
          />
        </div>
      )}

      {showMap && calculatedRoute && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Itinéraires suggérés</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                {calculatedRoute.commonLines.map((line: any) => (
                  <Badge key={line.id} variant="outline" className="text-xs">
                    {line.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {itineraries.map((itinerary) => (
            <Card
              key={itinerary.id}
              className={`bg-white/80 backdrop-blur-sm transition-all duration-200 ${
                selectedItinerary?.id === itinerary.id ? "ring-2 ring-blue-500 bg-blue-50/80" : "hover:shadow-lg"
              }`}
            >
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{itinerary.duration}</div>
                      <div className="text-sm text-gray-600">Durée totale</div>
                    </div>

                    <div className="text-center">
                      <div className="text-2xl font-bold">{itinerary.transfers}</div>
                      <div className="text-sm text-gray-600">Correspondance{itinerary.transfers > 1 ? "s" : ""}</div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-700">{itinerary.distance}</div>
                      <div className="text-sm text-gray-600">Distance</div>
                    </div>

                    <div className="text-center">
                      <div className="text-lg font-semibold text-green-600">{itinerary.price}</div>
                      <div className="text-sm text-gray-600">Prix</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <div className={`w-3 h-3 rounded-full ${itinerary.crowdColor}`}></div>
                      <span className="text-sm capitalize">{itinerary.crowdLevel}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleSelectItinerary(itinerary)}
                      className={`transition-all duration-200 ${
                        selectedItinerary?.id === itinerary.id
                          ? "bg-green-600 hover:bg-green-700 scale-105"
                          : "hover:scale-105"
                      }`}
                    >
                      {selectedItinerary?.id === itinerary.id
                        ? "✓ Itinéraire sélectionné"
                        : "Sélectionner cet itinéraire"}
                    </Button>
                  </div>
                </div>

                <div className="space-y-3">
                  {itinerary.steps.map((step, stepIndex) => (
                    <div key={stepIndex} className="flex items-center gap-3">
                      <div className="flex-shrink-0">
                        {step.type === "walk" && <MapPin className="h-5 w-5 text-gray-500" />}
                        {step.type === "tramway" && (
                          <div className="w-5 h-5 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            T
                          </div>
                        )}
                        {step.type === "bus" && (
                          <div className="w-5 h-5 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
                            B
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{step.description}</span>
                          {step.line && <Badge variant="outline">{step.line}</Badge>}
                          {step.crowdLevel && (
                            <Badge variant="secondary" className="flex items-center gap-1">
                              <Users className="h-3 w-3" />
                              {step.crowdLevel}
                            </Badge>
                          )}
                          {step.departure_time && (
                            <Badge variant="outline" className="text-blue-600">
                              {step.departure_time}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-gray-600 flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.duration}
                          {step.distance && <span className="ml-2">• {step.distance}</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
