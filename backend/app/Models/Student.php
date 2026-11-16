<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Student extends Model
{
    use HasFactory;

    protected $fillable = [
        'admission_no', 'roll_no', 'first_name', 'last_name', 'date_of_birth', 'gender', 'blood_group', 'primary_guardian_id', 'address', 'photo_url', 'status', 'admission_date'
    ];

    public function primaryGuardian()
    {
        return $this->belongsTo(PrimaryGuardian::class);
    }

}
