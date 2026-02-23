<?php

namespace App\Http\Controllers;

use App\Models\Wallet;
use App\Models\Deposit;
use App\Models\Withdrawal;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Str;

class WalletController extends Controller
{
    /**
     * Get the current user's wallet balance.
     */
    public function balance(Request $request): JsonResponse
    {
        $user = $request->user();
        $wallet = $user->wallet;

        if (!$wallet) {
            // Create wallet if it doesn't exist
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance' => $user->balance ?? 0,
            ]);
        }

        return response()->json([
            'balance' => (float) $wallet->balance,
            'currency' => 'BRL',
        ]);
    }

    /**
     * Create a deposit request with PIX QR code (fictional).
     */
    public function deposit(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        if (!$wallet) {
            $wallet = Wallet::create([
                'user_id' => $user->id,
                'balance' => 0,
            ]);
        }

        // Generate fictional PIX code
        $pixCode = $this->generatePixCode($validated['amount']);

        // Generate fictional QR code (just a placeholder)
        $qrCodeBase64 = $this->generateQrCode($pixCode);

        // Create deposit record with approved status (fictional)
        $deposit = Deposit::create([
            'user_id' => $user->id,
            'amount' => $validated['amount'],
            'pix_code' => $pixCode,
            'qr_code_base64' => $qrCodeBase64,
            'status' => 'approved',
            'expires_at' => now()->addMinutes(30),
        ]);

        // Update wallet balance
        $wallet->balance += $validated['amount'];
        $wallet->save();

        // Update user balance
        $user->balance += $validated['amount'];
        $user->save();

        return response()->json($deposit->toApiArray(), 201);
    }

    /**
     * Get the status of a deposit.
     */
    public function depositStatus(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $deposit = Deposit::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return response()->json($deposit->toApiArray());
    }

    /**
     * Create a withdrawal request (fictional).
     */
    public function withdraw(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:20',
            'pix_key_type' => 'required|in:cpf,email,phone,random',
            'pix_key' => 'required|string',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        if (!$wallet) {
            return response()->json([
                'message' => 'Wallet not found',
            ], 404);
        }

        // Check if user has sufficient balance
        if ($wallet->balance < $validated['amount']) {
            return response()->json([
                'message' => 'Insufficient balance',
            ], 422);
        }

        // Create withdrawal record with approved status (fictional)
        $withdrawal = Withdrawal::create([
            'user_id' => $user->id,
            'amount' => $validated['amount'],
            'pix_key_type' => $validated['pix_key_type'],
            'pix_key' => $validated['pix_key'],
            'status' => 'approved',
        ]);

        // Update wallet balance
        $wallet->balance -= $validated['amount'];
        $wallet->save();

        // Update user balance
        $user->balance -= $validated['amount'];
        $user->save();

        return response()->json($withdrawal->toApiArray(), 201);
    }

    /**
     * Get the status of a withdrawal.
     */
    public function withdrawalStatus(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $withdrawal = Withdrawal::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return response()->json($withdrawal->toApiArray());
    }

    /**
     * Generate a fictional PIX code.
     */
    private function generatePixCode(float $amount): string
    {
        // Fictional PIX code - just for display purposes
        $timestamp = now()->timestamp;
        $random = Str::random(16);
        
        return "PIX-{$random}-{$timestamp}";
    }

    /**
     * Generate a fictional QR code in base64 format.
     */
    private function generateQrCode(string $pixCode): string
    {
        // Create a simple SVG QR code placeholder
        $svg = <<<SVG
<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300" viewBox="0 0 300 300">
  <rect width="300" height="300" fill="white"/>
  <rect x="10" y="10" width="280" height="280" fill="none" stroke="black" stroke-width="2"/>
  <text x="150" y="150" font-size="14" text-anchor="middle" dominant-baseline="middle" font-family="Arial">
    {$pixCode}
  </text>
</svg>
SVG;

        return 'data:image/svg+xml;base64,' . base64_encode($svg);
    }
}
