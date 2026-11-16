<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // School Admin
        User::updateOrCreate(
            ['email' => 'admin@school.com'],
            [
                'name' => 'School Admin',
                'password' => Hash::make('password'),
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        // Teacher
        User::updateOrCreate(
            ['email' => 'teacher@school.com'],
            [
                'name' => 'Demo Teacher',
                'password' => Hash::make('password'),
                'role' => 'teacher',
                'is_active' => true,
            ]
        );
    }
}
