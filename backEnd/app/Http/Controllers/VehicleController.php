<?php

namespace App\Http\Controllers;
use App\Models\Vehicle;
use Illuminate\Http\Request;

class VehicleController extends Controller
{
    // Get all vehicles
    public function index() {
        return response()->json(Vehicle::all());
    }

    // Get one vehicle
    public function show($id) {
        $vehicle = Vehicle::find($id);
        if(!$vehicle) return response()->json(['message' => 'Not found'], 404);
        return response()->json($vehicle);
    }

    // Admin: Create Vehicle (with image)
    public function store(Request $request) {
        $request->validate([
            'brand' => 'required',
            'model' => 'required',
            'transmission' => 'required|string|in:Automatique,Manuelle,Semi-automatique', 
            'carburant' => 'required|string|in:Essence,Diesel,Électrique,Hybride',
            'year' => 'required|integer',
            'price_per_day' => 'required|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $data = $request->all();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('vehicles', 'public');
            $data['image'] = asset('storage/' . $path);
        }

        $vehicle = Vehicle::create($data);
        return response()->json($vehicle, 201);
    }

    // Admin: Update
    public function update(Request $request, $id) {
        $vehicle = Vehicle::find($id);
        if(!$vehicle) return response()->json(['message' => 'Not found'], 404);

        $request->validate([
            'transmission' => 'nullable|string|in:Automatique,Manuelle,Semi-automatique',
            'carburant' => 'nullable|string|in:Essence,Diesel,Électrique,Hybride',
            'year' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'price_per_day' => 'nullable|numeric',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $vehicle->update($request->all());
        return response()->json($vehicle);
    }

    // Admin: Delete
    public function destroy($id) {
        Vehicle::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
