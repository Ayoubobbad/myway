# Intégration API Spring Boot

## Configuration requise

### 1. Variables d'environnement

Ajoutez dans votre fichier `.env.local` :

\`\`\`env
# URL de votre API Spring Boot
NEXT_PUBLIC_API_URL=http://localhost:8080/api

# Pour la production
# NEXT_PUBLIC_API_URL=https://your-api-domain.com/api
\`\`\`

### 2. Configuration CORS dans Spring Boot

Ajoutez cette configuration dans votre application Spring Boot :

\`\`\`java
@Configuration
@EnableWebMvc
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
                .allowedOrigins("http://localhost:3000", "https://your-frontend-domain.com")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
\`\`\`

## Structure API attendue

### Endpoints pour les signalements

\`\`\`java
@RestController
@RequestMapping("/api/reports")
public class ReportController {

    // Créer un signalement
    @PostMapping
    public ResponseEntity<Report> createReport(@RequestBody CreateReportRequest request) {
        // Votre logique ici
    }

    // Récupérer les signalements récents
    @GetMapping("/recent")
    public ResponseEntity<List<Report>> getRecentReports(@RequestParam(defaultValue = "10") int limit) {
        // Votre logique ici
    }

    // Signalements par ligne
    @GetMapping("/line/{line}")
    public ResponseEntity<List<Report>> getReportsByLine(@PathVariable String line) {
        // Votre logique ici
    }

    // Signalements par station
    @GetMapping("/station/{station}")
    public ResponseEntity<List<Report>> getReportsByStation(@PathVariable String station) {
        // Votre logique ici
    }

    // Signalements d'un utilisateur
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Report>> getUserReports(@PathVariable Long userId) {
        // Votre logique ici
    }

    // Approuver un signalement (admin)
    @PutMapping("/{id}/approve")
    public ResponseEntity<Report> approveReport(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        // Votre logique ici
    }

    // Rejeter un signalement (admin)
    @PutMapping("/{id}/reject")
    public ResponseEntity<Report> rejectReport(@PathVariable Long id, @RequestHeader("Authorization") String token) {
        // Votre logique ici
    }
}
\`\`\`

### Modèles de données

\`\`\`java
// Entité Report
@Entity
public class Report {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String line;
    private String station;
    private String crowdLevel; // "faible", "moyen", "fort"
    private String comment;
    private Long userId;
    private String userName;
    
    @CreationTimestamp
    private LocalDateTime createdAt;
    
    private String status; // "pending", "approved", "rejected"
    
    // Getters et setters
}

// DTO pour la création
public class CreateReportRequest {
    private String line;
    private String station;
    private String crowdLevel;
    private String comment;
    private Long userId;
    
    // Getters et setters
}
\`\`\`

## Fonctionnalités implémentées

### ✅ Côté Frontend (Next.js)

- **Service API** complet avec gestion d'erreurs
- **Types TypeScript** pour la sécurité des données
- **Gestion des états** (chargement, erreur, succès)
- **Indicateur de connexion** (online/offline)
- **Rechargement automatique** des données
- **Fallback** vers des données simulées si l'API est indisponible
- **Validation** des formulaires
- **Gestion des erreurs** utilisateur-friendly

### 🔧 À implémenter côté Spring Boot

1. **Endpoints API** selon la structure ci-dessus
2. **Configuration CORS** pour autoriser les requêtes frontend
3. **Validation** des données d'entrée
4. **Gestion des erreurs** avec messages appropriés
5. **Authentification** pour les fonctionnalités admin
6. **Base de données** pour persister les signalements

## Test de l'intégration

1. **Démarrez votre API Spring Boot** sur le port 8080
2. **Vérifiez les endpoints** avec un outil comme Postman
3. **Testez la création** d'un signalement depuis l'interface
4. **Vérifiez les logs** côté Spring Boot et Next.js

## Dépannage

- **Erreur CORS** : Vérifiez la configuration CORS dans Spring Boot
- **Erreur 404** : Vérifiez que l'URL de l'API est correcte
- **Erreur de connexion** : Vérifiez que Spring Boot est démarré
- **Données non affichées** : Vérifiez la structure des réponses JSON
