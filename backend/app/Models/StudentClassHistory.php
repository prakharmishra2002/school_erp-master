<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StudentClassHistory extends Model
{
    use HasFactory;

    protected $table = 'student_class_history';

    protected $fillable = [
        'student_id', 'academic_year_id', 'class_id', 'section_id', 'result'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function class()
    {
        return $this->belongsTo(Class::class);
    }

    public function section()
    {
        return $this->belongsTo(Section::class);
    }

}
