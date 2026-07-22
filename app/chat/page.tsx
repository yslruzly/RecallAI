"use client";
import { useState, useEffect, useCallback } from "react";
import UploadZone from "@/components/UploadZone";
import DocumentList from "@/components/DocumentList";
import ChatWindow from "@/components/ChatWindow";
import { Brain, ShieldCheck, Paperclip, BarChart2, FolderOpen, X, Home as HomeIcon } from "lucide-react";
import LoadingLink from "@/components/LoadingLink";

interface Doc {
  id: string;
  name: string;
  created_at: string;
}

export default function Home() {
  const [documents, setDocuments] = useState<Doc[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [drawerOpen, setDrawerOpen] = useState(false);

  async function fetchDocs() {
    const res = await fetch("/api/ingest");
    const data = await res.json();
    const docs = data.documents || [];
    setDocuments(docs);
    setLoading(false);
    return docs;
  }

  useEffect(() => { fetchDocs(); }, []);

  // Close drawer with Escape key
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setDrawerOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  async function handleUpload(name: string, text: string) {
    if (text.startsWith("__pdf__")) {
      const documentId = text.replace("__pdf__", "");

      await fetchDocs();

      setActiveId(documentId);
      return;
    }

    const res = await fetch("/api/ingest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, text }),
    });
    const data = await res.json();

    if (data.documentId) {
      await fetchDocs();
      setActiveId(data.documentId);
    }
  }

  async function handleDelete(id: string) {
    await fetch("/api/ingest", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (activeId === id) setActiveId(null);
    await fetchDocs();
  }

  const handleSelect = useCallback((id: string | null) => {
    setActiveId(id);
    setDrawerOpen(false); // close drawer after choosing on mobile
  }, []);

  const sidebarContent = (
    <>
      <UploadZone onUpload={handleUpload} />
      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 rounded-xl shimmer" />
          ))}
        </div>
      ) : (
        <DocumentList
          documents={documents}
          activeId={activeId}
          onSelect={handleSelect}
          onDelete={handleDelete}
        />
      )}

      <div className="mt-auto pt-4 border-t border-border flex flex-col gap-2.5">
        <div className="flex items-start gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            Every answer is grounded in your uploaded notes — never the AI&apos;s own knowledge.
          </p>
        </div>
        <div className="flex items-start gap-2">
          <Paperclip className="w-3.5 h-3.5 text-muted flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted leading-relaxed">
            Max file size: 5MB. Supported: .txt, .md, .pdf
          </p>
        </div>
      </div>
    </>
  );

  return (
    <div className="h-[100dvh] bg-background flex flex-col overflow-hidden">
      <header className="border-b border-border px-4 sm:px-6 py-3.5 flex items-center gap-3 bg-white/70 backdrop-blur-md sticky top-0 z-30">
        {/* Mobile: notes drawer toggle */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open notes panel"
          className="md:hidden w-9 h-9 rounded-xl border border-border bg-card flex items-center justify-center text-foreground active:scale-95 transition-transform cursor-pointer flex-shrink-0"
        >
          <FolderOpen className="w-4 h-4" />
        </button>

        <div className="hidden md:flex w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-deep items-center justify-center shadow-glow flex-shrink-0">
          <Brain className="w-[18px] h-[18px] text-white" />
        </div>
        <div className="flex items-baseline gap-2 min-w-0">
          <span className="font-extrabold text-lg text-foreground tracking-tight leading-none">
            Recall
          </span>
          <span className="hidden lg:inline text-[10px] text-muted font-mono uppercase tracking-widest">
            Grounded study AI
          </span>
        </div>
        <div className="ml-auto flex items-center gap-2">
          {documents.length > 0 && (
            <span className="hidden sm:inline text-xs font-mono text-primary bg-primary/5 border border-primary/15 px-2.5 py-1 rounded-lg">
              {documents.length} file{documents.length > 1 ? "s" : ""} indexed
            </span>
          )}
          <LoadingLink
            href="/"
            message="Returning home…"
            className="text-xs font-medium text-muted hover:text-primary transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-primary/5 cursor-pointer"
          >
            <HomeIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </LoadingLink>
          <a
            href="/dashboard"
            target="_blank"
            className="text-xs font-medium text-muted hover:text-primary transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-primary/5"
          >
            <BarChart2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Quality</span>
          </a>
        </div>
      </header>

      <div className="flex flex-1 min-h-0 max-w-6xl mx-auto w-full overflow-hidden relative">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-72 flex-shrink-0 border-r border-border flex-col gap-5 p-5 overflow-y-auto bg-white/40">
          {sidebarContent}
        </aside>

        {/* Mobile drawer + backdrop */}
        {drawerOpen && (
          <div
            className="md:hidden fixed inset-0 z-40 bg-foreground/30 backdrop-blur-[2px]"
            onClick={() => setDrawerOpen(false)}
            aria-hidden="true"
          />
        )}
        <aside
          className={`md:hidden fixed inset-y-0 left-0 z-50 w-[85vw] max-w-xs bg-background border-r border-border flex flex-col gap-5 p-5 pt-4 overflow-y-auto transition-transform duration-300 ease-out ${
            drawerOpen ? "translate-x-0 shadow-glow" : "-translate-x-full"
          }`}
          aria-label="Notes panel"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
              Notes
            </span>
            <button
              onClick={() => setDrawerOpen(false)}
              aria-label="Close notes panel"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-muted hover:text-foreground hover:bg-muted-bg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          {sidebarContent}
        </aside>

        <main className="flex-1 flex flex-col min-h-0 min-w-0">
          <ChatWindow
            activeDocumentId={activeId}
            hasDocuments={documents.length > 0}
            onOpenNotes={() => setDrawerOpen(true)}
          />
        </main>
      </div>
    </div>
  );
}
