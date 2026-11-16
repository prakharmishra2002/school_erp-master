<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ImportJob extends Model
{
    use HasFactory;

    protected $fillable = [
        'job_type', 'source_type', 'source_config', 'file_path', 'original_filename', 'column_mapping', 'total_records', 'processed_records', 'success_count', 'error_count', 'warning_count', 'status', 'error_log', 'rollback_data', 'started_at', 'completed_at', 'created_by'
    ];

}
