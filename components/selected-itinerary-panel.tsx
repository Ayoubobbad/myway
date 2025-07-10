"use client"
import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navigation, Clock, MapPin, Users, X } from "lucide-react"

interface SelectedItineraryPanelProps {
  itinerary: any
  onClose: () => void
}

export function SelectedItineraryPanel({ itinerary, onClose }: SelectedItineraryPanelProps) {
  // Supprimer ces lignes
  // const [isNavigating, setIsNavigating] = useState(false)
  // const [currentStep, setCurrentStep] = useState(0)
  // const [timeRemaining, setTimeRemaining] = useState(35 * 60)
  // const [notifications, setNotifications] = useState(true)

  // Simulation du temps qui passe
  // useEffect(() => {
  //   if (!isNavigating) return

  //   const interval = setInterval(() => {
  //     setTimeRemaining((prev) => {
  //       if (prev <= 0) {
  //         setIsNavigating(false)
  //         return 0
  //       }
  //       return prev - 1
  //     })
  //   }, 1000)

  //   return () => clearInterval(interval)
  // }, [isNavigating])

  // const formatTime = (seconds: number) => {
  //   const mins = Math.floor(seconds / 60)
  //   const secs = seconds % 60
  //   return `${mins}:${secs.toString().padStart(2, "0")}`
  // }

  // const progress = ((35 * 60 - timeRemaining) / (35 * 60)) * 100

  // const handleStartNavigation = () => {
  //   setIsNavigating(true)
  //   // Demander la permission pour les notifications
  //   if ("Notification" in window && Notification.permission === "default") {
  //     Notification.requestPermission()
  //   }
  // }

  // const handleNextStep = () => {
  //   if (currentStep < itinerary.steps.length - 1) {
  //     setCurrentStep(currentStep + 1)

  //     // Notification pour la prochaine étape
  //     if (notifications && "Notification" in window && Notification.permission === "granted") {
  //       new Notification("TransportApp - Prochaine étape", {
  //         body: itinerary.steps[currentStep + 1].description,
  //         icon: "/favicon.ico",
  //       })
  //     }
  //   }
  // }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Navigation className="h-5 w-5 text-blue-600" />
              Itinéraire sélectionné
              {/* {isNavigating && (
                <Badge variant="default" className="bg-green-600">
                  <Play className="h-3 w-3 mr-1" />
                  En cours
                </Badge>
              )} */}
            </CardTitle>
            <CardDescription>
              De <strong>{itinerary.departure}</strong> vers <strong>{itinerary.destination}</strong>
            </CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Informations principales seulement */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-white rounded-lg">
            <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
            <div className="font-semibold text-blue-600">{itinerary.duration}</div>
            <div className="text-xs text-gray-600">Durée totale</div>
          </div>

          <div className="text-center p-3 bg-white rounded-lg">
            <MapPin className="h-5 w-5 text-green-600 mx-auto mb-1" />
            <div className="font-semibold text-green-600">{itinerary.distance}</div>
            <div className="text-xs text-gray-600">Distance</div>
          </div>

          <div className="text-center p-3 bg-white rounded-lg">
            <Users className="h-5 w-5 text-orange-600 mx-auto mb-1" />
            <div className="font-semibold text-orange-600 capitalize">{itinerary.crowdLevel}</div>
            <div className="text-xs text-gray-600">Affluence</div>
          </div>

          <div className="text-center p-3 bg-white rounded-lg">
            <div className="font-semibold text-purple-600">{itinerary.price}</div>
            <div className="text-xs text-gray-600">Prix total</div>
          </div>
        </div>

        {/* Affichage simple des étapes */}
        <div className="space-y-3">
          <h4 className="font-semibold">Détails de l'itinéraire :</h4>
          {itinerary.steps.map((step, index) => (
            <div key={index} className="bg-white p-3 rounded-lg border-l-4 border-blue-500">
              <p className="font-medium">{step.description}</p>
              <p className="text-sm text-gray-600">{step.duration}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
