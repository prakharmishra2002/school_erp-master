<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeeStructure extends Model
{
    use HasFactory;

    protected $fillable = [
        'academic_year_id', 'class_id', 'fee_category_id', 'amount', 'installment_type', 'due_day'
    ];

    public function academicYear()
    {
        return $this->belongsTo(AcademicYear::class);
    }

    public function class()
    {
        return $this->belongsTo(Class::class);
    }

    public function feeCategory()
    {
        return $this->belongsTo(FeeCategory::class);
    }

}
