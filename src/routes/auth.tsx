import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, LockKeyhole, Mail, Sparkles, User as UserIcon } from "lucide-react";
import { Navbar } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

type AuthSearch = { mode: "signin" | "signup"; next: string };
const cleanNext = (value: unknown) =>
  typeof value === "string" && value.startsWith("/") && !value.startsWith("//") ? value : "/";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): AuthSearch => ({
    mode: search["mode"] === "signup" ? "signup" : "signin",
    next: cleanNext(search["next"]),
  }),
  head: () => ({
    meta: [
      { title: "Sign In or Join — Vybe Driven" },
      { name: "description", content: "Sign in to Vybe Driven or create your builder account." },
      { property: "og:title", content: "Join Vybe Driven" },
      { property: "og:description", content: "Create your builder profile and discover your next opportunity." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(search.mode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Sync mode when URL search changes
  useEffect(() => {
    if (search.mode) setMode(search.mode);
  }, [search.mode]);

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate({ to: search.next, replace: true });
    }
  }, [navigate, search.next, user]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");

    if (mode === "signup") {
      if (confirmPassword && password !== confirmPassword) {
        setBusy(false);
        setError("Passwords do not match. Please verify your password.");
        return;
      }

      try {
        const { data, error: authError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: { full_name: name.trim() || undefined },
            emailRedirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(search.next)}`,
          },
        });

        setBusy(false);
        if (authError) {
          setError(authError.message);
          return;
        }

        if (!data.session) {
          setMessage("Account created! If email confirmation is required, please check your inbox to verify before signing in.");
          return;
        }

        // If session created, pre-populate profile display name if entered
        if (data.user && name.trim()) {
          try {
            await supabase.from("profiles").upsert({
              id: data.user.id,
              display_name: name.trim(),
              updated_at: new Date().toISOString(),
            });
          } catch {
            // Non-blocking
          }
        }

        await navigate({ to: search.next, replace: true });
      } catch (err: unknown) {
        setBusy(false);
        setError(err instanceof Error ? err.message : "An unexpected signup error occurred.");
      }
      return;
    }

    // Sign In Mode
    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setBusy(false);
      if (authError) {
        setError(authError.message);
        return;
      }

      await navigate({ to: search.next, replace: true });
    } catch (err: unknown) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "An unexpected sign-in error occurred.");
    }
  };

  const [showGoogleHelp, setShowGoogleHelp] = useState(false);

  const signInGoogle = async () => {
    setBusy(true);
    setError("");
    setMessage("");
    sessionStorage.setItem("hd-auth-next", search.next);

    try {
      const { data, error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth?next=${encodeURIComponent(search.next)}`,
          skipBrowserRedirect: true,
        },
      });

      if (oauthError) {
        setBusy(false);
        setError("Google authentication error: " + oauthError.message);
        return;
      }

      if (data?.url) {
        // Preflight probe to check if Supabase provider has OAuth secret configured
        try {
          const res = await fetch(data.url, { method: "GET" });
          if (!res.ok) {
            const errData = await res.json().catch(() => null);
            if (errData && (errData.msg?.includes("missing OAuth secret") || errData.error_code === "validation_failed")) {
              setBusy(false);
              setError("⚠️ Google OAuth Secret is not configured in your Supabase dashboard yet. Please enter your Google Client ID & Secret in Supabase -> Authentication -> Providers -> Google, or use Email / Demo login below.");
              setShowGoogleHelp(true);
              return;
            }
          }
        } catch {
          // If CORS prevents reading response, proceed to browser redirect
        }

        window.location.href = data.url;
        return;
      }

      setBusy(false);
    } catch (err: unknown) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Unable to initiate Google authentication.");
    }
  };

  const loginAsDemoBuilder = async () => {
    setBusy(true);
    setError("");
    setMessage("");

    const demoEmail = "builder.demo@vybedriven.com";
    const demoPassword = "VybeBuilderDemo2026!";

    try {
      const { error: signInErr } = await supabase.auth.signInWithPassword({
        email: demoEmail,
        password: demoPassword,
      });

      if (!signInErr) {
        await navigate({ to: search.next, replace: true });
        return;
      }

      // If user does not exist yet, attempt automatic creation
      if (signInErr.message.toLowerCase().includes("invalid login credentials")) {
        const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
          email: demoEmail,
          password: demoPassword,
          options: {
            data: { full_name: "Demo Builder" },
          },
        });

        if (signUpErr) {
          setBusy(false);
          setError(signUpErr.message);
          return;
        }

        if (signUpData.session) {
          await navigate({ to: search.next, replace: true });
          return;
        }

        setBusy(false);
        setMessage("Demo user created. Please check if email confirmation is required or try standard sign-in.");
        return;
      }

      setBusy(false);
      setError(signInErr.message);
    } catch (err: unknown) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Failed to sign in with demo credentials.");
    }
  };

  useEffect(() => {
    const stored = sessionStorage.getItem("hd-auth-next");
    if (user && stored) {
      sessionStorage.removeItem("hd-auth-next");
      navigate({ to: cleanNext(stored), replace: true });
    }
  }, [navigate, user]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto grid max-w-[1120px] items-center gap-8 sm:gap-10 px-4 sm:px-6 py-8 sm:py-14 lg:grid-cols-[0.9fr_1.1fr] lg:py-20">
        <section className="hidden lg:block">
          <p className="text-xs font-semibold tracking-[0.22em] text-neon">WELCOME TO VYBE DRIVEN</p>
          <h1 className="mt-4 text-5xl font-extrabold leading-tight">
            Your next build starts with one sign in.
          </h1>
          <p className="mt-5 max-w-md leading-7 text-muted-foreground">
            Discover challenges, register for top hackathons, meet your team and create a builder profile that grows with every event.
          </p>
          <div className="mt-10 grid max-w-md grid-cols-2 gap-3">
            {[
              { label: "Hackathons", count: "ADAPPT & IDEA '26" },
              { label: "Community", count: "2,000+ Builders" },
              { label: "Prize Pools", count: "₹1,00,000+" },
              { label: "Incubation", count: "Top Mentors & Perks" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-surface/60 p-4">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="mt-1 text-sm font-bold text-foreground">{item.count}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mx-auto w-full max-w-md rounded-2xl border border-border bg-card p-5 shadow-glow-soft sm:p-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="size-4" />
            Back home
          </Link>

          {/* Mode Switcher Tabs */}
          <div className="mt-5 sm:mt-6 flex rounded-xl border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setMessage("");
              }}
              className={`flex-1 rounded-lg py-2 text-center text-xs sm:text-sm font-semibold transition ${
                mode === "signin"
                  ? "bg-neon/15 text-neon border border-neon/30 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
              className={`flex-1 rounded-lg py-2 text-center text-xs sm:text-sm font-semibold transition ${
                mode === "signup"
                  ? "bg-neon/15 text-neon border border-neon/30 shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Create Account
            </button>
          </div>

          <h2 className="mt-5 text-2xl sm:text-3xl font-bold">
            {mode === "signin" ? "Welcome back" : "Create your account"}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground">
            {mode === "signin"
              ? "Sign in to access your builder profile and registrations."
              : "Join the Vybe Driven community in less than a minute."}
          </p>

          {/* Google Auth Button */}
          <Button
            type="button"
            variant="outline"
            className="mt-6 h-11 w-full rounded-xl border-border hover:border-neon/40 hover:bg-surface transition"
            onClick={signInGoogle}
            disabled={busy}
          >
            <span className="text-base font-bold text-neon mr-2">G</span>
            Continue with Google
          </Button>

          <div className="mt-2 text-center">
            <button
              type="button"
              onClick={() => setShowGoogleHelp((v) => !v)}
              className="text-[11px] text-muted-foreground hover:text-neon underline transition"
            >
              {showGoogleHelp ? "Hide Google Setup Guide" : "Why Google login says 'missing OAuth secret'?"}
            </button>
            {showGoogleHelp && (
              <div className="mt-2 text-left rounded-xl border border-neon/30 bg-surface/90 p-3.5 text-xs text-foreground space-y-2 animate-in fade-in">
                <p className="font-bold text-neon">How to enable Google Login in Supabase (2 mins):</p>
                <ol className="list-decimal pl-4 space-y-1.5 text-muted-foreground">
                  <li>Go to <strong className="text-foreground">Google Cloud Console</strong> &rarr; APIs & Services &rarr; Credentials &rarr; Create OAuth Client ID (Web Application).</li>
                  <li>Set Authorized Redirect URI to: <code className="text-neon bg-black/60 px-1 py-0.5 rounded text-[10px] break-all">https://qcgcemmhwjuhnwuqkfbk.supabase.co/auth/v1/callback</code></li>
                  <li>Go to <strong className="text-foreground">Supabase Dashboard</strong> &rarr; Authentication &rarr; Providers &rarr; Google &rarr; Paste your <strong className="text-foreground">Client ID</strong> and <strong className="text-foreground">Client Secret</strong> &rarr; Click Save!</li>
                </ol>
                <p className="text-[11px] text-neon/90 pt-1 border-t border-border/60">
                  💡 Tip: You can also use Email/Password or the ⚡ Quick Demo Builder Login button below for instant access!
                </p>
              </div>
            )}
          </div>

          <div className="my-5 flex items-center gap-3 text-[11px] font-semibold text-muted-foreground tracking-wider">
            <span className="h-px flex-1 bg-border" />
            OR CONTINUE WITH EMAIL
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Email / Password Form */}
          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && (
              <label className="block text-sm font-medium">
                Full Name / Builder Name
                <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                  <UserIcon className="size-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="e.g. Satyam Pandey"
                  />
                </div>
              </label>
            )}

            <label className="block text-sm font-medium">
              Email Address
              <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <Mail className="size-4 text-muted-foreground" />
                <input
                  required
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="you@example.com"
                />
              </div>
            </label>

            <label className="block text-sm font-medium">
              Password
              <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                <LockKeyhole className="size-4 text-muted-foreground" />
                <input
                  required
                  minLength={6}
                  type={showPassword ? "text" : "password"}
                  autoComplete={mode === "signin" ? "current-password" : "new-password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none"
                  placeholder="At least 6 characters"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </label>

            {mode === "signup" && (
              <label className="block text-sm font-medium">
                Confirm Password
                <div className="mt-1.5 flex h-11 items-center gap-2 rounded-xl border border-input bg-background px-3 focus-within:ring-2 focus-within:ring-ring">
                  <LockKeyhole className="size-4 text-muted-foreground" />
                  <input
                    required
                    minLength={6}
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    className="w-full bg-transparent text-sm outline-none"
                    placeholder="Re-enter password"
                  />
                </div>
              </label>
            )}

            {mode === "signin" && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs font-semibold text-neon hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            {error && (
              <div role="alert" className="rounded-xl border border-destructive/30 bg-destructive/10 px-3.5 py-2.5 text-xs sm:text-sm text-destructive">
                {error}
              </div>
            )}

            {message && (
              <div role="status" className="flex items-start gap-2 rounded-xl border border-neon/30 bg-neon/10 px-3.5 py-2.5 text-xs sm:text-sm text-foreground">
                <CheckCircle2 className="size-4 text-neon shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            <Button
              type="submit"
              className="h-11 w-full rounded-xl bg-gradient-brand text-primary-foreground font-bold shadow-glow-soft hover:brightness-105"
              disabled={busy}
            >
              {busy ? "Please wait…" : mode === "signin" ? "Sign In" : "Create Account"}
            </Button>
          </form>

          {/* Quick Demo Access Option */}
          <div className="mt-5 border-t border-border pt-4">
            <button
              type="button"
              onClick={loginAsDemoBuilder}
              disabled={busy}
              className="group flex w-full items-center justify-center gap-2 rounded-xl border border-neon/30 bg-surface/80 px-4 py-2.5 text-xs sm:text-sm font-semibold text-neon transition hover:border-neon hover:bg-neon/15 hover:shadow-glow-soft"
            >
              <Sparkles className="size-4 text-neon group-hover:scale-110 transition-transform" />
              <span>⚡ Quick Demo Builder Login (Instant Access)</span>
            </button>
          </div>

          <p className="mt-5 text-center text-xs sm:text-sm text-muted-foreground">
            {mode === "signin" ? "New to Vybe Driven?" : "Already have an account?"}{" "}
            <button
              type="button"
              className="font-semibold text-neon hover:underline"
              onClick={() => {
                setMode(mode === "signin" ? "signup" : "signin");
                setError("");
                setMessage("");
              }}
            >
              {mode === "signin" ? "Sign up now" : "Sign in"}
            </button>
          </p>
        </section>
      </main>
    </div>
  );
}