<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Formation;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\FormationUser;

class FormationController extends Controller
{
   
    public function enrollParticipant(Request $request, $formationId, $participantId)
    {
        // $formation = Formation::where("id",$formationId)->where();
        $formationUser = FormationUser::where("formation_id",$formationId)->where("user_id",$participantId)->first();
        
        if($formationUser) {
            return response()->json(['message' => 'Participant already enrolled in this formation'], 400);
        }
        $formation = Formation::where("id",$formationId)->first();
        $participant = User::where('id', $participantId)->first();
            if(!$participant){
                return response()->json(['message' => 'Participant not found'], 404);
            }
        $formation->participants()->attach($participant);

        return response()->json(['message' => 'Participant enrolled successfully'], 200);
    }

    public function formationsByParticipant($userId)
    {
        $participant = User::findOrFail($userId);
        $formations = $participant->formationsInscrites()->get();
        return response()->json(['formations' => $formations]);
    }
    public function participants($formationId)
    {
        $formation = Formation::where("id",$formationId)->first();
        if(!$formation) {
            return response()->json(['message' => 'Formation not found'], 404);
        }
        $participants = $formation->participants()->get();
        return response()->json(['participants' => $participants]);
    }
    public function formationsByFormateur($userId)
    {
        $formateur = User::findOrFail($userId);
        $formations = $formateur->formationsEnseignees()->get();
        return response()->json(['formations' => $formations]);
    }

    public function isEnrolled($formationId, $participantId)
    {
        $exists = FormationUser::where("formation_id", $formationId)
        ->where("user_id", $participantId)
        ->exists();
            return response()->json(['isEnrolled' => $exists], 200);

    }

    public function index()
    {
        $formations = Formation::all();
        return response()->json(['formations' => $formations]);
    }
    public function getByTitre(Request $request)
    {
        $formation= Formation::where('titre', $request->titre);

        return response()->json(['formation' => $formation]);
    }
    public function getFormation($id)
    {
        $formation = Formation::find($id);
        if(!$formation) {
            return response()->json(['message' => 'Formation not found'], 404);
        }
        return response()->json(['formation' => $formation->load('participants',"evaluations.user")]);
    }
    public function store(Request $request)
    {
        $request->validate([
            'dateFin' => 'required|date',
            'dateDebut' => 'required|date',
            'capacite_max' => 'required|integer',
            'lieu' => 'required|string',
            'description' => 'required|string',
            'niveau' => 'required|string',
            'titre' => 'required|string',
            'domaine' => 'required|string',
            'disponible' => 'required|boolean',
            'formateur' => 'required|string',
            'formateur_id' => 'required|integer',
        ]);

        $formation = Formation::create($request->all());
        $user= User::find($request->formateur_id)->load( 'formationsEnseignees');

        return response()->json(['formation' => $formation, 'user' => $user], 201);
    }
    public function update(Request $request, $id)
    {
        $formation = Formation::findOrFail($id);

        $request->validate([
            'dateFin' => 'required|date',
            'dateDebut' => 'required|date',
            'capacite_max' => 'required|integer',
            'lieu' => 'required|string',
            'description' => 'required|string',
            'niveau' => 'required|string',
            'titre' => 'required|string',
            'domaine' => 'required|string',
            'disponible' => 'required|boolean',
            'formateur' => 'required|string',
        ]);

        $formation->update($request->all());

        return response()->json(['formation' => $formation], 200);
    }


    public function destroy($id)
    {
        $formation = Formation::find($id);
        if(!$formation) {
            return response()->json(['message' => 'Formation not found'], 404);
        }
        $formation->delete();
        $user= User::find($formation->formateur_id)->load( 'formationsEnseignees');
        return response()->json(['message' => 'Formation deleted successfully', 'user' => $user], 200);
    }
}
