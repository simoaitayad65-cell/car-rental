<?php

namespace App\Http\Controllers;

use App\Models\Car;
use App\Models\Payment;
use App\Models\Reservation;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class AdminStatsController extends Controller
{
    public function index()
    {
        $rangeDays = 14;
        $since = Carbon::today()->subDays($rangeDays - 1);

        return response()->json([
            'totals' => $this->totals(),
            'reservations_by_day' => $this->reservationsByDay($since, $rangeDays),
            'revenue_by_day' => $this->revenueByDay($since, $rangeDays),
            'recent_reservations' => Reservation::with(['car', 'user'])
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(),
            'recent_cars' => Car::with('category')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get(),
        ]);
    }

    private function totals(): array
    {
        return [
            'reservations' => Reservation::count(),
            'revenue' => (float) Payment::where('statut', 'paye')->sum('montant'),
            'cars_total' => Car::count(),
            'cars_disponible' => Car::where('statut', 'disponible')->count(),
            'cars_loue' => Car::where('statut', 'loue')->count(),
            'cars_maintenance' => Car::where('statut', 'maintenance')->count(),
            'clients' => User::where('role', 'client')->count(),
        ];
    }

    private function reservationsByDay(Carbon $since, int $days): array
    {
        $rows = Reservation::selectRaw('DATE(created_at) as day, COUNT(*) as count')
            ->where('created_at', '>=', $since)
            ->groupBy('day')
            ->pluck('count', 'day');

        return $this->fillDays($since, $days, $rows);
    }

    private function revenueByDay(Carbon $since, int $days): array
    {
        $rows = Payment::selectRaw('DATE(payments.created_at) as day, SUM(payments.montant) as total')
            ->where('payments.statut', 'paye')
            ->where('payments.created_at', '>=', $since)
            ->groupBy('day')
            ->pluck('total', 'day');

        return $this->fillDays($since, $days, $rows, asFloat: true);
    }

    private function fillDays(Carbon $since, int $days, Collection $rows, bool $asFloat = false): array
    {
        $result = [];
        for ($i = 0; $i < $days; $i++) {
            $date = $since->copy()->addDays($i)->toDateString();
            $value = $rows[$date] ?? 0;
            $result[] = [
                'date' => $date,
                'value' => $asFloat ? (float) $value : (int) $value,
            ];
        }

        return $result;
    }
}
