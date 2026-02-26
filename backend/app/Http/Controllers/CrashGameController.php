<?php

namespace App\Http\Controllers;

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
            'countdown' => 10
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
        
        // Garante que a carteira existe
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

        return DB::transaction(function () use ($user, $wallet, $validated) {
            // 1. Debitar saldo (O dinheiro sai da carteira na aposta)
            $wallet->balance -= $validated['amount'];
            $wallet->save();

            $user->balance -= $validated['amount'];
            $user->save();

            // 2. Criar Transação (Tipo: loss)
            // Registramos como perda inicialmente. Se ganhar, cria-se uma de ganho depois.
            $transaction = Transaction::create([
                'user_id' => $user->id,
                'type' => 'loss', 
                'amount' => $validated['amount'],
                'status' => 'approved',
                'description' => 'Aposta Crash',
            ]);

            return response()->json([
                'message' => 'Aposta realizada',
                'betId' => $transaction->id, // Usamos o ID da transação como ID da aposta para simplificar
                'newBalance' => $wallet->balance,
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
            // Para testes, permitimos enviar o multiplicador. Em produção, pegue do Cache/Estado do Jogo.
            'multiplier' => 'nullable|numeric|min:1.01', 
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        // 1. Recuperar a aposta original
        $betTransaction = Transaction::where('id', $validated['betId'])
            ->where('user_id', $user->id)
            ->where('type', 'loss') // Garante que é a transação de aposta
            ->first();

        if (!$betTransaction) {
            return response()->json(['message' => 'Aposta não encontrada ou inválida'], 404);
        }

        // 2. Calcular ganho
        $currentMultiplier = $request->input('multiplier') ?? (float) Cache::get('crash_game_multiplier', 1.00);
        $winAmount = $betTransaction->amount * $currentMultiplier;

        return DB::transaction(function () use ($user, $wallet, $winAmount, $currentMultiplier) {
            // 3. Adicionar ganho ao saldo
            $wallet->balance += $winAmount;
            $wallet->save();

            $user->balance += $winAmount;
            $user->save();

            // 4. Criar Transação (Tipo: win)
            Transaction::create([
                'user_id' => $user->id,
                'type' => 'win',
                'amount' => $winAmount,
                'status' => 'approved',
                'description' => "Vitória Crash (x{$currentMultiplier})",
            ]);

            return response()->json([
                'message' => 'Cashout realizado',
                'winAmount' => $winAmount,
                'multiplier' => $currentMultiplier,
                'newBalance' => $wallet->balance,
            ]);
        });
    }
}