<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ExamType extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'academic_year_id', 'weightage', 'is_active'
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

}
