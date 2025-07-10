import { NextResponse } from "next/server"
import { AdminService } from "@/lib/admin-api"

// GET - Récupérer une ligne spécifique
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const lineId = params.id
    const lines = AdminService.getLines()
    const line = lines.find((l) => l.id === lineId)

    if (!line) {
      return NextResponse.json({ success: false, error: "Ligne non trouvée" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: line })
  } catch (error) {
    console.error(`❌ Erreur GET /api/admin/lines/${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH - Mettre à jour une ligne
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const lineId = params.id
    const body = await request.json()

    const updatedLine = await AdminService.updateLine(lineId, body)

    if (!updatedLine) {
      return NextResponse.json({ success: false, error: "Ligne non trouvée" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedLine })
  } catch (error) {
    console.error(`❌ Erreur PATCH /api/admin/lines/${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Supprimer une ligne
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const lineId = params.id
    const success = await AdminService.deleteLine(lineId)

    if (!success) {
      return NextResponse.json({ success: false, error: "Ligne non trouvée" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`❌ Erreur DELETE /api/admin/lines/${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}
