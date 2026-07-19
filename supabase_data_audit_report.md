# Rapport d'Audit de Données — appFacture Full-Stack Supabase

Cet audit a été réalisé pour garantir que l'application **appFacture** n'utilise aucun jeu de données fictives (mocks) ou de cache local temporaire (`localStorage`) pour ses opérations. L'objectif est de certifier que l'ensemble des modules lit, enregistre, et modifie exclusivement de **vraies données** stockées en base de données relationnelle **Supabase PostgreSQL**.

---

## 1. Synthèse de l'Audit par Section

### A. Tableau de Bord (`/dashboard`)
*   **Indicateurs financiers (KPI) :** Le Chiffre d'Affaires total facturé, les montants encaissés (factures payées), les encours (factures envoyées ou en retard) et le taux de recouvrement sont calculés de manière 100% dynamique en analysant les factures réelles de la base de données.
*   **Graphique de Flux de Trésorerie (Recharts) :**
    *   *Avant :* Le graphique consommait un tableau d'historique statique (`MOCK_REVENUE_DATA`).
    *   *Après :* Refactorisation complète. Le composant génère dynamiquement un agrégat mensuel des volumes facturés vs encaissés sur les 6 derniers mois en parcourant la liste des factures récupérées en temps réel de Supabase. Les données factices ont été définitivement supprimées du code.
*   **Dernières transactions :** Affiche la liste des 5 dernières factures réelles enregistrées sur Supabase.

### B. Gestion des Factures (`/invoices`, `/invoices/new`, `/invoices/[id]/edit`)
*   **Numérotation automatique :** Le préfixe de numérotation configuré dans les paramètres et le compteur dynamique (basé sur le nombre de factures en base de données) sont utilisés pour générer le numéro de facture, évitant les collisions de compteurs locaux.
*   **Insertion (Écriture) :** L'action `addInvoice` effectue des requêtes asynchrones coordonnées (insertion de la facture dans la table `invoices` et des lignes d'articles liées dans la table `invoice_items`).
*   **Modification (Mise à jour) :** L'action `updateInvoice` applique un `UPDATE` sur l'en-tête de facture, supprime les anciennes lignes et ré-insère de manière propre les nouvelles lignes d'articles, reflétant instantanément les modifications dans la base de données.
*   **Prévisualisation A4 :** Lit le nom, l'adresse, le téléphone, et le logo de l'entreprise directement depuis la table Supabase `settings` de l'utilisateur.

### C. Fiche de Détail d'une Facture (`/invoices/[id]`)
*   **Changement de statut :** Le sélecteur de statut applique directement un `UPDATE` SQL en modifiant le champ `status` de la facture ciblée.
*   **Suppression :** L'action de suppression envoie une requête `DELETE` à Supabase. La base PostgreSQL applique automatiquement la clause `ON DELETE CASCADE` pour supprimer les articles liés à cette facture sans laisser d'orphelins.

### D. Répertoire des Clients (`/clients`)
*   **CRUD Clients :** L'ajout, la modification (nom, email, téléphone, adresse) et la suppression de clients sont entièrement asynchrones et synchronisés avec la table Supabase `clients`.
*   **Hydratation :** La liste des clients du répertoire est triée par ordre alphabétique en direct depuis Supabase.

### E. Synthèse financière et Rapports (`/reports`)
*   Le Chiffre d'Affaires total généré par chaque client et le nombre de factures associées sont calculés dynamiquement à partir des données croisées des tables `clients` et `invoices` de Supabase.

### F. Paramètres Généraux (`/settings`)
*   Toutes les configurations de l'entreprise (Nom commercial, Email de facturation, Téléphone, Adresse, taux de TVA par défaut, préfixe de numérotation, délai d'échéance par défaut) et le logo d'entreprise (base64) sont enregistrés par une opération `UPSERT` sur l'unique ligne de la table Supabase `settings`. Le recours à `localStorage` a été supprimé.

---

## 2. État du Code & Compilation

*   **TypeScript et ESLint :** Le projet compile de manière totalement propre via le compilateur TypeScript :
    ```bash
    npx tsc --noEmit
    ```
    Aucune erreur de typage ou avertissement n'est présent.
*   **Cache client :** Le middleware `persist` de Zustand a été modifié pour ne sauvegarder que la préférence du thème utilisateur (`theme: light/dark`). Les données de factures, de clients et de paramètres de l'entreprise ne sont plus stockées dans le cache du navigateur, éliminant tout risque de désynchronisation.

---

## 3. Conclusion de l'Audit

L'application **appFacture** est désormais **100% full-stack** et **conforme au traitement de données réelles**. Elle ne dépend plus de mocks locaux. Toutes les lectures, créations, modifications et suppressions sont exécutées sur votre base de données Supabase PostgreSQL.
