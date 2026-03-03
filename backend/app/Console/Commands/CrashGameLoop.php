<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\CrashUpdate;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Str;

class CrashGameLoop extends Command
{
    protected $signature = 'game:crash-loop';
    protected $description = 'Roda o loop do jogo Crash';

    public function handle()
    {
        $this->info("Iniciando motor do Crash...");

        // Inicializa o histórico se não existir
        if (!Cache::has('crash_game_history')) {
            Cache::put('crash_game_history', [], 0);
        }

        // Garante que o ID da rodada inicial exista
        if (!Cache::has('crash_game_round_id')) {
            Cache::put('crash_game_round_id', 'round_' . Str::random(8));
        }

        while (true) {
            $this->runRound();
        }
    }

    protected function runRound()
    {
        $roundId = Cache::get('crash_game_round_id');

        // Fase de Apostas (Countdown) - 10 segundos para apostar
        Cache::put('crash_game_status', 'betting');
        $this->broadcast('status', ['status' => 'betting', 'roundId' => $roundId]);

        for ($i = 10; $i > 0; $i--) {
            Cache::put('crash_game_countdown', $i);
            $this->broadcast('countdown', ['seconds' => $i]);
            sleep(1);
        }

        // Defineo ponto de Crash (LIMITADO A 5x MÁXIMO)
        // 5% de chance de crash instantâneo (1.00x - 1.20x)
        // 40% de chance de crash baixo (1.20x - 2.00x)
        // 35% de chance de crash médio (2.00x - 3.50x)
        // 20% de chance de crash alto (3.50x - 5.00x)
        $crashPoint = $this->generateCrashPoint();

        // Salvar estado no Cache para o Controller acessar
        Cache::put('crash_game_status', 'flying');
        Cache::put('crash_game_multiplier', 1.00);
        Cache::put('crash_game_countdown', null);

        // Fase de Voo (Subir multiplicador LENTAMENTE)
        $multiplier = 1.00;
        $this->info("Voando... Vai crashar em {$crashPoint}x");

        while ($multiplier < $crashPoint) {
            // Aumenta o multiplicador (0.01 por vez)
            $multiplier += 0.01;

            // Atualiza cache e envia WebSocket
            $roundedMultiplier = round($multiplier, 2);
            Cache::put('crash_game_multiplier', $roundedMultiplier);
            $this->broadcast('multiplier', ['multiplier' => $roundedMultiplier]);

            // Pausa de 100ms para cada incremento (para testes)
            // 1x a 3x = 200 incrementos = 20 segundos no máximo
            usleep(100000);
        }

        // Crash
        Cache::put('crash_game_status', 'crashed');
        Cache::put('crash_game_multiplier', $crashPoint);
        $this->broadcast('crash', ['multiplier' => $crashPoint, 'roundId' => $roundId]);
        $this->info("Crashou em {$crashPoint}x");

        // Salva para o histórico
        $history = Cache::get('crash_game_history', []);
        $history[] = [
            'id' => $roundId,
            'multiplier' => $crashPoint,
            'timestamp' => now()->toIso8601String(),
            'hash' => hash('sha256', $roundId . $crashPoint . time()),
        ];
        // Mantém apenas as últimas 100 rodadas
        $history = array_slice($history, -100);
        Cache::put('crash_game_history', $history, 0);

        // Processa todas as apostas pendentes como perdidas
        $this->processLosingBets($roundId);

        // Prepara a Próxima Rodada (Waiting/Cooldown)
        $nextRoundId = 'round_' . Str::random(8);
        Cache::put('crash_game_round_id', $nextRoundId);

        Cache::put('crash_game_status', 'waiting');
        $this->broadcast('status', ['status' => 'waiting', 'roundId' => $nextRoundId]);

        sleep(3);
    }

    private function broadcast($type, $data)
    {
        event(new CrashUpdate($type, $data));
    }

    private function generateCrashPoint()
    {
        // Distribuição controlada para testes (MÁXIMO 3x)
        
        // 10% de chance de crash instantâneo (1.00x - 1.30x)
        if (mt_rand(1, 100) <= 10) {
            return round(1.00 + (mt_rand(0, 30) / 100), 2);
        }

        // 50% de chance de crash baixo (1.30x - 1.80x)
        if (mt_rand(1, 100) <= 50) {
            return round(1.30 + (mt_rand(0, 50) / 100), 2);
        }

        // 30% de chance de crash médio (1.80x - 2.50x)
        if (mt_rand(1, 100) <= 30) {
            return round(1.80 + (mt_rand(0, 70) / 100), 2);
        }

        // 10% de chance de crash alto (2.50x - 3.00x) - MÁXIMO 3x
        return round(2.50 + (mt_rand(0, 50) / 100), 2);
    }

    private function processLosingBets(string $crashedRoundId)
    {
        // Pega todas as apostas pendentes do cache
        $allBets = Cache::get('crash_pending_bets', []);
        $betsForNextRound = [];
        
        foreach ($allBets as $betId => $bet) {
            // Se a aposta for referente à rodada que acabou de terminar...
            if (isset($bet['round_id']) && $bet['round_id'] === $crashedRoundId) {
                // ...e não sacou antes, é uma perda(loss).
                if (empty($bet['cashed_out'])) {
                    $this->info("Bet {$betId} for round {$crashedRoundId} lost.");
                }
            } else {
                // Essa aposta pertence a uma rodada diferente (provavelmente a próxima), então é mantida.
                $betsForNextRound[$betId] = $bet;
            }
        }
        
        // Sobreescreve o cache apenas pelas apostas da próxima rodada.
        Cache::put('crash_pending_bets', $betsForNextRound, 3600);
    }
}
