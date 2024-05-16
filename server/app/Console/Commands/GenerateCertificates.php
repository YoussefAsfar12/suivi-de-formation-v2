<?php

namespace App\Console\Commands;

use App\Models\Formation;
use App\Models\Certification;
use Illuminate\Console\Command;

class GenerateCertificates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:generate-certificates';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Generate certificates for enrolled users of finished formations';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Find all finished formations
        $finishedFormations = Formation::where('dateFin', '<=', now())->get();
   
        foreach ($finishedFormations as $formation) {
            // Get all enrolled users for this formation
            $enrolledUsers = $formation->users;
      
          
            foreach ($enrolledUsers as $user) {
                // Check if certificate already exists for this user and formation
              
                $existingCertificate = Certification::where('formation_id', $formation->id)
                    ->where('user_id', $user->id)
                    ->exists();
                   
                // If certificate doesn't exist, create one
                if (!$existingCertificate) {
                    // Adjust certificate fields as needed
                    $certificate = Certification::create([
                        'formation_id' => $formation->id,
                        'titre' => $formation->titre, // Assuming formation title is used as certificate title
                        'dateObtention' => now(), // Assuming certificate is issued now
                        'domaine' => $formation->domaine, // Assuming domain of the formation is used for certificate
                        'niveau' => $formation->niveau, // Assuming level of the formation is used for certificate
                        'user_id' => $user->id,
                    ]);

                  
                    // Fire event for certificate creation
          
                    // Create notification for the user about the certificate
                    $user->notifications()->create([
                        'title' => 'Certificate in ' . $formation->titre,
                        'body' => 'You have received a certificate for completing the formation: ' . $formation->title,
                        "read" => false,
                        "user_id" => $user->id
                    ]);
                    $user->increment('unread_notifications');
                    event(new \App\Events\NotificationCreated($user->notifications->last()));
                }
            }
        }

        $this->info('Certificates generated successfully.');
    }
}
