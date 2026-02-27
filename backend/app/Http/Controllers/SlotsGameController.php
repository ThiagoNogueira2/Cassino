<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;

class SlotsGameController extends Controller
{
    private $symbols = ['🍒', '🍋', '🍊', '💎', '7️⃣', '⭐', '🔔'];

    public function spin(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'betAmount' => 'required|numeric|min:1',
        ]);

        $betAmount = (float) $validated['betAmount'];
        $user = $request->user();
        
        $wallet = $user->wallet;
        if (!$wallet) {
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance' => $user->balance ?? 0,
            ]);
        }

        if ($wallet->balance < $betAmount) {
            return response()->json(['message' => 'Saldo insuficiente'], 400);
        }

        return DB::transaction(function () use ($user, $wallet, $betAmount) {
            $wallet->balance -= $betAmount;
            $wallet->save();

            $user->balance -= $betAmount;
            $user->save();

            // Derrota (Loss)
            $betTransaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'loss',
                'amount' => $betAmount,
                'status' => 'approved',
                'description' => 'Aposta Slots',
            ]);

            // Manipulação (Outcome First)
            // Define a chance de vitória (ex: 30% para testes, em produção seria menor ou ajustado pelo RTP)
            $winChance = 80;
            $isWin = rand(1, 100) <= $winChance;
            
            $targetMatches = 0;
            if ($isWin) {
                // Se ganhou, decide o nível do prêmio
                $tierRand = rand(1, 100);
                if ($tierRand <= 70) $targetMatches = 3;      // 70% das vitórias são 3x (comuns)
                elseif ($tierRand <= 90) $targetMatches = 4;  // 20% das vitórias são 10x (raras)
                else $targetMatches = 5;                      // 10% das vitórias são 50x (lendárias)
            }

            // Gera os rolos forçando o resultado desejado
            $reels = $this->generateReels($targetMatches);
            $result = $this->calculateWin($reels, $betAmount);

            // Vitória (Win)
            if ($result['win']) {
                $wallet->balance += $result['prize'];
                $wallet->save();

                $user->balance += $result['prize'];
                $user->save();

                Transaction::create([
                    'user_id' => $user->id,
                    'type' => 'win',
                    'amount' => $result['prize'],
                    'status' => 'approved',
                    'description' => "Vitória Slots (x{$result['multiplier']})",
                ]);
            }

            return response()->json([
                'reels' => $reels,
                'win' => $result['win'],
                'multiplier' => $result['multiplier'],
                'prize' => $result['prize'],
                'newBalance' => (float) $wallet->balance,
                'betId' => $betTransaction->id,
            ]);
        });
    }

    /**
     * Gera a matriz 3x5 de símbolos (3 linhas, 5 colunas).
     * @param int $forceMatches Quantidade de símbolos iguais a forçar na linha do meio (0 = aleatório/perda)
     */
    private function generateReels(int $forceMatches = 0): array
    {
        $reels = [];
        
        // Preenche tudo aleatoriamente primeiro
        for ($i = 0; $i < 3; $i++) { // 3 linhas
            $row = [];
            for ($j = 0; $j < 5; $j++) { // 5 colunas
                $row[] = $this->symbols[array_rand($this->symbols)];
            }
            $reels[] = $row;
        }

        // Aplica a manipulação na linha do meio (índice 1)
        if ($forceMatches >= 3) {
            $winSymbol = $this->symbols[array_rand($this->symbols)];
            
            // Define os símbolos vencedores
            for ($j = 0; $j < $forceMatches; $j++) {
                $reels[1][$j] = $winSymbol;
            }
            
            // Garante que o próximo símbolo NÃO seja igual (para não aumentar o prêmio acidentalmente)
            if ($forceMatches < 5) {
                do {
                    $next = $this->symbols[array_rand($this->symbols)];
                } while ($next === $winSymbol);
                $reels[1][$forceMatches] = $next;
            }
        } else {
            // Forçar Derrota: Garante que NÃO existam 3 iguais seguidos
            // Se por acaso a aleatoriedade gerou uma vitória, nós a quebramos
            if ($reels[1][0] === $reels[1][1] && $reels[1][1] === $reels[1][2]) {
                do {
                    $reels[1][2] = $this->symbols[array_rand($this->symbols)];
                } while ($reels[1][2] === $reels[1][1]);
            }
        }

        return $reels;
    }

    /**
     * Calcula se houve vitória na linha do meio.
     */
    private function calculateWin(array $reels, float $betAmount): array
    {
        // Verifica apenas a linha do meio (índice 1)
        $middleLine = $reels[1];

        $firstSymbol = $middleLine[0];
        $matchCount = 1;

        // Conta símbolos consecutivos iguais a partir do primeiro (esquerda para direita)
        for ($i = 1; $i < 5; $i++) {
            if ($middleLine[$i] === $firstSymbol) {
                $matchCount++;
            } else {
                break;
            }
        }

        $multiplier = 0;
        // Regras de pagamento simples
        if ($matchCount === 5) {
            if ($firstSymbol === '💎') {
                $multiplier = 50.0;
            } elseif ($firstSymbol === '7️⃣') {
                $multiplier = 30.0;
            } else {
                $multiplier = 10.0;
            }
        } elseif ($matchCount === 4) {
            if ($firstSymbol === '💎') {
                $multiplier = 15.0;
            } else {
                $multiplier = 5.0;
            }
        } elseif ($matchCount === 3) {
            $multiplier = 2.0;
        }

        return [
            'win' => $multiplier > 0,
            'multiplier' => $multiplier,
            'prize' => $betAmount * $multiplier
        ];
    }
}
