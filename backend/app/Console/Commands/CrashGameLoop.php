<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\CrashUpdate;
use Illuminate\Support\Facades\Cache;

class CrashGameLoop extends Command
{
    protected $signature = 'game:crash-loop';
    protected $description = 'Roda o loop do jogo Crash';

    public function handle()
    {
        $this->info("Iniciando motor do Crash...");

        while (true) {
            $this->runRound();
        }
    }

    protected function runRound()
    {
        // 1. Fase de Apostas (Countdown)
        $this->broadcast('status', ['status' => 'betting']);
        for ($i = 5; $i > 0; $i--) {
            $this->broadcast('countdown', ['seconds' => $i]);
            sleep(1);
        }

        // 2. Definir ponto de Crash (Lógica simplificada)
        // Exemplo: 1% de chance de crashar no 1.00x
        $crashPoint = $this->generateCrashPoint();
        
        // Salvar estado no Cache para o Controller acessar
        Cache::put('crash_game_status', 'flying');
        Cache::put('crash_game_multiplier', 1.00);

        // 3. Fase de Voo (Subir multiplicador)
        $multiplier = 1.00;
        $this->info("Voando... Vai crashar em {$crashPoint}x");

        while ($multiplier < $crashPoint) {
            // Aumenta o multiplicador (exponencial simples)
            $multiplier += 0.01 + ($multiplier * 0.0002); 
            
            // Atualiza cache e envia WebSocket
            Cache::put('crash_game_multiplier', $multiplier);
            $this->broadcast('multiplier', ['multiplier' => round($multiplier, 2)]);

            // Pausa pequena para simular o tempo (100ms)
            usleep(100000); 
        }

        // 4. Crash!
        Cache::put('crash_game_status', 'crashed');
        $this->broadcast('crash', ['multiplier' => $crashPoint]);
        $this->info("Crashou em {$crashPoint}x");

        // Espera antes da próxima rodada
        sleep(3);
    }

    private function broadcast($type, $data)
    {
        event(new CrashUpdate($type, $data));
    }

    private function generateCrashPoint()
    {
        // Algoritmo simples de Provably Fair (exemplo)
        // Gera um número entre 1.00 e 100.00
        // Na vida real, use hash chains
        if (rand(1, 100) <= 3) return 1.00; // 3% de chance de crash instantâneo
        return round(100 / rand(1, 100), 2); // Exemplo matemático básico
    }
}
