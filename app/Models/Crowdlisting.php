<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Crowdlisting extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'crowdlisting';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'nama_keluarga_bangunan_usaha',
        'nama_pemilik',
        'jenis_usaha',
        'platform_digital',
        'alamat',
        'jumlah_usaha',
        'kode_pos',
        'email',
        'no_telp',
        'kabupaten_kota',
        'created_by',
        'updated_by',
    ];

    /**
     * Get the user who created this crowdlisting.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this crowdlisting.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
