<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Teacher;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $perPage = $request->query('per_page', 10);
        $teachers = Teacher::with('user')->paginate($perPage);
        return response()->json($teachers);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string|max:100',
            'last_name' => 'nullable|string|max:100',
            'email' => 'required|email|unique:users,email',
            'phone' => 'required|string|max:20',
            'department' => 'required|string',
            'designation' => 'required|string',
            'employee_id' => 'required|string|unique:teachers,employee_id'
        ]);

        DB::beginTransaction();
        try {
            $user = User::create([
                'name' => $request->first_name . ' ' . $request->last_name,
                'email' => $request->email,
                'phone' => $request->phone,
                'password' => Hash::make('password123'), // Default password
                'role' => 'teacher',
                'is_active' => true
            ]);

            $teacher = Teacher::create([
                'user_id' => $user->id,
                'employee_id' => $request->employee_id,
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'department' => $request->department,
                'designation' => $request->designation,
                'status' => 'active',
                'joining_date' => now()
            ]);

            DB::commit();
            return response()->json($teacher->load('user'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to create teacher', 'error' => $e->getMessage()], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $teacher = Teacher::with('user', 'teacherSchedules', 'teacherRatings')->findOrFail($id);
        return response()->json($teacher);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $teacher = Teacher::findOrFail($id);
        $user = $teacher->user;

        if ($user) {
            $user->update($request->only(['email', 'phone', 'is_active']));
            if($request->has('first_name') || $request->has('last_name')) {
                $user->update(['name' => $request->first_name . ' ' . $request->last_name]);
            }
        }

        $teacher->update($request->only([
            'first_name', 'last_name', 'department', 'designation', 'status'
        ]));

        return response()->json($teacher->load('user'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $teacher = Teacher::findOrFail($id);
        if ($teacher->user) {
            $teacher->user->delete();
        }
        $teacher->delete();
        
        return response()->json(['message' => 'Teacher deleted successfully']);
    }
}
