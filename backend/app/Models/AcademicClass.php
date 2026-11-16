<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AcademicClass extends Model
{
    use HasFactory;

    protected $table = 'classes';

    protected $fillable = [
        'name', 'numeric_value', 'capacity', 'managed_by'
    ];

    public function sections()
    {
        return $this->hasMany(Section::class, 'class_id');
    }

    public function managedBy()
    {
        return $this->belongsTo(Teacher::class, 'managed_by');
    }
}
