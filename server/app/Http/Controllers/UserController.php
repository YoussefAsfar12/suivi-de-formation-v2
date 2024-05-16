<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function login(Request $request)
{
    $user = User::where('email', $request->email)->first();

    if ($user && Hash::check($request->password, $user->password)) {
        $token = $user->createToken('auth_token')->plainTextToken;
        $cookie = cookie('token', $token, 60 * 24 * 7);
    
        return response()->json(['user' => $user, 'token' => $token])->withCookie($cookie);
    } else {
        // User doesn't exist or password doesn't match
        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}

    public function logout(Request $request)
    {
        Auth::guard('api')->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'User logged out successfully'])->withCookie(cookie()->forget('token'));
    }

    public function getCurrentUser(Request $request)
    {
        if($request->cookie('token')){
            $user = Auth::guard('api')->user();
            return response()->json(['user' =>$user->load("formationsInscrites","formationsEnseignees")]);
        }
        return null;
    }
    public function getByEmail(Request $request)
    {
        $user= User::where('email', $request->input('email'))->first();
     
        return response()->json(['user' => $user]);
    }
    public function getByName(Request $request)
    {
        $user= User::where('nom', $request->input('nom'))->where('prenom', $request->input('prenom'))->first();

        return response()->json(['user' => $user]);
    }
   
    public function getFormateurs()
    {
        $formateurs = User::where('role', 'Formateur')->get();
        return response()->json(['formateurs' => $formateurs]);
    }

    public function getParticipants()
    {
        $participants = User::where('role', 'Participant')->get();
        return response()->json(['participants' => $participants]);
    }


    public function getFormateur( $id)
    {
        $formateur = User::where('role', 'Formateur')->where('id', $id)->get();
        return response()->json(['formateur' => $formateur]);
    }

    public function getParticipant($id)
    {
        $participant = User::where('role', 'Participant')->where('id', $id)->get();
        return response()->json(['participant' => $participant]);
    }
    public function getUser($id)
    {
        $user = User::where('id', $id)->get();
        return response()->json(['user' => $user->load("formationsInscrites","formationsEnseignees")]);
    }


    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'role' => 'required|in:Formateur,Participant',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = User::create([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'role' => $request->role,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        return response()->json(['user' => $user], 201);
    }
    /**
     * Display the specified resource.
     */

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nom' => 'required|string',
            'prenom' => 'required|string',
            'email' => 'required|email|unique:users,email,'.$user->id,
            'password' => 'sometimes|required|string|min:6',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user->update([
            'nom' => $request->nom,
            'prenom' => $request->prenom,
            'email' => $request->email,
            'password' => isset($request->password) ? bcrypt($request->password) : $user->password,
        ]);

        return response()->json(['user' => $user], 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::find($id);

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully'], 200);
    }
    
}
