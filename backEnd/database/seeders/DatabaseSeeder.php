<?php

namespace Database\Seeders;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'Super Admin',
            'email' => 'Admin.Admin@gmail.com',
            'password' => Hash::make('Admin9836'),
            'role' => 'admin'
        ]);
    }
}
