"use client"
import React from 'react'
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Check, ChevronsUpDown, MapPin, Train } from "lucide-react"
import { cn } from "@/lib/utils"
import { stations, getDestinationsForDeparture, type Station } from "@/lib/transport-data"

interface StationSearchProps {
  value: string
  onChange: (value: string, station?: Station) => void
  placeholder?: string
  className?: string
  departureStationId?: string
  isDestination?: boolean
}

export function StationSearch({
  value,
  onChange,
  placeholder = "Rechercher une station...",
  className,
  departureStationId,
  isDestination = false,
}: StationSearchProps) {
  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredStations, setFilteredStations] = useState<Station[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  // Filtrer les stations selon le contexte
  useEffect(() => {
    let availableStations: Station[] = []

    if (isDestination && departureStationId) {
      // Si c'est une destination et qu'on a une station de départ,
      // montrer seulement les destinations possibles
      availableStations = getDestinationsForDeparture(departureStationId)
    } else {
      // Sinon, montrer toutes les stations
      availableStations = stations
    }

    if (searchQuery.trim()) {
      // Filtrer par nom ou ligne
      const filtered = availableStations.filter(
        (station) =>
          station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          station.lines.some((line) => line.toLowerCase().includes(searchQuery.toLowerCase())) ||
          station.zone.toLowerCase().includes(searchQuery.toLowerCase()),
      )
      setFilteredStations(filtered)
    } else {
      setFilteredStations(availableStations.slice(0, 10)) // Limiter à 10 pour les performances
    }
  }, [searchQuery, departureStationId, isDestination])

  const handleSelect = (station: Station) => {
    onChange(station.name, station)
    setOpen(false)
    setSearchQuery("")
  }

  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue)
    onChange(inputValue)

    // Ouvrir automatiquement si on tape
    if (inputValue.length > 0 && !open) {
      setOpen(true)
    }
  }

  const selectedStation = stations.find((station) => station.name === value)

  return (
    <div className={cn("relative", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-between h-auto min-h-[40px] px-3 py-2 bg-transparent"
            onClick={() => setOpen(!open)}
          >
            <div className="flex items-center gap-2 flex-1 text-left">
              {selectedStation ? (
                <div className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">{selectedStation.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge variant="outline" className="text-xs">
                      {selectedStation.zone}
                    </Badge>
                    <div className="flex gap-1">
                      {selectedStation.lines.slice(0, 2).map((line) => (
                        <Badge
                          key={line}
                          variant="secondary"
                          className={cn(
                            "text-xs px-1 py-0",
                            line.startsWith("T") ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800",
                          )}
                        >
                          {line}
                        </Badge>
                      ))}
                      {selectedStation.lines.length > 2 && (
                        <Badge variant="secondary" className="text-xs px-1 py-0">
                          +{selectedStation.lines.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <span className="text-muted-foreground">{placeholder}</span>
              )}
            </div>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              ref={inputRef}
              placeholder="Tapez pour rechercher..."
              value={searchQuery}
              onValueChange={handleInputChange}
              className="h-9"
            />
            <CommandList>
              <CommandEmpty>
                {isDestination && departureStationId
                  ? "Aucune destination trouvée sur les mêmes lignes"
                  : "Aucune station trouvée"}
              </CommandEmpty>
              <CommandGroup>
                {filteredStations.map((station) => (
                  <CommandItem
                    key={station.id}
                    value={station.name}
                    onSelect={() => handleSelect(station)}
                    className="flex items-center gap-2 p-3"
                  >
                    <Check
                      className={cn("mr-2 h-4 w-4", selectedStation?.id === station.id ? "opacity-100" : "opacity-0")}
                    />
                    <div className="flex items-center gap-2 flex-1">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="font-medium">{station.name}</div>
                          <div className="text-sm text-gray-500">Zone {station.zone}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 ml-auto">
                        <Train className="h-3 w-3 text-gray-400" />
                        <div className="flex gap-1">
                          {station.lines.map((line) => (
                            <Badge
                              key={line}
                              variant="outline"
                              className={cn(
                                "text-xs px-1 py-0",
                                line.startsWith("T")
                                  ? "border-blue-300 text-blue-700"
                                  : "border-green-300 text-green-700",
                              )}
                            >
                              {line}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Informations supplémentaires */}
      {selectedStation && (
        <div className="mt-2 text-xs text-gray-600">
          <div className="flex items-center gap-4">
            <span>
              📍 {selectedStation.coordinates[0].toFixed(4)}, {selectedStation.coordinates[1].toFixed(4)}
            </span>
            <span>🚊 {selectedStation.type === "tramway" ? "Station Tramway" : "Arrêt Bus"}</span>
            <span>
              🎯 {selectedStation.lines.length} ligne{selectedStation.lines.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}
