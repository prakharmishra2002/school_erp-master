<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GradeScale extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'min_percentage', 'max_percentage', 'grade_point', 'description', 'display_order'
    ];

}
