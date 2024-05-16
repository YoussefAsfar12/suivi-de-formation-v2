<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;
    protected $fillable = [
        'nom',
        'prenom',
        'role',
        'email',
        'password',
    ];

    public function formationsEnseignees()
    {
        return $this->hasMany(Formation::class, 'formateur_id', 'id');
    }

    public function formationsInscrites()
    {
        return $this->belongsToMany(Formation::class, 'formation_user', 'user_id', 'formation_id')->withTimestamps();
    }

    public function certifications()
    {
        return $this->belongsToMany(Certification::class, 'certification_user', 'user_id', 'certification_id')->withTimestamps();
    }


    public function notifications()
    {
        return $this->hasMany(Notification::class, 'user_id', 'id');
    }
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
    ];


}
