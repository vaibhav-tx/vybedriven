import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Reveal({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => { if (e?.isIntersecting) { el.classList.add("in"); io.disconnect(); } },
      { threshold: 0.12 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <div ref={ref} className={cn("reveal", className)} style={{ transitionDelay: `${delay}ms` }}>{children}</div>;
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <p className="text-xs font-semibold tracking-[0.22em] text-neon">{children}</p>;
}

export function PrimaryBtn({ children, href = "/hackathons", className }: { children: ReactNode; href?: string; className?: string }) {
  return (
    <a href={href} className={cn("inline-flex items-center justify-center gap-2 rounded-full bg-gradient-brand px-6 py-3.5 text-sm font-semibold text-primary-foreground transition hover:brightness-110 hover:shadow-glow", className)}>
      {children}
    </a>
  );
}

export function GhostBtn({ children, href = "#", className }: { children: ReactNode; href?: string; className?: string }) {
  return (
    <a href={href} className={cn("inline-flex items-center justify-center gap-2 rounded-full border border-foreground/25 bg-surface/60 px-6 py-3.5 text-sm font-semibold text-foreground transition hover:border-neon/60 hover:shadow-glow", className)}>
      {children}
    </a>
  );
}
