import type { ReactNode } from "react";
import { Navbar, Footer } from "@/components/SiteChrome";

export function ListingPage({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <section className="border-b border-border bg-surface">
          <div className="mx-auto max-w-[1200px] px-6 pb-9 pt-14 sm:pt-16">
            <p className="text-xs font-semibold tracking-[0.22em] text-neon">{eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-extrabold leading-tight text-foreground sm:text-6xl">{title}</h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">{description}</p>
          </div>
        </section>
        <section className="mx-auto max-w-[1200px] px-6 py-7 sm:py-9">{children}</section>
      </main>
      <Footer />
    </div>
  );
}