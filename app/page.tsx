import Link from "next/link";
import {
  Brain,
  Upload,
  MessageCircleQuestion,
  BadgeCheck,
  ArrowRight,
  ArrowDown,
  BarChart2,
} from "lucide-react";
import HeroDemo from "@/components/HeroDemo";

export const metadata = {
  title: "Recall — Ask your notes anything",
  description:
    "Upload your study notes and get answers grounded only in what you wrote — with sources to prove it.",
};

export default function Landing() {
  return (
    <div className="bg-background text-foreground">
      {/* Fixed nav */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center">
            <Brain className="w-[18px] h-[18px] text-white" />
          </div>
          <span className="font-extrabold text-lg tracking-tight">Recall</span>
          <div className="ml-auto flex items-center gap-1 sm:gap-2">
            <a
              href="#how"
              className="hidden sm:inline text-sm text-muted hover:text-foreground px-3 py-2 rounded-lg transition-colors"
            >
              How it works
            </a>
            <a
              href="#quality"
              className="hidden sm:inline text-sm text-muted hover:text-foreground px-3 py-2 rounded-lg transition-colors"
            >
              Quality
            </a>
            <Link
              href="/chat"
              className="text-sm font-semibold bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary-soft transition-colors"
            >
              Open Recall
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero — full viewport */}
      <section className="min-h-[100dvh] flex flex-col brand-glow">
        <div className="flex-1 flex items-center pt-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full grid lg:grid-cols-2 gap-10 lg:gap-16 items-center py-10">
            <div className="flex flex-col items-start gap-6">
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-extrabold tracking-tight leading-[1.05]">
                Ask your notes anything.
              </h1>
              <p className="text-base sm:text-lg text-muted leading-relaxed max-w-md">
                Upload your study notes. Get answers grounded only in what you
                wrote — never the AI&apos;s imagination — with sources on every
                reply.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                <Link
                  href="/chat"
                  className="inline-flex items-center justify-center gap-2 text-sm font-semibold bg-primary text-white px-6 py-3.5 rounded-xl hover:bg-primary-soft transition-colors"
                >
                  Start asking <ArrowRight className="w-4 h-4" />
                </Link>
                <a
                  href="#how"
                  className="inline-flex items-center justify-center text-sm font-medium text-foreground border border-border bg-card px-6 py-3.5 rounded-xl hover:bg-muted-bg transition-colors"
                >
                  See how it works
                </a>
              </div>
              <p className="text-[11px] font-mono uppercase tracking-widest text-muted">
                .pdf · .md · .txt — free to use
              </p>
            </div>

            {/* Product mock — animated, looping demo */}
            <HeroDemo />
          </div>
        </div>
        <a
          href="#how"
          aria-label="Scroll to how it works"
          className="mx-auto mb-6 w-10 h-10 rounded-full border border-border bg-card flex items-center justify-center text-muted hover:text-foreground transition-colors animate-bounce"
        >
          <ArrowDown className="w-4 h-4" />
        </a>
      </section>

      {/* How it works — full viewport */}
      <section
        id="how"
        className="min-h-[100dvh] flex items-center border-t border-border bg-card/60"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-24">
          <p className="text-[11px] font-mono uppercase tracking-widest text-muted text-center">
            01 — How it works
          </p>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight text-center mt-4">
            Three steps. Zero hallucinations.
          </h2>
          <p className="text-sm sm:text-base text-muted text-center max-w-md mx-auto mt-4 leading-relaxed">
            Recall is retrieval-augmented: it answers from your files, not from
            a model&apos;s memory.
          </p>
          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 mt-12 sm:mt-16">
            {[
              {
                icon: Upload,
                step: "01",
                title: "Upload",
                body: "Drop in lecture notes, reviewers, or textbook chapters as PDF, Markdown, or plain text.",
              },
              {
                icon: MessageCircleQuestion,
                step: "02",
                title: "Ask",
                body: "Summaries, explanations, quizzes — anything. Recall retrieves the exact passages that matter.",
              },
              {
                icon: BadgeCheck,
                step: "03",
                title: "Verify",
                body: "Every answer names its source files, so you always know it came from your notes.",
              },
            ].map(({ icon: Icon, step, title, body }) => (
              <div
                key={step}
                className="bg-background border border-border rounded-2xl p-6 sm:p-8 flex flex-col gap-3"
              >
                <div className="flex items-center justify-between">
                  <div className="w-11 h-11 rounded-xl bg-primary/5 border border-border flex items-center justify-center">
                    <Icon className="w-5 h-5 text-foreground" />
                  </div>
                  <span className="text-xs font-mono text-muted">{step}</span>
                </div>
                <h3 className="font-bold text-lg sm:text-xl tracking-tight mt-2">
                  {title}
                </h3>
                <p className="text-sm text-muted leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quality — full viewport */}
      <section
        id="quality"
        className="min-h-[100dvh] flex items-center border-t border-border"
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full py-24 grid md:grid-cols-2 gap-10 md:gap-16 items-center">
          <div className="flex flex-col gap-5">
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted">
              02 — Answer quality
            </p>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold tracking-tight">
              Every answer is graded.
            </h2>
            <p className="text-sm sm:text-base text-muted leading-relaxed">
              Behind the scenes, an LLM-as-judge scores each reply on
              faithfulness, relevance, and completeness — and the results are
              public in the quality dashboard. If Recall can&apos;t back an
              answer with your notes, you&apos;ll see it.
            </p>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm font-semibold text-foreground border-b-2 border-foreground pb-0.5 w-fit hover:opacity-70 transition-opacity"
            >
              <BarChart2 className="w-4 h-4" /> View the live dashboard
            </Link>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:gap-4">
            {[
              { label: "Faithfulness", value: 92 },
              { label: "Relevance", value: 88 },
              { label: "Completeness", value: 81 },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="bg-card border border-border rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-card"
              >
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted">
                  {label}
                </span>
                <span className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {value}%
                </span>
                <div className="w-full bg-muted-bg rounded-full h-1.5">
                  <div
                    className="h-1.5 rounded-full bg-foreground"
                    style={{ width: `${value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA — full viewport */}
      <section className="min-h-[100dvh] flex flex-col border-t border-border bg-foreground text-background">
        <div className="flex-1 flex items-center">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 w-full text-center flex flex-col items-center gap-7 py-24">
            <p className="text-[11px] font-mono uppercase tracking-widest opacity-50">
              03 — Get started
            </p>
            <h2 className="text-3xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight max-w-2xl leading-[1.1]">
              Your notes already have the answers.
            </h2>
            <p className="text-sm sm:text-base opacity-70 max-w-md leading-relaxed">
              Stop re-reading 40 pages the night before an exam. Ask instead.
            </p>
            <Link
              href="/chat"
              className="inline-flex items-center gap-2 text-sm font-semibold bg-background text-foreground px-8 py-4 rounded-xl hover:opacity-90 transition-opacity"
            >
              Open Recall <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
        {/* Footer inside the last viewport */}
        <footer className="border-t border-background/15">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-background flex items-center justify-center">
                <Brain className="w-3 h-3 text-foreground" />
              </div>
              <span className="font-bold text-sm tracking-tight">Recall</span>
            </div>
            <p className="text-xs font-mono opacity-50 sm:ml-auto">
              Next.js · Supabase pgvector · Jina AI · Groq
            </p>
          </div>
        </footer>
      </section>
    </div>
  );
}
