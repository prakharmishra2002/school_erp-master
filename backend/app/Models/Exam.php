<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Exam extends Model
{
    use HasFactory;

    protected $fillable = [
        'exam_type_id', 'class_id', 'subject_id', 'exam_date', 'start_time', 'end_time', 'max_marks', 'pass_marks', 'venue'
    ];

    public function examType()
    {
        return $this->belongsTo(ExamType::class);
    }

    public function class()
    {
        return $this->belongsTo(Class::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

}
