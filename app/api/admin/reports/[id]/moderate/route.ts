import { NextResponse } from "next/server"
import { ReportService } from "@/lib/api"

// POST - Modérer un signalement (approuver/rejeter)
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const reportId = params.id
    const { action } = await request.json()

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { success: false, error: "Action invalide. Utilisez 'approve' ou 'reject'" },
        { status: 400 },
      )
    }

    // Récupérer tous les signalements
    const reportsResponse = await ReportService.getAllReports()

    if (!reportsResponse.success || !reportsResponse.data) {
      return NextResponse.json(
        { success: false, error: "Erreur lors de la récupération des signalements" },
        { status: 500 },
      )
    }

    // Trouver le signalement à modérer
    const reports = reportsResponse.data
    const reportIndex = reports.findIndex((r) => r.id === reportId)

    if (reportIndex === -1) {
      return NextResponse.json({ success: false, error: "Signalement non trouvé" }, { status: 404 })
    }

    // Mettre à jour le statut du signalement
    reports[reportIndex].status = action === "approve" ? "approved" : "rejected"

    // Sauvegarder les signalements mis à jour (en utilisant une méthode privée)
    // Note: Comme saveReports est privé, nous devons utiliser une approche différente
    // Nous allons stocker directement dans localStorage
    localStorage.setItem("myway_reports", JSON.stringify(reports))

    console.log(`✅ Signalement ${reportId} ${action === "approve" ? "approuvé" : "rejeté"}`)

    return NextResponse.json({
      success: true,
      data: reports[reportIndex],
    })
  } catch (error) {
    console.error(`❌ Erreur POST /api/admin/reports/${params.id}/moderate:`, error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}
