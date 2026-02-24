<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Deposit extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'amount',
        'pix_code',
        'qr_code_base64',
        'status',
        'expires_at',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'expires_at' => 'datetime',
    ];

    /**
     * Get the user that owns the deposit.
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
            'amount' => (float) $this->amount,
            'pixCode' => $this->pix_code,
            'qrCodeBase64' => $this->qr_code_base64,
            'status' => $this->status,
            'expiresAt' => $this->expires_at?->toIso8601String(),
        ];
    }
}
