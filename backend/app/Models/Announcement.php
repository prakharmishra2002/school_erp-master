<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Announcement extends Model
{
    use HasFactory;

    protected $fillable = [
        'title', 'content', 'audience', 'class_id', 'is_pinned', 'published_at', 'expires_at', 'created_by'
    ];

    public function class()
    {
        return $this->belongsTo(Class::class);
    }

}
