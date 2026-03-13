<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Dtsen extends Model
{
    use HasFactory;
    
    protected $table = 'dtsen';

    protected $fillable = [
        'no_kk',
        'jenis_usaha',
        'jenis_platform',
        'kabupaten_kota',
        'usaha_utama',
        'created_by',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
