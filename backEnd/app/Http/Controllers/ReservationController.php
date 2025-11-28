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
}
