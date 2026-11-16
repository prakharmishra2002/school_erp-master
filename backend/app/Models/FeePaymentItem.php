<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FeePaymentItem extends Model
{
    use HasFactory;

    protected $fillable = [
        'fee_payment_id', 'student_fee_id', 'amount_allocated'
    ];

    public function feePayment()
    {
        return $this->belongsTo(FeePayment::class);
    }

    public function studentFee()
    {
        return $this->belongsTo(StudentFee::class);
    }

}
