"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Brain, Sparkles, ShieldCheck } from "lucide-react";
import clsx from "clsx";
import ReactMarkdown from "react-markdown";

interface Message {
  role: "user" | "assistant";
  content: string;
  sources?: string[];
}

interface ChatWindowProps {
  activeDocumentId: string | null;
  hasDocuments: boolean;
  onOpenNotes?: () => void;
}

const SUGGESTED = [
  "Summarize the key concepts",
  "What are the main topics covered?",
  "Explain the most important idea",
  "Create a quiz from these notes",
];

export default function ChatWindow({ activeDocumentId, hasDocuments, onOpenNotes }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function ask(question: string) {
    if (!question.trim() || loading || !hasDocuments) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: question }]);
    setLoading(true);

    const assistantMsg: Message = { role: "assistant", content: "", sources: [] };
    setMessages((prev) => [...prev, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, documentId: activeDocumentId }),
      });
      const data = await res.json();
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          ...next[next.length - 1],
          content: data.answer,
          sources: data.sources,
        };
        return next;
      });
    } catch (e) {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          ...next[next.length - 1],
          content: "Something went wrong. Try again.",
        };
        return next;
      });
    }

    setLoading(false);
    inputRef.current?.focus();
  }

  if (!hasDocuments) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-5 py-20 text-center brand-glow">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center shadow-glow">
          <Brain className="w-7 h-7 text-white" />
        </div>
        <div>
          <p className="font-bold text-xl text-foreground tracking-tight">Nothing to recall yet</p>
          <p className="text-sm text-muted mt-1.5">
            Upload your first file — then ask it anything
          </p>
        </div>
        {onOpenNotes && (
          <button
            onClick={onOpenNotes}
            className="md:hidden text-sm font-medium bg-primary text-white px-5 py-2.5 rounded-xl active:scale-95 transition-transform cursor-pointer"
          >
            Upload notes
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex-1 overflow-y-auto px-4 py-6 flex flex-col gap-5">
        {messages.length === 0 && (
          <div className="flex flex-col items-center gap-6 py-10 brand-glow rounded-3xl">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary" />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg text-foreground tracking-tight">
                Ask anything about your notes
              </p>
              <p className="text-xs text-muted mt-1.5 flex items-center justify-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-accent" />
                Grounded answers — sources shown with every reply
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-full max-w-md px-2">
              {SUGGESTED.map((s) => (
                <button
                  key={s}
                  onClick={() => ask(s)}
                  className="text-left text-sm px-3.5 py-3 rounded-xl border border-border bg-card hover:border-primary/40 hover:shadow-card transition-all duration-200 text-foreground cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={clsx(
              "flex flex-col gap-2 animate-fade-up",
              msg.role === "user" ? "items-end" : "items-start"
            )}
          >
            {msg.role === "user" ? (
              <div className="max-w-[85%] sm:max-w-[75%] bg-gradient-to-br from-primary to-primary-deep text-white px-4 py-3 rounded-2xl rounded-tr-md text-sm leading-relaxed shadow-card">
                {msg.content}
              </div>
            ) : (
              <div className="max-w-full sm:max-w-[90%] flex flex-col gap-2">
                <div className="bg-card border border-border border-l-2 border-l-primary px-4 py-3 rounded-2xl rounded-tl-md text-sm leading-relaxed text-foreground shadow-card">
                  {msg.content ? (
                    <ReactMarkdown
                      components={{
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                        strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
                        code: ({ children }) => (
                          <code className="bg-muted-bg px-1.5 py-0.5 rounded text-xs font-mono text-primary-deep">{children}</code>
                        ),
                        pre: ({ children }) => (
                          <pre className="bg-foreground text-white p-3 rounded-xl text-xs font-mono overflow-x-auto mb-2">{children}</pre>
                        ),
                        h1: ({ children }) => <h1 className="text-base font-bold mb-1 tracking-tight">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-sm font-bold mb-1 tracking-tight">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-sm font-semibold mb-1">{children}</h3>,
                      }}
                    >
                      {msg.content}
                    </ReactMarkdown>
                  ) : (
                    <span className="inline-flex gap-1" aria-label="Thinking">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-soft" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-soft" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse-soft" style={{ animationDelay: "300ms" }} />
                    </span>
                  )}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 px-1">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-accent">
                      <ShieldCheck className="w-3 h-3" />
                      Grounded in
                    </span>
                    {msg.sources.map((src) => (
                      <span
                        key={src}
                        className="text-xs px-2 py-0.5 rounded-md bg-accent/10 text-accent border border-accent/20 font-mono"
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-border px-4 py-3 bg-white/70 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && ask(input)}
            placeholder="Ask a question about your notes…"
            disabled={loading}
            aria-label="Ask a question about your notes"
            className="flex-1 text-sm bg-card border border-border rounded-xl px-4 py-2.5 outline-none focus:border-primary/60 focus:shadow-glow transition-all duration-200 placeholder:text-muted disabled:opacity-50"
          />
          <button
            onClick={() => ask(input)}
            disabled={!input.trim() || loading}
            aria-label="Send question"
            className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary to-primary-deep text-white flex items-center justify-center hover:opacity-90 active:scale-95 transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
