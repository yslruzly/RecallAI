"use client";

import { ReactNode, MouseEvent, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Brain } from "lucide-react";

function LoadingScreen({ message }: { message: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[100] flex flex-col items-center justify-center gap-7 bg-background brand-glow animate-fade-up"
    >
      <div className="relative flex items-center justify-center">
        {/* Spinning ring */}
        <span className="absolute w-[72px] h-[72px] rounded-[20px] border-2 border-border border-t-primary animate-spin" />
        {/* Brand mark */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center shadow-glow">
          <Brain className="w-7 h-7 text-white" />
        </div>
      </div>
      <div className="flex flex-col items-center gap-3">
        <p className="text-sm font-semibold text-foreground">{message}</p>
        <div className="flex gap-1.5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-primary demo-dot"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface LoadingLinkProps {
  href: string;
  children: ReactNode;
  className?: string;
  message?: string;
  "aria-label"?: string;
}

export default function LoadingLink({
  href,
  children,
  className,
  message = "Loading…",
  ...rest
}: LoadingLinkProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    // Let modifier-clicks / new-tab behave natively
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    startTransition(() => router.push(href));
  }

  return (
    <>
      <a href={href} className={className} onClick={handleClick} {...rest}>
        {children}
      </a>
      {isPending && <LoadingScreen message={message} />}
    </>
  );
}
