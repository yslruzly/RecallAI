"use client";
import { useEffect, useState } from "react";
import { Brain, BarChart2, CheckCircle, Target, Layers, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Eval {
  id: string;
  question: string;
  answer: string;
  document_name: string;
  faithfulness: number;
  relevance: number;
  completeness: number;
  created_at: string;
}

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const pct = Math.round(score * 100);
  const color =
    pct >= 80 ? "bg-foreground text-background border-foreground"
    : pct >= 50 ? "bg-muted-bg text-foreground border-border"
    : "bg-transparent text-muted border-border border-dashed";
  return (
    <span className={`text-xs font-mono px-2 py-0.5 rounded-md border ${color}`} title={label}>
      {pct}%
    </span>
  );
}

function avg(evals: Eval[], key: keyof Eval) {
  if (evals.length === 0) return 0;
  return evals.reduce((sum, e) => sum + (e[key] as number), 0) / evals.length;
}

export default function Dashboard() {
  const [evals, setEvals] = useState<Eval[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    function loadEvals() {
      fetch("/api/evals")
        .then((r) => r.json())
        .then((d) => { setEvals(d.evals || []); setLoading(false); });
    }

    loadEvals();
    const interval = setInterval(loadEvals, 10000); // refresh every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const avgFaithfulness = avg(evals, "faithfulness");
  const avgRelevance = avg(evals, "relevance");
  const avgCompleteness = avg(evals, "completeness");
  const avgOverall = (avgFaithfulness + avgRelevance + avgCompleteness) / 3;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-3.5 flex items-center gap-3 bg-white/70 backdrop-blur-md sticky top-0 z-10">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center shadow-glow">
          <BarChart2 className="w-[18px] h-[18px] text-white" />
        </div>
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-lg text-foreground tracking-tight leading-none">
            Answer quality
          </span>
          <span className="hidden sm:inline text-[10px] text-muted font-mono uppercase tracking-widest">
            Recall evals
          </span>
        </div>
        <Link
          href="/chat"
          className="ml-auto text-xs font-medium text-muted hover:text-primary transition-colors flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-primary/5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to chat
        </Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col gap-6 sm:gap-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          {[
            { label: "Overall", value: avgOverall, icon: Target },
            { label: "Faithfulness", value: avgFaithfulness, icon: CheckCircle },
            { label: "Relevance", value: avgRelevance, icon: Layers },
            { label: "Completeness", value: avgCompleteness, icon: BarChart2 },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="bg-card border border-border rounded-2xl p-4 flex flex-col gap-2 shadow-card">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-primary" />
                <span className="text-xs font-mono text-muted uppercase tracking-wider">{label}</span>
              </div>
              <p className="text-2xl font-extrabold text-foreground tracking-tight">{Math.round(value * 100)}%</p>
              <div className="w-full bg-muted-bg rounded-full h-1.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-primary to-primary-soft transition-all"
                  style={{ width: `${Math.round(value * 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-card">
          <div className="px-5 py-4 border-b border-border bg-muted-bg/50">
            <p className="font-semibold text-sm text-foreground">
              {evals.length} evaluated question{evals.length !== 1 ? "s" : ""}
            </p>
          </div>
          {loading ? (
            <div className="p-8 text-center text-muted text-sm font-mono">Loading…</div>
          ) : evals.length === 0 ? (
            <div className="p-8 text-center flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <p className="text-sm text-muted">No evals yet — ask some questions in Recall first.</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {evals.map((e) => (
                <div key={e.id} className="px-5 py-4 flex flex-col gap-2 hover:bg-muted-bg/40 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <p className="text-sm font-semibold text-foreground flex-1">{e.question}</p>
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <ScoreBadge score={e.faithfulness} label="Faithfulness" />
                      <ScoreBadge score={e.relevance} label="Relevance" />
                      <ScoreBadge score={e.completeness} label="Completeness" />
                    </div>
                  </div>
                  <p className="text-xs text-muted line-clamp-2">{e.answer}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-primary">{e.document_name}</span>
                    <span className="text-xs font-mono text-muted">{new Date(e.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
