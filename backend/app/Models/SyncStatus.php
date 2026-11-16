<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyncStatus extends Model
{
    use HasFactory;

    protected $table = 'sync_status';

    protected $fillable = [
        'last_sync_at', 'pending_count', 'status', 'error_message'
    ];

}
