<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'nip',
        'no_telp',
        'password',
        'role',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Get the crowdlisting records created by this user.
     */
    public function crowdlistingsCreated(): HasMany
    {
        return $this->hasMany(Crowdlisting::class, 'created_by');
    }

    /**
     * Get the crowdlisting records updated by this user.
     */
    public function crowdlistingsUpdated(): HasMany
    {
        return $this->hasMany(Crowdlisting::class, 'updated_by');
    }

    /**
     * Get the snowball records created by this user.
     */
    public function snowballsCreated(): HasMany
    {
        return $this->hasMany(Snowball::class, 'created_by');
    }

    /**
     * Get the snowball records updated by this user.
     */
    public function snowballsUpdated(): HasMany
    {
        return $this->hasMany(Snowball::class, 'updated_by');
    }

    /**
     * Check if user is admin.
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user is employee (pegawai).
     */
    public function isPegawai(): bool
    {
        return $this->role === 'pegawai';
    }
}
