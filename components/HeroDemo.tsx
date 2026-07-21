"use client";

import { useEffect, useState } from "react";
import { FileText, ShieldCheck } from "lucide-react";

// Phases of the looping demo:
// 0 = user asks   1 = Recall is searching (loading)   2 = grounded answer
const PHASE_DURATIONS = [1700, 1900, 4200];

export default function HeroDemo() {
  const [phase, setPhase] = useState(0);
  const [cycle, setCycle] = useState(0);

  useEffect(() => {
    const id = setTimeout(() => {
      setPhase((p) => {
        const next = (p + 1) % 3;
        if (next === 0) setCycle((c) => c + 1);
        return next;
      });
    }, PHASE_DURATIONS[phase]);
    return () => clearTimeout(id);
  }, [phase]);

  return (
    <div className="bg-card border border-border rounded-2xl shadow-card overflow-hidden">
      {/* Fixed header — never moves */}
      <div className="px-4 py-3 border-b border-border flex items-center gap-2">
        <FileText className="w-3.5 h-3.5 text-muted" />
        <span className="text-xs font-mono text-muted">data-structures.pdf</span>
        <span className="ml-auto inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
          Recall
        </span>
      </div>

      {/* Fixed-height body so the border stays put while content animates */}
      <div className="p-4 sm:p-6 flex flex-col gap-4 min-h-[300px] justify-start">
        {/* User question — replays its entrance each loop via key */}
        <div
          key={`q-${cycle}`}
          className="self-end max-w-[85%] bg-primary text-white px-4 py-3 rounded-2xl rounded-tr-md text-sm leading-relaxed animate-fade-up"
        >
          What&apos;s the difference between a stack and a queue?
        </div>

        {/* Loading state — visible only while Recall is "searching" */}
        {phase === 1 && (
          <div className="self-start animate-fade-up">
            <div className="bg-background border border-border border-l-2 border-l-primary px-4 py-3 rounded-2xl rounded-tl-md">
              <div className="flex items-center gap-2">
                <span className="demo-dot w-1.5 h-1.5 rounded-full bg-muted" />
                <span
                  className="demo-dot w-1.5 h-1.5 rounded-full bg-muted"
                  style={{ animationDelay: "0.15s" }}
                />
                <span
                  className="demo-dot w-1.5 h-1.5 rounded-full bg-muted"
                  style={{ animationDelay: "0.3s" }}
                />
                <span className="ml-2 text-xs font-mono text-muted">
                  Searching data-structures.pdf…
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Grounded answer — visible only after the search completes */}
        {phase === 2 && (
          <div className="self-start animate-fade-up">
            <div className="bg-background border border-border border-l-2 border-l-primary px-4 py-3 rounded-2xl rounded-tl-md text-sm leading-relaxed">
              According to your notes, a <strong>stack</strong> is LIFO — the
              last element pushed is the first popped, like the undo-history
              example on page 3. A <strong>queue</strong> is FIFO — elements
              leave in the order they arrived.
            </div>
            <div className="flex items-center gap-1.5 mt-2 px-1 flex-wrap">
              <span className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-accent">
                <ShieldCheck className="w-3 h-3" />
                Grounded in
              </span>
              <span className="text-xs px-2 py-0.5 rounded-md bg-accent/5 border border-border font-mono">
                data-structures.pdf
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
