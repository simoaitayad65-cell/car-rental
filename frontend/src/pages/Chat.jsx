import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";
import PageContainer from "../components/ui/PageContainer";
import Card from "../components/ui/Card";

const POLL_INTERVAL = 3000;

function formatTime(dateStr) {
  const d = new Date(dateStr);
  const isToday = d.toDateString() === new Date().toDateString();
  const time = d.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
  if (isToday) return time;
  return `${d.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })} ${time}`;
}

export default function Chat() {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const bottomRef = useRef(null);
  const isFirstLoad = useRef(true);

  function load() {
    api
      .get("/conversation")
      .then(({ data }) => setMessages(data))
      .catch(() => setError("Impossible de charger la discussion"))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    load();
    const id = setInterval(load, POLL_INTERVAL);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: isFirstLoad.current ? "auto" : "smooth" });
    isFirstLoad.current = false;
  }, [messages]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!body.trim()) return;
    setSending(true);
    setError(null);
    try {
      const { data } = await api.post("/conversation", { body });
      setMessages((prev) => [...prev, data]);
      setBody("");
    } catch {
      setError("Impossible d'envoyer le message");
    } finally {
      setSending(false);
    }
  }

  return (
    <PageContainer narrow>
      <div className="mb-4 flex items-center gap-2">
        <MessageCircle className="text-violet-700" size={22} />
        <h1 className="text-2xl font-bold text-slate-900">Contacter l'administration</h1>
      </div>

      <Card className="flex h-[65vh] flex-col overflow-hidden">
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {loading && <p className="text-center text-sm text-slate-500">Chargement...</p>}

          {!loading && messages.length === 0 && (
            <p className="py-8 text-center text-sm text-slate-500">
              Aucun message pour l'instant. Posez votre question ci-dessous !
            </p>
          )}

          {messages.map((m) => {
            const isMine = m.sender_id === user?.id;
            return (
              <div key={m.id} className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] ${isMine ? "items-end" : "items-start"} flex flex-col`}>
                  <div
                    className={`rounded-2xl px-4 py-2 text-sm ${
                      isMine
                        ? "rounded-br-sm bg-violet-700 text-white"
                        : "rounded-bl-sm bg-stone-100 text-slate-800"
                    }`}
                  >
                    {m.body}
                  </div>
                  <span className="mt-1 px-1 text-[11px] text-slate-400">
                    {isMine ? "Vous" : m.sender?.name ?? "Admin"} · {formatTime(m.created_at)}
                  </span>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-stone-200 p-3">
          <input
            type="text"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Écrivez votre message..."
            className="flex-1 rounded-full border border-stone-300 px-4 py-2 text-sm focus:border-violet-700 focus:outline-none focus:ring-1 focus:ring-violet-700"
          />
          <button
            type="submit"
            disabled={sending || !body.trim()}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-700 text-white transition-colors hover:bg-violet-900 disabled:opacity-50"
          >
            <Send size={16} />
          </button>
        </form>
      </Card>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </PageContainer>
  );
}
