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

        $vehicle->update($request->all());
        return response()->json($vehicle);
    }

    // Admin: Delete
    public function destroy($id) {
        Vehicle::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}
