import { NextResponse } from "next/server"
import { AdminService } from "@/lib/admin-api"

// GET - Récupérer les statistiques du dashboard admin
export async function GET() {
  try {
    const stats = await AdminService.getAdminStats()
    return NextResponse.json({ success: true, data: stats })
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/stats:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}
