<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Certification;
use App\Http\Controllers\Controller;

class CertificationController extends Controller
{
    public function certificationsByParticipant($userId)
    {
        $participant = User::findOrFail($userId);
        $certifications = $participant->certifications()->get();
        return response()->json(['certifications' => $certifications]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'formation_id' => 'required|exists:formations,id',
            'titre' => 'required|string',
            'dateObtention' => 'required|date',
            'domaine' => 'required|string',
            'niveau' => 'required|string',
            'user_id' => 'required|exists:users,id',
        ]);

        $certification = Certification::create($request->all());

        return response()->json(['certification' => $certification], 201);
    }
}
