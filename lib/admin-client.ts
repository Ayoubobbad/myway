// Client pour communiquer avec les API d'administration

interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}

class AdminClientClass {
  // Utilisateurs
  async getUsers(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch("/api/admin/users")
      return await response.json()
    } catch (error) {
      console.error("❌ Erreur client getUsers:", error)
      return { success: false, error: "Erreur lors de la récupération des utilisateurs" }
    }
  }

  async getUser(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/admin/users/${id}`)
      return await response.json()
    } catch (error) {
      console.error(`❌ Erreur client getUser(${id}):`, error)
      return { success: false, error: "Erreur lors de la récupération de l'utilisateur" }
    }
  }

  async createUser(userData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      })
      return await response.json()
    } catch (error) {
      console.error("❌ Erreur client createUser:", error)
      return { success: false, error: "Erreur lors de la création de l'utilisateur" }
    }
  }

  async updateUser(id: string, updates: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      return await response.json()
    } catch (error) {
      console.error(`❌ Erreur client updateUser(${id}):`, error)
      return { success: false, error: "Erreur lors de la mise à jour de l'utilisateur" }
    }
  }

  async deleteUser(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      })
      return await response.json()
    } catch (error) {
      console.error(`❌ Erreur client deleteUser(${id}):`, error)
      return { success: false, error: "Erreur lors de la suppression de l'utilisateur" }
    }
  }

  // Signalements
  async getReports(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch("/api/admin/reports")
      return await response.json()
    } catch (error) {
      console.error("❌ Erreur client getReports:", error)
      return { success: false, error: "Erreur lors de la récupération des signalements" }
    }
  }

  async createReport(reportData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch("/api/admin/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reportData),
      })
      return await response.json()
    } catch (error) {
      console.error("❌ Erreur client createReport:", error)
      return { success: false, error: "Erreur lors de la création du signalement" }
    }
  }

  async moderateReport(id: string, action: "approve" | "reject"): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/admin/reports/${id}/moderate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      })
      return await response.json()
    } catch (error) {
      console.error(`❌ Erreur client moderateReport(${id}, ${action}):`, error)
      return { success: false, error: "Erreur lors de la modération du signalement" }
    }
  }

  // Lignes
  async getLines(): Promise<ApiResponse<any[]>> {
    try {
      const response = await fetch("/api/admin/lines")
      return await response.json()
    } catch (error) {
      console.error("❌ Erreur client getLines:", error)
      return { success: false, error: "Erreur lors de la récupération des lignes" }
    }
  }

  async getLine(id: string): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/admin/lines/${id}`)
      return await response.json()
    } catch (error) {
      console.error(`❌ Erreur client getLine(${id}):`, error)
      return { success: false, error: "Erreur lors de la récupération de la ligne" }
    }
  }

  async createLine(lineData: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch("/api/admin/lines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(lineData),
      })
      return await response.json()
    } catch (error) {
      console.error("❌ Erreur client createLine:", error)
      return { success: false, error: "Erreur lors de la création de la ligne" }
    }
  }

  async updateLine(id: string, updates: any): Promise<ApiResponse<any>> {
    try {
      const response = await fetch(`/api/admin/lines/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      })
      return await response.json()
    } catch (error) {
      console.error(`❌ Erreur client updateLine(${id}):`, error)
      return { success: false, error: "Erreur lors de la mise à jour de la ligne" }
    }
  }

  async deleteLine(id: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`/api/admin/lines/${id}`, {
        method: "DELETE",
      })
      return await response.json()
    } catch (error) {
      console.error(`❌ Erreur client deleteLine(${id}):`, error)
      return { success: false, error: "Erreur lors de la suppression de la ligne" }
    }
  }

  // Statistiques
  async getStats(): Promise<ApiResponse<any>> {
    try {
      const response = await fetch("/api/admin/stats")
      return await response.json()
    } catch (error) {
      console.error("❌ Erreur client getStats:", error)
      return { success: false, error: "Erreur lors de la récupération des statistiques" }
    }
  }
}

export const AdminClient = new AdminClientClass()
