<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CrashUpdate implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $type; // 'multiplier', 'crashed', 'countdown'
    public $payload;

    public function __construct($type, $payload)
    {
        $this->type = $type;
        $this->payload = $payload;
    }

    public function broadcastOn()
    {
        // O frontend vai escutar no canal 'crash-game'
        return new Channel('crash-game');
    }

    public function broadcastAs()
    {
        return 'game_update';
    }
}
