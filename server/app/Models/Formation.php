<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Formation extends Model
{
    use HasFactory;
    protected $fillable = [
        'dateFin',
        'dateDebut',
        'capacite_max',
        'lieu',
        'description',
        'niveau',
        'titre',
        'domaine',
        'disponible',
        'formateur',
        'formateur_id'
    ];

    public function participants()
    {
        return $this->belongsToMany(User::class, 'formation_user', 'formation_id', 'user_id')->withTimestamps();
    }

    public function users()
    {
        return $this->hasManyThrough(User::class, FormationUser::class, 'formation_id', 'id', 'id', 'user_id');
    }

    public function formateur()
    {
        return $this->belongsTo(User::class, 'formateur_id');
    }

    public function evaluations()
    {
        return $this->hasMany(Evaluation::class);
    }
}
