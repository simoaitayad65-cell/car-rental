<?php

namespace App\Mail;

use App\Models\Reservation;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class NewReservationAdminMail extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct(public Reservation $reservation)
    {
        $this->reservation->loadMissing(['car', 'user']);
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            subject: sprintf(
                'Nouvelle réservation : %s %s',
                $this->reservation->car->marque,
                $this->reservation->car->modele
            ),
        );
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.new-reservation',
            with: [
                'reservation' => $this->reservation,
            ],
        );
    }
}
