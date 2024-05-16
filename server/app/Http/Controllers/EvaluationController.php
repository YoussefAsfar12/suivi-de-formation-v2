<?php

namespace App\Http\Controllers;

use App\Models\Formation;
use App\Models\Evaluation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class EvaluationController extends Controller
{
    public function evaluationsByFormation($formationId)
    {
        $formation = Formation::findOrFail($formationId);
        $evaluations = $formation->evaluations()->get();
        return response()->json(['evaluations' => $evaluations]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'formation_id' => 'required|exists:formations,id',
            'user_id' => 'required|exists:users,id',
            'commentaire' => 'required|string',
            'note' => 'required|numeric|min:0|max:5',
            "role" => 'required|string'
        ]);

        $evaluation = Evaluation::create($request->all());

        return response()->json(['evaluation' => $evaluation], 201);
    }
}
