<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeePayment extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id', 'receipt_no', 'payment_date', 'amount', 'payment_mode', 'reference_no', 'remarks', 'collected_by'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }

}
