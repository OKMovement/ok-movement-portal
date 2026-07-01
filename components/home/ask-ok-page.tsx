"use client";

import { useState, useRef, useEffect, useCallback, type FormEvent } from "react";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Loader2,
  MessageSquare,
  ShieldCheck,
  ArrowDown,
  RotateCcw,
  CheckCircle2,
  XCircle,
  AlertTriangle,
} from "lucide-react";
import HomeSiteHeader from "@/components/home/home-site-header";
import HomeFooterSection from "@/components/home/home-footer-section";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const SUGGESTED_QUESTIONS = [
  "What are Peter Obi's key achievements as Anambra Governor?",
  "Tell me about Kwankwaso's scholarship programme in Kano",
  "What is the OK Movement's vision for Nigeria?",
  "How did Peter Obi reduce Anambra's debt?",
  "What infrastructure did Kwankwaso build in Kano?",
  "Compare both principals' education policies",
];

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-2">
      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-green [animation-delay:0ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-green [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-green [animation-delay:300ms]" />
    </div>
  );
}

function FactCheckBadge({ type }: { type: "true" | "false" | "partial" | "info" }) {
  const config = {
    true: { icon: CheckCircle2, label: "Verified True", color: "text-green-600 bg-green-50 border-green-200" },
    false: { icon: XCircle, label: "False", color: "text-red-600 bg-red-50 border-red-200" },
    partial: { icon: AlertTriangle, label: "Partially True", color: "text-amber-600 bg-amber-50 border-amber-200" },
    info: { icon: ShieldCheck, label: "Fact-Checked", color: "text-brand-green bg-brand-green/5 border-brand-green/20" },
  }[type];
  const Icon = config.icon;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${config.color}`}>
      <Icon className="h-3 w-3" />
      {config.label}
    </span>
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function parseMarkdown(text: string): string {
  let html = escapeHtml(text)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)$/gm, '<h4 class="text-sm font-bold mt-3 mb-1">$1</h4>')
    .replace(/^## (.+)$/gm, '<h3 class="text-base font-bold mt-3 mb-1">$1</h3>')
    .replace(/^- (.+)$/gm, '<li class="ml-4 list-disc">$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li class="ml-4 list-decimal">$2</li>')
    .replace(/\n{2,}/g, '<br/><br/>')
    .replace(/\n/g, '<br/>');

  html = html.replace(/((?:<li[^>]*>.*?<\/li>\s*)+)/g, '<ul class="my-2 space-y-1">$1</ul>');

  return html;
}

function detectFactCheckType(content: string): "true" | "false" | "partial" | "info" | null {
  const lower = content.toLowerCase();
  if (/\b(this is true|verdict:\s*true|this claim is true|confirmed true)\b/.test(lower)) return "true";
  if (/\b(this is false|verdict:\s*false|this claim is false|confirmed false)\b/.test(lower)) return "false";
  if (/\b(partially true|partly true|verdict:\s*partial)\b/.test(lower)) return "partial";
  if (/\b(fact.?check|verdict|claim|evidence)\b/.test(lower)) return "info";
  return null;
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const factCheckType = !isUser ? detectFactCheckType(message.content) : null;

  return (
    <div className={`flex gap-3 ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
          isUser
            ? "bg-brand-green text-white"
            : "bg-gradient-to-br from-brand-green/10 to-brand-green/5 text-brand-green ring-1 ring-brand-green/15"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>

      <div className={`max-w-[80%] sm:max-w-[75%] ${isUser ? "text-right" : ""}`}>
        {!isUser && (
          <div className="mb-1 flex items-center gap-2">
            <span className="text-xs font-semibold text-brand-green">Ask OK</span>
            {factCheckType && <FactCheckBadge type={factCheckType} />}
          </div>
        )}
        <div
          className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-md bg-brand-green text-white"
              : "rounded-tl-md border border-gray-100 bg-white text-gray-800 shadow-sm"
          }`}
        >
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div
              className="prose-sm max-w-none [&_strong]:font-semibold [&_h3]:text-brand-black [&_h4]:text-brand-black [&_li]:text-gray-700"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default function AskOkPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    if (!showScrollBtn) scrollToBottom();
  }, [messages, showScrollBtn, scrollToBottom]);

  const handleScroll = useCallback(() => {
    const el = chatContainerRef.current;
    if (!el) return;
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
    setShowScrollBtn(!atBottom);
  }, []);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isStreaming) return;

      const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text.trim() };
      const assistantId = crypto.randomUUID();

      setMessages((prev) => [...prev, userMsg]);
      setInput("");
      setIsStreaming(true);

      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));

      try {
        const res = await fetch("/api/ask-ok", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messages: history }),
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error("No response stream");

        const decoder = new TextDecoder();
        let accumulated = "";
        let buffer = "";
        let streamFinished = false;

        setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }]);

        while (!streamFinished) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (!line.startsWith("data: ")) continue;
            try {
              const data = JSON.parse(line.slice(6));
              if (data.done) {
                streamFinished = true;
                break;
              }
              if (data.error) {
                accumulated += `\n\n_Error: ${data.error}_`;
                streamFinished = true;
                break;
              }
              if (data.content) {
                accumulated += data.content;
                setMessages((prev) =>
                  prev.map((m) => (m.id === assistantId ? { ...m, content: accumulated } : m))
                );
              }
            } catch {
              // skip malformed
            }
          }
        }
      } catch (err) {
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: "assistant",
            content:
              "I'm sorry, I wasn't able to process your question right now. Please try again in a moment.",
          },
        ]);
      } finally {
        setIsStreaming(false);
        inputRef.current?.focus();
      }
    },
    [isStreaming, messages]
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const resetChat = () => {
    setMessages([]);
    setInput("");
    inputRef.current?.focus();
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/60">
      <HomeSiteHeader />

      <main className="relative flex flex-1 flex-col">
        {!hasMessages ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 py-12 sm:py-16">
            <div className="relative mb-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-green to-brand-green/80 shadow-xl shadow-brand-green/20">
                <Sparkles className="h-10 w-10 text-white" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-brand-red text-[10px] font-bold text-white shadow-lg">
                AI
              </div>
            </div>

            <h1 className="mb-2 text-center text-3xl font-bold tracking-tight text-brand-black sm:text-4xl">
              Ask <span className="text-brand-green">O</span><span className="text-brand-red">K</span>
            </h1>
            <p className="mb-1 max-w-md text-center text-sm text-gray-500 sm:text-base">
              Your AI-powered fact-checker for the OK Movement
            </p>
            <p className="mb-8 max-w-lg text-center text-xs text-gray-400">
              Get verified information about Peter Obi &amp; Rabiu Kwankwaso — their track records,
              achievements, and policies. Powered by AI with real-time fact-checking.
            </p>

            <div className="mb-10 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-green/20 bg-brand-green/5 px-3 py-1 text-[11px] font-medium text-brand-green">
                <ShieldCheck className="h-3 w-3" /> Fact-checked responses
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-600">
                <MessageSquare className="h-3 w-3" /> Conversational AI
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-600">
                <Bot className="h-3 w-3" /> Multi-source intelligence
              </span>
            </div>

            <div className="w-full max-w-2xl">
              <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-400">
                Try asking
              </p>
              <div className="grid gap-2 sm:grid-cols-2">
                {SUGGESTED_QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="group rounded-xl border border-gray-200 bg-white px-4 py-3 text-left text-[13px] text-gray-600 shadow-sm transition hover:border-brand-green/30 hover:bg-brand-green/[0.03] hover:text-brand-black hover:shadow-md"
                  >
                    <span className="mr-2 inline-block text-brand-green/60 transition group-hover:text-brand-green">
                      →
                    </span>
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-1 flex-col">
            <div className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md">
              <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-green to-brand-green/80">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-bold text-brand-black">
                      Ask <span className="text-brand-green">O</span><span className="text-brand-red">K</span>
                    </h2>
                    <p className="text-[10px] text-gray-400">AI Fact-Checker</p>
                  </div>
                </div>
                <button
                  onClick={resetChat}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-600 transition hover:border-gray-300 hover:bg-gray-50"
                >
                  <RotateCcw className="h-3 w-3" />
                  New chat
                </button>
              </div>
            </div>

            <div
              ref={chatContainerRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-6"
            >
              <div className="mx-auto max-w-3xl space-y-6">
                {messages.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} />
                ))}
                {isStreaming && messages[messages.length - 1]?.role === "user" && (
                  <div className="flex gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-green/10 to-brand-green/5 text-brand-green ring-1 ring-brand-green/15">
                      <Bot className="h-4 w-4" />
                    </div>
                    <TypingIndicator />
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {showScrollBtn && (
              <button
                onClick={scrollToBottom}
                className="absolute bottom-28 left-1/2 z-10 -translate-x-1/2 rounded-full border border-gray-200 bg-white p-2 shadow-lg transition hover:bg-gray-50"
              >
                <ArrowDown className="h-4 w-4 text-gray-600" />
              </button>
            )}
          </div>
        )}

        <div className="sticky bottom-0 border-t border-gray-100 bg-white/90 px-4 py-3 backdrop-blur-md">
          <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
            <div className="flex items-end gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-2 shadow-sm transition focus-within:border-brand-green/40 focus-within:shadow-md focus-within:shadow-brand-green/5">
              <textarea
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Peter Obi, Kwankwaso, or the OK Movement..."
                rows={1}
                className="max-h-32 flex-1 resize-none border-0 bg-transparent py-2 text-sm text-brand-black outline-none placeholder:text-gray-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isStreaming}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-green text-white shadow-sm transition hover:bg-brand-green/90 disabled:opacity-40 disabled:hover:bg-brand-green"
              >
                {isStreaming ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>
            <p className="mt-2 text-center text-[10px] text-gray-400">
              Ask OK uses AI to provide fact-checked information. Always verify important claims from official sources.
            </p>
          </form>
        </div>
      </main>

      {!hasMessages && <HomeFooterSection />}
    </div>
  );
}
