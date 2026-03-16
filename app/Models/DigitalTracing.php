<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DigitalTracing extends Model
{
    use HasFactory;

    protected $table = 'digital_tracing';
    
    protected $fillable = [
        'link',
        'nama_usaha',
        'kategori',
        'alamat',
        'no_telp',
        'jenis_platform',
        'created_by',
        'updated_by',
    ];

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function updater()
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
