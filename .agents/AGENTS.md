# Règles du Design System — proFacture

Ce document définit les directives de design, d'intégration Tailwind CSS, d'alignement et de responsivité de l'application **proFacture** à suivre de manière stricte pour toute nouvelle page ou tout nouveau composant créé.

---

## 1. Structure de Page et Layouts (Shell)

- **Layout Global :**
  - Conteneur parent de type Flexbox s'étendant sur toute la largeur et hauteur de l'écran, avec masquage de l'overflow : `flex h-screen w-full overflow-hidden bg-slate-50`.
  - Le panneau latéral (Sidebar) est fixe à gauche sur grand écran et escamotable sur mobile.
  - La zone de contenu principale à droite occupe l'espace restant : `flex flex-1 flex-col overflow-hidden`.
  - Le corps de page défilable possède les classes `flex-1 overflow-y-auto p-6 lg:p-8`.

- **Sidebar (Menu Latéral) :**
  - Largeur fixée à `w-72`.
  - Arrière-plan blanc uni (`bg-white`), bordure droite fine de couleur slate (`border-r border-slate-200/80`), marges internes `p-6`.
  - Responsivité mobile : translate-x hors écran par défaut (`-translate-x-full lg:translate-x-0`), transition fluide, et affichage en tiroir (Drawer) au-dessus d'un voile flouté transparent (`fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden`).
  - Éléments inactifs ou non implémentés : opacity réduite, curseur bloqué (`opacity-50 cursor-not-allowed`) et petit badge "Bientôt" (`rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500`).

- **Topbar (Barre de Titre) :**
  - Hauteur fixe `h-16`, position collante (`sticky top-0 z-30`).
  - Effet translucide de verre givré (Glassmorphism) : `bg-white/70 backdrop-blur-md border-b border-slate-200/60 px-6 lg:px-8`.
  - Titre dynamique de section calculé selon le chemin actif en gras et lisible (`text-base sm:text-lg font-bold text-slate-800 tracking-tight`).

- **En-têtes de Page (Page Headers) :**
  - Structure en ligne répartie sur mobile et desktop : `flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between`.
  - Titre principal : `text-xl font-bold tracking-tight text-slate-900 sm:text-2xl`.
  - Sous-titre descriptif : `text-sm text-slate-500 mt-1 flex items-center gap-1.5`.

---

## 2. Palette de Couleurs & Charte Graphique

- **Couleurs de Fond & Conteneurs :**
  - Fond de l'application : `bg-slate-50` (Slate 50).
  - Fond des cartes et formulaires : `bg-white` (Blanc uni).
- **Couleur Primaire (Accent) :**
  - **Indigo** (`indigo-600` / `#4F46E5`).
  - Utilisé pour les états actifs, focus d'inputs, liens principaux, et boutons d'action (CTA) :
    - Bouton actif / CTA : `bg-indigo-600 text-white hover:bg-indigo-750`.
    - Lien de menu actif : `bg-indigo-50 text-indigo-600`.
    - Icône d'accentuation : `text-indigo-600`.
    - Effets d'ombre de focus : `shadow-indigo-150` ou `shadow-indigo-200`.

- **Palette des Statuts :**
  Les statuts des factures utilisent des badges formatés et colorés avec des variables précises :
  - **Payée (Paid) :** Vert Émeraude (`bg-emerald-55/70 text-emerald-700 border-emerald-200/50`, pastille `bg-emerald-500`).
  - **Envoyée (Sent) :** Bleu Ciel (`bg-sky-50 text-sky-700 border-sky-200/50`, pastille `bg-sky-500`).
  - **Brouillon (Draft) :** Gris Ardoise (`bg-slate-50 text-slate-600 border-slate-200/50`, pastille `bg-slate-400`).
  - **En retard (Overdue) :** Rose Rouge (`bg-rose-50 text-rose-700 border-rose-200/50`, pastille `bg-rose-500`).

---

## 3. Cartes (Cards) & Espacements

- **Style des Cartes Standard :**
  - Bordure fine neutre : `border border-slate-200/60`.
  - Coins arrondis très prononcés : `rounded-xl` (12px).
  - Ombres subtiles : `shadow-xs`.
  - Transition interactive (pour les cartes cliquables ou statistiques) : `hover:shadow-md hover:border-slate-300/40 transition-all duration-300`.
  - Marges internes standard : `p-5` ou `p-6` selon l'importance du composant.

---

## 4. Typographie & Alignements

- **Polices et Rendu :**
  - Utilisation prioritaire de la police Geist ou Inter sans-serif avec anticrénelage (`antialiased`).
  - Rendu typographique propre : `font-feature-settings: "cv02", "cv03", "cv04", "cv11"`.
- **Hiérarchie Typographique :**
  - Titres de section : `text-md font-bold text-slate-800 sm:text-lg`.
  - Chiffres clés / Valeurs de cartes : `text-lg font-extrabold text-slate-800 tracking-tight sm:text-xl`.
  - Libellés / Étiquettes secondaires : `text-xs font-semibold uppercase tracking-wider text-slate-400`.
  - Corps de texte / Valeurs de tableau : `text-sm text-slate-650`.

---

## 5. Composants Formulaires et Inputs (Inspiré de Creatinf)

- **Style des Inputs Standard :**
  - Coins arrondis : `rounded-xl` (ou `rounded-lg` pour les petits boutons).
  - Bordures : `border border-slate-200 bg-slate-50/50 focus:border-indigo-600 focus:bg-white transition-all outline-none`.
  - Icône à l'intérieur : placement absolu à gauche (`pl-10`) et texte aligné avec icône (`text-slate-400`).
  - Hauteur et Paddings : `py-2.5 px-3` ou `py-2.5 pl-10 pr-12`.

---

## 6. Tableaux de Données (DataTables)

- **Design des Tables :**
  - Rendre les tables défilables sur mobile via un conteneur horizontal : `overflow-x-auto -mx-6` avec sous-conteneur `inline-block min-w-full align-middle px-6`.
  - Lignes de tableau : `divide-y divide-slate-100/80` pour des séparations fines.
  - Hover sur les lignes : `hover:bg-slate-50/60 transition-all duration-150` pour guider la lecture.
  - En-têtes : alignement à gauche (`text-left`), taille minimale (`text-xs`), graisse semi-bold (`font-semibold`), majuscules (`uppercase`), espacement de lettres (`tracking-wider text-slate-400 py-3 px-4`).
  - Cellules de contenu : `py-3.5 px-4 text-sm`.

---

## 7. Visualisations et Graphiques (Recharts)

- **Précautions de rendu SSR / Next.js (Hydration) :**
  - Toujours utiliser un garde-fou client (`mounted`) avec `useEffect` pour éviter les erreurs d'incohérence HTML serveur-client. En cours de chargement, afficher un squelette de chargement animé (`bg-slate-50 animate-pulse rounded-xl`).
- **Style Visuel du Graphique :**
  - Zones remplies avec des dégradés légers (`fillOpacity={1} fill="url(#colorId)"`).
  - Dégradés définis avec des couleurs transparentes (`stopColor="#4F46E5" stopOpacity={0.15}` vers `stopOpacity={0}`).
  - Lignes de grille horizontales uniquement, très claires (`stroke="#E2E8F0" vertical={false}`).
  - Tooltips entièrement personnalisés (CustomTooltip) : sans bordure brute de navigateur, coins `rounded-xl`, bordure claire `border-slate-200`, texte petit et lisible, et valeurs formatées en FCFA via `formatFCFA`.
