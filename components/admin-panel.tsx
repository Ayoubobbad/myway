"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Shield,
  Users,
  AlertTriangle,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Bus,
  MapPin,
  BarChart3,
  TrendingUp,
  Activity,
} from "lucide-react"
import { AdminClient } from "@/lib/admin-client"
import type { User, TransportLine, AdminStats } from "@/lib/admin-api"
import { useToast } from "@/hooks/use-toast"

interface AdminPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AdminPanel({ open, onOpenChange }: AdminPanelProps) {
  const { toast } = useToast()

  // États pour les données
  const [users, setUsers] = useState<User[]>([])
  const [reports, setReports] = useState<any[]>([])
  const [lines, setLines] = useState<TransportLine[]>([])
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [loading, setLoading] = useState(false)

  // États pour les formulaires
  const [newUserName, setNewUserName] = useState("")
  const [newUserEmail, setNewUserEmail] = useState("")
  const [newUserRole, setNewUserRole] = useState("")
  const [newLineName, setNewLineName] = useState("")
  const [newLineType, setNewLineType] = useState("")
  const [newLineStations, setNewLineStations] = useState("")

  // Charger les données au montage
  useEffect(() => {
    if (open) {
      loadAllData()
    }
  }, [open])

  const loadAllData = async () => {
    setLoading(true)
    try {
      const [usersRes, reportsRes, linesRes, statsRes] = await Promise.all([
        AdminClient.getUsers(),
        AdminClient.getReports(),
        AdminClient.getLines(),
        AdminClient.getStats(),
      ])

      if (usersRes.success) setUsers(usersRes.data || [])
      if (reportsRes.success) setReports(reportsRes.data || [])
      if (linesRes.success) setLines(linesRes.data || [])
      if (statsRes.success) setStats(statsRes.data || null)
    } catch (error) {
      console.error("❌ Erreur chargement données admin:", error)
      toast({
        title: "Erreur",
        description: "Impossible de charger les données d'administration",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUserName || !newUserEmail || !newUserRole) return

    const result = await AdminClient.createUser({
      name: newUserName,
      email: newUserEmail,
      role: newUserRole as "user" | "admin",
    })

    if (result.success) {
      setUsers([...users, result.data!])
      setNewUserName("")
      setNewUserEmail("")
      setNewUserRole("")
      toast({
        title: "Succès",
        description: "Utilisateur créé avec succès",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Erreur lors de la création",
        variant: "destructive",
      })
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) return

    const result = await AdminClient.deleteUser(userId)
    if (result.success) {
      setUsers(users.filter((u) => u.id !== userId))
      toast({
        title: "Succès",
        description: "Utilisateur supprimé",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Erreur lors de la suppression",
        variant: "destructive",
      })
    }
  }

  const handleAddLine = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newLineName || !newLineType || !newLineStations) return

    const result = await AdminClient.createLine({
      name: newLineName,
      type: newLineType as "Bus" | "Tramway",
      stations: Number.parseInt(newLineStations),
    })

    if (result.success) {
      setLines([...lines, result.data!])
      setNewLineName("")
      setNewLineType("")
      setNewLineStations("")
      toast({
        title: "Succès",
        description: "Ligne créée avec succès",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Erreur lors de la création",
        variant: "destructive",
      })
    }
  }

  const handleDeleteLine = async (lineId: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette ligne ?")) return

    const result = await AdminClient.deleteLine(lineId)
    if (result.success) {
      setLines(lines.filter((l) => l.id !== lineId))
      toast({
        title: "Succès",
        description: "Ligne supprimée",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Erreur lors de la suppression",
        variant: "destructive",
      })
    }
  }

  const handleChangeLineStatus = async (lineId: string, newStatus: string) => {
    const result = await AdminClient.updateLine(lineId, { status: newStatus as any })
    if (result.success) {
      setLines(lines.map((line) => (line.id === lineId ? result.data! : line)))
      toast({
        title: "Succès",
        description: "Statut de la ligne mis à jour",
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Erreur lors de la mise à jour",
        variant: "destructive",
      })
    }
  }

  const handleModerateReport = async (reportId: string, action: "approve" | "reject") => {
    const result = await AdminClient.moderateReport(reportId, action)
    if (result.success) {
      setReports(
        reports.map((r) => (r.id === reportId ? { ...r, status: action === "approve" ? "approved" : "rejected" } : r)),
      )
      toast({
        title: "Succès",
        description: `Signalement ${action === "approve" ? "approuvé" : "rejeté"}`,
      })
    } else {
      toast({
        title: "Erreur",
        description: result.error || "Erreur lors de la modération",
        variant: "destructive",
      })
    }
  }

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[400px]">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3">Chargement des données...</span>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[1200px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Panneau d'administration
          </DialogTitle>
          <DialogDescription>
            Gérez les utilisateurs, modérez les signalements et administrez les lignes de transport
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="dashboard" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="reports">Signalements</TabsTrigger>
            <TabsTrigger value="lines">Lignes</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            {stats && (
              <>
                {/* Statistiques principales */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{stats.users.total}</div>
                      <div className="text-sm text-gray-600">Utilisateurs</div>
                      <div className="text-xs text-green-600 mt-1">+{stats.users.newThisWeek} cette semaine</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <AlertTriangle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{stats.reports.total}</div>
                      <div className="text-sm text-gray-600">Signalements</div>
                      <div className="text-xs text-blue-600 mt-1">{stats.reports.todayCount} aujourd'hui</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Bus className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{stats.lines.total}</div>
                      <div className="text-sm text-gray-600">Lignes</div>
                      <div className="text-xs text-green-600 mt-1">{stats.lines.active} actives</div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <Activity className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <div className="text-2xl font-bold">{stats.reports.pending}</div>
                      <div className="text-sm text-gray-600">En attente</div>
                      <div className="text-xs text-orange-600 mt-1">À modérer</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top stations */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-4 w-4" />
                        Stations les plus signalées
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {stats.activity.topStations.map((station, index) => (
                          <div key={station.station} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-bold text-blue-600">
                                {index + 1}
                              </div>
                              <span className="text-sm">{station.station}</span>
                            </div>
                            <Badge variant="outline">{station.count}</Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        Distribution affluence
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Faible</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{
                                  width: `${(stats.activity.crowdLevelDistribution.faible / stats.reports.total) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">
                              {stats.activity.crowdLevelDistribution.faible}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Moyen</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-yellow-500 rounded-full"
                                style={{
                                  width: `${(stats.activity.crowdLevelDistribution.moyen / stats.reports.total) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{stats.activity.crowdLevelDistribution.moyen}</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Fort</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-red-500 rounded-full"
                                style={{
                                  width: `${(stats.activity.crowdLevelDistribution.fort / stats.reports.total) * 100}%`,
                                }}
                              />
                            </div>
                            <span className="text-xs text-gray-600">{stats.activity.crowdLevelDistribution.fort}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="users" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter un utilisateur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Nom complet"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                  />
                  <Select value={newUserRole} onValueChange={setNewUserRole} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Rôle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usager</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button type="submit">Ajouter</Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Liste des utilisateurs ({users.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nom</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Signalements</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="font-medium">{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role === "admin" ? "Admin" : "Usager"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : user.status === "suspended"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {user.status === "active"
                              ? "Actif"
                              : user.status === "suspended"
                                ? "Suspendu"
                                : "En attente"}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.reportsCount}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteUser(user.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Modération des signalements ({reports.length})
                </CardTitle>
                <CardDescription>Approuvez ou rejetez les signalements des utilisateurs</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Station</TableHead>
                      <TableHead>Ligne</TableHead>
                      <TableHead>Affluence</TableHead>
                      <TableHead>Commentaire</TableHead>
                      <TableHead>Heure</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="font-medium">{report.station}</TableCell>
                        <TableCell>{report.line}</TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              report.crowdLevel === "faible"
                                ? "text-green-600"
                                : report.crowdLevel === "moyen"
                                  ? "text-yellow-600"
                                  : "text-red-600"
                            }
                          >
                            {report.crowdLevel}
                          </Badge>
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">
                          {report.comment || "Aucun commentaire"}
                        </TableCell>
                        <TableCell>
                          {new Date(report.createdAt).toLocaleString("fr-FR", {
                            day: "2-digit",
                            month: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.status === "approved"
                                ? "default"
                                : report.status === "rejected"
                                  ? "destructive"
                                  : "secondary"
                            }
                          >
                            {report.status === "approved"
                              ? "Approuvé"
                              : report.status === "rejected"
                                ? "Rejeté"
                                : "En attente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {report.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleModerateReport(report.id, "approve")}
                                className="text-green-600 hover:text-green-700"
                              >
                                <Check className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleModerateReport(report.id, "reject")}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lines" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Ajouter une ligne de transport
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleAddLine} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Nom de la ligne (ex: Bus 50)"
                    value={newLineName}
                    onChange={(e) => setNewLineName(e.target.value)}
                    required
                  />
                  <Select value={newLineType} onValueChange={setNewLineType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Type de transport" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bus">Bus</SelectItem>
                      <SelectItem value="Tramway">Tramway</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Nombre de stations"
                    value={newLineStations}
                    onChange={(e) => setNewLineStations(e.target.value)}
                    required
                  />
                  <Button type="submit">
                    <Bus className="h-4 w-4 mr-2" />
                    Ajouter
                  </Button>
                </form>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bus className="h-4 w-4" />
                  Gestion des lignes de transport ({lines.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ligne</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Route</TableHead>
                      <TableHead>Stations</TableHead>
                      <TableHead>Fréquence</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            {line.type === "Bus" ? (
                              <div className="w-6 h-6 bg-green-500 rounded text-white text-xs flex items-center justify-center font-bold">
                                B
                              </div>
                            ) : (
                              <div className="w-6 h-6 bg-blue-500 rounded text-white text-xs flex items-center justify-center font-bold">
                                T
                              </div>
                            )}
                            {line.name}
                          </div>
                        </TableCell>
                        <TableCell>{line.type}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 text-sm">
                            <MapPin className="h-3 w-3 text-gray-400" />
                            {line.route}
                          </div>
                        </TableCell>
                        <TableCell>{line.stations}</TableCell>
                        <TableCell>{line.frequency}</TableCell>
                        <TableCell>
                          <Select value={line.status} onValueChange={(value) => handleChangeLineStatus(line.id, value)}>
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="maintenance">Maintenance</SelectItem>
                              <SelectItem value="suspended">Suspendue</SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteLine(line.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
