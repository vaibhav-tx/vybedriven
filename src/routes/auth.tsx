import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail } from "lucide-react";
import { Navbar } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAuth } from "@/lib/auth";

type AuthSearch = { mode: "signin" | "signup"; next: string };
const cleanNext = (value: unknown) => typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({ mode: search["mode"] === "signup" ? "signup" : "signin", next: cleanNext(search["next"]) }),
  head: () => ({ meta: [
    { title: "Sign In or Join — Vybe Driven" },
    { name: "description", content: "Sign in to Vybe Driven or create your builder account." },
    { property: "og:title", content: "Join Vybe Driven" },
    { property: "og:description", content: "Create your builder profile and discover your next opportunity." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary" },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState(search.mode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) navigate({ to: search.next, replace: true });
  }, [navigate, search.next, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true); setError(""); setMessage("");
    if (mode === "signup") {
      const { data, error: authError } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(search.next)}` } });
      setBusy(false);
      if (authError) return setError(authError.message);
      if (!data.session) return setMessage("Check your email to confirm your account, then return here to sign in.");
      await navigate({ to: search.next, replace: true });
      return;
    }
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    setBusy(false);
    if (authError) return setError(authError.message);
    await navigate({ to: search.next, replace: true });
  };

  const signInGoogle = async () => {
    setBusy(true); setError("");
    sessionStorage.setItem("hd-auth-next", search.next);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: `${window.location.origin}/auth` });
    if (result.error) { setError(result.error.message); setBusy(false); return; }
    if (!result.redirected) await navigate({ to: search.next, replace: true });
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("hd-auth-next");
    if (user && stored) { sessionStorage.removeItem("hd-auth-next"); navigate({ to: cleanNext(stored), replace: true }); }
  }, [navigate, user]);

  return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto grid max-w-[1120px] items-center gap-8 sm:gap-10 px-4 sm:px-6 py-8 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
    <section className="hidden lg:block"><p className="text-xs font-semibold tracking-[0.22em] text-neon">WELCOME TO VYBE DRIVEN</p><h1 className="mt-4 text-5xl font-extrabold leading-tight">Your next build starts with one sign in.</h1><p className="mt-5 max-w-md leading-7 text-muted-foreground">Discover challenges, meet your team and create a builder profile that grows with every event.</p><div className="mt-10 grid max-w-md grid-cols-2 gap-3">{["Hackathons", "Meetups", "Competitions", "Community"].map((item) => <div key={item} className="rounded-xl border border-border bg-surface p-4 text-sm font-semibold">{item}</div>)}</div></section>
    <section className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-glow-soft sm:p-8"><Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />Back home</Link><h2 className="mt-5 sm:mt-7 text-2xl sm:text-3xl font-bold">{mode === "signin" ? "Welcome back" : "Create your account"}</h2><p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted-foreground">{mode === "signin" ? "Sign in to continue your builder journey." : "Join the community in less than a minute."}</p>
      <Button type="button" variant="outline" className="mt-6 sm:mt-7 h-11 w-full rounded-xl" onClick={signInGoogle} disabled={busy}><span className="text-base font-bold text-neon mr-1">G</span>Continue with Google</Button>
      <div className="my-5 sm:my-6 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />OR CONTINUE WITH EMAIL<span className="h-px flex-1 bg-border" /></div>
      <form onSubmit={submit} className="space-y-4"><label className="block text-sm font-medium">Email<div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring"><Mail className="size-4 text-muted-foreground" /><input required type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} className="w-full bg-transparent text-base sm:text-sm outline-none" placeholder="you@example.com" /></div></label><label className="block text-sm font-medium">Password<div className="mt-2 flex h-11 items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring"><LockKeyhole className="size-4 text-muted-foreground" /><input required minLength={8} type={showPassword ? "text" : "password"} autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(event) => setPassword(event.target.value)} className="w-full bg-transparent text-base sm:text-sm outline-none" placeholder="At least 8 characters" /><Button type="button" variant="ghost" size="icon" className="size-8" aria-label={showPassword ? "Hide password" : "Show password"} onClick={() => setShowPassword((value) => !value)}>{showPassword ? <EyeOff /> : <Eye />}</Button></div></label>
        {mode === "signin" && <div className="text-right"><Link to="/forgot-password" className="text-xs font-semibold text-neon hover:underline">Forgot password?</Link></div>}
        {error && <p role="alert" className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}{message && <p role="status" className="rounded-lg bg-neon/10 px-3 py-2 text-sm text-foreground">{message}</p>}
        <Button className="h-11 w-full rounded-xl bg-gradient-brand text-primary-foreground hover:brightness-105" disabled={busy}>{busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}</Button>
      </form>
      <p className="mt-5 sm:mt-6 text-center text-sm text-muted-foreground">{mode === "signin" ? "New to Vybe Driven?" : "Already have an account?"} <Button type="button" variant="link" className="h-auto p-0 text-neon" onClick={() => { setMode(mode === "signin" ? "signup" : "signin"); setError(""); setMessage(""); }}>{mode === "signin" ? "Sign up" : "Sign in"}</Button></p>
    </section>
  </main></div>;
}