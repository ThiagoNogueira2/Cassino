<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class TransactionController extends Controller
{
    /**
     * Get all transactions for the authenticated user.
     * 
     * Query parameters:
     * - type: deposit|withdraw|win|loss|bonus
     * - status: pending|approved|rejected
     * - page: page number (default: 1)
     * - limit: items per page (default: 20)
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        
        $query = Transaction::where('user_id', $user->id);

        // Filter by type if provided
        if ($request->has('type')) {
            $type = $request->query('type');
            if (in_array($type, ['deposit', 'withdraw', 'win', 'loss', 'bonus'])) {
                $query->where('type', $type);
            }
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $status = $request->query('status');
            if (in_array($status, ['pending', 'approved', 'rejected'])) {
                $query->where('status', $status);
            }
        }

        // Get pagination parameters
        $page = $request->query('page', 1);
        $limit = $request->query('limit', 20);

        // Ensure limit doesn't exceed 100
        $limit = min($limit, 100);

        // Order by most recent first
        $query->orderBy('created_at', 'desc');

        // Get paginated results
        $transactions = $query->paginate($limit, ['*'], 'page', $page);

        return response()->json([
            'data' => $transactions->map(fn($transaction) => $transaction->toApiArray()),
            'pagination' => [
                'total' => $transactions->total(),
                'count' => $transactions->count(),
                'perPage' => $transactions->perPage(),
                'currentPage' => $transactions->currentPage(),
                'lastPage' => $transactions->lastPage(),
            ],
        ]);
    }

    /**
     * Get a specific transaction by ID.
     */
    public function show(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        
        $transaction = Transaction::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        return response()->json($transaction->toApiArray());
    }

    /**
     * Create a new transaction (internal use - for deposits, withdrawals, wins, losses, bonuses).
     * 
     * This method is typically called internally by other controllers.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'type' => 'required|in:deposit,withdraw,win,loss,bonus',
            'amount' => 'required|numeric|min:0.01',
            'status' => 'required|in:pending,approved,rejected',
            'description' => 'nullable|string|max:255',
        ]);

        $transaction = Transaction::create($validated);

        return response()->json($transaction->toApiArray(), 201);
    }

    /**
     * Update a transaction (typically for status changes).
     */
    public function update(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        
        $transaction = Transaction::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'sometimes|in:pending,approved,rejected',
            'description' => 'sometimes|nullable|string|max:255',
        ]);

        $transaction->update($validated);

        return response()->json($transaction->toApiArray());
    }

    /**
     * Delete a transaction (soft delete).
     */
    public function destroy(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        
        $transaction = Transaction::where('id', $id)
            ->where('user_id', $user->id)
            ->firstOrFail();

        $transaction->delete();

        return response()->json([
            'message' => 'Transaction deleted successfully',
        ]);
    }
}
