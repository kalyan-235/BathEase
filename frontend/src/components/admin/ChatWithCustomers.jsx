import { useState, useRef, useEffect } from 'react';
import { Card } from '@/components/card';
import { Button } from '@/components/button';
import {
  MessageCircle, Send, Phone, ExternalLink,
  User, CheckCheck, Clock, Search,
} from 'lucide-react';

// ── Mock conversation data ────────────────────────────────────────────────────
// In production, replace with real-time WebSocket or polling API calls.
const MOCK_CONVERSATIONS = [
  {
    id: 1,
    name: 'Priya Sharma',
    email: 'priya@example.com',
    whatsapp: '919876543210',
    avatar: null,
    lastMessage: 'When will the cleaner arrive?',
    lastTime: '10:32 AM',
    unread: 2,
    messages: [
      { id: 1, from: 'customer', text: 'Hi, I have a booking tomorrow.', time: '10:28 AM' },
      { id: 2, from: 'admin',    text: 'Hello! How can I help you?',      time: '10:29 AM' },
      { id: 3, from: 'customer', text: 'When will the cleaner arrive?',   time: '10:32 AM' },
    ],
  },
  {
    id: 2,
    name: 'Ravi Kumar',
    email: 'ravi@example.com',
    whatsapp: '919765432109',
    avatar: null,
    lastMessage: 'Thank you for the quick service!',
    lastTime: '9:15 AM',
    unread: 0,
    messages: [
      { id: 1, from: 'customer', text: 'The bathroom looks great!',           time: '9:10 AM' },
      { id: 2, from: 'admin',    text: 'Glad to hear that! Thank you 🙏',    time: '9:12 AM' },
      { id: 3, from: 'customer', text: 'Thank you for the quick service!',    time: '9:15 AM' },
    ],
  },
  {
    id: 3,
    name: 'Anitha Reddy',
    email: 'anitha@example.com',
    whatsapp: '919654321098',
    avatar: null,
    lastMessage: 'Can I reschedule my booking?',
    lastTime: 'Yesterday',
    unread: 1,
    messages: [
      { id: 1, from: 'customer', text: 'Can I reschedule my booking?', time: 'Yesterday' },
    ],
  },
];

const WHATSAPP_BUSINESS = '919000000000'; // replace with actual business WhatsApp number

export function ChatWithCustomers() {
  const [conversations, setConversations]   = useState(MOCK_CONVERSATIONS);
  const [activeId,      setActiveId]        = useState(MOCK_CONVERSATIONS[0].id);
  const [input,         setInput]           = useState('');
  const [search,        setSearch]          = useState('');
  const [chatMode,      setChatMode]        = useState('app'); // 'app' | 'whatsapp'
  const messagesEndRef = useRef(null);

  const active = conversations.find((c) => c.id === activeId);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages?.length, activeId]);

  // Mark conversation as read when opened
  useEffect(() => {
    setConversations((prev) =>
      prev.map((c) => (c.id === activeId ? { ...c, unread: 0 } : c))
    );
  }, [activeId]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text || !active) return;
    const newMsg = {
      id: Date.now(),
      from: 'admin',
      text,
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeId
          ? { ...c, messages: [...c.messages, newMsg], lastMessage: text, lastTime: newMsg.time }
          : c
      )
    );
    setInput('');
  };

  const openWhatsApp = (wa) => {
    const url = `https://wa.me/${wa}?text=${encodeURIComponent('Hello! BathEase Admin here. How can we help you?')}`;
    window.open(url, '_blank');
  };

  const filteredConvs = conversations.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-1 p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageCircle className="h-6 w-6 text-primary" /> Chat with Customers
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            In-app chat or open WhatsApp directly from here
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => setChatMode('app')}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
              chatMode === 'app'
                ? 'bg-primary text-primary-foreground'
                : 'bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            <MessageCircle className="h-3.5 w-3.5" />
            In-App Chat
          </button>
          <button
            onClick={() => setChatMode('whatsapp')}
            className={`px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors ${
              chatMode === 'whatsapp'
                ? 'bg-green-600 text-white'
                : 'bg-background text-muted-foreground hover:bg-muted'
            }`}
          >
            {/* WhatsApp icon via SVG */}
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 fill-current" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            WhatsApp
          </button>
        </div>
      </div>

      {/* ── IN-APP CHAT ── */}
      {chatMode === 'app' && (
        <Card className="overflow-hidden p-0 flex" style={{ height: '560px' }}>
          {/* Conversation List */}
          <div className="w-72 shrink-0 border-r border-border/60 flex flex-col">
            {/* Search */}
            <div className="p-3 border-b border-border/60">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search customers…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 rounded-lg border border-border bg-muted/30 text-sm outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto">
              {filteredConvs.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveId(c.id)}
                  className={`w-full text-left px-4 py-3 flex items-start gap-3 border-b border-border/40 transition-colors ${
                    c.id === activeId ? 'bg-primary/5' : 'hover:bg-muted/30'
                  }`}
                >
                  {/* Avatar */}
                  <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {c.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold truncate">{c.name}</span>
                      <span className="text-[10px] text-muted-foreground shrink-0 ml-1">{c.lastTime}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate mt-0.5">{c.lastMessage}</p>
                  </div>
                  {c.unread > 0 && (
                    <span className="shrink-0 h-5 min-w-5 rounded-full bg-primary text-primary-foreground text-[10px] font-bold grid place-items-center">
                      {c.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Chat window */}
          {active && (
            <div className="flex-1 flex flex-col">
              {/* Chat header */}
              <div className="px-5 py-3 border-b border-border/60 flex items-center gap-3 bg-muted/20">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary font-bold text-sm">
                  {active.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{active.name}</p>
                  <p className="text-xs text-muted-foreground">{active.email}</p>
                </div>
                {active.whatsapp && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="gap-1.5 text-green-600 border-green-300 hover:bg-green-50"
                    onClick={() => openWhatsApp(active.whatsapp)}
                  >
                    <Phone className="h-3.5 w-3.5" />
                    WhatsApp
                  </Button>
                )}
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 bg-muted/10">
                {active.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex ${m.from === 'admin' ? 'justify-end' : 'justify-start'}`}
                  >
                    {m.from === 'customer' && (
                      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-muted mr-2 self-end">
                        <User className="h-3.5 w-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <div
                      className={`max-w-[70%] px-4 py-2.5 rounded-2xl text-sm ${
                        m.from === 'admin'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-white text-foreground border border-border/60 rounded-bl-sm shadow-sm'
                      }`}
                    >
                      <p>{m.text}</p>
                      <div className={`flex items-center gap-1 mt-1 text-[10px] ${
                        m.from === 'admin' ? 'text-primary-foreground/70 justify-end' : 'text-muted-foreground'
                      }`}>
                        <Clock className="h-2.5 w-2.5" />
                        {m.time}
                        {m.from === 'admin' && <CheckCheck className="h-2.5 w-2.5 ml-0.5" />}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3 border-t border-border/60 flex gap-2 items-end">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                  }}
                  placeholder="Type a message… (Enter to send)"
                  className="flex-1 resize-none rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/30 max-h-28"
                />
                <Button
                  size="sm"
                  onClick={sendMessage}
                  disabled={!input.trim()}
                  className="h-10 w-10 p-0 rounded-xl"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* ── WHATSAPP MODE ── */}
      {chatMode === 'whatsapp' && (
        <div className="space-y-4">
          {/* Business number quick link */}
          <Card className="p-5 flex items-center justify-between gap-4 border-green-200 bg-green-50/50">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-green-500 text-white">
                <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <p className="font-semibold text-sm">BathEase Business WhatsApp</p>
                <p className="text-xs text-muted-foreground">Receive & reply to customer messages</p>
              </div>
            </div>
            <a
              href={`https://web.whatsapp.com`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="bg-green-600 hover:bg-green-700 gap-2">
                <ExternalLink className="h-4 w-4" />
                Open WhatsApp Web
              </Button>
            </a>
          </Card>

          {/* Customer list — click to open WhatsApp chat with that customer */}
          <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
            Start WhatsApp chat with customer
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {conversations.map((c) => (
              <Card key={c.id} className="p-4 flex items-center gap-3">
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-green-100 text-green-700 font-bold text-sm">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{c.email}</p>
                  {c.whatsapp && (
                    <p className="text-xs text-green-600 font-medium mt-0.5">+{c.whatsapp}</p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => openWhatsApp(c.whatsapp)}
                  disabled={!c.whatsapp}
                >
                  <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
