import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { Menu, X, Instagram, Mail, User, LogOut, ChevronDown, Phone, ArrowUp, ArrowRight } from "lucide-react";
import homeIcon from "@/assets/nav/home.png.asset.json";
import hackathonsIcon from "@/assets/nav/hackathons.png.asset.json";
import eventsIcon from "@/assets/nav/events.png.asset.json";
import discoverIcon from "@/assets/nav/discover.png.asset.json";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";

function Logo({ className = "h-9" }: { className?: string }) {
  return (
    <Link to="/" className="flex items-center" aria-label="Vybe Driven home">
      <span className={`${className} aspect-[2.79/1] block overflow-hidden transition hover:brightness-110`}>
        <picture>
          <source type="image/webp" srcSet="/vybe-driven.webp 1x, /vybe-driven@2x.webp 2x" />
          <img
            src="/vybe-driven.webp"
            alt="Vybe Driven"
            className="h-full w-full object-contain"
            loading="eager"
            decoding="async"
          />
        </picture>
      </span>
    </Link>
  );
}

const links = [
  { label: "Home", to: "/" as const, image: homeIcon.url },
  { label: "Hackathons", to: "/hackathons" as const, image: hackathonsIcon.url },
  { label: "Events", to: "/events" as const, image: eventsIcon.url },
  { label: "Discover", to: "/discover" as const, image: discoverIcon.url },
];

function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    const close = (event: MouseEvent) => { if (ref.current && !ref.current.contains(event.target as Node)) setOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  const signOut = async () => {
    await supabase.auth.signOut();
    setOpen(false);
    await navigate({ to: "/", replace: true });
  };
  return (
    <div ref={ref} className="relative">
      <Button onClick={() => setOpen((value) => !value)} aria-label="Open profile menu" variant="outline" className="h-10 rounded-full bg-surface px-3">
        <User className="size-4" /><ChevronDown className="size-3" />
      </Button>
      {open && <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-popover p-2 shadow-glow-soft">
        <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-popover-foreground hover:bg-surface hover:text-neon"><User className="size-4" />Complete profile</Link>
        <Button onClick={signOut} variant="ghost" className="h-auto w-full justify-start rounded-lg px-3 py-2 font-normal text-popover-foreground hover:bg-surface hover:text-neon"><LogOut className="size-4" />Sign out</Button>
      </div>}
    </div>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, loading } = useAuth();
  const location = useLocation();
  return (
    <header className="sticky top-2 sm:top-4 z-50 px-2.5 sm:px-4">
      <nav className="relative mx-auto flex h-[64px] sm:h-[72px] max-w-[1120px] items-center justify-between rounded-2xl sm:rounded-[24px] border border-border px-3.5 sm:px-4 backdrop-blur-xl transition-colors" style={{ background: "var(--nav-bg)", boxShadow: "var(--nav-shadow)" }}>
        <ul className="hidden items-center gap-2 lg:flex">
          {links.map((item) => {
            const active = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
            return <li key={item.label} className="group relative"><Link to={item.to} aria-label={item.label} title={item.label} className={`nav-icon grid size-11 place-items-center rounded-full border-2 transition ${active ? "is-active border-lime shadow-glow" : "border-transparent hover:border-border hover:bg-surface"}`}><img src={item.image} alt="" className="nav-art size-6 object-contain" /></Link><span className="pointer-events-none absolute left-1/2 top-[calc(100%+10px)] -translate-x-1/2 rounded-md bg-foreground px-2 py-1 text-xs text-background opacity-0 shadow-sm transition group-hover:opacity-100 group-focus-within:opacity-100">{item.label}</span></li>;
          })}
        </ul>
        <div className="lg:absolute lg:left-1/2 lg:-translate-x-1/2"><Logo className="h-8.5 sm:h-11" /></div>
        <div className="hidden items-center gap-2 lg:flex">
          <Link to="/contact" className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition hover:text-neon">Contact Us</Link>
          {!loading && (user ? <ProfileMenu /> : <Button asChild className="rounded-full bg-gradient-brand text-primary-foreground hover:brightness-105"><Link to="/auth" search={{ mode: "signin", next: "/" }}>Sign In</Link></Button>)}
        </div>
        <div className="flex items-center gap-2 lg:hidden">
          <Button variant="ghost" size="icon" className="size-10 rounded-full border border-border/60 bg-surface/40 hover:bg-surface hover:text-neon text-foreground" onClick={() => setOpen((value) => !value)} aria-label="Toggle menu">{open ? <X className="size-5" /> : <Menu className="size-5" />}</Button>
        </div>
      </nav>
      {open && (
        <div className="mx-auto mt-2 max-w-[1120px] rounded-2xl border border-neon/25 bg-[#060b07]/95 p-3.5 shadow-2xl backdrop-blur-2xl lg:hidden animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {links.map((item) => {
              const active = item.to === "/" ? location.pathname === "/" : location.pathname.startsWith(item.to);
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition ${
                    active ? "bg-neon/15 text-neon border border-neon/30" : "text-foreground hover:bg-surface/80 hover:text-neon"
                  }`}
                >
                  <img src={item.image} alt="" className="nav-art size-5.5 object-contain" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-foreground hover:bg-surface/80 hover:text-neon transition"
            >
              <Phone className="size-5 text-neon" />
              Contact Us
            </Link>
          </div>
          <div className="mt-3 border-t border-border/80 pt-3">
            {!loading && (user ? (
              <div className="flex flex-col gap-2">
                <Link to="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-foreground hover:bg-surface">
                  <User className="size-4 text-neon" />Profile
                </Link>
              </div>
            ) : (
              <Button asChild className="w-full h-11 rounded-full bg-gradient-brand text-primary-foreground font-bold shadow-glow-soft">
                <Link to="/auth" search={{ mode: "signin", next: "/" }}>Sign In to Vybe Driven</Link>
              </Button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative mt-20 border-t border-border bg-[#030704] text-foreground overflow-hidden">
      {/* Ambient background glows & cyber grid */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[350px] w-[800px] -translate-x-1/2 rounded-full bg-neon/8 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[450px] w-[1000px] -translate-x-1/2 rounded-full bg-neon/10 blur-[140px]" />
      <div className="pointer-events-none absolute inset-0 bg-grid opacity-25" />

      {/* Main Grid Content */}
      <div className="relative mx-auto max-w-[1240px] px-6 pt-16 pb-12">
        <div className="grid gap-12 lg:grid-cols-12">
          {/* Brand & Mission column */}
          <div className="lg:col-span-5 space-y-5">
            <Logo className="h-12" />
            <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
              Powering India&apos;s most ambitious builders, hackers, and creators. Discover tier-1 hackathons, assemble winning squads, and drive the future with Vybe Driven.
            </p>

            {/* Live Indicator Badge */}
            <div className="inline-flex items-center gap-2.5 rounded-full border border-border bg-surface-2/90 px-3.5 py-1.5 text-xs font-medium text-foreground backdrop-blur-md">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-neon opacity-75" />
                <span className="relative inline-flex size-2 rounded-full bg-neon" />
              </span>
              <span className="text-muted-foreground">Live Across India</span>
              <span className="text-neon font-semibold">· 25.4K+ Builders</span>
            </div>

            {/* Social & Contact pills */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              <a
                href="https://www.instagram.com/vybedriven"
                target="_blank"
                rel="noreferrer"
                aria-label="Vybe Driven on Instagram"
                className="group flex size-10 items-center justify-center rounded-xl border border-border bg-surface transition hover:border-neon/60 hover:bg-neon/10 hover:text-neon hover:-translate-y-0.5"
              >
                <Instagram className="size-4 text-muted-foreground transition group-hover:text-neon" />
              </a>
              <a
                href="mailto:vybedriven@gmail.com"
                aria-label="Email Vybe Driven"
                className="group flex size-10 items-center justify-center rounded-xl border border-border bg-surface transition hover:border-neon/60 hover:bg-neon/10 hover:text-neon hover:-translate-y-0.5"
              >
                <Mail className="size-4 text-muted-foreground transition group-hover:text-neon" />
              </a>
              <Link
                to="/contact"
                aria-label="Contact Vybe Driven"
                className="group flex size-10 items-center justify-center rounded-xl border border-border bg-surface transition hover:border-neon/60 hover:bg-neon/10 hover:text-neon hover:-translate-y-0.5"
              >
                <Phone className="size-4 text-muted-foreground transition group-hover:text-neon" />
              </Link>
            </div>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:col-span-7">
            {/* Column 1: Explore */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Explore</h4>
              <ul className="mt-4 space-y-2.5">
                {[
                  { label: "Hackathons", to: "/hackathons" as const },
                  { label: "Tech Events", to: "/events" as const },
                  { label: "Competitions", to: "/hackathons" as const },
                  { label: "Discover All", to: "/discover" as const },
                ].map((item) => (
                  <li key={item.label}>
                    <Link
                      to={item.to}
                      className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-neon"
                    >
                      <span className="size-1 rounded-full bg-transparent transition group-hover:bg-neon" />
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 2: Community */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Community</h4>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link to="/contact" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-neon">
                    <span className="size-1 rounded-full bg-transparent transition group-hover:bg-neon" />
                    Host an Event
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-neon">
                    <span className="size-1 rounded-full bg-transparent transition group-hover:bg-neon" />
                    Partnerships
                  </Link>
                </li>
                <li>
                  <Link to="/auth" search={{ mode: "signup", next: "/" }} className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-neon">
                    <span className="size-1 rounded-full bg-transparent transition group-hover:bg-neon" />
                    Join Builder Network
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Direct Connect Card */}
            <div className="col-span-2 sm:col-span-1">
              <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Connect</h4>
              <div className="mt-4 rounded-2xl border border-border bg-surface/70 p-4 backdrop-blur-md">
                <p className="text-xs font-medium text-foreground">Have questions or want to partner?</p>
                <a
                  href="mailto:vybedriven@gmail.com"
                  className="mt-2 block break-all text-xs text-neon hover:underline"
                >
                  vybedriven@gmail.com
                </a>
                <Link
                  to="/contact"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-foreground transition hover:text-neon"
                >
                  Message us <ArrowRight className="size-3 text-neon" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Centerpiece: Animated Cinematic VYBE DRIVEN Brand Typography */}
      <div className="relative border-t border-border/70 pt-10 pb-6 overflow-hidden select-none">
        {/* Animated Light Beam gliding across the top edge */}
        <div className="absolute inset-x-0 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-border to-transparent" />
        <div className="footer-glow-beam absolute top-0 h-[1.5px] w-64 bg-gradient-to-r from-transparent via-neon to-transparent" />

        <div className="relative mx-auto max-w-[1400px] px-3 sm:px-4 text-center">
          <div className="group relative inline-block cursor-default max-w-full overflow-hidden">
            <h2 className="footer-big-brand text-[clamp(1.9rem,11.2vw,12.5rem)] font-black tracking-[-0.03em] sm:tracking-[-0.04em] leading-none transition-all duration-700 select-none">
              VYBE DRIVEN
            </h2>
            {/* Ambient ground reflection */}
            <div className="pointer-events-none absolute -bottom-4 inset-x-0 h-10 bg-gradient-to-t from-[#030704] to-transparent" />
          </div>
        </div>
      </div>

      {/* Bottom Bar: Copyright & Back to Top */}
      <div className="relative border-t border-border/50 bg-black/60 px-6 py-6 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-4 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 <span className="font-semibold text-foreground">Vybe Driven</span>. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hidden sm:inline">Engineered for Ambitious Builders</span>
            <button
              onClick={scrollToTop}
              className="group inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground transition hover:border-neon hover:text-neon cursor-pointer"
              aria-label="Back to top"
            >
              <span>Back to top</span>
              <ArrowUp className="size-3.5 transition group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}