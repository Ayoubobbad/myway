import { NextResponse } from "next/server"
import { AdminService } from "@/lib/admin-api"

// GET - Récupérer toutes les lignes
export async function GET() {
  try {
    const lines = AdminService.getLines()
    return NextResponse.json({ success: true, data: lines })
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/lines:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Créer une nouvelle ligne
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation des données
    if (!body.name || !body.type || !body.stations) {
      return NextResponse.json(
        { success: false, error: "Nom, type et nombre de stations sont requis" },
        { status: 400 },
      )
    }

    // Vérifier si le nom existe déjà
    const lines = AdminService.getLines()
    const existingLine = lines.find((l) => l.name === body.name)
    if (existingLine) {
      return NextResponse.json({ success: false, error: "Une ligne avec ce nom existe déjà" }, { status: 400 })
    }

    // Valeurs par défaut pour les champs manquants
    const lineData = {
      name: body.name,
      type: body.type,
      stations: body.stations,
      status: body.status || "active",
      route: body.route || "Nouvelle route",
      frequency: body.frequency || "À définir",
      operatingHours: body.operatingHours || "06:00 - 22:00",
    }

    const newLine = await AdminService.createLine(lineData)

    return NextResponse.json({ success: true, data: newLine }, { status: 201 })
  } catch (error) {
    console.error("❌ Erreur POST /api/admin/lines:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}
