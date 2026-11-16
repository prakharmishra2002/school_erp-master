<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SyncLog extends Model
{
    use HasFactory;

    protected $table = 'sync_log';

    protected $fillable = [
        'table_name', 'record_id', 'operation', 'data', 'synced', 'synced_at'
    ];

    public function record()
    {
        return $this->belongsTo(Record::class);
    }

}
