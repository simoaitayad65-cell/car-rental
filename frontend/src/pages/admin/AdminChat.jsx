import { useEffect, useRef, useState } from "react";
import { Send, ArrowLeft, MessageCircle } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/client";
import Badge from "../../components/ui/Badge";
import EmptyState from "../../components/ui/EmptyState";

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
    <div className="flex h-[75vh] overflow-hidden rounded-xl border border-slate-200 bg-slate-50 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Conversation list */}
      <div className={`w-full shrink-0 border-r border-slate-200 dark:border-slate-800 lg:block lg:w-80 ${selected ? "hidden" : "block"}`}>
        <div className="overflow-y-auto">
          {conversations.length === 0 && (
            <div className="p-4">
              <EmptyState icon={MessageCircle} title="Aucune conversation" description="Les messages des clients apparaîtront ici." />
            </div>
          )}
          {conversations.map((conv) => (
            <button
              key={conv.user.id}
              onClick={() => selectConversation(conv)}
              className={`flex w-full items-start gap-3 border-b border-slate-100 p-4 text-left transition-colors hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 ${
                selected?.user.id === conv.user.id ? "bg-blue-50 dark:bg-blue-500/10" : ""
              }`}
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-900 text-sm font-semibold text-white">
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
                <Badge color="blue">{conv.unread_count}</Badge>
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
            <div className="flex items-center gap-3 border-b border-slate-200 p-4 dark:border-slate-800">
              <button onClick={() => setSelected(null)} className="text-slate-500 lg:hidden">
                <ArrowLeft size={20} />
              </button>
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-900 text-sm font-semibold text-white">
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
                            ? "rounded-br-sm bg-blue-900 text-white"
                            : "rounded-bl-sm bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200"
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

            <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-slate-200 p-3 dark:border-slate-800">
              <input
                type="text"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Répondre..."
                className="flex-1 rounded-full border border-slate-300 px-4 py-2 text-sm focus:border-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-900 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200"
              />
              <button
                type="submit"
                disabled={sending || !body.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-900 text-white transition-colors hover:bg-blue-950 disabled:opacity-50"
              >
                {sending ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                ) : (
                  <Send size={16} />
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
    </div>
  );
}
