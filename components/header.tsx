"use client"
import React from 'react'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { User, Settings, LogOut, Shield, Home, Clock, MapPin, AlertTriangle, Menu, BarChart3 } from "lucide-react"
import { UserProfileDialog } from "@/components/user-profile-dialog"
import { AdminPanel } from "@/components/admin-panel"
import Image from "next/image"

interface HeaderProps {
  user: any
  onLogin: () => void
  onLogout: () => void
  activeSection: string
  onSectionChange: (section: string) => void
}

export function Header({ user, onLogin, onLogout, activeSection, onSectionChange }: HeaderProps) {
  const [showProfile, setShowProfile] = useState(false)
  const [showAdmin, setShowAdmin] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const publicNavigationItems = [
    { id: "accueil", label: "Accueil", icon: Home },
    { id: "horaires", label: "Horaires", icon: Clock },
    { id: "itineraires", label: "Itinéraires", icon: MapPin },
    { id: "signalement", label: "Signalement", icon: AlertTriangle },
  ]

  const adminNavigationItems = [{ id: "dashboard", label: "Dashboard", icon: BarChart3 }]

  const handleSectionChange = (section: string) => {
    onSectionChange(section)
    setMobileMenuOpen(false)
  }

  return (
    <>
      <header className="bg-white/90 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSectionChange("accueil")}>
              <Image src="/logo.png" alt="TransportApp Logo" width={40} height={40} className="rounded-full" />
              <span className="text-2xl font-bold text-gray-900">MyWay+</span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              {/* Navigation publique */}
              {publicNavigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <Button
                    key={item.id}
                    variant={activeSection === item.id ? "default" : "ghost"}
                    onClick={() => onSectionChange(item.id)}
                    className="flex items-center gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Button>
                )
              })}

              {/* Navigation admin */}
              {user?.role === "admin" && (
                <>
                  <div className="w-px h-6 bg-gray-300 mx-2"></div>
                  {adminNavigationItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <Button
                        key={item.id}
                        variant={activeSection === item.id ? "default" : "ghost"}
                        onClick={() => onSectionChange(item.id)}
                        className="flex items-center gap-2 hover:text-purple-700 text-purple-700"
                      >
                        <Icon className="h-4 w-4" />
                        {item.label}
                      </Button>
                    )
                  })}
                </>
              )}
            </nav>

            {/* Right side - User menu and mobile menu */}
            <div className="flex items-center gap-4">
              {/* User Menu */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full hover:ring-2 hover:ring-blue-500 transition-all"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 z-[9999]" align="end" sideOffset={5} style={{ zIndex: 9999 }}>
                    {/* En-tête du menu avec infos utilisateur */}
                    <div className="flex items-center justify-start gap-3 p-3 bg-gray-50">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                        <AvatarFallback className="bg-blue-500 text-white">
                          <User className="h-5 w-5" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600 truncate max-w-[150px]">{user.email}</p>
                        {user.role === "admin" && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            <Shield className="w-3 h-3 mr-1" />
                            Administrateur
                          </span>
                        )}
                      </div>
                    </div>

                    <DropdownMenuSeparator />

                    {/* Option 1: Modifier le profil */}
                    <DropdownMenuItem
                      onClick={() => setShowProfile(true)}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-blue-50"
                    >
                      <Settings className="h-4 w-4 text-gray-600" />
                      <span className="font-medium">Modifier le profil</span>
                    </DropdownMenuItem>

                    {/* Options Admin (si utilisateur admin) */}
                    {user.role === "admin" && (
                      <>
                        <DropdownMenuItem
                          onClick={() => handleSectionChange("dashboard")}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-purple-50"
                        >
                          <BarChart3 className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-700">Dashboard</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => setShowAdmin(true)}
                          className="flex items-center gap-3 p-3 cursor-pointer hover:bg-purple-50"
                        >
                          <Shield className="h-4 w-4 text-purple-600" />
                          <span className="font-medium text-purple-700">Administration</span>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />

                    {/* Option de déconnexion */}
                    <DropdownMenuItem
                      onClick={onLogout}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-red-50 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="font-medium">Déconnexion</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={onLogin} className="hidden md:flex">
                  Connexion
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-6 w-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                  <div className="flex flex-col space-y-4 mt-8">
                    {/* Logo mobile */}
                    <div className="flex items-center gap-3 pb-4 border-b">
                      <Image src="/logo.png" alt="TransportApp Logo" width={32} height={32} className="rounded-full" />
                      <span className="text-xl font-bold text-gray-900">MyWay+</span>
                    </div>

                    {/* Mobile Navigation */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold mb-4">Navigation</h3>

                      {/* Navigation publique */}
                      {publicNavigationItems.map((item) => {
                        const Icon = item.icon
                        return (
                          <Button
                            key={item.id}
                            variant={activeSection === item.id ? "default" : "ghost"}
                            onClick={() => handleSectionChange(item.id)}
                            className="w-full justify-start gap-2"
                          >
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Button>
                        )
                      })}

                      {/* Navigation admin */}
                      {user?.role === "admin" && (
                        <>
                          <div className="border-t pt-4 mt-4">
                            <h4 className="text-sm font-medium text-purple-600 mb-2">Administration</h4>
                            {adminNavigationItems.map((item) => {
                              const Icon = item.icon
                              return (
                                <Button
                                  key={item.id}
                                  variant={activeSection === item.id ? "default" : "ghost"}
                                  onClick={() => handleSectionChange(item.id)}
                                  className="w-full justify-start gap-2 text-purple-600 hover:text-purple-700"
                                >
                                  <Icon className="h-4 w-4" />
                                  {item.label}
                                </Button>
                              )
                            })}
                          </div>
                        </>
                      )}
                    </div>

                    {/* Mobile User Actions */}
                    {!user ? (
                      <div className="pt-4 border-t">
                        <Button onClick={onLogin} className="w-full">
                          Connexion
                        </Button>
                      </div>
                    ) : (
                      <div className="pt-4 border-t space-y-2">
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
                            <AvatarFallback className="bg-blue-500 text-white">
                              <User className="h-4 w-4" />
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{user.name}</p>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            {user.role === "admin" && (
                              <p className="text-xs text-purple-600 font-medium">Administrateur</p>
                            )}
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          onClick={() => {
                            setShowProfile(true)
                            setMobileMenuOpen(false)
                          }}
                          className="w-full justify-start gap-2"
                        >
                          <Settings className="h-4 w-4" />
                          Modifier le profil
                        </Button>

                        {user.role === "admin" && (
                          <Button
                            variant="ghost"
                            onClick={() => {
                              setShowAdmin(true)
                              setMobileMenuOpen(false)
                            }}
                            className="w-full justify-start gap-2"
                          >
                            <Shield className="h-4 w-4" />
                            Administration
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          onClick={() => {
                            onLogout()
                            setMobileMenuOpen(false)
                          }}
                          className="w-full justify-start gap-2 text-red-600 hover:text-red-700"
                        >
                          <LogOut className="h-4 w-4" />
                          Déconnexion
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <UserProfileDialog open={showProfile} onOpenChange={setShowProfile} user={user} />

      {user?.role === "admin" && <AdminPanel open={showAdmin} onOpenChange={setShowAdmin} />}
    </>
  )
}
