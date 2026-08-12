
# Documentation complète — Mounfact Car

Application web de location de voitures, développée avec **Laravel 12** (API REST) et **React 19** (interface utilisateur), base de données **MySQL**.

> Méthode de rédaction : ce document a été rédigé après une analyse directe du code source réel du projet (`backend/` et `frontend/`), pas à partir d'une description générique. Chaque information est basée sur un fichier existant. Quand une fonctionnalité n'existe pas dans le code, cela est indiqué explicitement ("Non trouvé").

---

## 1. Présentation générale du projet

**Mounfact Car** est une plateforme de location de voitures composée de deux parties séparées qui communiquent par API :

- un **backend** Laravel 12 qui expose une API REST (`backend/routes/api.php`) et gère la base de données MySQL ;
- un **frontend** React 19 (Single Page Application, construite avec Vite) qui consomme cette API et affiche l'interface visible par les utilisateurs.

Le projet gère deux types d'utilisateurs :
- des **clients**, qui consultent le catalogue de voitures, réservent, gèrent leur compte et discutent avec l'administration ;
- un ou plusieurs **administrateurs**, qui gèrent le catalogue, les catégories, les réservations, consultent des statistiques et répondent aux clients.

## 2. Objectif de l'application

Concrètement, l'application permet :

- à un visiteur : de consulter le catalogue de voitures et leurs fiches détaillées sans être connecté ;
- à un client inscrit : de réserver une voiture pour une période donnée, consulter/annuler ses réservations, gérer son compte, et échanger des messages avec l'administration ;
- à un administrateur : de gérer les voitures et catégories (créer/modifier/supprimer), gérer le statut des réservations, consulter un tableau de bord avec statistiques (réservations, revenus, disponibilité du parc), et répondre aux messages des clients.

## 3. Technologies utilisées

| Côté | Technologie | Rôle | Source de l'information |
|---|---|---|---|
| Backend | PHP ^8.2 | Langage du serveur | `composer.json` |
| Backend | Laravel ^12.0 | Framework backend / API REST | `composer.json` |
| Backend | Laravel Sanctum ^4.0 | Authentification par jeton (Bearer token) | `composer.json` |
| Backend | MySQL | Base de données | `.env.example` (`DB_CONNECTION=mysql`) |
| Backend | Resend (`resend/resend-laravel` ^1.4) | Envoi d'emails transactionnels | `composer.json`, `config/mail.php` |
| Frontend | React ^19.2.7 | Bibliothèque d'interface utilisateur | `frontend/package.json` |
| Frontend | React Router DOM ^7.18.1 | Routage côté client (SPA) | `frontend/package.json` |
| Frontend | Vite ^8.1.1 | Outil de build / serveur de développement | `frontend/package.json` |
| Frontend | Tailwind CSS ^4.3.3 | Framework CSS utilitaire | `frontend/package.json`, `src/index.css` |
| Frontend | Axios ^1.18.1 | Client HTTP pour appeler l'API | `frontend/src/api/client.js` |
| Frontend | lucide-react ^1.27.0 | Icônes | `frontend/package.json` |
| Frontend | oxlint | Linter JavaScript | `frontend/package.json` |
| Images | Wikimedia Commons | Photos réelles des voitures du catalogue (hotlink) | `database/seeders/CarCategorySeeder.php` |

**Non trouvé** : pas de bibliothèque de graphiques externe (les graphiques du tableau de bord admin sont construits à la main en SVG), pas de librairie de formulaires (React `useState` + validation HTML native), pas de TypeScript utilisé en pratique (seuls les types `@types/react` sont présents en devDependency, mais tous les fichiers sont `.jsx`), pas de WebSocket/Pusher (le chat fonctionne par polling HTTP classique).

## 4. Architecture générale du projet

Le projet est un **monorepo** avec deux dossiers indépendants à la racine :

```
car-rental/
├── backend/     → API Laravel (PHP), connectée à MySQL
└── frontend/    → SPA React (Vite), consomme l'API via Axios
```

- Le backend ne sert **aucune page HTML** de l'application (pas de vues Blade pour les pages) : `routes/web.php` ne contient qu'une seule route qui renvoie un simple JSON de statut (`{"app": "...", "status": "ok"}`). C'est une API pure.
- Le frontend est une application 100% côté client : toutes les pages sont des composants React, le routage se fait dans le navigateur via `react-router-dom` (pas de rendu serveur).
- La communication entre les deux se fait uniquement en HTTP/JSON via l'API REST, sécurisée par un jeton Bearer (Sanctum), **pas par cookies/sessions** — c'est un choix explicite (voir section 8).
- Les deux projets peuvent tourner sur des ports/domaines différents grâce à une configuration CORS dédiée (`backend/config/cors.php`), pilotée par la variable d'environnement `FRONTEND_URL`.

## 5. Création et configuration du projet

**Objectif** : partir d'un projet dans un état incohérent (base incomplète) et obtenir une stack fonctionnelle Laravel + React connectée.

**Ce qui a été fait** :
- Le dossier frontend d'origine (`frondend/`) contenait en réalité un projet Node/Express/Mongoose (donc pas du tout React) — il a été supprimé et reconstruit de zéro en tant que `frontend/`, un vrai projet React + Vite.
- Le fichier `.env` du backend était incomplet ; il a été complété avec les bonnes valeurs (connexion MySQL, nom de l'app, etc.), et un `backend/.env.example` a été rédigé comme modèle de référence pour un déploiement (`APP_ENV=production`, `APP_DEBUG=false`, config mail Resend, `FRONTEND_URL`/`SANCTUM_STATEFUL_DOMAINS`).
- Un `frontend/.env.example` a été créé (`VITE_API_URL=...`) et le `.gitignore` du frontend corrigé : il ne protégeait pas réellement le fichier `.env` (seul `*.local` était exclu), ce qui a été corrigé pour exclure `.env` et `.env.*` tout en gardant `.env.example` suivi par Git.
- Un dossier `backend/.git` résiduel a été découvert : il pointait encore vers le dépôt GitHub original `laravel/laravel` (squelette officiel), pas vers le projet de l'utilisateur. Il a été supprimé et un `git init` propre a été fait à la racine du projet.
- Un dossier `frontend/vendor/` de 16 Mo (dépendances PHP) a été trouvé par erreur à l'intérieur du projet React et supprimé (rien n'y faisait référence).

**Technologies / outils utilisés** : Laravel 12, Vite, Git.

**Explication technique** : un projet Laravel a besoin d'une clé d'application (`APP_KEY`), d'une connexion base de données valide, et (ici) d'une configuration CORS pour accepter les requêtes d'un frontend hébergé ailleurs. Un projet Vite/React a besoin d'un point d'entrée (`index.html` → `src/main.jsx`) et d'une variable d'environnement indiquant l'URL de l'API (`VITE_API_URL`).

**Résultat obtenu** : un environnement de développement propre avec `php artisan serve` (backend, port 8000) et `npm run dev` (frontend, port 5173) capables de communiquer.

**Tests réalisés** : vérification manuelle répétée via `curl` sur les endpoints API et démarrage des deux serveurs après chaque changement de configuration.

**Problèmes rencontrés et solutions** :
| Problème | Cause | Solution |
|---|---|---|
| Réponses API corrompues (JSON invalide) | BOM UTF-8 en tête de `routes/api.php` et `bootstrap/app.php` | BOM supprimé par script |
| Dossier `frontend/` en fait un projet Node/Express | Mauvais dossier initial (`frondend/`) | Suppression et reconstruction propre en React + Vite |
| `backend/.git` pointait vers le dépôt officiel Laravel | Résidu de l'installation initiale du squelette Laravel | Suppression et `git init` propre à la racine |

## 6. Base de données et migrations

**Objectif** : modéliser les entités nécessaires (utilisateurs, catégories, voitures, réservations, paiements, avis, messages).

**Ce qui a été fait** : 10 fichiers de migration existent dans `backend/database/migrations/`, exécutés dans cet ordre chronologique :

| Migration | Table créée | Colonnes clés |
|---|---|---|
| `2026_07_23_194840_create_users_table.php` | `users` | `name`, `email` (unique), `password`, `role` (enum `admin`/`client`, défaut `client`), `telephone`, `adresse`, `numero_permis` |
| `2026_07_23_194850_create_categories_table.php` | `categories` | `nom`, `description` |
| `2026_07_23_194851_create_cars_table.php` | `cars` | `category_id` (FK nullable, `set null` à la suppression), `marque`, `modele`, `immatriculation` (unique), `prix_jour` (decimal 8,2), `statut` (enum `disponible`/`loue`/`maintenance`), `image` |
| `2026_07_23_194851_create_reservations_table.php` | `reservations` | `user_id` (FK cascade), `car_id` (FK cascade), `date_debut`, `date_fin`, `statut` (enum 5 valeurs), `prix_total` |
| `2026_07_23_194852_create_car_images_table.php` | `car_images` | `car_id` (FK cascade), `image_path` |
| `2026_07_23_194852_create_payments_table.php` | `payments` | `reservation_id` (FK cascade), `montant`, `methode` (enum `carte`/`especes`/`virement`), `statut` (enum 4 valeurs) |
| `2026_07_23_194853_create_reviews_table.php` | `reviews` | `user_id` (FK cascade), `car_id` (FK cascade), `note` (tinyint 1-5), `commentaire` |
| `2026_07_24_192002_create_personal_access_tokens_table.php` | `personal_access_tokens` | Table standard Sanctum : `tokenable` (morph), `token` (unique), `abilities`, `expires_at` |
| `2026_07_29_190216_add_contact_fields_to_reservations_table.php` | modifie `reservations` | ajoute `nom`, `prenom`, `telephone` |
| `2026_08_01_201628_create_messages_table.php` | `messages` | `user_id` (client propriétaire du fil), `sender_id` (auteur réel, client ou admin), `body`, `read_at`, index composé `[user_id, created_at]` |

**Technologies / outils utilisés** : Laravel Migrations, MySQL.

**Explication technique** : chaque migration décrit la structure d'une table sous forme de code PHP (versionné dans Git), ce qui permet de recréer la base identique sur n'importe quelle machine avec `php artisan migrate`. Les clés étrangères en cascade (`onDelete('cascade')`) garantissent que la suppression d'un utilisateur ou d'une voiture supprime automatiquement ses réservations/avis liés, évitant les données orphelines.

**Résultat obtenu** : une base MySQL structurée avec 9 tables métier + la table technique Sanctum.

**Tests réalisés** : vérification directe via phpMyAdmin (XAMPP) après chaque `php artisan migrate`.

**Problèmes rencontrés et solutions** : la table `reservations` ne contenait au départ que les infos de réservation ; une migration ultérieure a dû ajouter `nom`/`prenom`/`telephone` pour permettre au formulaire de réservation de capturer les coordonnées du locataire sans dépendre uniquement des données du compte utilisateur.

## 7. Backend / API

**Objectif** : exposer toutes les fonctionnalités via une API REST cohérente et sécurisée.

**Ce qui a été fait** — routes réellement définies dans `backend/routes/api.php` :

**Routes publiques (aucune authentification requise)** :
| Méthode | URL | Contrôleur |
|---|---|---|
| POST | `/api/register` | `AuthController@register` |
| POST | `/api/login` | `AuthController@login` |
| GET | `/api/categories` | `CategoryController@index` |
| GET | `/api/categories/{id}` | `CategoryController@show` |
| GET | `/api/cars` | `CarController@index` |
| GET | `/api/cars/{id}` | `CarController@show` |
| GET | `/api/cars/{id}/reviews` | `ReviewController@index` |

**Routes protégées (`auth:sanctum`, utilisateur connecté requis)** :
| Méthode | URL | Contrôleur |
|---|---|---|
| POST | `/api/logout` | `AuthController@logout` |
| GET | `/api/me` | `AuthController@me` |
| GET / POST / PUT | `/api/reservations[...]` | `ReservationController` |
| GET / POST | `/api/payments[...]` | `PaymentController` |
| POST / PUT / DELETE | `/api/cars/{id}/reviews`, `/api/reviews/{id}` | `ReviewController` |
| GET / POST | `/api/conversation` | `MessageController@show` / `@store` |

**Routes protégées admin (`auth:sanctum` + `admin`)** :
| Méthode | URL | Contrôleur |
|---|---|---|
| POST/PUT/DELETE | `/api/categories[...]` | `CategoryController` |
| POST/PUT/DELETE | `/api/cars[...]` | `CarController` |
| DELETE | `/api/reservations/{id}` | `ReservationController@destroy` |
| PUT | `/api/payments/{id}` | `PaymentController@update` |
| GET | `/api/admin/stats` | `AdminStatsController@index` |
| GET/POST | `/api/admin/conversations[...]` | `MessageController@adminIndex/@adminShow/@adminStore` |

**Technologies / outils utilisés** : Laravel Router, Form Requests/validation intégrée, Eloquent ORM.

**Explication technique** : chaque contrôleur valide les données entrantes avec la méthode `validate()` de Laravel (retourne automatiquement une erreur 422 si les règles ne sont pas respectées), interagit avec la base via les modèles Eloquent, et retourne une réponse JSON. Les routes admin sont protégées par un double filtre : d'abord `auth:sanctum` (l'utilisateur doit être connecté), puis `admin` (middleware personnalisé, voir section 8).

**Résultat obtenu** : une API complète couvrant l'authentification, le catalogue, les réservations, les paiements, les avis et la messagerie.

**Tests réalisés** : appels manuels via `curl` sur chaque route après implémentation, vérification des codes HTTP (200/201/401/403/422).

**Problèmes rencontrés et solutions** : voir section 20 (bug de la boucle de notification, erreur BOM UTF-8).

## 8. Authentification et autorisation

**Objectif** : permettre l'inscription/connexion des utilisateurs et distinguer les droits client/admin.

**Ce qui a été fait** :
- `AuthController::register()` (`app/Http/Controllers/AuthController.php`) : valide nom/email/mot de passe, crée un `User` avec `role` forcé à `client`, hache le mot de passe (`Hash::make`), retourne l'utilisateur et un jeton.
- `AuthController::login()` : vérifie l'email/mot de passe (`Hash::check`), retourne 401 si incorrect, sinon retourne l'utilisateur et un nouveau jeton.
- `AuthController::logout()` : supprime le jeton d'accès courant (`$request->user()->currentAccessToken()->delete()`).
- `AuthController::me()` : retourne l'utilisateur connecté (utilisé au chargement de l'app pour restaurer la session).
- Middleware personnalisé `app/Http/Middleware/EnsureUserIsAdmin.php` : bloque (403) toute requête si `$request->user()->role !== 'admin'`. Enregistré sous l'alias `admin` dans `bootstrap/app.php`.

**Technologies / outils utilisés** : Laravel Sanctum (jetons d'API "Personal Access Tokens", **pas** l'authentification SPA par cookies).

**Explication technique** : à la connexion, le serveur génère un jeton texte unique (`createToken('auth_token')->plainTextToken`) stocké dans la table `personal_access_tokens`. Le frontend garde ce jeton dans le `localStorage` du navigateur et l'envoie dans l'en-tête `Authorization: Bearer <token>` à chaque requête (voir section 16). C'est un choix technique important et volontaire : au tout début du projet, une configuration Sanctum "stateful" (basée sur cookies/sessions) avait été activée par erreur, provoquant une erreur `no such table: sessions` — elle a été retirée pour repartir sur une authentification par jeton, plus simple à faire fonctionner entre deux domaines séparés (voir section 20).
- **Non trouvé** : aucune classe `Policy` Laravel (`app/Policies/` n'existe pas). Les autorisations fines (ex : "un client ne peut voir que ses propres réservations") sont codées "à la main" dans chaque contrôleur via une méthode privée `authorizeAccess()` qui compare `role` et `user_id`.

**Résultat obtenu** : inscription, connexion, déconnexion fonctionnelles ; séparation stricte des routes admin/client.

**Tests réalisés** : test manuel des 401 (non connecté), 403 (connecté mais pas admin) sur les routes protégées.

**Problèmes rencontrés et solutions** : voir "erreur `statefulApi`" en section 20.

## 9. Gestion des utilisateurs

**Objectif** : permettre à chaque utilisateur de gérer son profil et à l'admin de distinguer les rôles.

**Ce qui a été fait** : le modèle `app/Models/User.php` (champs `name, email, password, role, telephone, adresse, numero_permis`) est utilisé côté frontend dans `src/pages/Dashboard.jsx`, qui affiche les informations du profil connecté, un badge de rôle, et les 5 dernières réservations de l'utilisateur.

**Technologies / outils utilisés** : Eloquent (`User` implémente `HasApiTokens, Notifiable`), React (`AuthContext`).

**Explication technique** : le `role` (`admin` ou `client`) défini en base pilote tout l'accès : c'est ce champ que lit `EnsureUserIsAdmin` côté backend et `AdminRoute`/`ProtectedRoute` côté frontend pour autoriser ou rediriger.

**Résultat obtenu** : chaque utilisateur voit un espace "Mon compte" avec ses informations et un accès direct à ses réservations.

**Tests réalisés** : connexion avec un compte client et un compte admin pour vérifier que l'interface et les routes disponibles diffèrent bien.

**Problèmes rencontrés et solutions** : aucun problème spécifique documenté sur cette partie.

## 10. Gestion des voitures

**Objectif** : constituer un catalogue de voitures consultable publiquement et administrable.

**Ce qui a été fait** :
- `app/Models/Car.php` : relations `category()` (belongsTo), `reservations()`, `images()` (galerie via `CarImage`), `reviews()`.
- `CarController` (`app/Http/Controllers/CarController.php`) : `index` (liste filtrable par `category_id`/`statut`), `show` (fiche détaillée avec catégorie, images, avis), `store`/`update` (validation : marque/modèle requis, `immatriculation` unique, `prix_jour` numérique, `statut` limité à `disponible|loue|maintenance`), `destroy`.
- Frontend : `Cars.jsx` (catalogue public filtrable), `CarDetail.jsx` (fiche voiture + formulaire de réservation intégré), `admin/AdminCars.jsx` (tableau admin) et `admin/AdminCarForm.jsx` (création/édition, avec champ URL d'image principale + zone multi-lignes d'URLs pour la galerie à la création).
- **Catalogue réel en base** (via `database/seeders/CarCategorySeeder.php`) : Renault Clio, Peugeot 208, Volkswagen Golf 8, Dacia Logan, Dacia Duster, Volkswagen T-Roc, Mercedes-Benz Classe A. La composition du catalogue a évolué en cours de projet (remplacements de véhicules effectués directement en base via l'API admin, puis répercutés dans le seeder pour rester cohérent) : par exemple la Peugeot Passat a été remplacée par la Golf 8, la RAV4 par le T-Roc, la Skoda par la Logan, et le Renault Kangoo par la Mercedes Classe A.
- **Photos réelles** : chaque voiture pointe vers une image hébergée sur Wikimedia Commons (`Special:FilePath`), pas une image générique. Chaque photo a été recherchée, vérifiée par requête HTTP (code 200 + type `image/*`) puis inspectée visuellement avant d'être intégrée, afin de garantir des visuels réels et correctement licenciés.

**Technologies / outils utilisés** : Eloquent, validation Laravel, React, Wikimedia Commons (source d'images).

**Explication technique** : le champ `statut` d'une voiture (`disponible`/`loue`/`maintenance`) est utilisé à deux endroits critiques : l'affichage (badge coloré) et le blocage métier — une voiture en `maintenance` ne peut pas être réservée (vérifié côté serveur dans `ReservationController::store`).

**Résultat obtenu** : un catalogue public consultable et filtrable, entièrement administrable sans toucher au code (formulaire admin).

**Tests réalisés** : vérification de chaque image par `curl` (code HTTP), test manuel de création/modification/suppression via l'interface admin, vérification qu'aucune réservation ne bloque la suppression avant de retirer un véhicule.

**Problèmes rencontrés et solutions** : aucun problème technique majeur ; le principal point de vigilance a été de toujours vérifier l'absence de réservations liées avant de supprimer un véhicule remplacé (contrainte de clé étrangère en cascade).

## 11. Gestion des catégories

**Objectif** : classer les voitures par type (Citadine, Berline, SUV, Utilitaire).

**Ce qui a été fait** : `app/Models/Category.php` (champs `nom`, `description`, relation `cars()`), `CategoryController` (CRUD complet), pages frontend `Cars.jsx` (filtre par catégorie), `admin/AdminCategories.jsx` et `admin/AdminCategoryForm.jsx`.

**Technologies / outils utilisés** : Eloquent, validation Laravel, React.

**Explication technique** : la relation `category_id` sur `cars` est une clé étrangère **nullable** avec `onDelete('set null')` — supprimer une catégorie ne supprime donc pas les voitures associées, elle les laisse simplement sans catégorie.

**Résultat obtenu** : un filtrage du catalogue par catégorie côté public, et une gestion simple des catégories côté admin.

**Tests réalisés** : création/suppression manuelle de catégories en vérifiant l'effet sur les voitures liées.

**Problèmes rencontrés et solutions** : aucun problème documenté.

## 12. Gestion des réservations

**Objectif** : permettre à un client de réserver une voiture sur une période, en évitant les doubles réservations.

**Ce qui a été fait** — `app/Http/Controllers/ReservationController.php` :
- `store()` : valide `car_id`, `nom`, `prenom`, `telephone`, `date_debut` (doit être aujourd'hui ou après), `date_fin` (doit être après `date_debut`). Refuse si la voiture est en maintenance, ou si une méthode privée `hasOverlap()` détecte un chevauchement de dates sur la même voiture (hors réservations annulées). Calcule automatiquement `prix_total = nombre_de_jours × prix_jour` et crée la réservation avec le statut initial `en_attente`. Déclenche ensuite l'envoi d'un email aux administrateurs (voir section 14).
- `update()` : un client ne peut qu'annuler sa propre réservation (et seulement si elle n'est pas déjà `terminee`/`annulee`) ; un admin peut changer librement le statut vers n'importe laquelle des 5 valeurs (`en_attente`, `confirmee`, `en_cours`, `terminee`, `annulee`).
- `destroy()` : suppression définitive, réservée aux admins.
- Frontend : `src/components/ReservationForm.jsx` (formulaire intégré à la fiche voiture) et `src/pages/Reservations.jsx` (liste — vue "mes réservations" pour un client, vue globale avec changement de statut pour un admin).

**Technologies / outils utilisés** : Eloquent, validation Laravel (`after_or_equal:today`, `after:date_debut`), React (formulaire contrôlé avec `useState`).

**Explication technique** — logique anti-chevauchement (`hasOverlap`) :
```php
Reservation::where('car_id', $carId)
    ->where('statut', '!=', 'annulee')
    ->where('date_debut', '<=', $fin)
    ->where('date_fin', '>=', $debut)
    ->exists();
```
Cette requête vérifie s'il existe déjà une réservation active dont la période chevauche celle demandée — c'est une validation **côté serveur uniquement** : côté frontend, le formulaire ne fait qu'un calcul d'estimation de prix et une contrainte native sur la date minimale du champ, sans vérifier lui-même les disponibilités déjà prises (c'est volontairement le serveur qui a le dernier mot, pour éviter toute incohérence si deux clients réservent en même temps).

**Résultat obtenu** : un système de réservation fiable, avec calcul automatique du prix et impossibilité de double-réservation sur une même voiture/période.

**Tests réalisés** : tentative de réservation sur des dates déjà prises pour vérifier le rejet (422), test du cycle complet de statuts côté admin, test d'annulation côté client.

**Problèmes rencontrés et solutions** : aucun bug majeur rencontré sur cette logique ; le principal ajustement a été l'ajout ultérieur des champs `nom`/`prenom`/`telephone` sur la table `reservations` (migration dédiée) pour ne pas dépendre uniquement du compte utilisateur connecté.

## 13. Gestion du compte administrateur

**Objectif** : donner à l'administrateur une vue d'ensemble et les outils de pilotage de la plateforme.

**Ce qui a été fait** :
- `app/Http/Controllers/AdminStatsController.php` (`GET /api/admin/stats`) : retourne le nombre total de réservations, le revenu total (somme des paiements au statut `paye`), la répartition des voitures par statut, le nombre de clients, une série des réservations sur 14 jours, une série des revenus sur 14 jours, les 5 dernières réservations et les 5 derniers véhicules ajoutés.
- Frontend `src/pages/admin/AdminDashboard.jsx` : affiche 4 cartes de statistiques (`StatCard.jsx`), deux graphiques en courbes construits en SVG pur (`components/admin/LineChart.jsx`, sans librairie externe), un graphique en barres de disponibilité du parc (`StatusBarChart.jsx`), un tableau des dernières réservations et une grille des derniers véhicules.
- `src/components/admin/AdminSidebar.jsx` : navigation latérale admin (Tableau de bord, Voitures, Catégories, Réservations, Messages), bouton de thème, déconnexion.
- Protection d'accès : composant `src/components/AdminRoute.jsx`, qui redirige vers `/login` si non connecté, ou vers `/cars` si connecté mais `role !== 'admin'`.

**Technologies / outils utilisés** : Eloquent (agrégations SQL via `selectRaw`, `Carbon` pour les dates), React, SVG fait main.

**Explication technique** : les graphiques ne dépendent d'aucune bibliothèque tierce — ce sont des composants React qui calculent eux-mêmes les coordonnées SVG (courbes, axes, infobulles au survol) à partir des données JSON renvoyées par `/api/admin/stats`.

**Résultat obtenu** : un tableau de bord complet permettant de visualiser l'activité (réservations, revenus, occupation du parc) sans avoir à consulter directement la base de données.

**Tests réalisés** : vérification visuelle du dashboard après création de réservations/paiements de test, vérification que les routes `/admin/*` sont bien inaccessibles à un compte client.

**Problèmes rencontrés et solutions** : aucun problème technique majeur documenté sur cette partie.

## 14. Notifications / emails

**Objectif** : avertir automatiquement les administrateurs à chaque nouvelle réservation.

**Ce qui a été fait** :
- `app/Mail/NewReservationAdminMail.php` (Mailable Laravel) : sujet `"Nouvelle réservation : {marque} {modele}"`, contenu basé sur la vue Markdown `resources/views/emails/new-reservation.blade.php` (affiche client, contact, voiture, dates, prix total, statut, et un bouton vers `{FRONTEND_URL}/reservations`).
- Méthode privée `ReservationController::notifyAdmins()` : récupère tous les emails des utilisateurs `role = admin`, y ajoute les adresses supplémentaires définies dans la variable d'environnement `ADMIN_NOTIFICATION_EMAIL` (séparées par des virgules), déduplique, puis envoie un email à chaque destinataire **dans une boucle avec un `try/catch` individuel par envoi** — un échec sur une adresse n'empêche pas l'envoi aux autres.
- Fournisseur d'envoi : **Resend** (`MAIL_MAILER=resend`, clé `RESEND_API_KEY`), choisi après abandon d'une première approche par WhatsApp (via l'API tierce CallMeBot), jugée peu fiable (contact injoignable, numéros contradictoires trouvés lors des recherches).

**Technologies / outils utilisés** : Laravel Mail, Resend API, vue Markdown Laravel (`x-mail::message`).

**Explication technique** :
```php
foreach ($emails as $email) {
    try {
        Mail::to($email)->send(new NewReservationAdminMail($reservation));
    } catch (\Throwable $e) {
        Log::warning("Échec de la notification email admin ({$email}): ".$e->getMessage());
    }
}
```
Ce découpage try/catch par destinataire a été ajouté après un bug réel (voir section 20) où une seule adresse invalide bloquait l'envoi à tous les autres destinataires.

**Résultat obtenu** : à chaque nouvelle réservation créée, tous les administrateurs (+ adresses configurées) reçoivent un email automatique avec le détail de la demande.

**Tests réalisés** : création de réservations de test suivies de la vérification de réception de l'email ; test volontaire avec une adresse invalide dans la liste pour confirmer que les autres emails partent quand même.

**Problèmes rencontrés et solutions** :
| Problème | Cause | Solution |
|---|---|---|
| Notifications WhatsApp non fiables | API tierce CallMeBot (contact injoignable, infos contradictoires) | Abandon au profit d'un envoi par email via Resend |
| Un email invalide bloquait tous les envois | Boucle d'envoi sans gestion d'erreur individuelle | Ajout d'un `try/catch` par destinataire + log des échecs |
| Le compte Resend en mode "sandbox" ne pouvait envoyer qu'à sa propre adresse d'inscription | `onboarding@resend.dev` en tant qu'expéditeur, sans domaine personnalisé vérifié | Documenté comme limitation connue (nécessite un domaine vérifié pour lever la restriction) |

## 15. Frontend

**Objectif** : offrir une interface fluide en Single Page Application, sans rechargement de page.

**Ce qui a été fait** — structure réelle de `frontend/src/` :

- `main.jsx` : monte `<App />` dans `<StrictMode>` + `<BrowserRouter>`.
- `App.jsx` : englobe l'app dans `AuthProvider` puis `ThemeProvider`, définit l'arbre de routes (voir tableau ci-dessous).
- `context/AuthContext.jsx` : expose `user`, `loading`, `login()`, `register()`, `logout()`. Le jeton est stocké dans `localStorage` sous la clé `auth_token`. Au chargement de l'app, si un jeton existe, un appel à `GET /me` restaure automatiquement l'utilisateur connecté.
- `context/ThemeContext.jsx` : gère le mode sombre (voir section 17).
- `api/client.js` : instance Axios centralisée (voir section 16).
- `lib/statuts.js` : dictionnaires de libellés/couleurs pour les statuts de voitures et de réservations (utilisés par le composant `Badge`).
- `layouts/PublicLayout.jsx` (Nav + `<Outlet/>`) et `layouts/AdminLayout.jsx` (sidebar + `<Outlet/>`, gère aussi le menu mobile).
- `components/ProtectedRoute.jsx` et `components/AdminRoute.jsx` : gardes de route (redirection si non connecté / non admin).

**Table de routage réel** (`App.jsx`) :
| Route | Page | Protection |
|---|---|---|
| `/login` | `Login` | Aucune (page autonome, sans Nav) |
| `/` | redirige vers `/cars` | — |
| `/cars` | `Cars` | Aucune |
| `/cars/:id` | `CarDetail` | Aucune |
| `/register` | `Register` | Aucune |
| `/dashboard` | `Dashboard` | `ProtectedRoute` |
| `/reservations` | `Reservations` | `ProtectedRoute` |
| `/chat` | `Chat` | `ProtectedRoute` |
| `/admin/dashboard` | `AdminDashboard` | `AdminRoute` |
| `/admin/cars`, `/admin/cars/new`, `/admin/cars/:id/edit` | `AdminCars`, `AdminCarForm` | `AdminRoute` |
| `/admin/categories`, `/admin/categories/new`, `/admin/categories/:id/edit` | `AdminCategories`, `AdminCategoryForm` | `AdminRoute` |
| `/admin/chat` | `AdminChat` | `AdminRoute` |

**Technologies / outils utilisés** : React 19, React Router 7, Context API (pas de Redux/Zustand), Axios.

**Explication technique** : `ProtectedRoute` vérifie simplement `if (!user) return <Navigate to="/login" />`, et `AdminRoute` ajoute une vérification `user.role !== 'admin'`. C'est une protection **côté affichage seulement** — la vraie sécurité est imposée par le backend (chaque route sensible est aussi protégée côté serveur), le frontend ne fait qu'éviter d'afficher une interface inutile à un utilisateur non autorisé.

**Résultat obtenu** : une navigation fluide sans rechargement, avec un état de connexion persistant entre les rafraîchissements de page (grâce au jeton en `localStorage`).

**Tests réalisés** : navigation manuelle testée dans le navigateur, y compris vérification via Playwright sur certaines pages (connexion, chat) pour valider visuellement le rendu.

**Problèmes rencontrés et solutions** : voir "dossier `frondend/`" en section 5 et section 20.

## 16. Communication entre frontend et backend

**Objectif** : permettre au frontend d'appeler l'API de façon sécurisée et configurable selon l'environnement.

**Ce qui a été fait** — `frontend/src/api/client.js` :
```js
const baseURL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const api = axios.create({ baseURL: `${baseURL}/api`, headers: { Accept: "application/json" } });
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```
Toutes les pages importent directement cette instance unique (`api`) pour leurs appels — il n'y a pas de fichier séparé par fonctionnalité (pas de `carsApi.js`, `authApi.js`, etc.).

**Technologies / outils utilisés** : Axios (intercepteur de requête), Laravel Sanctum (jetons), Laravel CORS (`config/cors.php`).

**Explication technique** : l'URL de base de l'API est définie par la variable `VITE_API_URL` (donc configurable sans toucher au code selon l'environnement — local ou production). Le jeton d'authentification est automatiquement injecté dans chaque requête via l'intercepteur, ce qui évite de le répéter manuellement à chaque appel. Côté backend, `config/cors.php` autorise les requêtes venant du domaine défini dans `FRONTEND_URL` (plus, en local uniquement, n'importe quel port `localhost`/`127.0.0.1`, pour tolérer les changements de port de Vite en développement).

**Non trouvé** : il n'existe **aucun intercepteur de réponse** — pas de gestion globale automatique des erreurs 401 (pas de redirection/déconnexion automatique en cas de jeton expiré). Chaque page gère ses erreurs individuellement via `try/catch` et affiche `err.response?.data?.message`.

**Résultat obtenu** : une communication fonctionnelle et sécurisée entre les deux applications, même hébergées sur des domaines différents.

**Tests réalisés** : vérification manuelle des en-têtes de requêtes (présence du `Authorization: Bearer ...`), test de blocage CORS puis correction via `FRONTEND_URL`.

**Problèmes rencontrés et solutions** : voir "erreur `statefulApi`" en section 20 (le projet est passé d'une tentative d'auth par cookies à l'auth par jeton, plus simple à faire fonctionner entre deux domaines distincts).

## 17. Design et interface utilisateur

**Objectif** : offrir une interface moderne, cohérente, professionnelle, avec un mode sombre.

**Ce qui a été fait** :
- **Tailwind CSS v4**, configuré uniquement en CSS (pas de `tailwind.config.js` — Tailwind v4 fonctionne par import direct) : `frontend/src/index.css` contient `@import "tailwindcss";` et `@custom-variant dark (&:where(.dark, .dark *));`.
- **Mode sombre** : géré par `ThemeContext.jsx`, qui ajoute/retire la classe `dark` sur `<html>` et mémorise le choix dans `localStorage` (avec détection de la préférence système `prefers-color-scheme` par défaut). Le mode sombre est bien implémenté et actif sur l'espace admin, la barre de navigation et les composants UI partagés (`Card`, `Button`, `Field`, `Badge`), mais **certaines pages publiques n'ont pas de classes `dark:` propres** (`Login`, `Register`, `Dashboard`, `CarDetail`, `Reservations`, `Chat`, `ReservationForm`) — elles héritent partiellement du mode sombre via les composants partagés, mais leurs textes/fonds spécifiques restent en clair. Cette extension complète au site public reste **en attente**.
- **Palette de couleurs** : après plusieurs itérations en cours de projet (bleu simple → bleu profond + ambre → violet + ambre + gris pierre), la palette actuelle est **bleu marine (`blue-900`/`blue-950`) + gris ardoise (`slate`) + accent ambre (`amber-500`)**, choisie pour son rendu "corporate" sérieux. Les fonds blancs purs ont également été remplacés par un gris-bleu très clair (`slate-50`) pour un rendu plus doux et cohérent avec le reste de la palette.
- **Composants UI réutilisables** (`src/components/ui/`) : `Button`/`LinkButton` (variantes `primary`, `secondary`, `accent`, `danger`, `ghost`), `Card`, `Field`/`Input`/`Select`/`Textarea`, `Badge` (couleurs `gray`, `green`, `amber`, `red`, `blue`, `indigo`), `PageContainer`.
- **Icônes** : `lucide-react`.
- **Nom et image de marque** : rebranding du site en "Mounfact Car".

**Technologies / outils utilisés** : Tailwind CSS v4, `lucide-react`, SVG fait main pour les graphiques admin.

**Explication technique** : Tailwind v4 introduit `@custom-variant` pour définir soi-même la condition d'activation du préfixe `dark:` — ici, "dès qu'un ancêtre (ou l'élément) porte la classe `.dark`". C'est ce mécanisme, combiné au `classList.toggle("dark", ...)` du `ThemeContext`, qui active/désactive le thème sombre instantanément sans recharger la page.

**Résultat obtenu** : une interface visuellement cohérente, avec un thème clair/sombre partiellement disponible, et un jeu de couleurs professionnel appliqué de façon uniforme sur les composants partagés.

**Tests réalisés** : vérification visuelle via navigateur et Playwright après chaque changement de palette, `npm run build` systématique pour s'assurer de l'absence d'erreur de compilation CSS/JS après les remplacements de classes.

**Problèmes rencontrés et solutions** : aucun bug technique — le principal travail a été itératif (plusieurs changements de palette demandés et appliqués successivement).

## 18. Tests

**Objectif** : garantir que chaque fonctionnalité livrée fonctionne réellement.

**Ce qui a été fait / non trouvé** :
- **Non trouvé** : aucun test automatisé métier. Le dossier `backend/tests/` ne contient que les tests par défaut du squelette Laravel (`tests/Feature/ExampleTest.php` vérifie juste que `/` répond 200, `tests/Unit/ExampleTest.php` est un test trivial). Aucun test n'existe pour `AuthController`, `CarController`, `ReservationController`, le middleware `EnsureUserIsAdmin`, etc.
- **Non trouvé** côté frontend : aucun framework de test (pas de Jest/Vitest/Testing Library installé).
- **Ce qui a réellement servi de vérification tout au long du projet** : tests manuels systématiques via `curl` sur l'API après chaque modification backend, `npm run build` après chaque modification frontend pour détecter les erreurs de compilation, vérification de la disponibilité des deux serveurs de développement (`/up` côté backend, page d'accueil côté frontend), et vérifications visuelles ponctuelles dans un vrai navigateur via Playwright (page de connexion, chat).

**Technologies / outils utilisés** : PHPUnit (installé mais non exploité pour des tests métier), `curl`, Playwright (vérification manuelle ponctuelle, pas une suite de tests intégrée au projet).

**Résultat obtenu** : un fonctionnement validé manuellement à chaque étape, mais sans filet de sécurité automatisé (aucune garantie qu'une régression future soit détectée automatiquement).

**Recommandation pour la suite** (à mentionner honnêtement au jury si demandé) : ajouter des tests Feature Laravel sur au minimum l'authentification et la logique anti-chevauchement des réservations serait la priorité si le projet devait être industrialisé.

## 19. Déploiement / mise en ligne

**Objectif** : rendre l'application accessible en ligne, en conservant MySQL comme base de données.

**État réel actuel** : **le projet n'est pas encore déployé en production.** Il fonctionne actuellement en local via XAMPP (Apache/MySQL) avec phpMyAdmin pour la base de données. Deux tentatives d'hébergement ont été explorées puis explicitement abandonnées :

1. **Render** (tentative n°1) : configuration Docker créée (`Dockerfile`, `.dockerignore`, script de déploiement `00-laravel-deploy.sh`, `frontend/public/_redirects`), basée sur l'image `richarvey/nginx-php-fpm`. Plusieurs problèmes ont été résolus (voir section 20), notamment la découverte que la variable d'environnement `PHP_CATCHALL=1` était indispensable pour que Nginx redirige correctement les routes vers `index.php`. Render impose PostgreSQL en base gratuite standard, ce qui entrait en conflit avec l'exigence de garder MySQL — cette piste a finalement été **abandonnée sur demande explicite**, et toute la configuration Docker liée a été supprimée du projet.
2. **Railway** (tentative n°2) : approche sans Docker (détection automatique Laravel par Nixpacks), avec un plugin MySQL natif (variables `MYSQLHOST`, `MYSQLPORT`, etc.). Un échec de build est survenu (erreur SQLite au lieu de MySQL) — expliqué comme normal car Railway déclenche un premier build automatique dès la connexion du dépôt GitHub, avant que le service MySQL et ses variables d'environnement ne soient configurés. Cette piste a ensuite, elle aussi, été **abandonnée sur demande explicite**.

**Ce qui reste bien en place dans le projet, indépendamment de la plateforme choisie** : `routes/web.php` simplifié en réponse JSON (amélioration jugée pertinente indépendamment de l'hébergeur), les fichiers `.env.example` (backend et frontend) comme modèles de configuration de production, et un dépôt Git propre poussé sur `https://github.com/simoaitayad65-cell/car-rental.git` (branche `main`).

**Technologies / outils envisagés** : Docker (Render, retiré), Nixpacks (Railway, non poursuivi), Git/GitHub pour le déploiement continu.

**Problèmes rencontrés et solutions** : voir section 20 (détails complets des erreurs Render/Railway).

**Décision en attente** : le choix d'un nouvel hébergeur supportant nativement MySQL sans complexité Docker reste à faire (pistes possibles non encore tranchées : hébergement mutualisé classique type Hostinger/OVH avec déploiement manuel FTP, ou une autre plateforme PaaS supportant MySQL).

## 20. Problèmes rencontrés et solutions

Récapitulatif de tous les problèmes réels rencontrés pendant le développement :

| Problème | Cause | Solution appliquée |
|---|---|---|
| Réponses API en JSON invalide | BOM UTF-8 en tête de `routes/api.php` / `bootstrap/app.php` | BOM supprimé via script |
| Erreur `SQLSTATE... no such table: sessions` | Middleware `statefulApi()` ajouté par erreur (auth par cookies au lieu de jetons) | Retrait de `statefulApi()` de `bootstrap/app.php`, retour à l'auth par jeton Bearer |
| Erreurs liées aux tables `sessions`/`cache`/`jobs` absentes | `SESSION_DRIVER`/`CACHE_STORE`/`QUEUE_CONNECTION` réglés sur `database` sans migrations correspondantes | Passage à `file`/`file`/`sync` |
| Notifications WhatsApp non fiables | API tierce CallMeBot peu fiable (contact injoignable, infos contradictoires) | Abandon au profit de l'email (Resend) |
| Emails Resend limités à une seule adresse en mode test | Compte Resend en mode "sandbox" (`onboarding@resend.dev` sans domaine vérifié) | Documenté comme limitation connue ; nécessite un domaine personnalisé vérifié pour lever la restriction |
| Une seule adresse email invalide bloquait toutes les notifications | Boucle d'envoi sans gestion d'erreur individuelle | Chaque envoi encapsulé dans son propre `try/catch` avec log (`ReservationController::notifyAdmins`) |
| Dossier `frontend/` contenait un projet Node/Express (pas React) | Mauvais dossier de départ (`frondend/`) | Suppression et reconstruction propre en React + Vite |
| Render : "Dockerfile not found" | Le champ "Root Directory" du service Render n'était pas réglé sur `backend` | Correction dans le tableau de bord Render |
| Render : erreur 502 (`php-fpm.sock` connection refused) | Condition de course au démarrage (Nginx démarré avant que le socket PHP-FPM existe) | Résolu après redémarrage (problème transitoire) |
| Render : toutes les routes renvoyaient une 404 | Variable d'environnement `PHP_CATCHALL` manquante, empêchant Nginx de rediriger vers `index.php` | Ajout de `ENV PHP_CATCHALL 1` dans le `Dockerfile` |
| Render : `/` renvoyait une erreur 500 même après le correctif ci-dessus | La vue Blade par défaut (`welcome.blade.php`) échouait à s'afficher dans le conteneur | `routes/web.php` simplifié pour renvoyer une réponse JSON plutôt qu'une vue |
| Railway : échec de build (`SQLSTATE... no such table: cache`, base SQLite) | Railway déclenche un build automatique dès la connexion GitHub, avant configuration du service MySQL | Comportement normal expliqué ; n'a pas empêché la suite (le projet Railway a ensuite été abandonné pour d'autres raisons) |
| `backend/.git` pointait vers le dépôt officiel `laravel/laravel` | Résidu de l'installation initiale du squelette Laravel, jamais réinitialisé | Suppression et `git init` propre à la racine du projet |
| Dossier `frontend/vendor/` (16 Mo de dépendances PHP) présent par erreur | Résidu d'une mauvaise commande `composer require` lancée au mauvais endroit | Suppression après vérification qu'il n'était référencé nulle part |
| `.gitignore` frontend ne protégeait pas réellement `.env` | Seul le motif `*.local` était exclu, pas `.env` lui-même | Ajout explicite de `.env` / `.env.*` avec exception pour `.env.example` |

## 21. Résumé final du fonctionnement de l'application

1. Un visiteur arrive sur `/cars` (page par défaut) et consulte le catalogue de voitures, éventuellement filtré par catégorie — aucune connexion requise.
2. Il consulte une fiche voiture (`/cars/:id`) : détails, galerie photo, avis existants.
3. Pour réserver, il doit se connecter ou créer un compte (`/login`, `/register`) — un jeton Sanctum est alors stocké côté navigateur (`localStorage`) et envoyé à chaque requête suivante.
4. Sur la fiche voiture, il remplit le formulaire de réservation (dates, coordonnées) ; le serveur valide les dates, vérifie l'absence de chevauchement avec une réservation existante, calcule le prix total, puis crée la réservation au statut `en_attente`.
5. Automatiquement, un email est envoyé à tous les administrateurs pour les avertir de la nouvelle demande.
6. L'administrateur se connecte sur `/admin/dashboard`, consulte les statistiques, va sur `/reservations` pour changer le statut de la réservation (`confirmee`, `en_cours`, `terminee`...), et peut échanger des messages avec le client via `/admin/chat` (le client répond de son côté sur `/chat`, les deux pages se synchronisent par interrogation périodique de l'API toutes les 3 secondes).
7. Le client suit l'état de sa réservation sur `/reservations` et peut l'annuler tant qu'elle n'est pas terminée.
8. L'administrateur gère en parallèle le catalogue (voitures, catégories) via les pages `/admin/cars` et `/admin/categories`.

---

# Comment présenter le projet devant le professeur

Voici un script simple, découpé en blocs que tu peux dire presque tel quel à l'oral.

**1. Introduction du projet**
"J'ai développé Mounfact Car, une application de location de voitures. Elle est composée de deux parties séparées : un backend Laravel qui gère les données et la logique métier via une API, et un frontend React qui affiche l'interface utilisateur. Les deux communiquent uniquement en JSON via des requêtes HTTP."

**2. Pourquoi ces technologies**
"J'ai choisi Laravel côté backend parce que c'est un framework PHP mature qui offre nativement la gestion de base de données (migrations, ORM Eloquent), la validation, et un système d'authentification par jeton (Sanctum). Côté frontend, j'ai choisi React parce que c'est le standard actuel pour construire des interfaces réactives en Single Page Application, avec React Router pour la navigation sans rechargement de page. La base de données est MySQL, que j'ai choisi de conserver tout au long du projet, y compris pour l'hébergement."

**3. Comment fonctionne le backend**
"Le backend expose une API REST : chaque ressource (voitures, catégories, réservations, paiements, avis, messages) a ses propres routes, protégées différemment selon le besoin — certaines sont publiques, comme consulter le catalogue, d'autres nécessitent d'être connecté, et les routes d'administration nécessitent en plus le rôle admin, vérifié par un middleware personnalisé. Chaque contrôleur valide les données reçues avant de les enregistrer en base via Eloquent, l'ORM de Laravel."

**4. Comment fonctionne le frontend**
"Le frontend est une application React à page unique : toute la navigation se fait dans le navigateur sans recharger la page, grâce à React Router. J'utilise le Context API de React pour gérer l'état global — un contexte pour l'utilisateur connecté, un autre pour le thème clair/sombre. Chaque page appelle l'API via un client Axios centralisé qui ajoute automatiquement le jeton d'authentification à chaque requête."

**5. Comment fonctionne la base de données**
"La base contient neuf tables principales : utilisateurs, catégories, voitures, images de voitures, réservations, paiements, avis et messages, plus la table technique de Sanctum pour les jetons. Les relations sont gérées avec des clés étrangères — par exemple, si un utilisateur est supprimé, ses réservations le sont aussi automatiquement grâce à la suppression en cascade."

**6. Comment fonctionne une réservation**
"Quand un client réserve une voiture, il choisit une date de début et une date de fin. Le serveur vérifie deux choses avant de valider : que la voiture n'est pas en maintenance, et qu'aucune autre réservation active n'existe déjà sur cette période pour cette voiture — c'est une requête qui vérifie les chevauchements de dates. Si tout est valide, le prix total est calculé automatiquement à partir du nombre de jours et du prix journalier, et la réservation est créée avec le statut 'en attente'."

**7. Comment l'administrateur gère le système**
"L'administrateur a un espace dédié protégé par un contrôle de rôle. Il a accès à un tableau de bord avec des statistiques (nombre de réservations, revenus, disponibilité du parc automobile), il peut gérer le catalogue de voitures et de catégories, changer le statut des réservations, et répondre aux messages des clients depuis une messagerie interne."

**8. Comment les notifications sont envoyées**
"À chaque nouvelle réservation, le serveur envoie automatiquement un email à tous les administrateurs via l'API Resend. J'ai pris soin de gérer chaque envoi individuellement, pour qu'une adresse email invalide ne bloque pas l'envoi aux autres destinataires."

**9. Comment le projet a été déployé**
"Le projet tourne actuellement en local avec XAMPP et MySQL. J'ai testé deux pistes d'hébergement en ligne, Render puis Railway, mais je les ai abandonnées car je voulais absolument conserver MySQL sans complexité technique supplémentaire liée à Docker. Le choix définitif de l'hébergement reste à finaliser, mais toute la configuration nécessaire (variables d'environnement, CORS, fichiers d'exemple) est déjà prête dans le projet."

---

# Liste complète des fichiers importants du projet

## Backend (`backend/`)

| Fichier | Rôle |
|---|---|
| `routes/api.php` | Toutes les routes de l'API REST |
| `routes/web.php` | Route unique de statut JSON (`/`) |
| `bootstrap/app.php` | Configuration de l'application, enregistrement du middleware `admin` |
| `app/Models/User.php` | Modèle utilisateur (rôle admin/client, jetons Sanctum) |
| `app/Models/Car.php` | Modèle voiture |
| `app/Models/CarImage.php` | Images de galerie d'une voiture |
| `app/Models/Category.php` | Catégorie de voiture |
| `app/Models/Reservation.php` | Réservation |
| `app/Models/Payment.php` | Paiement lié à une réservation |
| `app/Models/Review.php` | Avis client sur une voiture |
| `app/Models/Message.php` | Message de la messagerie client/admin |
| `app/Http/Controllers/AuthController.php` | Inscription, connexion, déconnexion, profil |
| `app/Http/Controllers/CarController.php` | CRUD voitures |
| `app/Http/Controllers/CategoryController.php` | CRUD catégories |
| `app/Http/Controllers/ReservationController.php` | Création/gestion des réservations, anti-chevauchement, notifications |
| `app/Http/Controllers/PaymentController.php` | Gestion des paiements liés aux réservations |
| `app/Http/Controllers/ReviewController.php` | Avis clients (uniquement après réservation terminée) |
| `app/Http/Controllers/MessageController.php` | Messagerie client ↔ admin |
| `app/Http/Controllers/AdminStatsController.php` | Statistiques du tableau de bord admin |
| `app/Http/Middleware/EnsureUserIsAdmin.php` | Vérification du rôle admin |
| `app/Mail/NewReservationAdminMail.php` | Email envoyé aux admins à chaque réservation |
| `resources/views/emails/new-reservation.blade.php` | Contenu de l'email de notification |
| `database/migrations/*.php` | Structure des 9 tables métier + table Sanctum |
| `database/seeders/CarCategorySeeder.php` | Catalogue initial (catégories + voitures + photos) |
| `database/seeders/DatabaseSeeder.php` | Création d'un utilisateur de test |
| `config/cors.php` | Autorisation des origines frontend (CORS) |
| `config/mail.php` | Configuration Resend + adresse admin de notification |
| `.env.example` | Modèle de configuration d'environnement |
| `composer.json` | Dépendances PHP (Laravel, Sanctum, Resend) |

## Frontend (`frontend/`)

| Fichier | Rôle |
|---|---|
| `src/main.jsx` | Point d'entrée React |
| `src/App.jsx` | Arbre de routage complet de l'application |
| `src/context/AuthContext.jsx` | Gestion de l'utilisateur connecté et du jeton |
| `src/context/ThemeContext.jsx` | Gestion du mode clair/sombre |
| `src/api/client.js` | Client Axios centralisé (base URL + jeton automatique) |
| `src/lib/statuts.js` | Libellés et couleurs des statuts (voitures, réservations) |
| `src/layouts/PublicLayout.jsx` | Mise en page publique (Nav + contenu) |
| `src/layouts/AdminLayout.jsx` | Mise en page admin (sidebar + contenu) |
| `src/components/ProtectedRoute.jsx` | Garde de route : connexion requise |
| `src/components/AdminRoute.jsx` | Garde de route : rôle admin requis |
| `src/components/Nav.jsx` | Barre de navigation publique |
| `src/components/ReservationForm.jsx` | Formulaire de réservation (fiche voiture) |
| `src/components/admin/AdminSidebar.jsx` | Menu latéral admin |
| `src/components/admin/LineChart.jsx` | Graphique en courbes (SVG fait main) |
| `src/components/admin/StatCard.jsx` | Carte de statistique du dashboard |
| `src/components/admin/StatusBarChart.jsx` | Graphique de disponibilité du parc |
| `src/components/ui/Button.jsx`, `Card.jsx`, `Field.jsx`, `Badge.jsx`, `PageContainer.jsx` | Composants d'interface réutilisables |
| `src/pages/Cars.jsx` | Catalogue public |
| `src/pages/CarDetail.jsx` | Fiche voiture détaillée |
| `src/pages/Login.jsx` / `Register.jsx` | Connexion / inscription |
| `src/pages/Dashboard.jsx` | Espace "Mon compte" |
| `src/pages/Reservations.jsx` | Liste des réservations (client ou admin) |
| `src/pages/Chat.jsx` | Messagerie côté client |
| `src/pages/admin/AdminDashboard.jsx` | Tableau de bord admin |
| `src/pages/admin/AdminCars.jsx` / `AdminCarForm.jsx` | Gestion admin des voitures |
| `src/pages/admin/AdminCategories.jsx` / `AdminCategoryForm.jsx` | Gestion admin des catégories |
| `src/pages/admin/AdminChat.jsx` | Messagerie côté admin |
| `src/index.css` | Import Tailwind + configuration du mode sombre |
| `vite.config.js` | Configuration du build (plugins React + Tailwind) |
| `.env.example` | Modèle de configuration (`VITE_API_URL`) |
| `package.json` | Dépendances JavaScript |
