<x-mail::message>
# Nouvelle réservation

Un client vient de réserver une voiture.

<x-mail::table>
| | |
|:---|:---|
| **Client** | {{ $reservation->user->name }} ({{ $reservation->user->email }}) |
| **Contact** | {{ $reservation->prenom }} {{ $reservation->nom }} — {{ $reservation->telephone }} |
| **Voiture** | {{ $reservation->car->marque }} {{ $reservation->car->modele }} |
| **Du** | {{ $reservation->date_debut }} |
| **Au** | {{ $reservation->date_fin }} |
| **Prix total** | {{ $reservation->prix_total }} € |
| **Statut** | {{ $reservation->statut }} |
</x-mail::table>

<x-mail::button :url="env('FRONTEND_URL', 'http://localhost:5173') . '/reservations'">
Voir les réservations
</x-mail::button>

Merci,<br>
{{ config('app.name') }}
</x-mail::message>
