<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class FormationUser extends Pivot
{   

    use HasFactory;
    protected $table = 'formation_user';

    protected $fillable = [
        'formation_id',
        'user_id',
    ];


}