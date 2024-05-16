<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notification extends Model
{
    use HasFactory;
    protected $fillable = ['title', 'body', 'user_id', 'read',"unread_notifications"];

    public function user()
{
    return $this->belongsTo(User::class);
}

public function scopeUnread($query)
{
    return $query->where('read', false);
}


}
