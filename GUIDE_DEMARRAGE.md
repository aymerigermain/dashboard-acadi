# 🚀 Guide de Démarrage Rapide - Dashboard ACADI

## ⚡ Démarrage Immédiat

### 1. Installation (2 minutes)
```bash
npm install
```

### 2. Configuration (1 minute)
```bash
# Copier le fichier d'exemple
cp .env.example .env

# Option A: Mode test avec données simulées (recommandé pour démo)
# Modifier dans .env :
VITE_USE_MOCK_DATA=true

# Option B: Mode production avec vraies données Stripe
# Modifier dans .env :
VITE_USE_MOCK_DATA=false
VITE_STRIPE_SECRET_KEY=sk_live_votre_cle_stripe
```

### 3. Lancement (30 secondes)
```bash
# Démarrer backend + frontend en une commande
npm run dev

# Le dashboard sera accessible sur : http://localhost:5173
# Le serveur API sur : http://localhost:3001
```

## 🎯 Test Rapide

1. **Ouvrir** : http://localhost:5173
2. **Vérifier** : Les KPIs s'affichent en haut
3. **Naviguer** : Voir les 2 graphiques interactifs
4. **Consulter** : Le tableau détaillé en bas
5. **Exporter** : Cliquer "Exporter PDF" pour générer un rapport

## 📋 Checklist de Démo

- [ ] ✅ Dashboard s'affiche correctement
- [ ] 📊 KPIs affichent les bonnes valeurs
- [ ] 📈 Graphiques sont interactifs (hover)
- [ ] 📱 Interface responsive (tester sur mobile)
- [ ] 📄 Export PDF fonctionne
- [ ] 🔄 Bouton actualiser marche
- [ ] ⚡ Chargement fluide (<3s)

## 🔧 Résolution Problèmes

### Le serveur ne démarre pas
```bash
# Vérifier que le port 3001 est libre
lsof -i :3001

# Démarrer manuellement
npm run server
```

### Le frontend ne trouve pas l'API
```bash
# Vérifier que le serveur backend tourne
curl http://localhost:3001/api/health

# Doit retourner : {"status":"OK","timestamp":"..."}
```

### Erreurs de compilation
```bash
# Nettoyer et réinstaller
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 🎯 Prêt pour Présentation

Le dashboard est maintenant prêt pour :
- ✅ Démonstration à l'équipe
- ✅ Rapports hebdomadaires automatisés
- ✅ Suivi des performances en temps réel
- ✅ Export PDF professionnel

---

*Guide créé par l'équipe étudiants Mines pour l'ACADI*