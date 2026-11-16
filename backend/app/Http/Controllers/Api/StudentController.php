<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Student;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class StudentController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $students = Student::with(['user', 'class', 'section', 'guardian'])->paginate($perPage);
        return response()->json($students);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:50',
            'last_name' => 'required|string|max:50',
            'email' => 'nullable|email|unique:users,email',
            'admission_number' => 'required|string|max:20|unique:students,admission_number',
            'admission_date' => 'required|date',
            'class_id' => 'required|exists:classes,id',
            'section_id' => 'nullable|exists:sections,id',
            'guardian_id' => 'nullable|exists:guardians,id',
            'gender' => 'required|in:male,female,other',
            'date_of_birth' => 'required|date'
        ]);

        DB::beginTransaction();

        try {
            // Priority: Determine user account credentials
            $email = $request->email ?? strtolower($request->first_name . '.' . $request->admission_number . '@school.com');
            
            // 1. Create User account for student
            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $email,
                'password' => Hash::make('password123'), // Default password
                'tenant_id' => 1 // Assuming default tenant
            ]);

            // Assign Student Role (assuming role ID 4 is student - can be dynamically fetched in real app)
            // For now, we omit role assignment if spatie/permission is not fully seeded for new roles, or we just attach a static ID
            // $user->roles()->attach(4); 

            // 2. Create Student Profile
            $student = Student::create([
                'user_id' => $user->id,
                'guardian_id' => $request->guardian_id,
                'class_id' => $request->class_id,
                'section_id' => $request->section_id,
                'admission_number' => $request->admission_number,
                'roll_number' => $request->roll_number,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'gender' => $request->gender,
                'date_of_birth' => $request->date_of_birth,
                'blood_group' => $request->blood_group,
                'religion' => $request->religion,
                'category' => $request->category,
                'admission_date' => $request->admission_date,
            ]);

            DB::commit();

            return response()->json($student->load(['user', 'class', 'section']), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Student registration failed', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $student = Student::with(['user', 'class', 'section', 'guardian'])->findOrFail($id);
        return response()->json($student);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $student = Student::findOrFail($id);
        
        $request->validate([
            'first_name' => 'string|max:50',
            'last_name' => 'string|max:50',
            'class_id' => 'exists:classes,id',
            'section_id' => 'exists:sections,id',
        ]);

        $student->update($request->all());

        // Update User name if applicable
        if ($request->has('first_name') || $request->has('last_name')) {
            $student->user->update([
                'name' => ($request->first_name ?? $student->first_name) . ' ' . ($request->last_name ?? $student->last_name)
            ]);
        }

        return response()->json($student);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $student = Student::findOrFail($id);
        
        DB::beginTransaction();
        try {
            $user = $student->user;
            $student->delete();
            if ($user) {
                $user->delete();
            }
            DB::commit();
            return response()->json(['message' => 'Student deleted successfully']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Deletion failed', 'error' => $e->getMessage()], 500);
        }
    }
}
