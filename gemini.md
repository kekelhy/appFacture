# Récapitulatif Technique & Fonctionnel — appFacture

Ce document sert de guide de référence et de fiche de transfert pour l'application **appFacture**. Il résume le but du projet, les fonctionnalités implémentées, la structure du code, les choix de design, et fournit des directives pour tout futur modèle d'intelligence artificielle ou développeur travaillant sur cette base de code.

---

## 1. Description du Projet
**appFacture** est une application web SaaS de facturation premium spécialement conçue pour les entrepreneurs d'Afrique francophone (utilisant la devise **FCFA / XOF**, sans centimes). L'application propose une interface moderne, hautement responsive et interactive, permettant de piloter l'ensemble du cycle de vie des factures et clients en mode local autonome.

---

## 2. Technologies & Dépendances
L'application repose sur un ensemble de technologies modernes et performantes :
*   **Framework :** Next.js 14 (App Router, structures de dossiers groupés `(dashboard)`).
*   **Styling (CSS) :** Tailwind CSS v3 & PostCSS avec Autoprefixer (styles personnalisés et support natif du mode sombre).
*   **Gestion d'État :** Zustand 5 + Middleware `persist` (persistance des données de l'application dans le `localStorage` du navigateur).
*   **Visualisation de Données :** Recharts (graphiques financiers interactifs adaptés pour éviter les incohérences d'hydratation Next.js).
*   **Composants d'Icônes :** Lucide React.
*   **Notifications :** Sonner (gestion des toasts interactifs).

---

## 3. Fonctionnalités Implémentées

### A. Tableau de Bord (Dashboard — `/dashboard`)
*   **Statistiques clés :** Chiffre d'affaires total facturé, montant encaissé réel, encours client total (factures envoyées + en retard) et taux de recouvrement financier global.
*   **Graphique de Flux :** Graphique d'évolution financière (`AreaChart` interactif) affichant les courbes avec dégradés légers.
*   **Dernières transactions :** Liste des 5 dernières factures émises avec statut en couleur et accès direct à la fiche de détails.

### B. Gestion des Factures (`/invoices`)
*   **Tableau de données :** Liste complète avec numéro de facture, client, date d'échéance, montant total et statut.
*   **Recherche & Filtres :** Recherche en temps réel par nom de client ou numéro de facture, et filtres par onglets (Tous, Brouillon, Envoyée, Payée, En retard).
*   **Calcul de statut à la volée :** Le statut « En retard » est calculé dynamiquement si la facture est "envoyée" et que sa date d'échéance est dépassée par rapport à la date du jour.

### C. Éditeur de Facture (`/invoices/new` et `/invoices/[invoiceId]/edit`)
*   **Double panneau interactif :** Formulaire de saisie à gauche et prévisualisation live A4 à droite.
*   **Calculateur automatique :** Mise à jour instantanée des totaux (sous-total, TVA globale 18% UEMOA, et total TTC au franc près).
*   **Lignes d'articles dynamiques :** Ajout ou retrait de lignes de service à la volée avec calcul de sous-total par ligne.
*   **Responsive :** Sur mobile, un bouton switch permet d'alterner proprement entre la vue formulaire et la vue aperçu.

### D. Fiche de Détail d'une Facture (`/invoices/[invoiceId]`)
*   **Rendu A4 complet :** Feuille de style épurée et professionnelle de la facture.
*   **Changement de statut en direct :** Un menu dropdown permet de passer instantanément de *Brouillon* -> *Envoyée* -> *Payée*.
*   **Actions directes :** Lien de modification, suppression définitive avec boîte de dialogue personnalisée de confirmation, et simulation de téléchargement de PDF ou d'envoi par e-mail.

### E. Répertoire des Clients (`/clients`)
*   **Table de gestion :** Affiche le nom, l'e-mail, le téléphone, l'adresse postale et le nombre de factures associées à chaque client.
*   **Slide-over Panel :** Tiroir latéral pour ajouter un nouveau client ou modifier les coordonnées d'un client existant.
*   **Validation des formulaires :** Contrôle des champs obligatoires et des formats de saisie (e-mail, téléphone).
*   **Suppression sécurisée :** Fenêtre modale de confirmation personnalisée avant suppression.

### F. Rapports & Vues de Synthèse (`/reports`)
*   **Performances de ventes :** Synthèse du C.A. facturé, encaissé et taux de recouvrement.
*   **Ventes par client :** Tableau listant le chiffre d'affaires et le nombre de factures ventilés par client.
*   **Répartition graphique :** Comparaison de la proportion des règlements et des encours.

### G. Paramètres Généraux (`/settings`)
*   **Identité de l'entreprise :** Configuration du nom commercial, de l'adresse, du téléphone et de l'e-mail de facturation.
*   **Logo d'entreprise :** Zone d'importation d'image (drag & drop) avec aperçu immédiat et persistance locale en base64.
*   **Règles de facturation :** Choix du taux de TVA par défaut (18%, 10% ou 0%), du préfixe de numérotation, et du délai d'échéance par défaut.

### H. Aide & Support (`/support`)
*   **Faq Interactive :** Réponses sous forme d'accordéon dynamique à propos des taxes, de la numérotation ou de l'envoi de factures.
*   **Formulaire de contact :** Permet d'envoyer des demandes de support avec retour visuel par toast.

### I. Mode Sombre (Dark Mode)
*   **Bascule instantanée :** Boutons Soleil/Lune dans la barre latérale pour basculer de thème.
*   **Design sombre premium :** Inversion complète des couleurs (fond Slate 950, cartes Slate 900, textes et formulaires adaptés) par injection globale de style.

---

## 4. Structure des Fichiers Clés
```text
appFacture/
├── .agents/
│   └── AGENTS.md                 # Directives de design system (charte, espacements)
├── app/
│   ├── (dashboard)/
│   │   ├── clients/              # Page du répertoire client
│   │   ├── dashboard/            # Page d'accueil (statistiques et graphiques)
│   │   ├── invoices/             # Pages de liste, création, édition et détail facture
│   │   ├── reports/              # Page de synthèse et rapports financiers
│   │   ├── settings/             # Page des paramètres entreprise
│   │   ├── support/              # Page d'aide et support client
│   │   └── layout.tsx            # Mise en page globale (Sidebar + Topbar)
│   ├── globals.css               # Importations Tailwind et surcharges du mode sombre
│   ├── layout.tsx                # Structure HTML racine et initialisation du thème
│   └── page.tsx                  # Redirection par défaut vers le dashboard
├── components/
│   ├── features/
│   │   └── invoices/
│   │       └── invoice-form.tsx  # Formulate de facture unifié (Création & Édition)
│   └── layout/
│       ├── sidebar.tsx           # Menu de navigation et sélecteur de mode sombre
│       ├── theme-provider.tsx    # Observer client-side appliquant la classe .dark
│       └── topbar.tsx            # En-tête dynamique avec titre de section
├── lib/
│   ├── calculations/
│   │   ├── invoice-totals.ts     # Logique de calcul des lignes et de la TVA 18%
│   │   └── money.ts              # Formatage monétaire en FCFA (sans décimales)
│   └── store.ts                  # Base de données locale Zustand (Clients, Factures, Thème)
├── postcss.config.mjs            # Configuration des plugins PostCSS (Tailwind, Autoprefixer)
├── tailwind.config.ts            # Configuration des dossiers sources de Tailwind
└── tsconfig.json                 # Paramètres TypeScript
```

---

## 5. Directives Importantes pour l'IA (Futurs Modèles)

Lorsqu'un modèle d'IA intervient pour étendre ou modifier cette application, il **doit respecter strictement** les directives suivantes :

1.  **Hydration & Hydratation Guards (SSR vs Client) :**
    Next.js effectue un rendu serveur (SSR) avant l'exécution client. Le store Zustand chargeant ses données depuis le `localStorage`, de légères différences peuvent apparaître au chargement. Toujours utiliser un garde-fou d'initialisation (`mounted` via `useEffect`) pour les parties graphiques (Recharts) ou les affichages dépendants de données dynamiques pour éviter les erreurs de désynchronisation HTML.
2.  **Règles de syntaxe en JSX (Échappement des caractères) :**
    Pour éviter les erreurs de compilation bloquantes lors du build ESLint, **ne jamais utiliser de guillemets simples ou d'apostrophes brutes** dans les textes JSX. Utilisez systématiquement les entités HTML échappées (ex : utilisez `l&apos;activité` ou `d&apos;échéance` au lieu de `l'activité` ou `d'échéance`).
3.  **Nettoyage du Cache Next.js :**
    Si le serveur de développement rencontre des erreurs `404` inexpliquées sur les fichiers d'assets statiques (fichiers CSS ou JS de layout), c'est qu'un build de production a laissé des traces conflictuelles dans le dossier `.next`. La commande de résolution consiste à supprimer le cache et à relancer le serveur de développement :
    `rm -rf .next && pnpm run dev`
4.  **Charte Graphique & Espacements :**
    Consulter [AGENTS.md](file:///.agents/AGENTS.md) avant d'implémenter de nouveaux composants. Respecter les arrondis de cartes prononcés (`rounded-xl` / 12px), les ombres discrètes (`shadow-xs`), la couleur d'accentuation Indigo (`text-indigo-600` / `bg-indigo-600`), et les badges de statuts aux couleurs atténuées standardisées.
