<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@cassino.com',
            'cpf' => '00000000001',
            'password' => Hash::make('admin123456'),
            'avatar' => null,
            'balance' => 10000.00,
            'level' => 'VIP Diamond',
            'role' => 'admin',
        ]);

        // Sync wallet balance with user balance
        if ($admin->wallet) {
            $admin->wallet->update(['balance' => $admin->balance]);
        }

        echo "\n✅ Admin criado com sucesso!\n";
        echo "Email: admin@cassino.com\n";
        echo "Senha: admin123456\n";
        echo "Saldo: R$ 10.000,00\n\n";
    }
}
