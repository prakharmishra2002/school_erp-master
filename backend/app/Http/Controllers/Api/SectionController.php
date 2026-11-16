<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Section;

class SectionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Section::with(['class', 'classTeacher']);
        
        if ($request->has('class_id')) {
            $query->where('class_id', $request->class_id);
        }
        
        $sections = $query->get();
        return response()->json($sections);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'class_id' => 'required|exists:classes,id',
            'name' => 'required|string|max:50',
            'room_number' => 'nullable|string|max:20',
            'capacity' => 'required|integer',
            'class_teacher_id' => 'nullable|exists:teachers,id'
        ]);

        $section = Section::create($request->all());
        return response()->json($section, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $section = Section::with(['class', 'classTeacher'])->findOrFail($id);
        return response()->json($section);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $section = Section::findOrFail($id);
        
        $request->validate([
            'class_id' => 'exists:classes,id',
            'name' => 'string|max:50',
            'room_number' => 'nullable|string|max:20',
            'capacity' => 'integer',
            'class_teacher_id' => 'nullable|exists:teachers,id'
        ]);

        $section->update($request->all());
        return response()->json($section);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $section = Section::findOrFail($id);
        $section->delete();
        
        return response()->json(['message' => 'Section deleted successfully']);
    }
}
