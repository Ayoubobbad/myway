# Configuration Google Maps API

## 1. Obtenir une clé API Google Maps

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez les APIs suivantes :
   - Maps JavaScript API
   - Places API
   - Directions API
   - Geocoding API

## 2. Créer une clé API

1. Allez dans "APIs & Services" > "Credentials"
2. Cliquez sur "Create Credentials" > "API Key"
3. Copiez votre clé API

## 3. Configurer les restrictions (Recommandé)

### Restrictions d'application :
- HTTP referrers (web sites)
- Ajoutez vos domaines : `localhost:3000/*`, `yourdomain.com/*`

### Restrictions d'API :
- Maps JavaScript API
- Places API
- Directions API
- Geocoding API

## 4. Configuration dans l'application

1. Créez un fichier `.env.local` à la racine du projet
2. Ajoutez votre clé API :
\`\`\`
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_actual_api_key_here
\`\`\`

## 5. Facturation

⚠️ **Important** : Google Maps API nécessite un compte de facturation activé.
- Les premiers $200/mois sont gratuits
- Surveillez votre utilisation dans la console

## 6. Limites et quotas

- **Maps JavaScript API** : 28,000 requêtes/mois gratuites
- **Places API** : Varie selon le type de requête
- **Directions API** : 2,500 requêtes/jour gratuites

## 7. Sécurité

- Ne jamais exposer votre clé API côté client sans restrictions
- Utilisez les restrictions de domaine
- Surveillez l'utilisation régulièrement
- Régénérez la clé si compromise

## 8. Test de l'intégration

Une fois configuré, l'application devrait :
- Charger la carte de Casablanca
- Afficher l'autocomplétion des lieux
- Calculer les itinéraires en transport en commun
- Afficher les directions sur la carte
