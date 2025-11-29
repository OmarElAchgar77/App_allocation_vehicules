<?php

namespace App\Http\Controllers;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\Reservation;

class DashboardController extends Controller
{
    public function stats() {
        return response()->json([
            'total_users' => User::where('role', 'user')->count(),
            'total_vehicles' => Vehicle::count(),
            'active_reservations' => Reservation::where('status', 'approved')->count(),
            'pending_reservations' => Reservation::where('status', 'pending')->count(),
            'recent_reservations' => Reservation::with(['user', 'vehicle'])->latest()->take(5)->get()
        ]);
    }
}
