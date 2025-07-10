import { NextResponse } from "next/server"
import { AdminService } from "@/lib/admin-api"

// GET - Récupérer un utilisateur spécifique
export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const users = AdminService.getUsers()
    const user = users.find((u) => u.id === userId)

    if (!user) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: user })
  } catch (error) {
    console.error(`❌ Erreur GET /api/admin/users/${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}

// PATCH - Mettre à jour un utilisateur
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const body = await request.json()

    const updatedUser = await AdminService.updateUser(userId, body)

    if (!updatedUser) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ success: true, data: updatedUser })
  } catch (error) {
    console.error(`❌ Erreur PATCH /api/admin/users/${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const userId = params.id
    const success = await AdminService.deleteUser(userId)

    if (!success) {
      return NextResponse.json({ success: false, error: "Utilisateur non trouvé" }, { status: 404 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(`❌ Erreur DELETE /api/admin/users/${params.id}:`, error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}
