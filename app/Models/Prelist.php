<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Prelist extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'prelist';

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'no_urut_bangunan',
        'nama_keluarga_bangunan_usaha',
        'jenis_usaha',
        'alamat',
        'no_urut_keluarga',
        'jumlah_usaha',
        'kode_pos',
        'email',
        'no_telp',
        'created_by',
        'updated_by',
    ];

    /**
     * Get the user who created this prelist.
     */
    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    /**
     * Get the user who last updated this prelist.
     */
    public function updater(): BelongsTo
    {
        return $this->belongsTo(User::class, 'updated_by');
    }
}
