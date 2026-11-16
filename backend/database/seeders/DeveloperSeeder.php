<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DeveloperSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'mvaibhav@gmail'],
            [
                'name' => 'Vaibhav',
                'password' => Hash::make('passoword'),
                'role' => 'developer',
                'is_active' => true,
                'phone' => '1234567890'
            ]
        );
    }
}
