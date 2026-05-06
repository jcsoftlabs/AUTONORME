# Plan d'Implémentation — Phase 3.6 : Multilingue (i18n complet)

Pour répondre à l'exigence `i18n complet fr/ht/en (tous les textes)`, nous devons extraire absolument tous les textes "en dur" (actuellement en français) des composants React et les injecter dynamiquement depuis les fichiers de traduction JSON via `next-intl`.

## Objectifs
1. Remplir les dictionnaires `fr.json` (Français), `ht.json` (Créole Haïtien) et `en.json` (Anglais) avec toutes les clés de l'application.
2. Refactoriser les pages et les composants pour utiliser le hook `useTranslations()` de `next-intl`.

## User Review Required
> [!IMPORTANT]
> C'est une tâche massive car elle touche tous les fichiers créés jusqu'à présent. Pour minimiser le risque d'erreurs et garantir un code propre, es-tu d'accord si on le fait en **2 étapes consécutives** ?
> 1. **Étape 1 : Le cœur de navigation et l'Accueil**. Extraction et traduction complète du Header, Footer, Hero Section, et des blocs de la page d'accueil (`/`).
> 2. **Étape 2 : Les pages internes**. Traduction des pages Garages, Pièces, AutoBot et l'Espace Client.
>
> Valides-tu cette approche progressive ?

## Proposed Changes (Étape 1 & 2)

### Fichiers de Traduction
#### [MODIFY] `apps/web/messages/fr.json`
- Ajout des objets JSON : `Header`, `Footer`, `HomePage`, `Garages`, `Parts`, `AutoBot`, `Account`.

#### [MODIFY] `apps/web/messages/ht.json`
- Traduction en Créole Haïtien. *(Ex: "Trouver un garage" → "Jwenn yon garaj")*.

#### [MODIFY] `apps/web/messages/en.json`
- Traduction en Anglais. *(Ex: "Trouver un garage" → "Find a garage")*.

### Refactorisation des Composants
#### [MODIFY] `apps/web/components/layout/Header.tsx`
- Import du hook `useTranslations('Header')`.

## Verification Plan
### Automated Verification
- Lancer `npm run build` après la refactorisation pour s'assurer que toutes les clés `next-intl` sont résolues correctement.

---

# Plan d'Implémentation — Phase 3.5 : Finalisation des Livrables Phase 3

## Objectifs (Livrables manquants)
1. **Pages de détails dynamiques** : `/garages/[slug]` et `/pieces/[id]`.
2. **i18n complet & Language Switcher** : Déplacer tous les textes français codés en dur vers les fichiers JSON (`messages/fr.json`, etc.) et ajouter le bouton pour changer de langue dans le Header.
3. **SEO & Metadata** : Générer `sitemap.xml`, `robots.txt` et les balises Open Graph.

---

# AUTONORME — PLAN D'ACTION TECHNIQUE V1 (MASTER PLAN)
## Architecture cohérente par couche — Avril 2026

> Référence absolue : `AUTONORME_MasterPrompt_V1.md`
> Toute décision déviante de ce plan doit être validée explicitement.

---

## Principe Directeur : Ordre des Dépendances

```
PHASE 0 → PHASE 1 → PHASE 2 → PHASE 3 → PHASE 4 → PHASE 5 → PHASE 6
Infra      Backend    Auth+AI    Web       Mobile    Dashboards  QA+Sécu
(socle)   (API+DB)   (transv.)  (public)  (Flutter) (Pro/Admin) (recette)
```

> ⚠️ **Règle absolue** : aucune phase ne commence avant que la précédente soit **stable et testée**.  
> Chaque couche consomme ce que la couche inférieure expose — jamais l'inverse.

---

## PHASE 0 — FONDATIONS & MONOREPO

> Objectif : poser le socle commun que tout le reste consommera.

### Structure du Monorepo

```
autonorme/
├── apps/
│   ├── api/               ← NestJS Backend
│   ├── web/               ← Next.js 14 Site public
│   ├── mobile/            ← Flutter App
│   ├── dashboard-garage/  ← Garage Pro (Next.js SPA)
│   ├── dashboard-supplier/← AUTOparts Supplier (Next.js SPA)
│   └── dashboard-admin/   ← Admin Panel (Next.js SPA)
├── packages/
│   ├── config/            ← ESLint, Prettier, TypeScript base
│   ├── database/          ← Prisma schema + migrations
│   ├── types/             ← Types partagés FR/HT/EN, DTOs
│   ├── i18n/              ← Fichiers de traduction (fr/ht/en)
│   └── ui/                ← Composants shadcn/ui customisés AUTONORME
├── .github/
│   └── workflows/         ← CI/CD GitHub Actions par app
└── docker-compose.yml     ← Dev local : Postgres + Redis + pgAdmin
```

### Livrables Phase 0

- [x] Monorepo Turborepo initialisé
- [x] `docker-compose.yml` : PostgreSQL 16 + Redis 7 + pgAdmin
- [x] `packages/config` : ESLint + Prettier + TS strict configurés
- [x] `packages/database` : Schéma Prisma complet (toutes entités du BLOC 10)
- [x] Variables d'environnement documentées (`.env.example` par app)
- [x] GitHub Actions : lint + test sur chaque PR
- [x] Conventions de commits enforced (Husky + commitlint)

### Schéma Prisma — Entités à couvrir dès Phase 0

| Entité | Source |
|--------|--------|
| `User` + `Role` | BLOC 10 |
| `Vehicle` | BLOC 10 |
| `MaintenanceRecord` | BLOC 10 |
| `MaintenanceReminder` | BLOC 10 |
| `Garage` | BLOC 10 |
| `Appointment` | BLOC 10 |
| `Part` + `PartCategory` | BLOC 8 |
| `Order` + `OrderItem` | BLOC 10 |
| `Conversation` | BLOC 10 |
| `Review` | BLOC 9 |
| `Invoice` | BLOC 9 |
| `Notification` | BLOC 7 |

> **Règle** : Le schéma Prisma est la **source de vérité unique** du modèle de données.  
> Aucun type TypeScript de données ne peut être défini manuellement s'il existe déjà dans Prisma.

---

## PHASE 1 — BACKEND NESTJS (API CENTRALE)

> Objectif : exposer une API REST documentée, typée, sécurisée, consommable par toutes les surfaces.

### Structure des Modules NestJS

```
apps/api/src/
├── main.ts                  ← Bootstrap, Swagger, CORS, validation global pipe
├── app.module.ts
├── modules/
│   ├── auth/                ← JWT + OTP (WhatsApp/SMS via sent.dm)
│   ├── users/               ← CRUD profils, RBAC guards
│   ├── vehicles/            ← Gestion véhicules + VIN scan validation
│   ├── garages/             ← Annuaire, géolocalisation, spécialités
│   ├── appointments/        ← RDV, statuts, notifications
│   ├── parts/               ← Catalogue AUTOparts, compatibilité
│   ├── orders/              ← Commandes, paiements, statuts
│   ├── maintenance/         ← Plans, rappels, historique
│   ├── autobot/             ← Proxy Claude API, gestion contexte conversation
│   ├── whatsapp/            ← Webhook Meta, envoi messages, templates
│   ├── notifications/       ← Centre notif, préférences, push FCM
│   ├── reviews/             ← Avis garages, modération
│   ├── invoices/            ← Génération PDF, historique
│   └── admin/               ← KPIs, modération, config système
├── shared/
│   ├── guards/              ← JwtAuthGuard, RolesGuard, WhatsAppHmacGuard
│   ├── decorators/          ← @Roles(), @CurrentUser(), @Public()
│   ├── filters/             ← GlobalExceptionFilter → format AUTONORME_[DOMAINE]_[ERREUR]
│   ├── interceptors/        ← LoggingInterceptor, TransformInterceptor
│   ├── pipes/               ← ZodValidationPipe
│   └── utils/               ← Format HTG, format date haïtien, téléphone +509
└── config/                  ← ConfigModule, validation env vars avec Zod
```

### Conventions API — Non Négociables

| Convention | Règle |
|-----------|-------|
| Format erreur | `AUTONORME_[DOMAINE]_[CODE]` (ex: `AUTONORME_PART_INCOMPATIBLE`) |
| Auth header | `Authorization: Bearer <JWT>` |
| Pagination | `?page=1&limit=20` sur tous les `findAll` |
| Versioning | `/api/v1/` préfixe toutes les routes |
| Réponse succès | `{ success: true, data: {...}, meta?: { page, total } }` |
| Réponse erreur | `{ success: false, error: { code, message, timestamp } }` |
| Langue erreur | Paramètre `Accept-Language: fr | ht | en` |
| Swagger | Auto-généré via `@nestjs/swagger`, accessible `/api/docs` |
| Logs | Jamais de donnée personnelle en clair (masquage téléphone, email) |

### Livrables Phase 1

- [x] Module `auth` : OTP WhatsApp/SMS + JWT access (15min) + refresh (30j HttpOnly)
- [x] RBAC : guards `CLIENT · GARAGE · SUPPLIER · ADMIN · SUPER_ADMIN`
- [x] Module `vehicles` : CRUD + validation VIN
- [x] Module `garages` : CRUD + géo (lat/lng) + recherche par distance
- [x] Module `appointments` : création, validation, annulation, statuts
- [x] Module `parts` : catalogue, filtre compatibilité, stock temps réel
- [x] Module `orders` : flux complet 10 étapes (BLOC 8)
- [x] Module `maintenance` : plans + BullMQ jobs (rappels J-7 et J-1)
- [x] Module `whatsapp` : webhook vérifié HMAC-SHA256 + envoi templates
- [x] Module `autobot` : proxy Claude API + persistance `Conversation`
- [x] Module `notifications` : centre + préférences + push FCM
- [x] Swagger `/api/docs` complet et à jour
- [x] Tests unitaires ≥ 70% couverture sur modules critiques
- [x] GlobalExceptionFilter retournant le format d'erreur standardisé

---

## PHASE 2 — AUTHENTIFICATION & COUCHE IA TRANSVERSALE

> Objectif : la couche IA (AutoBot) et la couche Auth sont **partagées** par toutes les surfaces (web, mobile, WhatsApp). Elles doivent être stables avant tout développement frontend.

### Auth — Flux Complet

```
1. Client envoie son numéro +509 XXXX XXXX
2. API génère OTP 6 chiffres → envoie via WhatsApp (sent.dm) ou SMS fallback
3. Client soumet OTP → API vérifie + génère JWT access + refresh
4. JWT access : 15min, in-memory côté client
5. JWT refresh : 30j, HttpOnly Cookie
6. Rotation refresh token à chaque usage
7. Admin uniquement : TOTP 2FA obligatoire (Google Authenticator)
```

### AutoBot — Intégration Claude API

```
Module autobot/
├── autobot.service.ts       ← Appels Claude API avec system prompt officiel (BLOC 6)
├── context.service.ts       ← Chargement contexte utilisateur (véhicule, historique)
├── conversation.service.ts  ← Persistance messages en BDD (model Conversation)
├── tools/                   ← Tool calls Claude : check-stock, find-garage, create-appointment
└── streaming.gateway.ts     ← WebSocket pour streaming réponses temps réel
```

**Règles AutoBot — Non Négociables** :
- System prompt = identique au BLOC 6, jamais modifié sans validation
- Détection langue automatique (fr/ht/en) sur chaque message
- Contexte chargé à chaque requête : profil user + véhicules + historique 10 derniers messages
- Tool calls : `check_part_compatibility`, `get_stock`, `find_nearest_garage`, `create_appointment`
- Jamais de données fabriquées — si incertain → escalade agent humain
- Streaming via WebSocket Gateway (NestJS Gateway + Socket.io)

### Livrables Phase 2

- [x] Flux OTP complet fonctionnel (WhatsApp + SMS fallback)
- [x] JWT access + refresh avec rotation
- [x] Guards RBAC testés sur tous les endpoints sensibles
- [x] TOTP 2FA Admin implémenté
- [x] `autobot.service.ts` avec system prompt officiel injecté
- [x] Context loader : véhicule actif + historique conversation
- [x] Tool calls Claude validés (stock, garage, RDV)
- [x] WebSocket streaming gateway fonctionnel
- [x] Persistance conversations en BDD (`Conversation` model)

---

## PHASE 3 — SITE WEB PUBLIC (Next.js 14)

> Objectif : surface publique SEO-optimisée, multilingue, mobile-first, consommant l'API v1.

### Architecture Next.js

```
apps/web/
├── app/
│   ├── [locale]/                 ← next-intl routing : fr / ht / en
│   │   ├── page.tsx              ← / Accueil
│   │   ├── garages/              ← /garages + /garages/[slug]
│   │   ├── pieces/               ← /pieces + /pieces/[id]
│   │   ├── autobot/              ← /autobot — Chat IA public
│   │   ├── maintenance/          ← /maintenance
│   │   ├── a-propos/             ← /a-propos
│   │   ├── rejoindre/            ← /rejoindre
│   │   ├── blog/                 ← /blog
│   │   └── compte/               ← Espace client connecté (auth guard)
│   ├── api/                      ← Route handlers Next.js (BFF léger)
│   └── layout.tsx
├── components/
│   ├── ui/                       ← shadcn/ui customisé couleurs AUTONORME
│   ├── autobot/                  ← Widget chat, streaming, bulles messages
│   ├── garages/                  ← Carte interactive, cards, filtres
│   ├── parts/                    ← Catalogue, fiche pièce, filtre véhicule
│   └── shared/                   ← Header, Footer, LanguageSwitcher, etc.
├── lib/
│   ├── api-client.ts             ← Wrapper fetch vers /api/v1 avec auth headers
│   ├── query-client.ts           ← TanStack Query config
│   └── store/                    ← Zustand stores (auth, vehicle actif, panier)
└── messages/                     ← Fichiers i18n : fr.json / ht.json / en.json
```

### Livrables Phase 3

- [x] Layout global : Header multilingue, Footer, LanguageSwitcher
- [x] Page `/` : Hero, valeur prop, CTA, chiffres clés, témoignages
- [ ] Page `/garages` : carte interactive (Google Maps) + liste filtrée
- [ ] Page `/garages/[slug]` : fiche complète + prise de RDV
- [ ] Page `/pieces` : catalogue + filtre véhicule
- [ ] Page `/pieces/[id]` : fiche pièce + compatibilité + commande
- [ ] Page `/autobot` : chat IA avec streaming WebSocket
- [ ] Pages `/compte/*` : dashboard client complet (protected routes)
- [ ] Lighthouse ≥ 90 sur pages publiques
- [ ] FCP < 2s sur connexion 3G simulée
- [ ] i18n complet fr/ht/en (tous les textes)
- [ ] sitemap.xml + robots.txt + Open Graph

---

## PHASE 4 — APPLICATION MOBILE FLUTTER

> Objectif : app iOS + Android offline-first, feature-first, consommant la même API v1.

### Architecture Flutter

```
apps/mobile/
├── lib/
│   ├── core/
│   │   ├── api/             ← Dio client + intercepteurs JWT auto-refresh
│   │   ├── router/          ← go_router — routes + auth guards + deep links
│   │   ├── theme/           ← Couleurs AUTONORME, typo Poppins/Inter
│   │   └── services/        ← StorageService (Hive), NotifService (FCM)
│   ├── features/
│   │   ├── auth/            ← Splash, Onboarding, OTP login, Setup profil
│   │   ├── home/            ← Dashboard, raccourcis, alertes actives
│   │   ├── vehicles/        ← Liste, fiche, ajout (scan VIN), historique
│   │   ├── garages/         ← Carte, liste, fiche, RDV, évaluation
│   │   ├── autobot/         ← Chat IA natif, historique, streaming
│   │   ├── parts/           ← Catalogue, panier, commande, suivi
│   │   ├── maintenance/     ← Calendrier, rappels, historique
│   │   ├── notifications/   ← Centre, paramètres, badge
│   │   ├── profile/         ← Infos, paiements, langue, biométrie
│   │   └── motonorme/       ← Sous-section motos/tricycles
│   └── shared/
│       ├── widgets/         ← Composants réutilisables AUTONORME
│       └── providers/       ← Riverpod providers globaux
└── assets/
    ├── i18n/                ← fr.json / ht.json / en.json
    └── fonts/               ← Poppins + Inter embedded
```

### Livrables Phase 4

- [ ] Auth OTP complet (WhatsApp/SMS) avec biométrie
- [ ] Home dashboard avec alertes maintenance urgentes
- [ ] Module Véhicules : CRUD + scan VIN caméra
- [ ] Module Garages : carte Google Maps + RDV
- [ ] Module AutoBot : chat natif avec streaming
- [ ] Module AUTOparts : catalogue + panier + commande
- [ ] Module Maintenance : calendrier + rappels push
- [ ] Mode hors-ligne : véhicules + garages + historique (Hive)
- [ ] Switch langue FR/HT/EN sans redémarrage
- [ ] Section GaragePro (role-based) : planning + fiches clients
- [ ] Tests widget + integration ≥ 70% couverture modules critiques

---

## PHASE 5 — INTÉGRATIONS TIERCES

> Objectif : connecter tous les services externes de manière sécurisée et résiliente.

### Livrables Phase 5

- [ ] MonCash : initiation paiement + callback + confirmation
- [ ] Stripe : PaymentIntent + webhook confirmé
- [ ] Claude API : rate limiting + gestion quota + fallback message
- [ ] WhatsApp templates soumis et approuvés Meta (FR + HT)
- [ ] FCM : notifications riches avec action buttons
- [ ] Cloudinary : upload sécurisé + CDN URLs pour images
- [ ] Tous jobs BullMQ opérationnels avec monitoring Redis
- [ ] Resend : emails transactionnels (confirmation, facture, rappel)

---

## PHASE 6 — TABLEAUX DE BORD PROFESSIONNELS

> Objectif : 3 dashboards Next.js SPA consommant le même `/api/v1` avec RBAC strict.

### Livrables Phase 6

- [ ] Dashboard Garage Pro complet (toutes sections)
- [ ] Dashboard Fournisseur complet (toutes sections)
- [ ] Dashboard Admin complet (toutes sections)
- [ ] RBAC enforced : chaque route vérifie le rôle via API
- [ ] Export CSV fonctionnel (finances, inventaire)
- [ ] Génération PDF factures (PDFKit ou Puppeteer)

---

## PHASE 7 — RECETTE, SÉCURITÉ & MISE EN PRODUCTION

> Objectif : valider les 12 scénarios critiques du BLOC 12 et sécuriser le déploiement.

### Livrables Phase 7

- [ ] Audit RBAC : tester chaque rôle sur chaque endpoint
- [ ] Penetration test basique : injection SQL/NoSQL, XSS, CSRF
- [ ] Vérification : aucune donnée personnelle en clair dans les logs
- [ ] Vérification : tous les secrets dans AWS Secrets Manager
- [ ] TLS 1.3 sur toutes les routes (Cloudflare)
- [ ] Rate limiting configuré : `100 req/min` par IP, `1000 req/min` par user authentifié
- [ ] Backup PostgreSQL chiffré configuré (quotidien, rétention 30j)
- [ ] Sentry configuré sur toutes les apps (web, api, mobile)
- [ ] Lighthouse ≥ 90 Performance, ≥ 90 Accessibilité — pages publiques
- [ ] Tests de charge : API ≥ 99.5% uptime sous 500 users simultanés

---

# Plan d'Implémentation — Phase 7 : Dashboard Admin

> [!IMPORTANT]
> Création de l'interface centrale de contrôle pour valider les partenaires et gérer le contenu.

### Objectifs
1. **Modération** : Validation des Garages et Fournisseurs.
2. **CMS** : Gestion de la section "Shop by Model" (FeaturedModels).
3. **Analytics** : Vue d'ensemble de l'activité.

### Proposed Changes
- [NEW] apps/dashboard-admin/app/[locale]/layout.tsx
- [NEW] apps/dashboard-admin/app/[locale]/partners/page.tsx
- [NEW] apps/dashboard-admin/app/[locale]/content/featured-models/page.tsx
- [NEW] apps/dashboard-admin/components/layout/Sidebar.tsx
