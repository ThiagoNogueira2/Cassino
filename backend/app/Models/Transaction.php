<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'type',
        'amount',
        'status',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Get the user that owns the transaction.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Convert the model to an API response array.
     */
    public function toApiArray(): array
    {
        return [
            'id' => (string) $this->id,
            'type' => $this->type,
            'amount' => (float) $this->amount,
            'date' => $this->created_at->toIso8601String(),
            'status' => $this->status,
            'description' => $this->description,
        ];
    }
}
