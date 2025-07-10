// Données des transports en commun de Casablanca
export interface Station {
  id: string
  name: string
  coordinates: [number, number] // [latitude, longitude]
  lines: string[]
  type: "tramway" | "bus" | "mixed"
  zone: string // Add zone property
  address?: string
}

export interface TransportLine {
  id: string
  name: string
  type: "tramway" | "bus"
  color: string
  stations: string[] // IDs des stations
  schedule?: {
    weekday: { start: string; end: string; frequency: number }
    weekend: { start: string; end: string; frequency: number }
  }
}

export interface RouteSegment {
  from: Station
  to: Station
  line: TransportLine
  duration: number // en minutes
  distance: number // en km
}

export interface Itinerary {
  segments: RouteSegment[]
  totalDuration: number
  totalDistance: number
  transfers: number
  crowdLevel?: "faible" | "moyen" | "fort"
}

// Stations de Casablanca avec coordonnées GPS réelles
export const stations: Station[] = [
  // Ligne T1 (Tramway)
  {
    id: "casa-port",
    name: "Casa Port",
    coordinates: [33.5731, -7.6298],
    lines: ["T1"],
    type: "tramway",
    zone: "1",
    address: "Boulevard Hassan II, Casablanca",
  },
  {
    id: "place-mohammed-v",
    name: "Place Mohammed V",
    coordinates: [33.5731, -7.5898],
    lines: ["T1", "T2"],
    type: "mixed",
    zone: "1",
    address: "Place Mohammed V, Casablanca",
  },
  {
    id: "casa-voyageurs",
    name: "Casa Voyageurs",
    coordinates: [33.5667, -7.5833],
    lines: ["T1"],
    type: "tramway",
    zone: "1",
    address: "Gare Casa Voyageurs, Casablanca",
  },
  {
    id: "maarif",
    name: "Maarif",
    coordinates: [33.5589, -7.6298],
    lines: ["T1", "T2"],
    type: "mixed",
    zone: "2",
    address: "Quartier Maarif, Casablanca",
  },
  {
    id: "racine",
    name: "Racine",
    coordinates: [33.5456, -7.6456],
    lines: ["T1"],
    type: "tramway",
    zone: "2",
    address: "Boulevard Rachidi, Casablanca",
  },
  {
    id: "ain-diab",
    name: "Ain Diab",
    coordinates: [33.5389, -7.6789],
    lines: ["T2"],
    type: "tramway",
    zone: "3",
    address: "Corniche Ain Diab, Casablanca",
  },

  // Ligne T2 (Tramway)
  {
    id: "ibn-tachfine",
    name: "Ibn Tachfine",
    coordinates: [33.5756, -7.5723],
    lines: ["T2"],
    type: "tramway",
    zone: "1",
    address: "Boulevard Ibn Tachfine, Casablanca",
  },
  {
    id: "hay-hassani",
    name: "Hay Hassani",
    coordinates: [33.5823, -7.5567],
    lines: ["T2", "B20"],
    type: "mixed",
    zone: "2",
    address: "Hay Hassani, Casablanca",
  },

  // Stations de bus
  {
    id: "sidi-maarouf",
    name: "Sidi Maarouf",
    coordinates: [33.5123, -7.5234],
    lines: ["B20", "B15"],
    type: "bus",
    zone: "3",
    address: "Sidi Maarouf, Casablanca",
  },
  {
    id: "technopark",
    name: "Technopark",
    coordinates: [33.5089, -7.5178],
    lines: ["B20"],
    type: "bus",
    zone: "3",
    address: "Technopark Casablanca",
  },
  {
    id: "anfa",
    name: "Anfa",
    coordinates: [33.5634, -7.6234],
    lines: ["B15", "B10"],
    type: "bus",
    zone: "2",
    address: "Quartier Anfa, Casablanca",
  },
  {
    id: "bourgogne",
    name: "Bourgogne",
    coordinates: [33.5712, -7.6123],
    lines: ["B10"],
    type: "bus",
    zone: "2",
    address: "Quartier Bourgogne, Casablanca",
  },
  {
    id: "gauthier",
    name: "Gauthier",
    coordinates: [33.5798, -7.6045],
    lines: ["B10", "B15"],
    type: "bus",
    zone: "1",
    address: "Quartier Gauthier, Casablanca",
  },
  {
    id: "palmier",
    name: "Palmier",
    coordinates: [33.5845, -7.5967],
    lines: ["B15"],
    type: "bus",
    zone: "1",
    address: "Boulevard du Palmier, Casablanca",
  },
  {
    id: "derb-sultan",
    name: "Derb Sultan",
    coordinates: [33.5678, -7.5789],
    lines: ["B10"],
    type: "bus",
    zone: "1",
    address: "Derb Sultan, Casablanca",
  },
]

// Lignes de transport
export const transportLines: TransportLine[] = [
  {
    id: "T1",
    name: "Tramway T1",
    type: "tramway",
    color: "#0066CC",
    stations: ["casa-port", "place-mohammed-v", "casa-voyageurs", "maarif", "racine"],
    schedule: {
      weekday: { start: "06:00", end: "23:00", frequency: 8 },
      weekend: { start: "07:00", end: "22:00", frequency: 12 },
    },
  },
  {
    id: "T2",
    name: "Tramway T2",
    type: "tramway",
    color: "#CC6600",
    stations: ["ibn-tachfine", "place-mohammed-v", "maarif", "hay-hassani", "ain-diab"],
    schedule: {
      weekday: { start: "06:00", end: "23:00", frequency: 10 },
      weekend: { start: "07:00", end: "22:00", frequency: 15 },
    },
  },
  {
    id: "B20",
    name: "Bus B20",
    type: "bus",
    color: "#009900",
    stations: ["hay-hassani", "sidi-maarouf", "technopark"],
    schedule: {
      weekday: { start: "05:30", end: "22:30", frequency: 15 },
      weekend: { start: "06:30", end: "21:30", frequency: 20 },
    },
  },
  {
    id: "B15",
    name: "Bus B15",
    type: "bus",
    color: "#990099",
    stations: ["sidi-maarouf", "anfa", "gauthier", "palmier"],
    schedule: {
      weekday: { start: "06:00", end: "22:00", frequency: 12 },
      weekend: { start: "07:00", end: "21:00", frequency: 18 },
    },
  },
  {
    id: "B10",
    name: "Bus B10",
    type: "bus",
    color: "#FF6600",
    stations: ["anfa", "bourgogne", "gauthier", "derb-sultan"],
    schedule: {
      weekday: { start: "05:45", end: "22:15", frequency: 10 },
      weekend: { start: "06:45", end: "21:15", frequency: 15 },
    },
  },
]

// Fonctions utilitaires
export function getStationById(id: string): Station | undefined {
  return stations.find((station) => station.id === id)
}

// Add the missing getStationByName function
export function getStationByName(name: string): Station | undefined {
  return stations.find((station) => station.name.toLowerCase() === name.toLowerCase())
}

export function getStationsByLine(lineId: string): Station[] {
  const line = transportLines.find((l) => l.id === lineId)
  if (!line) return []

  return line.stations.map((stationId) => getStationById(stationId)).filter((station): station is Station => !!station)
}

// Fix the getCommonLines function to return TransportLine objects instead of just IDs
export function getCommonLines(stationId1: string, stationId2: string): TransportLine[] {
  const station1 = getStationById(stationId1)
  const station2 = getStationById(stationId2)

  if (!station1 || !station2) return []

  const commonLineIds = station1.lines.filter((lineId) => station2.lines.includes(lineId))

  return commonLineIds
    .map((lineId) => transportLines.find((line) => line.id === lineId))
    .filter((line): line is TransportLine => !!line)
}

export function getDestinationsForDeparture(departureId: string): Station[] {
  const departure = getStationById(departureId)
  if (!departure) return []

  const destinations = new Set<Station>()

  // Pour chaque ligne de la station de départ
  departure.lines.forEach((lineId) => {
    const stationsOnLine = getStationsByLine(lineId)
    stationsOnLine.forEach((station) => {
      if (station.id !== departureId) {
        destinations.add(station)
      }
    })
  })

  return Array.from(destinations)
}

export function getLineById(id: string): TransportLine | undefined {
  return transportLines.find((line) => line.id === id)
}

// Fonction pour calculer la distance entre deux points GPS
export function calculateDistance(coord1: [number, number], coord2: [number, number]): number {
  const [lat1, lon1] = coord1
  const [lat2, lon2] = coord2

  const R = 6371 // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Fonction pour trouver les stations les plus proches
export function findNearestStations(coordinates: [number, number], maxDistance = 2): Station[] {
  return stations
    .map((station) => ({
      station,
      distance: calculateDistance(coordinates, station.coordinates),
    }))
    .filter(({ distance }) => distance <= maxDistance)
    .sort((a, b) => a.distance - b.distance)
    .map(({ station }) => station)
}

// Fonction pour convertir les données backend vers le format frontend
export function convertBackendStationToFrontend(backendStation: any): Station {
  return {
    id: backendStation.id?.toString() || backendStation.name.toLowerCase().replace(/\s+/g, "-"),
    name: backendStation.name,
    coordinates: [backendStation.latitude || 33.5731, backendStation.longitude || -7.5898],
    lines: backendStation.lineNames || [],
    type: backendStation.type?.toLowerCase() || "mixed",
    zone: backendStation.zone || "1",
    address: backendStation.address,
  }
}

// Fonction pour obtenir le nom d'affichage du niveau d'affluence
export function getCrowdLevelDisplayName(level: string): string {
  switch (level?.toUpperCase()) {
    case "FAIBLE":
      return "Fluide"
    case "MOYEN":
      return "Modérée"
    case "FORT":
      return "Chargée"
    default:
      return "Inconnue"
  }
}

// Fonction pour obtenir la couleur du niveau d'affluence
export function getCrowdLevelColor(level: string): string {
  switch (level?.toUpperCase()) {
    case "FAIBLE":
      return "text-green-600 bg-green-100"
    case "MOYEN":
      return "text-yellow-600 bg-yellow-100"
    case "FORT":
      return "text-red-600 bg-red-100"
    default:
      return "text-gray-600 bg-gray-100"
  }
}

// Fonction pour rechercher des stations par nom
export function searchStations(query: string): Station[] {
  if (!query.trim()) return []

  const normalizedQuery = query.toLowerCase().trim()
  return stations.filter(
    (station) =>
      station.name.toLowerCase().includes(normalizedQuery) ||
      station.address?.toLowerCase().includes(normalizedQuery) ||
      station.lines.some((line) => line.toLowerCase().includes(normalizedQuery)),
  )
}

// Fonction pour obtenir les horaires d'une ligne
export function getLineSchedule(lineId: string): TransportLine["schedule"] | undefined {
  const line = getLineById(lineId)
  return line?.schedule
}

// Fonction pour calculer le prochain passage
export function getNextDeparture(lineId: string, currentTime: Date = new Date()): string {
  const schedule = getLineSchedule(lineId)
  if (!schedule) return "Horaires non disponibles"

  const isWeekend = currentTime.getDay() === 0 || currentTime.getDay() === 6
  const daySchedule = isWeekend ? schedule.weekend : schedule.weekday

  const currentHour = currentTime.getHours()
  const currentMinute = currentTime.getMinutes()
  const currentTimeInMinutes = currentHour * 60 + currentMinute

  const [startHour, startMinute] = daySchedule.start.split(":").map(Number)
  const [endHour, endMinute] = daySchedule.end.split(":").map(Number)
  const startTimeInMinutes = startHour * 60 + startMinute
  const endTimeInMinutes = endHour * 60 + endMinute

  if (currentTimeInMinutes < startTimeInMinutes) {
    return `Premier départ à ${daySchedule.start}`
  }

  if (currentTimeInMinutes > endTimeInMinutes) {
    return `Service terminé - Reprise à ${daySchedule.start}`
  }

  // Calculer le prochain passage
  const minutesSinceStart = currentTimeInMinutes - startTimeInMinutes
  const nextDepartureOffset = Math.ceil(minutesSinceStart / daySchedule.frequency) * daySchedule.frequency
  const nextDepartureTime = startTimeInMinutes + nextDepartureOffset

  if (nextDepartureTime > endTimeInMinutes) {
    return `Dernier service - Reprise à ${daySchedule.start}`
  }

  const nextHour = Math.floor(nextDepartureTime / 60)
  const nextMinute = nextDepartureTime % 60
  const waitTime = nextDepartureTime - currentTimeInMinutes

  return `${nextHour.toString().padStart(2, "0")}:${nextMinute.toString().padStart(2, "0")} (dans ${waitTime} min)`
}
