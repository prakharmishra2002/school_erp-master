<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Tenant extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'domain', 'database_name', 'schema_name', 'logo_url', 'primary_color', 'address', 'phone', 'email', 'subscription_plan', 'subscription_expires_at', 'is_active', 'settings'
    ];

}
