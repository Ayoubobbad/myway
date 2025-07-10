"use client"
import React from 'react'
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Bus, Clock } from "lucide-react"
import { LoginDialog } from "@/components/login-dialog"
import { Header } from "@/components/header"
import { HomeSection } from "@/components/home-section"
import { ScheduleSection } from "@/components/schedule-section"
import { ItinerarySection } from "@/components/itinerary-section"
import { ReportSection } from "@/components/report-section"
import { DashboardSection } from "@/components/dashboard-section"

export default function HomePage() {
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [showLoginDialog, setShowLoginDialog] = useState(false)
  const [activeSection, setActiveSection] = useState("accueil")

  const handleLoginRequired = () => {
    if (!currentUser) {
      setShowLoginDialog(true)
      return false
    }
    return true
  }

  const renderActiveSection = () => {
    switch (activeSection) {
      case "accueil":
        return <HomeSection onSectionChange={setActiveSection} />
      case "horaires":
        return <ScheduleSection />
      case "itineraires":
        return <ItinerarySection />
      case "signalement":
        return <ReportSection user={currentUser} onLoginRequired={handleLoginRequired} />
      case "dashboard":
        return currentUser?.role === "admin" ? <DashboardSection /> : <HomeSection />
      default:
        return <HomeSection />
    }
  }

  const getPageTitle = () => {
    switch (activeSection) {
      case "accueil":
        return null // Pas de titre pour l'accueil, il a son propre hero
      case "horaires":
        return "Horaires en Temps Réel"
      case "itineraires":
        return "Calculateur d'Itinéraires"
      case "signalement":
        return "Signalement d'Affluence"
      case "dashboard":
        return null // Le dashboard a son propre titre
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header
        user={currentUser}
        onLogin={() => setShowLoginDialog(true)}
        onLogout={() => {
          setCurrentUser(null)
          // Rediriger vers l'accueil si on était sur le dashboard
          if (activeSection === "dashboard") {
            setActiveSection("accueil")
          }
        }}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section - Only show on home */}
        {activeSection === "accueil" && (
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">
              La mobilité urbaine, <span className="text-blue-600">intelligente</span> et{" "}
              <span className="text-green-600">personnalisée</span>.
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              {" "}
            </p>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Bus className="h-12 w-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">23</h3>
                  <p className="text-gray-600">Lignes surveillées</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">87%</h3>
                  <p className="text-gray-600">Précision des prédictions</p>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <Clock className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-gray-900">2min</h3>
                  <p className="text-gray-600">Temps de réponse moyen</p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Page Title for other sections */}
        {getPageTitle() && (
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getPageTitle()}</h1>
          </div>
        )}

        {/* Active Section Content */}
        {renderActiveSection()}
      </main>

      <LoginDialog open={showLoginDialog} onOpenChange={setShowLoginDialog} onLogin={setCurrentUser} />
    </div>
  )
}
