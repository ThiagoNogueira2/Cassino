<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            [
                'name' => 'João Silva',
                'email' => 'joao@example.com',
                'cpf' => '123.456.789-00',
                'password' => Hash::make('password123'),
                'balance' => 1500.50,
                'level' => 'VIP Silver',
            ],
            [
                'name' => 'Maria Santos',
                'email' => 'maria@example.com',
                'cpf' => '123.456.789-01',
                'password' => Hash::make('password123'),
                'balance' => 2500.00,
                'level' => 'VIP Gold',
            ],
            [
                'name' => 'Pedro Oliveira',
                'email' => 'pedro@example.com',
                'cpf' => '123.456.789-02',
                'password' => Hash::make('password123'),
                'balance' => 500.75,
                'level' => 'VIP Silver',
            ],
            [
                'name' => 'Ana Costa',
                'email' => 'ana@example.com',
                'cpf' => '123.456.789-03',
                'password' => Hash::make('password123'),
                'balance' => 3200.00,
                'level' => 'VIP Platinum',
            ],
            [
                'name' => 'Carlos Mendes',
                'email' => 'carlos@example.com',
                'cpf' => '123.456.789-04',
                'password' => Hash::make('password123'),
                'balance' => 1000.00,
                'level' => 'VIP Silver',
            ],
            [
                'name' => 'Fernanda Lima',
                'email' => 'fernanda@example.com',
                'cpf' => '123.456.789-05',
                'password' => Hash::make('password123'),
                'balance' => 4500.25,
                'level' => 'VIP Platinum',
            ],
            [
                'name' => 'Roberto Ferreira',
                'email' => 'roberto@example.com',
                'cpf' => '123.456.789-06',
                'password' => Hash::make('password123'),
                'balance' => 750.50,
                'level' => 'VIP Silver',
            ],
            [
                'name' => 'Juliana Gomes',
                'email' => 'juliana@example.com',
                'cpf' => '123.456.789-07',
                'password' => Hash::make('password123'),
                'balance' => 2200.00,
                'level' => 'VIP Gold',
            ],
            [
                'name' => 'Lucas Alves',
                'email' => 'lucas@example.com',
                'cpf' => '123.456.789-08',
                'password' => Hash::make('password123'),
                'balance' => 1800.75,
                'level' => 'VIP Gold',
            ],
            [
                'name' => 'Beatriz Rocha',
                'email' => 'beatriz@example.com',
                'cpf' => '123.456.789-09',
                'password' => Hash::make('password123'),
                'balance' => 3500.00,
                'level' => 'VIP Platinum',
            ],
        ];

        foreach ($users as $userData) {
            User::create(array_merge($userData, [
                'avatar' => null,
                'role' => 'user',
            ]));
        }

        echo "\n✅ 10 usuários criados com sucesso!\n\n";
    }
}
