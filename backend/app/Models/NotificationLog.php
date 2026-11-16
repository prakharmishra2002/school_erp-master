<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class NotificationLog extends Model
{
    use HasFactory;

    protected $fillable = [
        'recipient_type', 'recipient_id', 'channel', 'template', 'message', 'status', 'external_id', 'error_message', 'sent_at'
    ];

    public function recipient()
    {
        return $this->belongsTo(Recipient::class);
    }

    public function external()
    {
        return $this->belongsTo(External::class);
    }

}
