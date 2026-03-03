<?php

namespace App\Http\Controllers;

use App\Events\CrashUpdate;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Cache;

class CrashGameController extends Controller
{
    /**
     * Retorna o estado atual do jogo.
     * GET /api/games/crash/current
     */
    public function current(Request $request): JsonResponse
    {
        // Em produção, isso viria do Cache/Redis alimentado pelo Game Loop
        return response()->json([
            'status' => Cache::get('crash_game_status', 'waiting'),
            'multiplier' => (float) Cache::get('crash_game_multiplier', 1.00),
            'countdown' => Cache::get('crash_game_countdown', 5),
            'roundId' => Cache::get('crash_game_round_id', null)
        ]);
    }

    /**
     * Retorna o histórico das últimas rodadas.
     * GET /api/games/crash/history
     */
    public function history(Request $request): JsonResponse
    {
        $limit = (int) $request->get('limit', 15);
        $history = Cache::get('crash_game_history', []);
        
        $history = array_slice(array_reverse($history), 0, $limit);
        
        return response()->json([
            'data' => $history
        ]);
    }

    /**
     * Registrar aposta na próxima rodada.
     * Desconta o valor da carteira e cria transação de 'loss' (saída).
     * POST /api/games/crash/bet
     */
    public function bet(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:1',
        ]);

        $user = $request->user();

        $wallet = $user->wallet;
        if (!$wallet) {
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance' => $user->balance ?? 0,
            ]);
        }

        if ($wallet->balance < $validated['amount']) {
            return response()->json(['message' => 'Saldo insuficiente'], 400);
        }

        $gameStatus = Cache::get('crash_game_status', 'waiting');
        if ($gameStatus !== 'betting' && $gameStatus !== 'waiting') {
            return response()->json(['message' => 'Aguarde a próxima rodada para apostar'], 400);
        }

        return DB::transaction(function () use ($user, $wallet, $validated) {
            // Debita o saldo (O dinheiro sai da carteira na aposta)
            $wallet->balance -= $validated['amount'];
            $wallet->save();

            $user->balance -= $validated['amount'];
            $user->save();

            // Criar Transação (Tipo: loss)
            // Registramos como perda inicialmente. Se ganhar, cria-se uma de ganho depois.
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'loss',
                'amount' => $validated['amount'],
                'status' => 'approved',
                'description' => 'Aposta Crash - Round: ' . Cache::get('crash_game_round_id', 'unknown'),
            ]);

            // Armazena a aposta em cache para que o loop do jogo a processe
            $roundId = Cache::get('crash_game_round_id', 'pending');
            $pendingBets = Cache::get('crash_pending_bets', []);
            $pendingBets[$transaction->id] = [
                'id' => $transaction->id,
                'user_id' => $user->id,
                'amount' => $validated['amount'],
                'round_id' => $roundId,
                'status' => 'pending',
                'cashed_out' => false,
                'cashout_multiplier' => null,
                'created_at' => now()->toIso8601String(),
            ];
            Cache::put('crash_pending_bets', $pendingBets, 3600);

            return response()->json([
                'message' => 'Aposta realizada',
                'betId' => $transaction->id,
                'newBalance' => $wallet->balance,
                'roundId' => $roundId,
            ]);
        });
    }

    /**
     * Fazer cashout durante o voo.
     * Adiciona o valor ganho à carteira e cria transação de 'win'.
     * POST /api/games/crash/cashout
     */
    public function cashout(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'betId' => 'required|exists:transactions,id',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        // Recupera a aposta original
        $betTransaction = Transaction::where('id', $validated['betId'])
            ->where('user_id', $user->id)
            ->where('type', 'loss') // Garante que é a transação de aposta
            ->first();

        if (!$betTransaction) {
            return response()->json(['message' => 'Aposta não encontrada ou inválida'], 404);
        }

        // Verifica se a aposta está em cache e ainda está pendente
        $pendingBets = Cache::get('crash_pending_bets', []);
        if (!isset($pendingBets[$betTransaction->id])) {
            return response()->json(['message' => 'Aposta já foi processada ou cashout realizada'], 400);
        }

        $bet = $pendingBets[$betTransaction->id];

        if (!empty($bet['cashed_out'])) {
            return response()->json(['message' => 'Aposta já foi processada ou cashout realizada'], 400);
        }
        
        // Verifica se o status ainda está "flying"
        $gameStatus = Cache::get('crash_game_status', 'waiting');
        if ($gameStatus !== 'flying') {
            return response()->json(['message' => 'Jogo já crashou ou não está em andamento'], 400);
        }

        // Obtém o multiplicador atual
        $currentMultiplier = (float) Cache::get('crash_game_multiplier', 1.00);
        
        // Calcula o montante da vitória
        $winAmount = $betTransaction->amount * $currentMultiplier;

        return DB::transaction(function () use ($user, $wallet, $winAmount, $currentMultiplier, $bet, $pendingBets, $betTransaction) {
            // Atualiza a aposta em cache como saque realizado
            $bet['cashed_out'] = true;
            $bet['cashout_multiplier'] = $currentMultiplier;
            $bet['status'] = 'won';
            $pendingBets[$betTransaction->id] = $bet;
            Cache::put('crash_pending_bets', $pendingBets, 3600);

            // Adiciona ganho ao saldo
            $wallet->balance += $winAmount;
            $wallet->save();

            $user->balance += $winAmount;
            $user->save();

            // Criaa Transação (win)
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'win',
                'amount' => $winAmount,
                'status' => 'approved',
                'description' => "Cashout Crash (x{$currentMultiplier})",
            ]);

            event(new CrashUpdate('player_cashout', [
                'playerId' => $user->id,
                'playerName' => $user->name,
                'multiplier' => $currentMultiplier,
                'winAmount' => $winAmount,
                'betId' => $betTransaction->id,
            ]));

            return response()->json([
                'message' => 'Cashout realizado',
                'winAmount' => $winAmount,
                'multiplier' => $currentMultiplier,
                'newBalance' => $wallet->balance,
            ]);
        });
    }
}