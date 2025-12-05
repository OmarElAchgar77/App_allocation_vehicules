<?php

namespace App\Http\Controllers;
use App\Models\Vehicle;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class VehicleController extends Controller
{
    protected function formatVehicle(Vehicle $vehicle) {
        $data = $vehicle->toArray();
        if ($vehicle->image) {
            $data['image'] = asset('storage/' . $vehicle->image); 
        }
        return $data;
    }
    
    public function index() {
        return response()->json(Vehicle::all()->map(function ($vehicle) {
            return $this->formatVehicle($vehicle);
        }));
    }

    public function show($id) {
        $vehicle = Vehicle::find($id);
        if(!$vehicle) return response()->json(['message' => 'Not found'], 404);
        return response()->json($this->formatVehicle($vehicle));
    }

    public function store(Request $request) {        
        $data = $request->all();

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('vehicles', 'public');
            $data['image'] = $path;
        }

        $vehicle = Vehicle::create($data);
        return response()->json($this->formatVehicle($vehicle), 201);
    }

    public function update(Request $request, $id) {
        $vehicle = Vehicle::find($id);
        if(!$vehicle) return response()->json(['message' => 'Not found'], 404);

        $request->validate([
            'brand'         => 'sometimes|required',
            'model'         => 'sometimes|required',
            'year'          => 'sometimes|required|integer',
            'price_per_day' => 'sometimes|required|numeric',
            'image'         => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', 
        ]);

        $data = $request->except(['_method']); 
        
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('vehicles', 'public');
            $data['image'] = $path; 
        }

        $vehicle->update($data);
        $vehicle->refresh(); 
        
        return response()->json($this->formatVehicle($vehicle));
    }
    
    public function destroy($id) {
        Vehicle::destroy($id);
        return response()->json(['message' => 'Deleted']);
    }
}