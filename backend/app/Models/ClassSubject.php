<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClassSubject extends Model
{
    use HasFactory;

    protected $fillable = [
        'class_id', 'subject_id', 'is_optional'
    ];

    public function class()
    {
        return $this->belongsTo(Class::class);
    }

    public function subject()
    {
        return $this->belongsTo(Subject::class);
    }

}
