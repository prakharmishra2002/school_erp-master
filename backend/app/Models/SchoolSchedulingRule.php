<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SchoolSchedulingRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'max_periods_per_day', 'max_continuous_periods', 'period_duration_minutes', 'school_start_time', 'school_end_time'
    ];

}
