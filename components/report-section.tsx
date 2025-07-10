"use client"
import React from 'react'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { AlertTriangle, CheckCircle, Clock, MessageSquare, Send, Train, Users } from "lucide-react"
import { StationSearch } from "@/components/station-search"
import { ReportService, type Report } from "@/lib/api"
import { getStationByName, type Station } from "@/lib/transport-data"
import { toast } from "sonner"

export function ReportSection() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null)
  const [stationInput, setStationInput] = useState("")
  const [selectedLine, setSelectedLine] = useState("")
  const [crowdLevel, setCrowdLevel] = useState<"FAIBLE" | "MOYEN" | "FORT" | "">("")
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [recentReports, setRecentReports] = useState<Report[]>([])
  const [isLoadingReports, setIsLoadingReports] = useState(false)

  const handleStationChange = (value: string, station?: Station) => {
    console.log("Station sélectionnée:", { value, station })
    setStationInput(value)
    setSelectedStation(station || null)
    setSelectedLine("") // Reset line selection when station changes

    if (station) {
      loadRecentReports(station.name)
    } else {
      setRecentReports([])
    }
  }

  const loadRecentReports = async (stationName: string) => {
    setIsLoadingReports(true)
    try {
      console.log("📊 Chargement des signalements récents pour:", stationName)

      // Essayer d'abord de trouver la station par nom dans les données locales
      const localStation = getStationByName(stationName)
      if (localStation) {
        // Simuler des signalements récents pour cette station
        const mockReports: Report[] = [
          {
            id: 1,
            crowdLevel: "MOYEN",
            status: "APPROVED",
            comment: `Affluence normale à ${stationName}`,
            createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            userName: "Voyageur1",
            stationName: stationName,
            lineName: localStation.lines[0],
          },
          {
            id: 2,
            crowdLevel: "FAIBLE",
            status: "APPROVED",
            comment: `Peu de monde à ${stationName} en ce moment`,
            createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
            userName: "Voyageur2",
            stationName: stationName,
            lineName: localStation.lines[0],
          },
        ]
        setRecentReports(mockReports)
        console.log(`✅ ${mockReports.length} signalements simulés chargés`)
      } else {
        // Essayer l'API backend
        const response = await ReportService.getReportsByStation(1) // ID par défaut
        if (response.success && response.data) {
          const approvedReports = response.data
            .filter((report) => report.status === "APPROVED")
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)

          setRecentReports(approvedReports)
          console.log(`✅ ${approvedReports.length} signalements récents chargés`)
        }
      }
    } catch (error) {
      console.error("❌ Erreur lors du chargement des signalements:", error)
      setRecentReports([])
    } finally {
      setIsLoadingReports(false)
    }
  }

  const handleSubmit = async () => {
    if (!selectedStation || !selectedLine || !crowdLevel) {
      toast.error("Veuillez remplir tous les champs obligatoires")
      return
    }

    setIsSubmitting(true)

    try {
      console.log("📝 Envoi du signalement:", {
        station: selectedStation.name,
        line: selectedLine,
        crowdLevel,
        comment,
      })

      // Créer un signalement local d'abord
      const newReport: Report = {
        id: Date.now(),
        crowdLevel,
        status: "APPROVED",
        comment: comment.trim() || undefined,
        createdAt: new Date().toISOString(),
        userName: "Vous",
        stationName: selectedStation.name,
        lineName: selectedLine,
      }

      // Essayer l'API backend
      try {
        const response = await ReportService.createReport({
          stationId: 1, // ID par défaut pour le moment
          crowdLevel,
          comment: comment.trim() || undefined,
        })

        if (response.success) {
          toast.success("Signalement envoyé avec succès !")
          console.log("✅ Signalement créé via API:", response.data)
        } else {
          throw new Error(response.error)
        }
      } catch (apiError) {
        // Fallback local
        console.warn("API non disponible, signalement local:", apiError)
        toast.success("Signalement enregistré localement !")
      }

      // Reset form
      setCrowdLevel("")
      setComment("")
      setSelectedLine("")

      // Ajouter le nouveau signalement à la liste
      setRecentReports((prev) => [newReport, ...prev.slice(0, 4)])
    } catch (error) {
      console.error("❌ Erreur lors de l'envoi:", error)
      toast.error("Erreur lors de l'envoi du signalement")
    } finally {
      setIsSubmitting(false)
    }
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

  return (
    <div className="space-y-6">
      {/* Formulaire de signalement */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Signaler l'affluence
          </CardTitle>
          <CardDescription>
            Aidez la communauté en signalant l'affluence actuelle dans les transports en commun
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sélection de la station */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Station *</Label>
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
                <div className="flex items-center gap-2 text-sm text-blue-700 mb-2">
                  <span className="capitalize">{selectedStation.type}</span>
                  <span>•</span>
                  <span>
                    {selectedStation.lines.length} ligne{selectedStation.lines.length > 1 ? "s" : ""} disponible
                    {selectedStation.lines.length > 1 ? "s" : ""}
                  </span>
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

          {/* Sélection de la ligne */}
          {selectedStation && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Ligne de transport *</Label>
              <Select value={selectedLine} onValueChange={setSelectedLine}>
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

          {/* Niveau d'affluence */}
          {selectedLine && (
            <div className="space-y-3">
              <Label className="text-sm font-medium">Niveau d'affluence actuel *</Label>
              <RadioGroup value={crowdLevel} onValueChange={(value) => setCrowdLevel(value as any)}>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-green-50 transition-colors">
                    <RadioGroupItem value="FAIBLE" id="faible" />
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-4 h-4 rounded-full bg-green-500"></div>
                      <Label htmlFor="faible" className="flex-1 cursor-pointer">
                        <div className="font-medium">Affluence faible</div>
                        <div className="text-sm text-gray-600">Beaucoup de places assises disponibles</div>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-yellow-50 transition-colors">
                    <RadioGroupItem value="MOYEN" id="moyen" />
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
                      <Label htmlFor="moyen" className="flex-1 cursor-pointer">
                        <div className="font-medium">Affluence modérée</div>
                        <div className="text-sm text-gray-600">Quelques places debout, confortable</div>
                      </Label>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-red-50 transition-colors">
                    <RadioGroupItem value="FORT" id="fort" />
                    <div className="flex items-center gap-2 flex-1">
                      <div className="w-4 h-4 rounded-full bg-red-500"></div>
                      <Label htmlFor="fort" className="flex-1 cursor-pointer">
                        <div className="font-medium">Affluence élevée</div>
                        <div className="text-sm text-gray-600">Transport bondé, difficile de monter</div>
                      </Label>
                    </div>
                  </div>
                </div>
              </RadioGroup>
            </div>
          )}

          {/* Commentaire optionnel */}
          {crowdLevel && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Commentaire (optionnel)</Label>
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Ajoutez des détails sur la situation actuelle..."
                className="min-h-[80px]"
                maxLength={200}
              />
              <div className="text-xs text-gray-500 text-right">{comment.length}/200 caractères</div>
            </div>
          )}

          {/* Bouton d'envoi */}
          {crowdLevel && (
            <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <>
                  <Clock className="h-4 w-4 mr-2 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Envoyer le signalement
                </>
              )}
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Signalements récents */}
      {selectedStation && (
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Signalements récents - {selectedStation.name}
            </CardTitle>
            <CardDescription>Derniers signalements de la communauté pour cette station</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingReports ? (
              <div className="flex items-center justify-center py-8">
                <Clock className="h-6 w-6 animate-spin text-gray-400 mr-2" />
                <span className="text-gray-600">Chargement des signalements...</span>
              </div>
            ) : recentReports.length > 0 ? (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div key={report.id} className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{report.lineName || "Station"}</span>
                        <div className={`w-3 h-3 rounded-full ${getCrowdLevelColor(report.crowdLevel)}`}></div>
                        <span className="text-sm text-gray-600">
                          Affluence {getCrowdLevelText(report.crowdLevel).toLowerCase()}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">{formatTimeAgo(report.createdAt)}</span>
                    </div>

                    {report.comment && (
                      <p className="text-sm text-gray-700 italic bg-white p-2 rounded border-l-2 border-blue-400">
                        "{report.comment}"
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>Aucun signalement récent pour cette station</p>
                <p className="text-sm">Soyez le premier à signaler l'affluence !</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Informations - Affichée seulement quand aucune station n'est sélectionnée */}
      {!selectedStation && (
        <Card className="bg-blue-50/80 backdrop-blur-sm border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-blue-900 mb-1">Contribuez à la communauté</h4>
                <p className="text-sm text-blue-700">
                  Vos signalements aident les autres voyageurs à mieux planifier leurs trajets. Les données sont
                  anonymisées et utilisées pour améliorer l'information en temps réel.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
