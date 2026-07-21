"use client";
import { useRef, useState } from "react";
import { Upload, Loader2, Clock } from "lucide-react";
import clsx from "clsx";

interface UploadZoneProps {
  onUpload: (name: string, text: string) => Promise<void>;
}

export default function UploadZone({ onUpload }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingFile, setLoadingFile] = useState("");
  const [slowWarning, setSlowWarning] = useState(false);

  async function processFiles(files: FileList | File[]) {
    const arr = Array.from(files);
    setLoading(true);
    for (const file of arr) {
      setLoadingFile(file.name);
      try {
        if (file.name.toLowerCase().endsWith(".pdf")) {
          if (file.size > 500 * 1024) { // show warning for files over 500KB
            setSlowWarning(true);
          }
          const formData = new FormData();
          formData.append("file", file);
          const res = await fetch("/api/ingest", {
            method: "POST",
            body: formData,
          });
          if (res.ok) {
            const data = await res.json();
            await onUpload(file.name, "__pdf__" + data.documentId);
          } else {
            console.log("Upload failed:", res.status);
          }
        } else {
          const text = await file.text();
          await onUpload(file.name, text);
        }
      } catch (e) {
        console.error("File processing error:", e);
      }
    }
    setLoading(false);
    setLoadingFile("");
    setSlowWarning(false);
  }

  return (
    <div
      className={clsx(
        "border-2 border-dashed border-border rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 select-none bg-card hover:border-primary/40 hover:shadow-card",
        dragging && "drop-active",
        loading && "opacity-80 pointer-events-none"
      )}
      role="button"
      tabIndex={0}
      aria-label="Upload notes — .txt, .md, or .pdf"
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        processFiles(e.dataTransfer.files);
      }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        multiple
        accept=".txt,.md,.pdf"
        onChange={(e) => e.target.files && processFiles(e.target.files)}
      />
      <div className="flex flex-col items-center gap-3">
        {loading ? (
          <>
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-sm text-muted font-mono break-all">Processing {loadingFile}…</p>
            {slowWarning && (
              <div className="flex items-start gap-2 bg-muted-bg border border-border rounded-xl px-3 py-2 mt-1">
                <Clock className="w-3.5 h-3.5 text-muted flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted text-left leading-relaxed">
                  Large file — this may take a few minutes. Keep this page open.
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Upload className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground text-sm">Drop your notes here</p>
              <p className="text-xs text-muted mt-1">.txt · .md · .pdf — multiple files OK</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
