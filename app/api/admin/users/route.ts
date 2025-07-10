import { NextResponse } from "next/server"
import { AdminService } from "@/lib/admin-api"

// GET - Récupérer tous les utilisateurs
export async function GET() {
  try {
    const users = AdminService.getUsers()
    return NextResponse.json({ success: true, data: users })
  } catch (error) {
    console.error("❌ Erreur GET /api/admin/users:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}

// POST - Créer un nouvel utilisateur
export async function POST(request: Request) {
  try {
    const body = await request.json()

    // Validation des données
    if (!body.name || !body.email || !body.role) {
      return NextResponse.json({ success: false, error: "Nom, email et rôle sont requis" }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const users = AdminService.getUsers()
    const existingUser = users.find((u) => u.email === body.email)
    if (existingUser) {
      return NextResponse.json({ success: false, error: "Cet email est déjà utilisé" }, { status: 400 })
    }

    const newUser = await AdminService.createUser({
      name: body.name,
      email: body.email,
      role: body.role,
      status: body.status || "active",
    })

    return NextResponse.json({ success: true, data: newUser }, { status: 201 })
  } catch (error) {
    console.error("❌ Erreur POST /api/admin/users:", error)
    return NextResponse.json({ success: false, error: "Erreur serveur" }, { status: 500 })
  }
}
