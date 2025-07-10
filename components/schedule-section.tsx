"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Train, MessageSquare, RefreshCw, AlertCircle } from "lucide-react"
import { StationSearch } from "@/components/station-search"
import type { Report } from "@/lib/api"
import { stations, getLineById, type Station } from "@/lib/transport-data"

interface Schedule {
  time: string
  destination: string
  crowdLevel: "FAIBLE" | "MOYEN" | "FORT"
  delay?: number
  platform?: string
}

export function ScheduleSection() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [stationInput, setStationInput] = useState("")
  const [selectedLine, setSelectedLine] = useState("")
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingReports, setIsLoadingReports] = useState(false)
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null)

  const handleStationChange = (value: string, station?: Station) => {
    console.log("Station sélectionnée pour horaires:", { value, station })
    setStationInput(value)
    setSelectedStation(station || null)
    setSelectedLine("")
    setSchedules([])
    setRecentReports([])
  }

  const handleLineChange = (lineId: string) => {
    console.log("Ligne sélectionnée:", lineId)
    setSelectedLine(lineId)
    setSchedules([])
  }

  const loadSchedules = async () => {
    if (!selectedStation || !selectedLine) {
      console.warn("Station ou ligne manquante pour charger les horaires")
      return
    }

    setIsLoading(true)
    try {
      console.log(`🚊 Génération des horaires pour ${selectedStation.name} - Ligne ${selectedLine}`)

      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Obtenir les informations de la ligne
      const lineInfo = getLineById(selectedLine)
      console.log("Informations de la ligne:", lineInfo)

      // Générer des horaires réalistes
      const now = new Date()
      const generatedSchedules: Schedule[] = []

      for (let i = 0; i < 8; i++) {
        const scheduleTime = new Date(now.getTime() + i * getLineInterval(selectedLine) * 60 * 1000)
        const crowdLevel = getCrowdLevelForTime(scheduleTime, "MOYEN")
        const delay = Math.random() > 0.7 ? Math.floor(Math.random() * 5) + 1 : 0

        generatedSchedules.push({
          time: scheduleTime.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" }),
          destination: getDestinationForLine(selectedLine, selectedStation.name),
          crowdLevel,
          delay: delay > 0 ? delay : undefined,
          platform: selectedLine.startsWith("T") ? `Voie ${Math.floor(Math.random() * 2) + 1}` : undefined,
        })
      }

      setSchedules(generatedSchedules)
      setLastUpdate(new Date())
      console.log(`✅ ${generatedSchedules.length} horaires générés`)
    } catch (error) {
      console.error("❌ Erreur lors du chargement des horaires:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadRecentReports = async () => {
    if (!selectedStation) return

    setIsLoadingReports(true)
    try {
      console.log(`💬 Chargement des commentaires récents pour ${selectedStation.name}`)

      // Simuler des commentaires récents
      const mockReports: Report[] = [
        {
          id: 1,
          crowdLevel: "MOYEN",
          status: "APPROVED",
          comment: `Horaires respectés à ${selectedStation.name}`,
          createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
          userName: "Voyageur1",
          stationName: selectedStation.name,
          lineName: selectedStation.lines[0],
        },
        {
          id: 2,
          crowdLevel: "FAIBLE",
          status: "APPROVED",
          comment: `Service ponctuel, peu d'attente`,
          createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
          userName: "Voyageur2",
          stationName: selectedStation.name,
          lineName: selectedStation.lines[0],
        },
      ]

      setRecentReports(mockReports)
      console.log(`✅ ${mockReports.length} commentaires simulés chargés`)
    } catch (error) {
      console.error("❌ Erreur lors du chargement des commentaires:", error)
    } finally {
      setIsLoadingReports(false)
    }
  }

  const getLineInterval = (lineId: string): number => {
    if (lineId.startsWith("T")) return 6 // Tramway toutes les 6 minutes
    return 12 // Bus toutes les 12 minutes
  }

  const getCrowdLevelForTime = (
    time: Date,
    baseCrowdLevel: "FAIBLE" | "MOYEN" | "FORT",
  ): "FAIBLE" | "MOYEN" | "FORT" => {
    const hour = time.getHours()
    const isRushHour = (hour >= 7 && hour <= 9) || (hour >= 17 && hour <= 19)

    if (isRushHour) {
      if (baseCrowdLevel === "FAIBLE") return "MOYEN"
      if (baseCrowdLevel === "MOYEN") return "FORT"
      return "FORT"
    }

    return baseCrowdLevel
  }

  const getDestinationForLine = (lineId: string, currentStation: string): string => {
    const lineInfo = getLineById(lineId)
    if (!lineInfo) return "Terminus"

    // Trouver la direction opposée
    const stationIndex = lineInfo.stations.findIndex((stationId) => {
      const station = stations.find((s) => s.id === stationId)
      return station?.name === currentStation
    })

    if (stationIndex === -1) return "Terminus"

    // Si on est au début, aller vers la fin, sinon vers le début
    const isGoingToEnd = stationIndex < lineInfo.stations.length / 2
    const destinationStationId = isGoingToEnd ? lineInfo.stations[lineInfo.stations.length - 1] : lineInfo.stations[0]

    const destinationStation = stations.find((s) => s.id === destinationStationId)
    return destinationStation?.name || "Terminus"
  }

  const getCrowdLevelColor = (level: "FAIBLE" | "MOYEN" | "FORT"): string => {
    switch (level) {
      case "FAIBLE":
        return "bg-green-500"
      case "MOYEN":
        return "bg-yellow-500"
      case "FORT":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  const getCrowdLevelText = (level: "FAIBLE" | "MOYEN" | "FORT"): string => {
    switch (level) {
      case "FAIBLE":
        return "Faible"
      case "MOYEN":
        return "Modérée"
      case "FORT":
        return "Élevée"
      default:
        return level
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

  // Charger les commentaires quand une station est sélectionnée
  useEffect(() => {
    if (selectedStation) {
      loadRecentReports()
    }
  }, [selectedStation])

  return (
    <div className="space-y-6">
      {/* Sélection de la station et ligne */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Consultation des horaires
          </CardTitle>
          <CardDescription>Sélectionnez une station et une ligne pour voir les horaires en temps réel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Recherche de station */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Station</label>
            <StationSearch
              value={stationInput}
              onChange={handleStationChange}
              placeholder="Rechercher une station..."
              className="w-full"
            />

            {selectedStation && (
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Train className="h-4 w-4 text-blue-600" />
                  <span className="font-medium text-blue-900">{selectedStation.name}</span>
                  <Badge variant="outline" className="text-xs">
                    Zone {selectedStation.zone}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1">
                  {selectedStation.lines.map((lineId) => (
                    <Badge
                      key={lineId}
                      variant="secondary"
                      className={`text-xs ${
                        lineId.startsWith("T") ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {lineId}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sélection de ligne */}
          {selectedStation && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Ligne</label>
              <Select value={selectedLine} onValueChange={handleLineChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Choisissez une ligne" />
                </SelectTrigger>
                <SelectContent>
                  {selectedStation.lines.map((lineId) => (
                    <SelectItem key={lineId} value={lineId}>
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded flex items-center justify-center text-white text-xs font-bold ${
                            lineId.startsWith("T") ? "bg-blue-500" : "bg-green-500"
                          }`}
                        >
                          {lineId}
                        </div>
                        <span>
                          {lineId.startsWith("T") ? "Tramway" : "Bus"} {lineId}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Bouton de consultation */}
          {selectedLine && (
            <Button onClick={loadSchedules} disabled={isLoading} className="w-full" size="lg">
              {isLoading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Chargement des horaires...
                </>
              ) : (
                <>
                  <Clock className="h-4 w-4 mr-2" />
                  Consulter les horaires
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Horaires */}
      {schedules.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Train className="h-5 w-5" />
                Horaires - {selectedStation?.name} • Ligne {selectedLine}
              </CardTitle>
              {lastUpdate && (
                <div className="text-sm text-gray-500">Mis à jour: {lastUpdate.toLocaleTimeString("fr-FR")}</div>
              )}
            </div>
            <CardDescription>Prochains départs avec niveau d'affluence prévu</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedules.map((schedule, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    index === 0 ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="text-lg font-bold text-gray-900">
                        {schedule.time}
                        {schedule.delay && <span className="text-sm text-red-600 ml-2">+{schedule.delay} min</span>}
                      </div>
                      <div className="text-gray-600">→ {schedule.destination}</div>
                      {schedule.platform && (
                        <Badge variant="outline" className="text-xs">
                          {schedule.platform}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${getCrowdLevelColor(schedule.crowdLevel)}`}></div>
                      <span className="text-sm text-gray-600">
                        Affluence {getCrowdLevelText(schedule.crowdLevel).toLowerCase()}
                      </span>
                      {schedule.delay && <AlertCircle className="h-4 w-4 text-red-500" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-center">
              <Button variant="outline" onClick={loadSchedules} disabled={isLoading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Actualiser
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Commentaires récents */}
      {selectedStation && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Commentaires récents - {selectedStation.name}
            </CardTitle>
            <CardDescription>Derniers retours de la communauté pour cette station</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                <span className="text-gray-600">Chargement des commentaires...</span>
              </div>
            ) : recentReports.length > 0 ? (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-3 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-5 h-5 rounded flex items-center justify-center text-white text-xs font-bold ${
                            report.lineName?.startsWith("T") ? "bg-blue-500" : "bg-green-500"
                          }`}
                        >
                          {report.lineName}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getCrowdLevelColor(report.crowdLevel)}`}></div>
                        <span className="text-sm text-gray-600">
                          Affluence {getCrowdLevelText(report.crowdLevel).toLowerCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimeAgo(report.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 italic">"{report.comment}"</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <MessageSquare className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Aucun commentaire récent pour cette station</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
