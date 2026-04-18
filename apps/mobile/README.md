# AUTONORME Mobile — Flutter App

Application mobile AUTONORME pour iOS et Android.

## Stack

- **Framework** : Flutter (Dart) — codebase unique iOS + Android
- **State** : Riverpod
- **Navigation** : go_router (deep links, auth guards)
- **HTTP** : Dio + Retrofit
- **Stockage local** : Hive / Isar (offline-first)
- **Push** : Firebase Messaging (FCM)
- **Maps** : Google Maps Flutter
- **Scan VIN** : mobile_scanner

## Structure (Feature-First)

```
lib/
├── core/
│   ├── api/          ← Dio client + intercepteurs JWT
│   ├── router/       ← go_router + auth guards + deep links
│   ├── theme/        ← Couleurs AUTONORME, Poppins/Inter
│   └── services/     ← StorageService (Hive), NotifService (FCM)
├── features/
│   ├── auth/         ← Splash, Onboarding, OTP, Setup profil
│   ├── home/         ← Dashboard, raccourcis, alertes
│   ├── vehicles/     ← Liste, fiche, scan VIN, historique
│   ├── garages/      ← Carte, liste, fiche, RDV, avis
│   ├── autobot/      ← Chat IA natif, streaming
│   ├── parts/        ← Catalogue, panier, commande, suivi
│   ├── maintenance/  ← Calendrier, rappels, historique
│   ├── notifications/← Centre, paramètres, badge
│   ├── profile/      ← Infos, paiements, langue, biométrie
│   └── motonorme/    ← Motos et tricycles
└── shared/
    ├── widgets/      ← Composants réutilisables
    └── providers/    ← Riverpod providers globaux
```

## Pattern obligatoire par feature

```
Repository → UseCase → Provider Riverpod → Widget
```

## API

Consomme `https://api.autonorme.com/api/v1`

## Notes

- Initié en Phase 4 du plan d'action
- Colocalisé dans le monorepo mais indépendant de Turborepo
- Son propre tooling Flutter/Dart
