import { useEffect, useRef, useState } from "react";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import Badge from "../../components/ui/Badge";

const POLL_INTERVAL = 3000;

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const isToday = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return time;
  return `${d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} ${time}`;
}

export default function AdminChat() {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  function loadConversations() {
    api
      .get("/admin/conversations")
      .then(({ data }) => setConversations(data))
      .catch(() => {});
  }

  function loadThread(clientId) {
    api
      .get(`/admin/conversations/${clientId}`)
      .then(({ data }) => setMessages(data))
      .catch(() => {});
  }

  useEffect(() => {
    loadConversations();
    const id = setInterval(loadConversations, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!selected) return;
    loadThread(selected.user.id);
    const id = setInterval(() => loadThread(selected.user.id), POLL_INTERVAL);
    return () => clearInterval(id);
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function selectConversation(conv) {
    setSelected(conv);
    setMessages([]);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim() || !selected) return;
    setSending(true);
    try {
      const { data } = await api.post(`/admin/conversations/${selected.user.id}`, { body });
      setMessages((prev) => [...prev, data]);
      setBody("");
      loadConversations();
    } catch {
      // silently ignore, user can retry
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-2xl font-bold text-slate-900 dark:text-white">Messages</h1>
    <div className="flex h-[75vh] overflow-hidden rounded-xl border border-stone-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Conversation list */}
      <div className={`w-full shrink-0 border-r border-stone-200 dark:border-slate-800 lg:block lg:w-80 ${selected ? "hidden" : "block"}`}>
        <div className="overflow-y-auto">
          {conversations.length === 0 && (
            <p className="p-4 text-sm text-slate-500 dark:text-slate-400">Aucune conversation pour l'instant.</p>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.user.id}
              onClick={() => selectConversation(conv)}
              className={`flex w-full items-start gap-3 border-b border-stone-100 p-4 text-left transition-colors hover:bg-stone-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                selected?.user.id === conv.user.id ? "bg-violet-50 dark:bg-violet-500/10" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-violet-700 text-sm font-semibold text-white">
                {conv.user.name?.[0]?.toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between">
                  <p className="truncate text-sm font-medium text-slate-800 dark:text-slate-200">{conv.user.name}</p>
                  {conv.last_message && (
                    <span className="shrink-0 text-[11px] text-slate-400">
                      {formatTime(conv.last_message.created_at)}
                    </span>
                  )}
                </div>
                <p className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {conv.last_message?.body}
                </p>
              </div>
              {conv.unread_count > 0 && (
                <Badge color="violet">{conv.unread_count}</Badge>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Thread */}
      <div className={`flex min-w-0 flex-1 flex-col ${selected ? "flex" : "hidden lg:flex"}`}>
        {!selected && (
          <div className="flex h-full flex-col items-center justify-center text-slate-400 dark:text-slate-500">
            <MessageCircle size={32} />
            <p className="mt-2 text-sm">Sélectionnez une conversation</p>
          </div>
        )}

        {selected && (
          <>
            <div className="flex items-center gap-3 border-b border-stone-200 p-4 dark:border-slate-800">
              <button onClick={() => setSelected(null)} className="text-slate-500 lg:hidden">
                <ArrowLeft size={20} />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-700 text-sm font-semibold text-white">
                {selected.user.name?.[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{selected.user.name}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">{selected.user.email}</p>
              </div>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((m) => {
                const isMine = m.sender_id === user?.id;
                return (
                  <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                    <div className="flex max-w-[75%] flex-col">
                      <div
                        className={`rounded-2xl px-4 py-2 text-sm ${
                          isMine
                            ? "rounded-br-sm bg-violet-700 text-white"
                            : "rounded-bl-sm bg-stone-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
                        }`}
                      >
                        {m.body}
                      </div>
                      <span className="mt-1 px-1 text-[11px] text-slate-400">
                        {isMine ? "Vous" : m.sender?.name} · {formatTime(m.created_at)}
                      </span>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
            </div>

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-stone-200 p-3 dark:border-slate-800">
              <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Répondre..."
                className="flex-1 rounded-full border border-stone-300 px-4 py-2 text-sm focus:border-violet-700 focus:outline-none focus:ring-1 focus:ring-violet-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                disabled={sending || !body.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-700 text-white transition-colors hover:bg-violet-900 disabled:opacity-50"
              >
                <Send size={16} />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
    </div>
  );
}
