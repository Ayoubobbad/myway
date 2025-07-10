"use client"
import React from 'react'
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart3,
  Users,
  Bus,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Activity,
  Settings,
  Download,
  RefreshCw,
} from "lucide-react"

export function DashboardSection() {
  const [selectedPeriod, setSelectedPeriod] = useState("today")
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 2000)
  }

  const dashboardStats = [
    {
      title: "Utilisateurs actifs",
      value: "2,847",
      change: "+12.5%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Signalements aujourd'hui",
      value: "156",
      change: "+8.2%",
      trend: "up",
      icon: AlertTriangle,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
    },
    {
      title: "Lignes surveillées",
      value: "23",
      change: "0%",
      trend: "stable",
      icon: Bus,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Précision IA",
      value: "87.3%",
      change: "+2.1%",
      trend: "up",
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
  ]

  const recentActivity = [
    {
      id: 1,
      type: "report",
      user: "Jean Dupont",
      action: "Signalement d'affluence forte",
      line: "Ligne 1 - Tramway",
      time: "Il y a 2 min",
      status: "pending",
    },
    {
      id: 2,
      type: "user",
      user: "Marie Martin",
      action: "Nouvel utilisateur inscrit",
      line: "-",
      time: "Il y a 5 min",
      status: "completed",
    },
    {
      id: 3,
      type: "system",
      user: "Système",
      action: "Mise à jour des prédictions",
      line: "Toutes les lignes",
      time: "Il y a 10 min",
      status: "completed",
    },
    {
      id: 4,
      type: "alert",
      user: "Système",
      action: "Retard détecté",
      line: "Bus 20",
      time: "Il y a 15 min",
      status: "resolved",
    },
  ]

  const topLines = [
    {
      line: "Ligne 1 - Tramway",
      reports: 45,
      accuracy: "92%",
      status: "Excellent",
      trend: "up",
    },
    {
      line: "Bus 10",
      reports: 38,
      accuracy: "89%",
      status: "Bon",
      trend: "up",
    },
    {
      line: "Ligne 2 - Tramway",
      reports: 32,
      accuracy: "85%",
      status: "Bon",
      trend: "stable",
    },
    {
      line: "Bus 20",
      reports: 28,
      accuracy: "78%",
      status: "Moyen",
      trend: "down",
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header avec actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble du système de transport</p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Aujourd'hui</SelectItem>
              <SelectItem value="week">Cette semaine</SelectItem>
              <SelectItem value="month">Ce mois</SelectItem>
              <SelectItem value="year">Cette année</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing} className="flex items-center gap-2">
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`} />
            Actualiser
          </Button>

          <Button className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exporter
          </Button>
        </div>
      </div>

      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {dashboardStats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === "up" ? TrendingUp : stat.trend === "down" ? TrendingDown : Activity

          return (
            <Card key={index} className="bg-white/80 backdrop-blur-sm hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-full ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <TrendIcon
                    className={`h-4 w-4 ${
                      stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}
                  />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</p>
                  <p
                    className={`text-sm font-medium ${
                      stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}
                  >
                    {stat.change}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Activité récente */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Activité récente
            </CardTitle>
            <CardDescription>Dernières actions sur la plateforme</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        activity.type === "report"
                          ? "bg-orange-500"
                          : activity.type === "user"
                            ? "bg-blue-500"
                            : activity.type === "system"
                              ? "bg-green-500"
                              : "bg-red-500"
                      }`}
                    ></div>
                    <div>
                      <p className="font-medium text-sm">{activity.action}</p>
                      <p className="text-xs text-gray-600">
                        {activity.user} • {activity.line}
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <Badge
                      variant={
                        activity.status === "completed"
                          ? "default"
                          : activity.status === "pending"
                            ? "secondary"
                            : "outline"
                      }
                      className="text-xs mb-1"
                    >
                      {activity.status === "completed"
                        ? "Terminé"
                        : activity.status === "pending"
                          ? "En attente"
                          : "Résolu"}
                    </Badge>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance des lignes */}
        <Card className="bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Performance des lignes
            </CardTitle>
            <CardDescription>Lignes les plus actives et leur précision</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topLines.map((line, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-blue-600">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium text-sm">{line.line}</p>
                      <p className="text-xs text-gray-600">{line.reports} signalements</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold">{line.accuracy}</span>
                      {line.trend === "up" ? (
                        <TrendingUp className="h-3 w-3 text-green-600" />
                      ) : line.trend === "down" ? (
                        <TrendingDown className="h-3 w-3 text-red-600" />
                      ) : (
                        <Activity className="h-3 w-3 text-gray-600" />
                      )}
                    </div>
                    <Badge
                      variant={
                        line.status === "Excellent" ? "default" : line.status === "Bon" ? "secondary" : "outline"
                      }
                      className="text-xs"
                    >
                      {line.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphique de trafic simulé */}
      <Card className="bg-white/80 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Trafic par heure
          </CardTitle>
          <CardDescription>Affluence moyenne sur le réseau aujourd'hui</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gradient-to-t from-blue-50 to-blue-100 rounded-lg flex items-end justify-center p-4">
            <div className="flex items-end gap-2 w-full max-w-2xl">
              {[20, 35, 45, 60, 80, 95, 85, 70, 55, 40, 30, 25].map((height, index) => (
                <div key={index} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-blue-500 rounded-t transition-all duration-1000 hover:bg-blue-600"
                    style={{ height: `${height}%` }}
                  ></div>
                  <span className="text-xs text-gray-600 mt-2">{6 + index}h</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Settings className="h-12 w-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Gestion du Système</h3>
            <p className="text-blue-700 text-sm mb-4">Configurer les paramètres</p>
            <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-50">
              Configurer
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">Gestion Utilisateurs</h3>
            <p className="text-green-700 text-sm mb-4">Administrer les comptes</p>
            <Button variant="outline" className="border-green-300 text-green-700 hover:bg-green-50">
              Gérer
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer">
          <CardContent className="p-6 text-center">
            <BarChart3 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-purple-800 mb-2">Rapports Avancés</h3>
            <p className="text-purple-700 text-sm mb-4">Analyses détaillées</p>
            <Button variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50">
              Analyser
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
