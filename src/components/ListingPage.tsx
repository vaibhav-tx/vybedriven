import type { ReactNode } from "react";
import { Navbar, Footer } from "@/components/SiteChrome";

export function ListingPage({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6 pb-8 pt-10 sm:pb-9 sm:pt-16">
            <p className="text-xs font-semibold tracking-[0.22em] text-neon">{eyebrow}</p>
            <h1 className="mt-2.5 sm:mt-3 max-w-3xl text-3xl font-extrabold leading-[1.04] text-foreground sm:text-5xl lg:text-6xl">{title}</h1>
            <p className="mt-3 sm:mt-5 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-lg">{description}</p>
          </div>
        </section>
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6 sm:py-9">{children}</section>
      </main>
      <Footer />
    </div>
  );
}