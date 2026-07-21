# Plan d'implémentation — Migration Full-Stack vers Supabase (proFacture)

Ce plan décrit les étapes pour migrer la couche de données locale (Zustand + `localStorage`) vers un véritable backend PostgreSQL hébergé sur **Supabase**, rendant l'application entièrement full-stack et collaborative.

Nous allons conserver le store Zustand pour la gestion réactive de l'état côté client, mais nous allons synchroniser chaque action d'écriture directement avec Supabase et charger les données du cloud lors du montage de l'application.

---

## 1. Dépendances & Variables d'environnement

*   **Installation :** Installer le SDK JavaScript officiel de Supabase dans le projet.
    ```bash
    pnpm install @supabase/supabase-js
    ```
*   **Variables d'environnement :** Créer un fichier `.env.local` à la racine contenant les clés d'accès de votre projet Supabase :
    ```env
    NEXT_PUBLIC_SUPABASE_URL=https://uroxcckdkaaazffexclr.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVyb3hjY2tka2FhYXpmZmV4Y2xyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ0NTcxMjIsImV4cCI6MjEwMDAzMzEyMn0.so1JviIXnxWcVSmfxGawm6zQx1315y6GYW5gkQEmLp8
    ```

---

## 2. Schéma de la Base de Données (SQL)

Nous allons exécuter un script SQL dans votre projet Supabase pour générer la structure de la base de données PostgreSQL et y insérer les données de démonstration de la phase 1.

#### Schéma SQL
*   **Table `clients` :**
    *   `id` : UUID (Primary Key, par défaut `gen_random_uuid()`)
    *   `name` : TEXT (not null)
    *   `email` : TEXT (not null)
    *   `phone` : TEXT
    *   `address` : TEXT
    *   `created_at` : TIMESTAMP (default `now()`)
*   **Table `invoices` :**
    *   `id` : UUID (Primary Key, par défaut `gen_random_uuid()`)
    *   `invoice_number` : TEXT (unique, not null)
    *   `client_id` : UUID (Foreign Key references `clients(id)` ON DELETE CASCADE, not null)
    *   `issue_date` : DATE (not null)
    *   `due_date` : DATE (not null)
    *   `status` : TEXT (not null, check constraint : `draft`, `sent`, `paid`)
    *   `subtotal` : NUMERIC (not null)
    *   `vat_amount` : NUMERIC (not null)
    *   `total` : NUMERIC (not null)
    *   `created_at` : TIMESTAMP (default `now()`)
*   **Table `invoice_items` :**
    *   `id` : UUID (Primary Key, par défaut `gen_random_uuid()`)
    *   `invoice_id` : UUID (Foreign Key references `invoices(id)` ON DELETE CASCADE, not null)
    *   `description` : TEXT (not null)
    *   `quantity` : NUMERIC (not null)
    *   `unit_price` : NUMERIC (not null)
    *   `created_at` : TIMESTAMP (default `now()`)
*   **Table `settings` (Configuration de l'entreprise) :**
    *   `id` : UUID (Primary Key, par défaut `gen_random_uuid()`)
    *   `company_name` : TEXT
    *   `company_email` : TEXT
    *   `company_phone` : TEXT
    *   `company_address` : TEXT
    *   `default_vat` : NUMERIC
    *   `invoice_prefix` : TEXT
    *   `payment_terms` : TEXT
    *   `logo_preview` : TEXT (base64)
    *   `updated_at` : TIMESTAMP (default `now()`)

---

## 3. Connexion Frontend & Refactoring du Store Zustand

#### Fichier `lib/supabase.ts`
*   Créer et exporter l'instance du client Supabase (`createClient`) configurée avec les variables d'environnement.

#### Fichier `lib/store.ts`
*   Retirer la persistance `localStorage` pour les données de clients et factures (nous la garderons uniquement pour les préférences utilisateur locales comme le `theme`).
*   Ajouter l'action `fetchInitialData` pour charger de manière asynchrone toutes les données depuis Supabase :
    1.  Récupérer la ligne unique de la table `settings`.
    2.  Récupérer la liste des `clients`.
    3.  Récupérer la liste des `invoices` avec leurs articles liés (`invoice_items`).
    4.  Mettre à jour l'état local du store.
*   Refactoriser les actions d'écriture pour les rendre asynchrones et synchroniser la base de données cloud :
    *   **Clients :**
        *   `addClient` : Effectue un `INSERT` dans la table `clients`.
        *   `updateClient` : Effectue un `UPDATE` dans la table `clients`.
        *   `deleteClient` : Effectue un `DELETE` dans la table `clients`.
    *   **Factures :**
        *   `addInvoice` : Effectue un `INSERT` dans la table `invoices` et insère parallèlement les articles dans `invoice_items` dans une transaction/requête groupée.
        *   `updateInvoice` : Met à jour la table `invoices`, supprime les anciens articles et ré-insère les nouveaux articles mis à jour dans `invoice_items`.
        *   `updateInvoiceStatus` : Met à jour le champ `status` dans la table `invoices`.
        *   `deleteInvoice` : Supprime la facture dans `invoices` (cascade automatique sur les articles).
    *   **Paramètres :**
        *   Ajouter une action `saveSettings` qui effectue un `UPSERT` dans la table `settings` (pour écraser l'unique ligne de configuration).

---

## 4. Chargement initial dans l'application

#### Fichier `app/layout.tsx`
*   Créer un composant d'initialisation client ou appeler `fetchInitialData()` dans le `ThemeProvider` pour s'assurer que les données du cloud sont récupérées au chargement de l'application.

---

## Plan de vérification

### Tests automatisés
*   `pnpm run build` pour valider la correction du typage TypeScript après transition vers les UUIDs et types Supabase.

### Vérification manuelle
1.  **Chargement initial :** Ouvrir l'application sur `localhost:3000` et s'assurer que les données de démonstration chargent depuis Supabase (les identifiants seront désormais sous forme de UUIDs).
2.  **Synchronisation :**
    *   Créer un nouveau client ou une nouvelle facture.
    *   Vérifier dans le dashboard ou dans la console Supabase que les tables SQL correspondantes ont bien enregistré la nouvelle ligne.
    *   Recharger la page (F5) et vérifier que les données saisies restent affichées (confirmant qu'elles ne proviennent plus du stockage temporaire `localStorage` du navigateur mais bien de Supabase).
    *   Modifier les informations dans les Paramètres (ex: ajouter un logo local), recharger, et vérifier que la modification persiste.
