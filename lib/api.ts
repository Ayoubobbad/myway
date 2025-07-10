// Service de communication avec le backend Spring Boot
export interface Report {
  id: number
  crowdLevel: "FAIBLE" | "MOYEN" | "FORT"
  status: "PENDING" | "APPROVED" | "REJECTED"
  comment?: string
  createdAt: string
  moderatedAt?: string
  userName: string
  stationName?: string
  lineName?: string
  moderatedByName?: string
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

export interface StationStats {
  stationId: number
  stationName: string
  coordinates: [number, number]
  currentCrowdLevel: "FAIBLE" | "MOYEN" | "FORT"
  confidence: number
  recentReportsCount: number
  lastReportTime?: string
  lines: string[]
}

export interface GlobalStats {
  totalReports: number
  totalStations: number
  totalUsers: number
  newUsersToday: number
  newReportsToday: number
  activeUsersThisWeek: number
  pendingReports: number
}

export interface Station {
  id: number
  name: string
  latitude: number
  longitude: number
  type: "BUS" | "TRAMWAY" | "MIXED"
  address?: string
  city: string
  isActive: boolean
  createdAt: string
  lineNames: string[]
  currentCrowdLevel: "FAIBLE" | "MOYEN" | "FORT"
  recentReportsCount: number
}

export interface CrowdLevelResponse {
  stationId: number
  stationName: string
  currentLevel: "FAIBLE" | "MOYEN" | "FORT"
  predictedLevel: "FAIBLE" | "MOYEN" | "FORT"
  confidence: number
  lastUpdated?: string
  reportsCount: number
}

class ReportServiceClass {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
  private token: string | null = null
  private isBackendAvailable = true

  constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
  }

  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
    }

    if (this.token) {
      headers["Authorization"] = `Bearer ${this.token}`
    }

    return headers
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    try {
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: "Erreur réseau" }))
        return {
          success: false,
          error: errorData.message || `Erreur HTTP ${response.status}`,
        }
      }

      const data = await response.json()
      return {
        success: true,
        data,
      }
    } catch (error) {
      console.error("Erreur lors du traitement de la réponse:", error)
      return {
        success: false,
        error: "Erreur lors du traitement de la réponse",
      }
    }
  }

  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(url, {
        ...options,
        headers: { ...this.getHeaders(), ...options.headers },
      })
      this.isBackendAvailable = true
      return this.handleResponse<T>(response)
    } catch (error) {
      console.warn("Backend non disponible, utilisation des données locales:", error)
      this.isBackendAvailable = false
      throw error
    }
  }

  // Fallback vers les données locales
  private getFallbackGlobalStats(): GlobalStats {
    const reports = this.getFallbackReports()
    const stations = this.getFallbackStations()

    return {
      totalReports: reports.length,
      totalStations: stations.length,
      totalUsers: 150, // Simulé
      newUsersToday: 12, // Simulé
      newReportsToday: reports.filter((r) => {
        const today = new Date().toDateString()
        return new Date(r.createdAt).toDateString() === today
      }).length,
      activeUsersThisWeek: 89, // Simulé
      pendingReports: reports.filter((r) => r.status === "PENDING").length,
    }
  }

  private getFallbackReports(): Report[] {
    const fallbackReports: Report[] = [
      {
        id: 1,
        crowdLevel: "MOYEN",
        status: "APPROVED",
        comment: "Beaucoup de monde mais ça va, quelques places debout disponibles",
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        userName: "user1",
        stationName: "Casa Port",
        lineName: "T1",
      },
      {
        id: 2,
        crowdLevel: "FORT",
        status: "APPROVED",
        comment: "Très bondé, difficile de monter. Retard de 5 minutes",
        createdAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        userName: "user2",
        stationName: "Casa Port",
        lineName: "T1",
      },
      {
        id: 3,
        crowdLevel: "FAIBLE",
        status: "APPROVED",
        comment: "Peu de monde, voyage confortable",
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        userName: "user3",
        stationName: "Place Mohammed V",
        lineName: "T1",
      },
      {
        id: 4,
        crowdLevel: "MOYEN",
        status: "APPROVED",
        comment: "Affluence normale pour cette heure",
        createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        userName: "user4",
        stationName: "Place Mohammed V",
        lineName: "T2",
      },
      {
        id: 5,
        crowdLevel: "FORT",
        status: "APPROVED",
        comment: "Heure de pointe, beaucoup de monde. Tramway bondé",
        createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        userName: "user5",
        stationName: "Maarif",
        lineName: "T1",
      },
    ]
    return fallbackReports
  }

  private getFallbackStations(): Station[] {
    return [
      {
        id: 1,
        name: "Casa Port",
        latitude: 33.5731,
        longitude: -7.6298,
        type: "TRAMWAY",
        address: "Boulevard Hassan II, Casablanca",
        city: "Casablanca",
        isActive: true,
        createdAt: new Date().toISOString(),
        lineNames: ["T1"],
        currentCrowdLevel: "MOYEN",
        recentReportsCount: 3,
      },
      {
        id: 2,
        name: "Place Mohammed V",
        latitude: 33.5731,
        longitude: -7.5898,
        type: "MIXED",
        address: "Place Mohammed V, Casablanca",
        city: "Casablanca",
        isActive: true,
        createdAt: new Date().toISOString(),
        lineNames: ["T1", "T2"],
        currentCrowdLevel: "FAIBLE",
        recentReportsCount: 2,
      },
      {
        id: 3,
        name: "Maarif",
        latitude: 33.5589,
        longitude: -7.6298,
        type: "MIXED",
        address: "Quartier Maarif, Casablanca",
        city: "Casablanca",
        isActive: true,
        createdAt: new Date().toISOString(),
        lineNames: ["T1", "T2"],
        currentCrowdLevel: "FORT",
        recentReportsCount: 1,
      },
    ]
  }

  // Authentification
  async login(email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      const result = await this.makeRequest<{ token: string; user: any }>(`${this.baseUrl}/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
      })

      if (result.success && result.data) {
        this.token = result.data.token
        localStorage.setItem("auth_token", this.token)
        localStorage.setItem("user", JSON.stringify(result.data.user))
      }

      return result
    } catch (error) {
      // Fallback pour le développement
      console.warn("Mode développement - connexion simulée")
      const mockUser = { id: 1, name: "Utilisateur Test", email, role: "USER" }
      const mockToken = "mock-jwt-token"

      this.token = mockToken
      localStorage.setItem("auth_token", mockToken)
      localStorage.setItem("user", JSON.stringify(mockUser))

      return {
        success: true,
        data: { token: mockToken, user: mockUser },
      }
    }
  }

  async register(name: string, email: string, password: string): Promise<ApiResponse<{ token: string; user: any }>> {
    try {
      const result = await this.makeRequest<{ token: string; user: any }>(`${this.baseUrl}/auth/register`, {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      })

      if (result.success && result.data) {
        this.token = result.data.token
        localStorage.setItem("auth_token", this.token)
        localStorage.setItem("user", JSON.stringify(result.data.user))
      }

      return result
    } catch (error) {
      // Fallback pour le développement
      console.warn("Mode développement - inscription simulée")
      const mockUser = { id: 1, name, email, role: "USER" }
      const mockToken = "mock-jwt-token"

      this.token = mockToken
      localStorage.setItem("auth_token", mockToken)
      localStorage.setItem("user", JSON.stringify(mockUser))

      return {
        success: true,
        data: { token: mockToken, user: mockUser },
      }
    }
  }

  logout(): void {
    this.token = null
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
  }

  // Stations
  async getAllStations(): Promise<ApiResponse<Station[]>> {
    try {
      return await this.makeRequest<Station[]>(`${this.baseUrl}/stations`)
    } catch (error) {
      console.warn("Utilisation des données locales pour les stations")
      return { success: true, data: this.getFallbackStations() }
    }
  }

  async searchStations(name: string): Promise<ApiResponse<Station[]>> {
    try {
      return await this.makeRequest<Station[]>(`${this.baseUrl}/stations/search?name=${encodeURIComponent(name)}`)
    } catch (error) {
      console.warn("Recherche locale des stations")
      const stations = this.getFallbackStations()
      const filtered = stations.filter((station) => station.name.toLowerCase().includes(name.toLowerCase()))
      return { success: true, data: filtered }
    }
  }

  async getStationCrowdLevel(stationId: number): Promise<ApiResponse<CrowdLevelResponse>> {
    try {
      return await this.makeRequest<CrowdLevelResponse>(`${this.baseUrl}/stations/${stationId}/crowd-level`)
    } catch (error) {
      console.warn("Données d'affluence locales")
      const station = this.getFallbackStations().find((s) => s.id === stationId)
      if (station) {
        return {
          success: true,
          data: {
            stationId: station.id,
            stationName: station.name,
            currentLevel: station.currentCrowdLevel,
            predictedLevel: station.currentCrowdLevel,
            confidence: 75,
            lastUpdated: new Date().toISOString(),
            reportsCount: station.recentReportsCount,
          },
        }
      }
      return { success: false, error: "Station non trouvée" }
    }
  }

  // Signalements
  async createReport(reportData: {
    stationId?: number
    lineId?: number
    crowdLevel: "FAIBLE" | "MOYEN" | "FORT"
    comment?: string
  }): Promise<ApiResponse<Report>> {
    try {
      return await this.makeRequest<Report>(`${this.baseUrl}/reports`, {
        method: "POST",
        body: JSON.stringify(reportData),
      })
    } catch (error) {
      console.warn("Création de signalement en mode local")
      const newReport: Report = {
        id: Date.now(),
        crowdLevel: reportData.crowdLevel,
        status: "APPROVED",
        comment: reportData.comment,
        createdAt: new Date().toISOString(),
        userName: "Utilisateur Local",
        stationName: "Station Test",
        lineName: "Ligne Test",
      }
      return { success: true, data: newReport }
    }
  }

  async getReportsByStation(stationId: number): Promise<ApiResponse<Report[]>> {
    try {
      return await this.makeRequest<Report[]>(`${this.baseUrl}/reports/station/${stationId}`)
    } catch (error) {
      console.warn("Signalements locaux par station")
      const reports = this.getFallbackReports().filter((r) => r.stationName?.includes("Casa Port"))
      return { success: true, data: reports }
    }
  }

  async getReportsByLine(lineId: number): Promise<ApiResponse<Report[]>> {
    try {
      return await this.makeRequest<Report[]>(`${this.baseUrl}/reports/line/${lineId}`)
    } catch (error) {
      console.warn("Signalements locaux par ligne")
      const reports = this.getFallbackReports().filter((r) => r.lineName === "T1")
      return { success: true, data: reports }
    }
  }

  async getUserReports(): Promise<ApiResponse<Report[]>> {
    try {
      return await this.makeRequest<Report[]>(`${this.baseUrl}/reports/my-reports`)
    } catch (error) {
      console.warn("Signalements utilisateur locaux")
      return { success: true, data: this.getFallbackReports().slice(0, 2) }
    }
  }

  // Statistiques
  async getGlobalStats(): Promise<ApiResponse<GlobalStats>> {
    try {
      return await this.makeRequest<GlobalStats>(`${this.baseUrl}/admin/stats`)
    } catch (error) {
      console.warn("Utilisation des statistiques locales")
      return { success: true, data: this.getFallbackGlobalStats() }
    }
  }

  async getStationsStats(): Promise<ApiResponse<StationStats[]>> {
    try {
      // Essayer d'abord avec le backend
      const stationsResponse = await this.getAllStations()
      if (!stationsResponse.success || !stationsResponse.data) {
        throw new Error("Impossible de récupérer les stations")
      }

      const stationsStats: StationStats[] = []

      for (const station of stationsResponse.data) {
        try {
          const crowdResponse = await this.getStationCrowdLevel(station.id)
          if (crowdResponse.success && crowdResponse.data) {
            stationsStats.push({
              stationId: station.id,
              stationName: station.name,
              coordinates: [station.latitude, station.longitude],
              currentCrowdLevel: crowdResponse.data.currentLevel,
              confidence: crowdResponse.data.confidence,
              recentReportsCount: crowdResponse.data.reportsCount,
              lastReportTime: crowdResponse.data.lastUpdated,
              lines: station.lineNames,
            })
          }
        } catch (error) {
          // Continuer avec les autres stations même si une échoue
          console.warn(`Erreur pour la station ${station.name}:`, error)
        }
      }

      return { success: true, data: stationsStats }
    } catch (error) {
      console.warn("Utilisation des statistiques de stations locales")
      const fallbackStats: StationStats[] = this.getFallbackStations().map((station) => ({
        stationId: station.id,
        stationName: station.name,
        coordinates: [station.latitude, station.longitude],
        currentCrowdLevel: station.currentCrowdLevel,
        confidence: 75,
        recentReportsCount: station.recentReportsCount,
        lastReportTime: new Date(Date.now() - Math.random() * 60 * 60 * 1000).toISOString(),
        lines: station.lineNames,
      }))
      return { success: true, data: fallbackStats }
    }
  }

  // Méthodes de compatibilité avec l'ancien système
  calculateAverageCrowdLevel(reports: Report[]): {
    level: "FAIBLE" | "MOYEN" | "FORT"
    confidence: number
    recentCount: number
  } {
    if (reports.length === 0) {
      return { level: "FAIBLE", confidence: 0, recentCount: 0 }
    }

    const now = new Date()
    const recentReports = reports.filter((report) => {
      const reportTime = new Date(report.createdAt)
      const diffInMinutes = (now.getTime() - reportTime.getTime()) / (1000 * 60)
      return diffInMinutes <= 60
    })

    if (recentReports.length === 0) {
      return { level: "FAIBLE", confidence: 20, recentCount: 0 }
    }

    const levelCounts = recentReports.reduce(
      (acc, report) => {
        acc[report.crowdLevel] = (acc[report.crowdLevel] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const mostFrequentLevel = Object.entries(levelCounts).sort(([, a], [, b]) => b - a)[0][0] as
      | "FAIBLE"
      | "MOYEN"
      | "FORT"

    const confidence = Math.min(95, 30 + recentReports.length * 15)

    return {
      level: mostFrequentLevel,
      confidence,
      recentCount: recentReports.length,
    }
  }

  // Méthodes d'administration
  async getPendingReports(): Promise<ApiResponse<Report[]>> {
    try {
      return await this.makeRequest<Report[]>(`${this.baseUrl}/reports/pending`)
    } catch (error) {
      console.warn("Signalements en attente locaux")
      const pendingReports = this.getFallbackReports().filter((r) => r.status === "PENDING")
      return { success: true, data: pendingReports }
    }
  }

  async moderateReport(reportId: number, status: "APPROVED" | "REJECTED"): Promise<ApiResponse<Report>> {
    try {
      return await this.makeRequest<Report>(`${this.baseUrl}/reports/${reportId}/moderate?status=${status}`, {
        method: "PUT",
      })
    } catch (error) {
      console.warn("Modération locale")
      const report = this.getFallbackReports().find((r) => r.id === reportId)
      if (report) {
        report.status = status
        return { success: true, data: report }
      }
      return { success: false, error: "Signalement non trouvé" }
    }
  }

  // Vérifier si le backend est disponible
  isBackendOnline(): boolean {
    return this.isBackendAvailable
  }
}

export const ReportService = new ReportServiceClass()
