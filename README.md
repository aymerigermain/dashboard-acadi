# 📊 ACADI Formation Stratégie - Dashboard MVP

Dashboard de suivi des ventes en temps réel pour la formation "Les principes fondamentaux de la stratégie d'entreprise" créée avec Xavier Fontanet.

## 🎯 Objectif

Fournir une vue d'ensemble claire et professionnelle des performances de vente avec :
- 📈 Visualisation des ventes en temps réel
- 💰 Suivi du chiffre d'affaires cumulé
- 📊 Tableaux de données détaillés
- 📄 Export PDF pour rapports hebdomadaires

## ⚡ Installation Rapide

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Modifier .env avec vos clés Stripe

# 3. Démarrer en mode développement (frontend + backend)
npm run dev

# 4. Ou démarrer séparément :
npm run server  # Backend (port 3001)
npm run dev     # Frontend (port 5173)
```

## 🔑 Configuration

### Variables d'environnement (.env)
```env
VITE_STRIPE_SECRET_KEY=sk_live_xxxxx    # Clé secrète Stripe
VITE_API_BASE_URL=https://api.stripe.com/v1
VITE_USE_MOCK_DATA=false                # true pour données de test
```

### Stripe API
- Le dashboard utilise l'API Stripe v3 pour récupérer les paiements
- Seuls les paiements réussis (status: 'succeeded') sont comptabilisés
- Les données sont groupées par semaine automatiquement

## 🏗️ Architecture

```
dashboard-mvp/
├── src/
│   ├── components/          # Composants React
│   │   ├── Header.tsx      # KPIs principaux
│   │   ├── SalesChart.tsx  # Graphique ventes/semaine
│   │   ├── RevenueChart.tsx # Revenue cumulé
│   │   ├── DataTable.tsx   # Tableau détaillé
│   │   └── ExportButton.tsx # Export PDF
│   ├── services/
│   │   └── stripeService.ts # API calls sécurisées
│   ├── hooks/
│   │   └── useStripeData.ts # Hook personnalisé
│   ├── utils/              # Utilitaires
│   ├── types/              # Types TypeScript
│   └── theme.ts           # Thème MUI
├── server.js              # Serveur Express (proxy API)
└── package.json
```

## 🚀 Stack Technique

- **Frontend**: React 19 + TypeScript + Vite
- **UI/Design**: Material-UI v5 + responsive design
- **Graphiques**: Recharts avec tooltips interactifs
- **Backend**: Express.js (proxy sécurisé)
- **Export**: jsPDF + html2canvas pour rapports PDF
- **API**: Stripe API v3

## 📊 Fonctionnalités

### KPIs Principaux
- 💰 **Chiffre d'affaires total** : Somme de tous les paiements réussis
- 👥 **Nombre de clients** : Total des transactions
- 🎯 **Panier moyen** : CA total / nombre de clients

### Visualisations
- **Graphique des ventes** : Évolution du nombre de ventes par semaine
- **Graphique du CA** : Revenue cumulé dans le temps
- **Tableau détaillé** : Données par semaine avec évolution

### Export PDF
- Rapport professionnel avec graphiques et tableau
- Format : "rapport-formation-strategie-YYYY-MM-DD.pdf"
- Prêt pour partage en équipe

## 🔒 Sécurité

- ✅ Clés API Stripe jamais exposées côté frontend
- ✅ Serveur proxy Express pour sécuriser les appels
- ✅ Validation des données reçues
- ✅ Gestion des timeouts et erreurs

## 📱 Responsive Design

- **Desktop** : Graphiques côte à côte (2 colonnes)
- **Tablet** : Graphiques empilés, navigation optimisée
- **Mobile** : Interface verticale, touches adaptées

## 🛠️ Développement

### Commandes disponibles
```bash
npm run dev      # Dev frontend + backend
npm run server   # Backend seul (port 3001)
npm run build    # Build production
npm run preview  # Preview du build
npm run lint     # Linting ESLint
```

### Mode développement avec données de test
```env
VITE_USE_MOCK_DATA=true
```

## 🎨 Personnalisation

### Couleurs (src/theme.ts)
- **Primaire** : #1e40af (bleu professionnel)
- **Secondaire** : #64748b (gris moderne)  
- **Succès** : #10b981 (vert CA)
- **Background** : #f8fafc (gris très clair)

### Configuration Stripe
Le serveur backend expose ces endpoints :
- `GET /api/stats` - Statistiques générales
- `GET /api/payments` - Liste des paiements
- `GET /api/health` - Vérification santé serveur
- `GET /api/mock-data` - Données de test

## 🚀 Déploiement

### Production
1. Configurer les variables d'environnement production
2. `npm run build` pour générer le build
3. Déployer le dossier `dist/` et `server.js`
4. Démarrer avec `npm start`

### Environnements supportés
- Node.js 18+
- Navigateurs modernes (Chrome, Firefox, Safari, Edge)

## 📈 Métriques et Performance

- **Bundle size** : ~1.4MB (acceptable pour MVP)
- **Load time** : <3s sur connexion normale
- **Auto-refresh** : Toutes les 5 minutes
- **Responsive** : Optimisé mobile-first

## 🎯 Évolutions Futures (V2)

- 🔔 Alerting automatique sur seuils
- 📊 Prédictions de vente
- 👥 Segmentation clients
- 📅 Comparaisons périodiques
- 🔧 Dashboard admin avancé
- 🌍 Multi-formations

## 👥 Équipe

Développé par l'équipe étudiants des Mines pour l'ACADI :
- **Coordination** : Aymeri
- **Développement** : Matthieu, Tadeos
- **Formation** : Xavier Fontanet (ancien PDG Essilor)

---

*Dashboard MVP - Formation Stratégie d'Entreprise © 2024 ACADI*