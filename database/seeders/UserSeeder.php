<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@crawlse.test',
            'nip' => '123456789',
            'password' => Hash::make('admin123'),
            'role' => 'admin',
        ]);

        // Create sample employee user
        User::create([
            'name' => 'Pegawai',
            'email' => 'pegawai@crawlse.test',
            'nip' => '987654321',
            'password' => Hash::make('pegawai123'),
            'role' => 'pegawai',
        ]);
    }
}
