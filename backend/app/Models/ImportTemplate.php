<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportTemplate extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'entity_type', 'columns', 'sample_file_path'
    ];

}
