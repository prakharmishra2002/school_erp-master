<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guardian extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'name', 'relation', 'phone', 'email', 'occupation', 'address'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

}
