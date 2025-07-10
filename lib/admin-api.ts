export interface User {
  id: number
  name: string
  email: string
  role: "USER" | "ADMIN"
  status: "ACTIVE" | "SUSPENDED" | "PENDING"
  createdAt: string
  reportsCount: number
}

export interface TransportLine {
  id: number
  name: string
  type: "BUS" | "TRAMWAY"
  route: string
  stations: number
  frequency: string
  status: "ACTIVE" | "MAINTENANCE" | "SUSPENDED"
}

export interface AdminStats {
  users: {
    total: number
    newThisWeek: number
  }
  reports: {
    total: number
    todayCount: number
    pending: number
  }
  lines: {
    total: number
    active: number
  }
  activity: {
    topStations: Array<{
      station: string
      count: number
    }>
    crowdLevelDistribution: {
      faible: number
      moyen: number
      fort: number
    }
  }
}

class AdminApiClass {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"
  private token: string | null = null

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

  private async handleResponse<T>(response: Response): Promise<{ success: boolean; data?: T; error?: string }> {
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

  // Statistiques
  async getStats() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/stats`, {
        headers: this.getHeaders(),
      })
      return this.handleResponse<AdminStats>(response)
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error)
      return { success: false, error: "Erreur lors de la récupération des statistiques" }
    }
  }

  // Utilisateurs
  async getUsers() {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users`, {
        headers: this.getHeaders(),
      })
      return this.handleResponse<User[]>(response)
    } catch (error) {
      console.error("Erreur lors de la récupération des utilisateurs:", error)
      return { success: false, error: "Erreur lors de la récupération des utilisateurs" }
    }
  }

  async createUser(userData: { name: string; email: string; role: string }) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users`, {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(userData),
      })
      return this.handleResponse<User>(response)
    } catch (error) {
      console.error("Erreur lors de la création de l'utilisateur:", error)
      return { success: false, error: "Erreur lors de la création de l'utilisateur" }
    }
  }

  async updateUser(id: string, updates: any) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${id}`, {
        method: "PATCH",
        headers: this.getHeaders(),
        body: JSON.stringify(updates),
      })
      return this.handleResponse<User>(response)
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error)
      return { success: false, error: "Erreur lors de la mise à jour de l'utilisateur" }
    }
  }

  async deleteUser(id: string) {
    try {
      const response = await fetch(`${this.baseUrl}/admin/users/${id}`, {
        method: "DELETE",
        headers: this.getHeaders(),
      })
      return this.handleResponse<void>(response)
    } catch (error) {
      console.error("Erreur lors de la suppression de l'utilisateur:", error)
      return { success: false, error: "Erreur lors de la suppression de l'utilisateur" }
    }
  }

  // Signalements
  async getReports() {
    try {
      const response = await fetch(`${this.baseUrl}/reports/pending`, {
        headers: this.getHeaders(),
      })
      return this.handleResponse<any[]>(response)
    } catch (error) {
      console.error("Erreur lors de la récupération des signalements:", error)
      return { success: false, error: "Erreur lors de la récupération des signalements" }
    }
  }

  async moderateReport(id: string, action: "approve" | "reject") {
    try {
      const status = action === "approve" ? "APPROVED" : "REJECTED"
      const response = await fetch(`${this.baseUrl}/reports/${id}/moderate?status=${status}`, {
        method: "PUT",
        headers: this.getHeaders(),
      })
      return this.handleResponse<any>(response)
    } catch (error) {
      console.error("Erreur lors de la modération du signalement:", error)
      return { success: false, error: "Erreur lors de la modération du signalement" }
    }
  }

  // Lignes (placeholder - à implémenter côté backend)
  async getLines() {
    // Pour l'instant, retourner des données simulées
    const mockLines: TransportLine[] = [
      {
        id: 1,
        name: "Tramway T1",
        type: "TRAMWAY",
        route: "Casa Port - Sidi Moumen",
        stations: 31,
        frequency: "6 min",
        status: "ACTIVE",
      },
      {
        id: 2,
        name: "Tramway T2",
        type: "TRAMWAY",
        route: "Sidi Bernoussi - Ain Diab",
        stations: 23,
        frequency: "6 min",
        status: "ACTIVE",
      },
    ]

    return { success: true, data: mockLines }
  }

  async createLine(lineData: { name: string; type: string; stations: number }) {
    // Placeholder - à implémenter
    return { success: true, data: { id: Date.now(), ...lineData } }
  }

  async updateLine(id: string, updates: any) {
    // Placeholder - à implémenter
    return { success: true, data: { id, ...updates } }
  }

  async deleteLine(id: string) {
    // Placeholder - à implémenter
    return { success: true }
  }
}

export const AdminApi = new AdminApiClass()
