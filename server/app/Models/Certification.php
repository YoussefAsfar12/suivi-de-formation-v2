<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Certification extends Model
{
    use HasFactory;


    protected $fillable = [
        'formation_id',
        'titre',
        'dateObtention',
        'domaine',
        'niveau',
        "user_id"
    ];

    public function formation()
    {
        return $this->belongsTo(Formation::class);
    }

    public function participants()
    {
        return $this->belongsToMany(User::class, 'certification_user', 'certification_id', 'user_id')->withTimestamps();
    }
}
