"use client";
import { FileText, Trash2 } from "lucide-react";

interface Doc {
  id: string;
  name: string;
  created_at: string;
}

interface DocumentListProps {
  documents: Doc[];
  activeId: string | null;
  onSelect: (id: string | null) => void;
  onDelete: (id: string) => void;
}

export default function DocumentList({ documents, activeId, onSelect, onDelete }: DocumentListProps) {
  if (documents.length === 0) return null;

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] font-mono text-muted uppercase tracking-widest">Your notes</p>
        <button
          onClick={() => onSelect(null)}
          className={`text-xs px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
            activeId === null
              ? "bg-primary text-white"
              : "text-muted hover:text-primary hover:bg-primary/5"
          }`}
        >
          All
        </button>
      </div>
      {documents.map((doc) => (
        <div
          key={doc.id}
          className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200 ${
            activeId === doc.id
              ? "bg-primary/10 border border-primary/25"
              : "hover:bg-card hover:shadow-card border border-transparent"
          }`}
          onClick={() => onSelect(activeId === doc.id ? null : doc.id)}
        >
          <FileText className={`w-4 h-4 flex-shrink-0 ${activeId === doc.id ? "text-primary" : "text-muted"}`} />
          <span className={`text-sm flex-1 truncate ${activeId === doc.id ? "text-primary font-semibold" : "text-foreground"}`}>
            {doc.name}
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(doc.id); }}
            className="opacity-0 group-hover:opacity-100 focus-visible:opacity-100 text-muted hover:text-destructive transition-all p-1.5 rounded-lg cursor-pointer"
            aria-label={`Delete ${doc.name}`}
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
