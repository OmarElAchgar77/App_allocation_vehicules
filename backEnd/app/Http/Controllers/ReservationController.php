<?php

namespace App\Http\Controllers;
use App\Models\Reservation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReservationController extends Controller
{
    // User: create reservation
    public function store(Request $request) {
        $request->validate([
            'vehicle_id' => 'required|exists:vehicles,id',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after:start_date',
            'total_price' => 'required|numeric',
            'drivers_license' => 'required|file|mimes:pdf,jpg,png|max:2048'
        ]);

        $path = $request->file('drivers_license')->store('licenses', 'public');

        $reservation = Reservation::create([
            'user_id' => Auth::id(),
            'vehicle_id' => $request->vehicle_id,
            'start_date' => $request->start_date,
            'end_date' => $request->end_date,
            'total_price' => $request->total_price,
            'drivers_license' => asset('storage/' . $path),
            'status' => 'pending'
        ]);

        return response()->json($reservation, 201);
    }

    // User: view my reservations
    public function myReservations() {
        $reservations = Reservation::where('user_id', Auth::id())->with('vehicle')->get();
        return response()->json($reservations);
    }

    // Admin: view all reservations
    public function index() {
        return response()->json(Reservation::with(['user', 'vehicle'])->latest()->get());
    }

    // Admin: update status (approve/reject)
    public function updateStatus(Request $request, $id) {
        $request->validate(['status' => 'required|in:approved,rejected']);

        $reservation = Reservation::find($id);
        if(!$reservation) return response()->json(['message' => 'Not found'], 404);

        $reservation->status = $request->status;
        $reservation->save();

        return response()->json(['message' => 'Status updated', 'reservation' => $reservation]);
    }

    // User: Get details of a specific reservation
    public function show($id) {
        // On récupère la réservation avec les infos du véhicule associé
        $reservation = Reservation::with('vehicle')->find($id);

        // 1. Vérifier si elle existe
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        // 2. SÉCURITÉ : Vérifier que cette réservation appartient bien à l'utilisateur connecté
        if ($reservation->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        return response()->json($reservation);
    }

    // User: Cancel Reservation (Only if pending)
    public function destroy($id) {
        $reservation = Reservation::find($id);

        // Vérifier si la réservation existe
        if (!$reservation) {
            return response()->json(['message' => 'Reservation not found'], 404);
        }

        // Vérifier que c'est bien la réservation de l'utilisateur connecté
        if ($reservation->user_id !== Auth::id()) {
            return response()->json(['message' => 'Unauthorized access'], 403);
        }

        // Vérifier que le statut est bien 'pending'
        if ($reservation->status !== 'pending') {
            return response()->json(['message' => 'Cannot delete a reservation that is already processed'], 400);
        }

        // Si tout est bon, on supprime (avec cascade, le fichier image restera dans le storage mais l'entrée DB disparaît)
        $reservation->delete();

        return response()->json(['message' => 'Reservation cancelled successfully']);
    }
}
