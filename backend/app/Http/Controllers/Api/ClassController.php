<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\AcademicClass;

class ClassController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $classes = AcademicClass::all();
        return response()->json($classes);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:100',
            'numeric_value' => 'required|integer',
            'capacity' => 'required|integer',
            'managed_by' => 'nullable|exists:teachers,id'
        ]);

        $class = AcademicClass::create($request->all());
        return response()->json($class, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $class = AcademicClass::with(['sections', 'managedBy'])->findOrFail($id);
        return response()->json($class);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $class = AcademicClass::findOrFail($id);
        
        $request->validate([
            'name' => 'string|max:100',
            'numeric_value' => 'integer',
            'capacity' => 'integer',
            'managed_by' => 'nullable|exists:teachers,id'
        ]);

        $class->update($request->all());
        return response()->json($class);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $class = AcademicClass::findOrFail($id);
        $class->delete();
        
        return response()->json(['message' => 'Class deleted successfully']);
    }
}
