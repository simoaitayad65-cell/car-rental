<?php

namespace App\Http\Controllers;

use App\Models\Message;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class MessageController extends Controller
{
    // GET /api/conversation — client's own thread with the admin team
    public function show(Request $request)
    {
        $user = $request->user();

        Message::where('user_id', $user->id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = Message::where('user_id', $user->id)
            ->with('sender:id,name,role')
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    // POST /api/conversation — client sends a message
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'body' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $user = $request->user();

        $message = Message::create([
            'user_id' => $user->id,
            'sender_id' => $user->id,
            'body' => $request->body,
        ]);

        return response()->json($message->load('sender:id,name,role'), 201);
    }

    // GET /api/admin/conversations — admin inbox: one row per client
    public function adminIndex()
    {
        $clientIds = Message::select('user_id')->distinct()->pluck('user_id');

        $conversations = User::whereIn('id', $clientIds)
            ->get()
            ->map(function ($client) {
                $lastMessage = Message::where('user_id', $client->id)->latest()->first();
                $unreadCount = Message::where('user_id', $client->id)
                    ->where('sender_id', $client->id)
                    ->whereNull('read_at')
                    ->count();

                return [
                    'user' => $client->only(['id', 'name', 'email']),
                    'last_message' => $lastMessage,
                    'unread_count' => $unreadCount,
                ];
            })
            ->sortByDesc(fn ($c) => $c['last_message']?->created_at)
            ->values();

        return response()->json($conversations);
    }

    // GET /api/admin/conversations/{client} — admin views a client's thread
    public function adminShow(User $client)
    {
        Message::where('user_id', $client->id)
            ->where('sender_id', $client->id)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $messages = Message::where('user_id', $client->id)
            ->with('sender:id,name,role')
            ->orderBy('created_at')
            ->get();

        return response()->json($messages);
    }

    // POST /api/admin/conversations/{client} — admin replies
    public function adminStore(Request $request, User $client)
    {
        $validator = Validator::make($request->all(), [
            'body' => 'required|string|max:2000',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 422);
        }

        $message = Message::create([
            'user_id' => $client->id,
            'sender_id' => $request->user()->id,
            'body' => $request->body,
        ]);

        return response()->json($message->load('sender:id,name,role'), 201);
    }
}
