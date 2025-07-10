"use client"
import React from 'react'
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, TrendingUp, Users, Clock, Activity, AlertTriangle, CheckCircle, Zap } from "lucide-react"
import { HomeMap } from "@/components/home-map"
import { ReportService, type GlobalStats, type StationStats } from "@/lib/api"

export function HomeSection({ onSectionChange }: { onSectionChange?: (section: string) => void }) {
  const [globalStats, setGlobalStats] = useState<GlobalStats | null>(null)
  const [stationsStats, setStationsStats] = useState<StationStats[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadDashboardData()
    // Actualiser les données toutes les 2 minutes
    const interval = setInterval(loadDashboardData, 2 * 60 * 1000)
    return () => clearInterval(interval)
  }, [])

  const loadDashboardData = async () => {
    try {
      console.log("🔄 Chargement des données du tableau de bord...")

      // Charger les statistiques globales
      const globalResponse = await ReportService.getGlobalStats()
      if (globalResponse.success && globalResponse.data) {
        setGlobalStats(globalResponse.data)
        console.log("📊 Statistiques globales chargées:", globalResponse.data)
      }

      // Charger les statistiques des stations
      const stationsResponse = await ReportService.getStationsStats()
      if (stationsResponse.success && stationsResponse.data) {
        setStationsStats(stationsResponse.data)
        console.log("🗺️ Statistiques des stations chargées:", stationsResponse.data.length, "stations")
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des données:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const getCrowdLevelColor = (level: "FAIBLE" | "MOYEN" | "FORT"): string => {
    switch (level) {
      case "FAIBLE":
        return "text-green-600 bg-green-100"
      case "MOYEN":
        return "text-yellow-600 bg-yellow-100"
      case "FORT":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getCrowdLevelText = (level: "FAIBLE" | "MOYEN" | "FORT"): string => {
    switch (level) {
      case "FAIBLE":
        return "Fluide"
      case "MOYEN":
        return "Modérée"
      case "FORT":
        return "Chargée"
      default:
        return level
    }
  }

  const formatTimeAgo = (dateString?: string): string => {
    if (!dateString) return "Aucune donnée"

    const now = new Date()
    const reportTime = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - reportTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "à l'instant"
    if (diffInMinutes < 60) return `il y a ${diffInMinutes} min`
    return `il y a ${Math.floor(diffInMinutes / 60)}h`
  }

  // Convertir les données des stations pour la carte
  const mapStations = stationsStats.map((station) => ({
    name: station.stationName,
    coordinates: station.coordinates,
    lines: station.lines,
    crowdLevel: station.currentCrowdLevel,
    confidence: station.confidence,
    lastUpdate: station.lastReportTime,
  }))

  return (
    <div className="space-y-8">
      {/* En-tête avec statistiques globales */}
      <div className="text-center space-y-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-900">MyWay Casablanca</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Votre compagnon intelligent pour naviguer dans les transports en commun de Casablanca
          </p>
        </div>

        {/* Statistiques en temps réel */}
        {globalStats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <Card className="bg-blue-50/80 backdrop-blur-sm border-blue-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-blue-900">{globalStats.totalReports}</div>
                <div className="text-sm text-blue-700">Signalements</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50/80 backdrop-blur-sm border-green-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-green-900">{globalStats.totalStations}</div>
                <div className="text-sm text-green-700">Stations</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50/80 backdrop-blur-sm border-purple-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Activity className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-purple-900">{globalStats.totalUsers}</div>
                <div className="text-sm text-purple-700">Utilisateurs</div>
              </CardContent>
            </Card>

            <Card className="bg-orange-50/80 backdrop-blur-sm border-orange-200">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-orange-900">{globalStats.newReportsToday}</div>
                <div className="text-sm text-orange-700">Aujourd'hui</div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Carte interactive Leaflet */}
      <HomeMap stations={mapStations} />

      {/* Stations les plus actives */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Stations les plus actives
            </CardTitle>
            <CardDescription>Stations avec le plus de signalements récents</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Clock className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                <span className="text-gray-600">Chargement...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {stationsStats
                  .sort((a, b) => b.recentReportsCount - a.recentReportsCount)
                  .slice(0, 5)
                  .map((station, index) => (
                    <div
                      key={station.stationId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="font-medium">{station.stationName}</div>
                          <div className="text-sm text-gray-600">
                            {station.lines.join(", ")} • {station.recentReportsCount} signalement
                            {station.recentReportsCount > 1 ? "s" : ""}
                          </div>
                        </div>
                      </div>
                      <Badge className={getCrowdLevelColor(station.currentCrowdLevel)}>
                        {getCrowdLevelText(station.currentCrowdLevel)}
                      </Badge>
                    </div>
                  ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes en cours
            </CardTitle>
            <CardDescription>Situations nécessitant votre attention</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stationsStats
                .filter((station) => station.currentCrowdLevel === "FORT" && station.confidence > 60)
                .slice(0, 3)
                .map((station) => (
                  <div
                    key={station.stationId}
                    className="flex items-start gap-3 p-3 bg-red-50 rounded-lg border border-red-200"
                  >
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="font-medium text-red-900">{station.stationName}</div>
                      <div className="text-sm text-red-700">
                        Affluence élevée signalée • Confiance: {Math.round(station.confidence)}%
                      </div>
                      <div className="text-xs text-red-600 mt-1">
                        Dernière mise à jour: {formatTimeAgo(station.lastReportTime)}
                      </div>
                    </div>
                  </div>
                ))}

              {stationsStats.filter((station) => station.currentCrowdLevel === "FORT" && station.confidence > 60)
                .length === 0 && (
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium text-green-900">Tout va bien !</div>
                    <div className="text-sm text-green-700">Aucune alerte d'affluence majeure en cours</div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Actions rapides */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <h3 className="text-xl font-semibold text-gray-900">Contribuez à la communauté</h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Aidez les autres voyageurs en partageant des informations en temps réel sur l'affluence des transports
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                size="lg"
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => onSectionChange?.("signalement")}
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Signaler l'affluence
              </Button>
              <Button size="lg" variant="outline" onClick={() => onSectionChange?.("horaires")}>
                <Clock className="h-4 w-4 mr-2" />
                Consulter les horaires
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
