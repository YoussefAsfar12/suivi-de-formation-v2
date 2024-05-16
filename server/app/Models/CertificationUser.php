<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

use Illuminate\Database\Eloquent\Relations\Pivot;

class CertificationUser extends Pivot
{

    use HasFactory;
    protected $table = 'certification_user';

    protected $fillable = [
        'certification_id',
        "formation_id",
        'user_id',
    ];
}
