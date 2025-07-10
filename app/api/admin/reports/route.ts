import { NextResponse } from "next/server"
import { ReportService } from "@/lib/api"

// GET - Récupérer tous les signalements
export async function GET() {
  try {
    const response = await ReportService.getAllReports()

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || "Erreur lors de la récupération des signalements" },
        { status: 500 },
      )
    }

    // Trier par date (plus récents en premier)
    const sortedReports = [...(response.data || [])].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )

    return NextResponse.json({ success: true, data: sortedReports })
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/reports:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Créer un nouveau signalement (pour tests admin)
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation des données
    if (!body.station || !body.line || !body.crowdLevel) {
      return NextResponse.json(
        { success: false, error: "Station, ligne et niveau d'affluence sont requis" },
        { status: 400 },
      )
    }

    const response = await ReportService.createReport({
      station: body.station,
      line: body.line,
      crowdLevel: body.crowdLevel,
      comment: body.comment || "",
      userId: body.userId || "admin",
    })

    if (!response.success) {
      return NextResponse.json(
        { success: false, error: response.error || "Erreur lors de la création du signalement" },
        { status: 500 },
      )
    }

    return NextResponse.json({ success: true, data: response.data }, { status: 201 })
  } catch (error) {
    console.error("❌ Erreur POST /api/admin/reports:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}
