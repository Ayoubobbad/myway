# Configuration Leaflet pour MyWay+

## Vue d'ensemble

L'application MyWay+ utilise **Leaflet** comme solution de cartographie open-source, remplaçant Google Maps pour une solution gratuite et performante.

## Technologies utilisées

### Cartographie
- **Leaflet 1.9.4** - Bibliothèque de cartes interactive
- **OpenStreetMap** - Données cartographiques gratuites
- **OSRM** - Calcul d'itinéraires open-source
- **Nominatim** - Géocodage et recherche d'adresses

### Données de transport
- **Réseau de Casablanca** - Tramway (T1, T2) et Bus (B10, B20, B30)
- **25+ stations** réparties dans 5 zones
- **Filtrage intelligent** des destinations selon les lignes

## Fonctionnalités

### 🗺️ Cartographie
- Carte interactive centrée sur Casablanca
- Marqueurs de départ/destination
- Calcul d'itinéraires optimisés
- Affichage des routes avec OSRM
- Contrôles de navigation

### 🚇 Recherche de stations
- Autocomplétion intelligente
- Filtrage par lignes de transport
- Affichage des correspondances
- Informations détaillées (zone, type, lignes)

### 🔄 Logique de correspondance
- Destinations filtrées selon le départ sélectionné
- Affichage des lignes communes
- Validation des connexions directes
- Alertes pour les correspondances nécessaires

## Structure des données

### Stations
\`\`\`typescript
interface Station {
  id: string           // Identifiant unique
  name: string         // Nom de la station
  type: 'tramway' | 'bus'  // Type de transport
  lines: string[]      // Lignes desservies
  coordinates: [number, number]  // Lat/Lng
  zone: string         // Zone géographique
}
\`\`\`

### Lignes de transport
\`\`\`typescript
interface TransportLine {
  id: string           // Ex: 'T1', 'B10'
  name: string         // Nom complet
  type: 'tramway' | 'bus'
  color: string        // Couleur de la ligne
  stations: string[]   // IDs des stations
}
\`\`\`

## Réseau de transport implémenté

### Tramway
- **Ligne T1** : Sidi Moumen ↔ Ain Diab (8 stations)
- **Ligne T2** : Sidi Bernoussi ↔ Ain Diab (8 stations)

### Bus
- **Ligne B10** : Derb Ghallef ↔ Corniche (6 stations)
- **Ligne B20** : Hay Hassani ↔ Sidi Maarouf (6 stations)
- **Ligne B30** : Médina ↔ Technopark (6 stations)

### Correspondances principales
- **Place Mohammed V** : T1, T2, B10, B30
- **Maarif** : T1, T2, B10, B30
- **Casa Voyageurs** : T1, T2, B20
- **Ain Diab** : T1, T2, B10

## Avantages vs Google Maps

| Critère | Leaflet + OSM | Google Maps |
|---------|---------------|-------------|
| **Coût** | Gratuit | Payant après quota |
| **Données** | OpenStreetMap | Google |
| **Personnalisation** | Totale | Limitée |
| **Performance** | Excellente | Bonne |
| **Dépendances** | Aucune clé API | Clé API requise |
| **Offline** | Possible | Non |

## Installation et utilisation

### Chargement automatique
Les ressources Leaflet sont chargées automatiquement :
\`\`\`html
<!-- CSS -->
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />

<!-- JavaScript -->
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
\`\`\`

### Composants principaux
- `LeafletMap` - Carte interactive avec itinéraires
- `StationSearch` - Recherche de stations avec filtrage
- `transport-data.ts` - Données du réseau de transport

## Prochaines améliorations

### Court terme
- [ ] Données temps réel des transports
- [ ] Calcul de prix précis
- [ ] Horaires détaillés par ligne

### Moyen terme
- [ ] Intégration API opérateurs
- [ ] Prédictions d'affluence IA
- [ ] Notifications push

### Long terme
- [ ] Extension à d'autres villes
- [ ] Mode hors-ligne
- [ ] Réalité augmentée

## Support et maintenance

- **Leaflet** : Communauté active, mises à jour régulières
- **OpenStreetMap** : Données collaboratives, mises à jour continues
- **OSRM** : Service gratuit, haute disponibilité
- **Nominatim** : Géocodage gratuit, pas de limite stricte

Cette solution offre une alternative robuste et économique à Google Maps, parfaitement adaptée aux besoins de MyWay+ et au budget du projet.
