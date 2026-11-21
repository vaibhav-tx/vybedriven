import { createFileRoute, Link, notFound, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useMemo } from "react";
import {
  Calendar,
  CheckCircle2,
  Clock3,
  ExternalLink,
  MapPin,
  MessageCircle,
  Trophy,
  Users,
  WalletCards,
  Gift,
  Rocket,
  Laptop,
  Coffee,
  Award,
  Handshake,
  Brain,
  Sparkles,
  Crown,
  Ticket,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Lock,
  LogIn,
  Info,
  Share2,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Navbar, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { getOpportunity, type Opportunity } from "@/data/opportunities";
import { useAuth } from "@/lib/auth";
import { createBuilderAccount, signInBuilderAccount, getBuilderSession } from "@/lib/builder-auth";
import { EventRegistrationModal } from "@/components/EventRegistrationModal";
import { TeamManagementModal } from "@/components/TeamManagementModal";
import { IdeaSubmissionModal } from "@/components/IdeaSubmissionModal";
import { isUserRegistered, getRegistrationCount, useEventRegistrations, isEventOrganizer, getUserRegistrations, mergeRemoteRegistrations, refreshUserRegistrationFromD1, type EventRegistration } from "@/data/events-store";
import { formatExternalUrl, isInvalidPptLink } from "@/lib/utils";

type OpportunitySearch = {
  register?: string;
  joinCode?: string;
  joinTeam?: string;
  autoredirect?: string;
};

export const Route = createFileRoute("/opportunities/$slug")({
  validateSearch: (search: Record<string, unknown>): OpportunitySearch => ({
    register: typeof search["register"] === "string" ? search["register"] : undefined,
    joinCode: typeof search["joinCode"] === "string" ? search["joinCode"] : undefined,
    joinTeam: typeof search["joinTeam"] === "string" ? search["joinTeam"] : undefined,
    autoredirect: typeof search["autoredirect"] === "string" ? search["autoredirect"] : undefined,
  }),
  loader: ({ params }) => {
    const opportunity = getOpportunity(params.slug);
    if (!opportunity) throw notFound();
    return opportunity;
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Event unavailable — Vybe Driven" }],
      };
    }
    const pageTitle = `${loaderData.title} | ${loaderData.type} in ${loaderData.location} — Vybe Driven`;
    const canonicalUrl = `https://www.vybedriven.in/opportunities/${loaderData.slug}`;
    const imageUrl = loaderData.image?.startsWith("http")
      ? loaderData.image
      : `https://www.vybedriven.in${loaderData.image}`;
    const keywords = `${loaderData.title}, ${loaderData.type}, hackathons in ${loaderData.location}, nearest hackathon, hackathons near me, vybe driven, vybe, vibe driven, vibe, ${loaderData.organizer}, coding competitions 2026, tech events`;

    return {
      meta: [
        { name: "viewport", content: "width=device-width, initial-scale=1.0" },
        { title: pageTitle },
        { name: "description", content: loaderData.description },
        { name: "keywords", content: keywords },
        { name: "robots", content: "index, follow, max-image-preview:large" },
        { property: "og:site_name", content: "Vybe Driven" },
        { property: "og:title", content: pageTitle },
        { property: "og:description", content: loaderData.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: canonicalUrl },
        { property: "og:image", content: imageUrl },
        { property: "og:locale", content: "en_IN" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@vybedriven" },
        { name: "twitter:title", content: pageTitle },
        { name: "twitter:description", content: loaderData.description },
        { name: "twitter:image", content: imageUrl },
      ],
      links: [
        { rel: "canonical", href: canonicalUrl },
      ],
    };
  },
  component: OpportunityDetails,
  notFoundComponent: OpportunityNotFound,
});

function FormattedOverview({ overview }: { overview: string }) {
  const [expanded, setExpanded] = useState(false);
  const sections = overview.split(/\n\n+/);
  return (
    <div className="space-y-4 max-w-3xl">
      <div className="relative">
        <div
          className={`space-y-5 text-sm sm:text-base leading-relaxed text-muted-foreground transition-all duration-300 ${
            !expanded ? "max-h-[300px] overflow-hidden" : ""
          }`}
        >
          {sections.map((sec, idx) => {
            const lines = sec.trim().split("\n");
            const firstLine = lines[0].trim();

            const isHeading =
              lines.length > 1 &&
              (firstLine.endsWith(":") || firstLine.startsWith("###") || firstLine.startsWith("**"));

            if (isHeading) {
              const headingText = firstLine.replace(/^[#*]+/, "").replace(/[*:]+$/, "").trim();
              const restLines = lines.slice(1);
              return (
                <div key={idx} className="pt-2">
                  <h3 className="text-base sm:text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-neon shrink-0" />
                    <span>{headingText}</span>
                  </h3>
                  <div className="space-y-2">
                    {restLines.map((line, lIdx) => {
                      const trimmed = line.trim();
                      if (trimmed.startsWith("•") || trimmed.startsWith("-") || trimmed.startsWith("*")) {
                        const cleanText = trimmed.replace(/^[•\-*]\s*/, "");
                        const colonIndex = cleanText.indexOf(":");
                        return (
                          <div key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm pl-2 text-foreground/90">
                            <span className="mt-2 size-1 rounded-full bg-neon/80 shrink-0" />
                            <span>
                              {colonIndex > 0 ? (
                                <>
                                  <strong className="font-semibold text-foreground">
                                    {cleanText.slice(0, colonIndex + 1)}
                                  </strong>
                                  {cleanText.slice(colonIndex + 1)}
                                </>
                              ) : (
                                cleanText
                              )}
                            </span>
                          </div>
                        );
                      }
                      return (
                        <p key={lIdx} className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {line}
                        </p>
                      );
                    })}
                  </div>
                </div>
              );
            }

            const isBulletList = lines.every((l) => {
              const t = l.trim();
              return t.startsWith("•") || t.startsWith("-") || t.startsWith("*") || /^\d+[.)]/.test(t);
            });

            if (isBulletList) {
              return (
                <ul key={idx} className="space-y-2 pl-2 my-2">
                  {lines.map((l, lIdx) => {
                    const clean = l.trim().replace(/^[•\-*]\s*|^\d+[.)]\s*/, "");
                    const colonIndex = clean.indexOf(":");
                    return (
                      <li key={lIdx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                        <span className="mt-2 size-1.5 rounded-full bg-neon shrink-0" />
                        <span>
                          {colonIndex > 0 ? (
                            <>
                              <strong className="font-semibold text-foreground">{clean.slice(0, colonIndex + 1)}</strong>
                              {clean.slice(colonIndex + 1)}
                            </>
                          ) : (
                            clean
                          )}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              );
            }

            return (
              <p key={idx} className="text-sm sm:text-base leading-relaxed text-muted-foreground">
                {sec}
              </p>
            );
          })}
        </div>

        {!expanded && (
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-background via-background/80 to-transparent" />
        )}
      </div>

      <div className="pt-2 flex items-center justify-start">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="inline-flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 text-xs sm:text-sm font-bold text-primary-foreground shadow-glow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="size-4" />
            </>
          ) : (
            <>
              Read More Details <ChevronDown className="size-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

function EventAuthGateDialog({
  item,
  open,
  onOpenChange,
  pendingAction,
  onSuccess,
}: {
  item: Opportunity;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingAction?: { mode: "create" | "join"; joinCode?: string } | null;
  onSuccess?: () => void;
}) {
  const navigate = useNavigate();
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const handleGoogleAuth = async () => {
    setBusy(true);
    setError("");
    try {
      const searchParams = new URLSearchParams();
      if (pendingAction?.mode === "join") {
        const code = pendingAction.joinCode;
        if (code && code.toUpperCase() !== "JOIN") {
          searchParams.set("joinCode", code);
        } else {
          searchParams.set("joinTeam", "1");
        }
      } else {
        searchParams.set("register", "1");
      }
      if (item.registrationUrl) {
        searchParams.set("autoredirect", "1");
      }
      const queryStr = searchParams.toString() ? `?${searchParams.toString()}` : "";
      const targetUrl = `/opportunities/${item.slug}${queryStr}`;

      try {
        localStorage.setItem("hd-auth-next", targetUrl);
        sessionStorage.setItem("hd-auth-next", targetUrl);
      } catch {}

      const redirectTo = `${window.location.origin}/auth?next=${encodeURIComponent(targetUrl)}`;
      const { data, error: oauthErr } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo,
        },
      });
      if (oauthErr) {
        setBusy(false);
        setError(oauthErr.message);
        return;
      }
      if (data?.url) {
        window.location.assign(data.url);
      }
    } catch (err: unknown) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Unable to initiate Google sign-in.");
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setBusy(false);
      setError("Please enter a valid email address.");
      return;
    }
    if (!password || password.length < 6) {
      setBusy(false);
      setError("Password must be at least 6 characters.");
      return;
    }

    try {
      if (authMode === "signup") {
        if (!fullName.trim()) {
          setBusy(false);
          setError("Please enter your Full Name.");
          return;
        }

        const { user: newBuilderUser, error: builderErr } = await createBuilderAccount({
          fullName: fullName.trim(),
          email: email.trim(),
          password,
          phone: phone.trim() || undefined,
        });

        if (builderErr) {
          setBusy(false);
          setError(builderErr);
          return;
        }

        if (newBuilderUser) {
          toast.success(`Welcome, ${fullName.trim()}! Event unlocked.`);
          setBusy(false);
          onOpenChange(false);
          onSuccess?.();
          if (item.registrationUrl && typeof window !== "undefined") {
            window.open(item.registrationUrl, "_blank", "noopener,noreferrer");
          }
          return;
        }
      }

      // Sign in mode
      const { user: signedInUser, error: signInErr } = await signInBuilderAccount({
        email: email.trim(),
        password,
      });

      if (signInErr) {
        setBusy(false);
        setError(signInErr);
        return;
      }

      if (signedInUser) {
        toast.success("Welcome back! Event unlocked.");
        setBusy(false);
        onOpenChange(false);
        onSuccess?.();
        if (item.registrationUrl && typeof window !== "undefined") {
          window.open(item.registrationUrl, "_blank", "noopener,noreferrer");
        }
        return;
      }
    } catch (err: unknown) {
      setBusy(false);
      setError(err instanceof Error ? err.message : "Authentication error.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[calc(100vw-24px)] sm:w-full max-w-[420px] border-border bg-[#070d09] p-4 sm:p-6 text-foreground shadow-2xl rounded-2xl sm:rounded-3xl max-h-[90vh] overflow-y-auto no-scrollbar box-border"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="border-b border-border/70 pb-3 text-left pr-8 sm:pr-10">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="size-8 sm:size-10 rounded-xl border border-neon/30 bg-surface flex items-center justify-center overflow-hidden shrink-0 shadow-glow-soft">
              <img src={item.image} alt={item.title} className="h-full w-full object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-xs sm:text-base font-bold text-foreground leading-snug line-clamp-2 pr-1">
                {item.title}
              </DialogTitle>
              <DialogDescription className="text-[11px] sm:text-xs text-muted-foreground truncate mt-0.5">
                {item.slug === "quasar-5-international-hackathon-2027"
                  ? "VPPCOE & VA Mumbai"
                  : item.organizer}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-3 space-y-2.5 sm:space-y-3.5 text-xs sm:text-sm">
          <div className="rounded-xl border border-neon/40 bg-neon/5 px-2.5 py-2 text-xs flex items-center gap-2">
            <Lock className="size-3.5 shrink-0 text-neon" />
            <span className="text-muted-foreground leading-tight text-[11px] sm:text-xs">
              {pendingAction?.mode === "join"
                ? "Sign in or create account to join your squad with Team Code."
                : "Sign in or create account to unlock event stages, problem statements & register."}
            </span>
          </div>

          {/* 1-Click Google Sign In */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleAuth}
            disabled={busy}
            className="h-10 sm:h-11 w-full rounded-xl sm:rounded-2xl border-border bg-surface hover:border-neon hover:bg-neon/10 transition flex items-center justify-center gap-2 font-bold text-foreground text-xs sm:text-sm shadow-sm"
          >
            <svg className="size-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Continue with Google</span>
          </Button>

          <div className="flex items-center gap-2 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
            <span className="h-px flex-1 bg-border" />
            OR WITH EMAIL &amp; PASSWORD
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Toggle */}
          <div className="grid grid-cols-2 gap-1 rounded-xl border border-border bg-surface p-1">
            <button
              type="button"
              onClick={() => { setAuthMode("signin"); setError(""); }}
              className={`w-full rounded-lg py-1.5 px-1 text-center text-xs font-bold transition whitespace-nowrap cursor-pointer ${authMode === "signin" ? "bg-neon/15 text-neon border border-neon/30 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setAuthMode("signup"); setError(""); }}
              className={`w-full rounded-lg py-1.5 px-1 text-center text-xs font-bold transition whitespace-nowrap cursor-pointer ${authMode === "signup" ? "bg-neon/15 text-neon border border-neon/30 shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
            >
              Create Account
            </button>
          </div>

          {error && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-2.5 text-xs text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleEmailAuth} className="space-y-2.5">
            {authMode === "signup" && (
              <>
                <div>
                  <label className="block text-[11px] font-semibold text-foreground/90 mb-1">
                    Full Name <span className="text-neon">*</span>
                  </label>
                  <input
                    required
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Johnson"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground outline-none focus:border-neon"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-foreground/90 mb-1">
                    Mobile Number <span className="text-neon">*</span>
                  </label>
                  <input
                    required
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 9876543210"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground outline-none focus:border-neon"
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-foreground/90 mb-1">
                Email Address <span className="text-neon">*</span>
              </label>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yourname@gmail.com"
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground outline-none focus:border-neon"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-foreground/90">
                  Password <span className="text-neon">*</span>
                </label>
                {authMode === "signin" && (
                  <a
                    href="/forgot-password"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] font-semibold text-neon hover:underline"
                  >
                    Forgot password?
                  </a>
                )}
              </div>
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-xs text-foreground outline-none focus:border-neon"
              />
            </div>

            <div className="pt-2 flex items-center justify-between gap-2 sm:gap-2.5">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="rounded-full border-border text-xs h-9 px-3 shrink-0"
              >
                Close
              </Button>
              <Button
                type="submit"
                disabled={busy}
                className="rounded-full bg-neon text-primary-foreground font-bold shadow-glow-soft hover:brightness-105 text-xs flex-1 h-9 px-3"
              >
                <span className="truncate">
                  {busy ? "Please wait..." : authMode === "signin" ? "Sign In & Continue" : "Create & Continue"}
                </span>
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function OpportunityDetails() {
  const item = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [regModalOpen, setRegModalOpen] = useState(false);
  const [exploreGateOpen, setExploreGateOpen] = useState(false);
  const [teamModalOpen, setTeamModalOpen] = useState(false);
  const [ideaModalOpen, setIdeaModalOpen] = useState(false);

  const incomingJoinCode = search.joinCode || search.joinTeam;
  const [activeJoinCode, setActiveJoinCode] = useState<string | undefined>(incomingJoinCode);
  const [modalMode, setModalMode] = useState<"create" | "join">("create");
  const [pendingAction, setPendingAction] = useState<{ mode: "create" | "join"; joinCode?: string } | null>(null);

  const isHost = isEventOrganizer(item, user);
  const registrations = useEventRegistrations(item.slug, { enabled: isHost });
  const regCount = registrations.length;

  const guestStoredEmail = typeof window !== "undefined" ? localStorage.getItem("hd_guest_email") || undefined : undefined;
  const userIdentifier = user?.email || user?.id || guestStoredEmail;

  const userRegRecord = useMemo(() => {
    const effectiveEmail = user?.email || guestStoredEmail;
    const effectiveId = user?.id;
    if (!effectiveId && !effectiveEmail) return null;

    const localUserRegs = getUserRegistrations(effectiveId, effectiveEmail);
    const matched = localUserRegs.find((r) => r.opportunitySlug === item.slug);
    if (matched) return matched;

    return (
      registrations.find(
        (r) =>
          (effectiveId && r.userId === effectiveId) ||
          (effectiveEmail && typeof r.email === "string" && r.email.toLowerCase() === effectiveEmail.toLowerCase()) ||
          (effectiveEmail &&
            Array.isArray(r.teammates) &&
            r.teammates.some(
              (t) =>
                typeof t === "object" &&
                t &&
                typeof t.email === "string" &&
                t.email.toLowerCase() === effectiveEmail.toLowerCase()
            ))
      ) || null
    );
  }, [registrations, user, guestStoredEmail, item.slug]);

  const isRegistered = Boolean(userRegRecord) || isUserRegistered(item.slug, userIdentifier);

  const externalPlatform = useMemo(() => {
    if (!item.registrationUrl) return null;
    const url = item.registrationUrl.toLowerCase();
    if (url.includes("luma.com") || url.includes("lu.ma")) return "Lu.ma";
    if (url.includes("unstop.com")) return "Unstop";
    if (url.includes("devfolio.co")) return "Devfolio";
    return "the official host platform";
  }, [item.registrationUrl]);

  // Live sync user's registration and team roster from Cloudflare D1
  useEffect(() => {
    if (!user && !guestStoredEmail) return;
    const userEmail = user?.email || guestStoredEmail;
    const userId = user?.id;

    // Immediately fetch latest team & registration state from Cloudflare D1
    refreshUserRegistrationFromD1(item.slug, userId, userEmail);

    // Auto-refresh when user switches back to tab or focuses window, plus a periodic 8s sync
    const handleFocus = () => {
      refreshUserRegistrationFromD1(item.slug, userId, userEmail);
    };
    window.addEventListener("focus", handleFocus);
    const interval = setInterval(() => {
      refreshUserRegistrationFromD1(item.slug, userId, userEmail);
    }, 8000);

    return () => {
      window.removeEventListener("focus", handleFocus);
      clearInterval(interval);
    };
  }, [user?.id, user?.email, guestStoredEmail, item.slug]);

  // Auto-open modal or redirect if requested via ?register=1 or ?joinCode=...
  useEffect(() => {
    if (loading) return;
    const hasAuth = !!user || !!getBuilderSession();

    if (search.register === "1") {
      if (item.registrationUrl) {
        window.open(item.registrationUrl, "_blank", "noopener,noreferrer");
      } else {
        if (!hasAuth) {
          setPendingAction({ mode: "create" });
          setExploreGateOpen(true);
        } else if (!isRegistered) {
          setActiveJoinCode(undefined);
          setModalMode("create");
          setRegModalOpen(true);
        } else {
          // Already registered, remove ?register=1 so it doesn't keep opening on tab switch or reload
          navigate({
            search: (prev: any) => ({
              ...prev,
              register: undefined,
            }),
            replace: true,
          });
        }
      }
    } else if (incomingJoinCode && incomingJoinCode.toUpperCase() !== "JOIN") {
      setActiveJoinCode(incomingJoinCode);
      if (!hasAuth) {
        setPendingAction({ mode: "join", joinCode: incomingJoinCode });
        setExploreGateOpen(true);
      } else if (!isRegistered) {
        setModalMode("join");
        setRegModalOpen(true);
      }
    }
  }, [search.register, incomingJoinCode, item.registrationUrl, user, loading, isRegistered]);

  // Prompt unauthenticated visitors to sign in or create an account
  useEffect(() => {
    if (!loading && !user && !getBuilderSession()) {
      setExploreGateOpen(true);
    } else {
      setExploreGateOpen(false);
    }
  }, [loading, user]);

  const handleRegModalChange = (open: boolean) => {
    setRegModalOpen(open);
    if (!open) {
      if (search.register || search.joinCode) {
        navigate({
          search: (prev: any) => ({
            ...prev,
            register: undefined,
            joinCode: undefined,
          }),
          replace: true,
        });
      }
    }
  };

  const handleRegisterClick = () => {
    if (!user && !getBuilderSession()) {
      setPendingAction({ mode: "create" });
      setExploreGateOpen(true);
      return;
    }
    setActiveJoinCode(undefined);
    setModalMode("create");
    setRegModalOpen(true);
  };

  const handleJoinClick = () => {
    if (!user && !getBuilderSession()) {
      setPendingAction({ mode: "join" });
      setExploreGateOpen(true);
      return;
    }
    setActiveJoinCode(undefined);
    setModalMode("join");
    setRegModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setExploreGateOpen(false);
    if (pendingAction?.mode === "join") {
      const code = pendingAction.joinCode || activeJoinCode;
      if (code && code.toUpperCase() !== "JOIN") {
        setActiveJoinCode(code);
      }
      setModalMode("join");
      setRegModalOpen(true);
      setPendingAction(null);
    } else if (pendingAction?.mode === "create") {
      setActiveJoinCode(undefined);
      setModalMode("create");
      setRegModalOpen(true);
      setPendingAction(null);
    } else if (incomingJoinCode && incomingJoinCode.toUpperCase() !== "JOIN") {
      setActiveJoinCode(incomingJoinCode);
      setModalMode("join");
      setRegModalOpen(true);
    } else if (search.register === "1") {
      setActiveJoinCode(undefined);
      setModalMode("create");
      setRegModalOpen(true);
    }
  };

  const handleExternalRegisterClick = () => {
    if (!item.registrationUrl) return;
    window.open(item.registrationUrl, "_blank", "noopener,noreferrer");
  };

  // Auto-redirect to external registration if redirected after Google OAuth
  useEffect(() => {
    if (search.autoredirect === "1" && user && item.registrationUrl) {
      window.open(item.registrationUrl, "_blank", "noopener,noreferrer");
    }
  }, [search.autoredirect, user, item.registrationUrl]);

  const facts = [
    { icon: Calendar, label: "Event dates", value: item.date },
    { icon: MapPin, label: "Format", value: `${item.format} · ${item.location}` },
    { icon: Clock3, label: "Registration deadline", value: item.registrationDeadline },
    { icon: Users, label: "Team size", value: item.teamSize },
    { icon: CheckCircle2, label: "Eligibility", value: item.eligibility },
    { icon: WalletCards, label: "Entry fee", value: item.fee },
  ];

  const eventStructuredData = {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": item.title,
    "description": item.description,
    "image": item.image?.startsWith("http")
      ? item.image
      : `https://www.vybedriven.in${item.image}`,
    "startDate": item.date,
    "eventAttendanceMode":
      item.format === "Online"
        ? "https://schema.org/OnlineEventAttendanceMode"
        : item.format === "Hybrid"
        ? "https://schema.org/MixedEventAttendanceMode"
        : "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus":
      item.status === "Event full" || item.status === "Sold out"
        ? "https://schema.org/EventMovedOnline"
        : "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": item.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": item.location.includes("Mumbai") ? "Mumbai" : item.location.includes("Pune") ? "Pune" : "India",
        "addressCountry": "IN"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": item.organizer,
      "url": "https://www.vybedriven.in"
    },
    "offers": {
      "@type": "Offer",
      "url": item.registrationUrl || `https://www.vybedriven.in/opportunities/${item.slug}`,
      "price": item.fee.includes("₹") ? (item.fee.replace(/[^\d]/g, "") || "0") : "0",
      "priceCurrency": "INR",
      "availability":
        item.status === "Sold out"
          ? "https://schema.org/SoldOut"
          : "https://schema.org/InStock"
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-clip max-w-full">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventStructuredData) }}
      />
      <Navbar />

      {/* Mobile Sub-Navigation Tabs (Unstop Mobile Convenience) */}
      <div className="border-b border-border/80 bg-surface/80 backdrop-blur-md lg:hidden max-w-full overflow-hidden">
        <div className="flex items-center gap-2 overflow-x-auto px-3.5 py-2 no-scrollbar scroll-smooth">
          <a
            href="#overview"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-card border border-border/80 text-foreground hover:border-neon/60 hover:text-neon transition"
          >
            <span>🏠 Overview</span>
          </a>
          {item.schedule && item.schedule.length > 0 && (
            <a
              href="#timeline"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-card border border-border/80 text-foreground hover:border-neon/60 hover:text-neon transition"
            >
              <span>⏳ Stages &amp; Timeline</span>
            </a>
          )}
          <a
            href="#details"
            className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-card border border-border/80 text-foreground hover:border-neon/60 hover:text-neon transition"
          >
            <span>📋 Details</span>
          </a>
          {item.importantDates && item.importantDates.length > 0 && (
            <a
              href="#dates"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-card border border-border/80 text-foreground hover:border-neon/60 hover:text-neon transition"
            >
              <span>📅 Dates</span>
            </a>
          )}
          {(item.rewards || item.prize) && (
            <a
              href="#rewards"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-card border border-border/80 text-foreground hover:border-neon/60 hover:text-neon transition"
            >
              <span>🏆 Rewards</span>
            </a>
          )}
          {item.contacts && (
            <a
              href="#contact"
              className="shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-card border border-border/80 text-foreground hover:border-neon/60 hover:text-neon transition"
            >
              <span>📞 Contact</span>
            </a>
          )}
        </div>
      </div>

      <main className="pb-28 lg:pb-0 overflow-x-hidden w-full max-w-full">
        {/* DESKTOP HERO (Laptop / PC: Identical to original desktop layout) */}
        <section id="overview" className="hidden lg:block border-b border-border bg-surface scroll-mt-28">
          <div className="mx-auto grid max-w-[1200px] gap-7 px-6 pb-10 pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            {/* Column 1: Details & Title */}
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold">
                  {item.type}
                </span>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${item.status === "Past event" ? "border border-white/10 bg-zinc-800 text-zinc-300" : "bg-neon text-primary-foreground"}`}>
                  {item.status === "Past event" ? "Past event" : item.status}
                </span>
                {(item as any).isHosted && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-neon/50 bg-black/80 px-2.5 py-1 text-xs font-semibold text-neon backdrop-blur">
                    <Sparkles className="size-3" /> Community Hosted
                  </span>
                )}
                {item.slug === "goa-buildathon-2027" && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-2.5 py-1 text-xs font-medium text-muted-foreground">
                    <Users className="size-3 text-neon" /> 2,000+ Registrations
                  </span>
                )}
              </div>
              <p className="mt-6 text-sm font-semibold text-neon">{item.tag.toUpperCase()}</p>
              <h1 className="mt-2 text-5xl lg:text-6xl font-extrabold leading-tight break-words">{item.title}</h1>
              <p className="mt-5 max-w-2xl text-lg leading-relaxed text-muted-foreground break-words">
                {item.description}
              </p>
              <p className="mt-5 text-sm text-muted-foreground break-words">
                Hosted by <span className="font-semibold text-foreground">{item.organizer}</span>
              </p>

              {/* Top Prize & Trophy Banner */}
              {item.prize && (
                item.slug === "goa-buildathon-2027" ? (
                  <div className="mt-5 inline-block">
                    <img
                      src="/events/prizes-worth-banner.jpg"
                      alt="Prizes Worth ₹ 10,00,000"
                      className="h-auto max-w-md md:max-w-lg rounded-2xl border border-neon/40 shadow-glow-soft hover:shadow-glow transition"
                    />
                  </div>
                ) : item.slug === "quasar-5-international-hackathon-2027" ? (
                  <div className="mt-5 inline-block max-w-full">
                    <div className="relative overflow-hidden rounded-[30px] border-2 border-emerald-500/70 bg-[#030904] p-3 pr-6 shadow-[0_0_35px_rgba(16,185,129,0.35)] backdrop-blur-xl">
                      <div className="flex items-center gap-5 rounded-[24px] border border-emerald-500/40 bg-gradient-to-r from-emerald-950/60 via-[#051307] to-[#040e06] p-3 pl-5">
                        {/* Laurel Wreath */}
                        <div className="shrink-0 flex items-center justify-center text-emerald-400 drop-shadow-[0_0_10px_rgba(52,211,153,0.7)]">
                          <svg className="size-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M7 21C5.5 19 4 16.5 4 13.5C4 9.5 6 6 8.5 4" />
                            <path d="M4 11C5.5 11 7 9.5 7 8" />
                            <path d="M4.5 16C6 15.5 7.5 14 7.5 12.5" />
                            <path d="M17 21C18.5 19 20 16.5 20 13.5C20 9.5 18 6 15.5 4" />
                            <path d="M20 11C18.5 11 17 9.5 17 8" />
                            <path d="M19.5 16C18 15.5 16.5 14 16.5 12.5" />
                          </svg>
                        </div>

                        {/* Vertical separator */}
                        <div className="h-12 w-[1.5px] bg-emerald-500/40 shrink-0" />

                        {/* Prize text */}
                        <div className="flex flex-col min-w-0 pr-2">
                          <span className="text-xs font-black italic tracking-wider text-emerald-400 uppercase drop-shadow-[0_0_8px_rgba(52,211,153,0.6)]">
                            PRIZES <span className="text-emerald-300">WORTH</span>
                          </span>
                          <span className="text-3xl md:text-4xl font-black text-white font-mono tracking-tight drop-shadow-[0_2px_14px_rgba(255,255,255,0.45)] leading-tight">
                            ₹ 1,50,000
                          </span>
                        </div>

                        {/* Trophy with Glowing Green Orbit */}
                        <div className="relative shrink-0 flex items-center justify-center pl-2">
                          <div className="absolute inset-x-[-12px] bottom-2.5 h-4 rounded-[100%] border-2 border-emerald-400/90 shadow-[0_0_14px_rgba(52,211,153,0.9)] -rotate-12 pointer-events-none" />
                          <img
                            src="/events/golden-star-trophy.png"
                            alt="Prize Trophy"
                            className="relative z-10 h-18 md:h-20 w-auto object-contain drop-shadow-[0_6px_22px_rgba(250,204,21,0.6)]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 inline-flex items-center gap-4 rounded-2xl border border-neon/35 bg-gradient-to-r from-neon/15 via-emerald-500/10 to-transparent p-3 pr-5 shadow-glow-soft">
                    <div className="pl-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-neon">Prizes worth</p>
                      <p className="text-2xl sm:text-3xl font-extrabold text-foreground font-mono tracking-tight">
                        {item.prize}
                      </p>
                    </div>
                    <img
                      src="/events/golden-star-trophy.png"
                      alt="Prize Trophy"
                      className="h-14 sm:h-16 w-auto object-contain shrink-0 drop-shadow-[0_4px_14px_rgba(250,204,21,0.45)]"
                    />
                  </div>
                )
              )}
            </div>

            {/* Column 2: Event Poster */}
            <div className="relative flex items-center justify-center overflow-hidden rounded-3xl border border-border/80 bg-black/60 p-4 shadow-inner">
              <img
                src={item.image}
                alt={item.title}
                style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined}
                className="max-h-[460px] w-auto max-w-full rounded-2xl object-contain transition duration-500 hover:scale-[1.01]"
              />
            </div>
          </div>
        </section>

        {/* MOBILE HERO (Unstop Native Experience: Clean Banner + Clean Card + 3 Metadata Rows) */}
        <section id="mobile-overview" className="block lg:hidden bg-surface pb-3">
          {/* 1. Full-width top landscape banner (Full uncropped poster) */}
          <div className="px-3 pt-3">
            <div className="relative overflow-hidden rounded-2xl border border-border/80 bg-black shadow-md flex items-center justify-center">
              <img
                src={item.slug === "quasar-5-international-hackathon-2027" ? "/events/quasar-5-poster-full.jpg" : item.image}
                alt={item.title}
                className="w-full h-auto max-h-[380px] object-contain rounded-2xl"
              />
            </div>
          </div>

          {/* 2. Unstop Mobile Hero Info Card */}
          <div className="px-3 pt-3">
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-sm space-y-3.5">
              {/* Row 1: Offline / Mode Badge + Action Icons (Unstop Header) */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/15 border border-red-500/30 px-3 py-1 text-xs font-semibold text-red-400">
                  <MapPin className="size-3 text-red-400" />
                  Offline
                </span>

                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({ title: item.title, url: window.location.href }).catch(() => {});
                      } else {
                        navigator.clipboard.writeText(window.location.href);
                        toast.success("Event link copied to clipboard!");
                      }
                    }}
                    className="p-1.5 rounded-full hover:bg-surface-2 transition text-muted-foreground hover:text-foreground active:scale-95"
                    title="Share Event"
                    aria-label="Share Event"
                  >
                    <Share2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Row 2: Title and Square Event Logo Badge (Matching Unstop Actual Logo) */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h1 className="text-base sm:text-lg font-black text-foreground leading-snug break-words">
                    {item.title}
                  </h1>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed break-words">
                    {item.slug === "quasar-5-international-hackathon-2027"
                      ? "Vasantdada Patil Pratishthan's College of Engineering and Visual Arts, Mumbai, Maharashtra"
                      : item.organizer}
                  </p>
                </div>

                {/* Square Event Logo Badge */}
                {item.slug === "quasar-5-international-hackathon-2027" ? (
                  <img
                    src="/events/quasar-5-logo.webp"
                    alt="Quasar 5.0"
                    className="shrink-0 size-14 sm:size-16 rounded-xl object-contain border border-border/80 bg-black shadow-inner"
                  />
                ) : (
                  <div className="shrink-0 size-14 rounded-xl border border-border/80 bg-black/90 p-1 flex flex-col items-center justify-center text-center shadow-inner">
                    <Sparkles className="size-5 text-neon" />
                    <span className="text-[8px] font-black tracking-tight text-white font-mono mt-0.5 truncate max-w-[46px]">{item.title.split(" ")[0]}</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border/60" />

              {/* Row 3: 3 Clean Metadata Bullet Rows (Exact Unstop format) */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between text-xs gap-3">
                  <span className="flex items-center gap-2 text-muted-foreground font-medium shrink-0 pt-0.5">
                    <MapPin className="size-3.5 text-muted-foreground shrink-0" />
                    Location
                  </span>
                  <span className="font-semibold text-foreground text-right leading-tight max-w-[240px]">
                    {item.slug === "quasar-5-international-hackathon-2027"
                      ? "Vasantdada Patil Pratishthan's College of Engineering and Visual Arts, Mumbai, Maharashtra"
                      : item.location}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs gap-3">
                  <span className="flex items-center gap-2 text-muted-foreground font-medium shrink-0">
                    <Users className="size-3.5 text-muted-foreground shrink-0" />
                    Team Size
                  </span>
                  <span className="font-semibold text-foreground text-right">
                    {item.teamSize || "2 - 4 Members"}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs gap-3">
                  <span className="flex items-center gap-2 text-muted-foreground font-medium shrink-0">
                    <ExternalLink className="size-3.5 text-muted-foreground shrink-0" />
                    Registered
                  </span>
                  <span className="font-semibold text-foreground text-right font-mono">
                    {item.slug === "quasar-5-international-hackathon-2027"
                      ? "1000+"
                      : regCount > 0
                      ? `${regCount} registered`
                      : "1000+"}
                  </span>
                </div>
              </div>

              {/* Unstop Native Trophy Banner: Left Trophy + Center Prize + Right Trophy */}
              {item.prize && (
                <div className="relative overflow-hidden rounded-2xl border border-sky-400/30 bg-gradient-to-r from-sky-500/10 via-cyan-500/15 to-sky-500/10 p-2.5 sm:p-3 shadow-sm">
                  <div className="flex items-center justify-between gap-3 px-2">
                    <img
                      src="/events/golden-star-trophy.png"
                      alt="Trophy"
                      className="h-9 sm:h-11 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]"
                    />
                    <div className="flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] sm:text-[11px] font-bold text-sky-300 uppercase tracking-wider">Prizes worth</span>
                      <span className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight drop-shadow-sm leading-tight">
                        {item.prize}
                      </span>
                    </div>
                    <img
                      src="/events/golden-star-trophy.png"
                      alt="Trophy"
                      className="h-9 sm:h-11 w-auto object-contain shrink-0 drop-shadow-[0_2px_8px_rgba(250,204,21,0.5)]"
                    />
                  </div>
                </div>
              )}

              {/* Clean Category Tags */}
              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                <span className="rounded-full bg-surface-2 border border-border/80 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.type}
                </span>
                <span className="rounded-full bg-surface-2 border border-border/80 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  {item.fee === "Free" ? "Free Entry" : item.fee}
                </span>
                {item.slug === "quasar-5-international-hackathon-2027" && (
                  <span className="rounded-full bg-surface-2 border border-border/80 px-2.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                    36-Hour Hackathon
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Content & Sidebar */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6 sm:py-8">
          <div className="grid gap-7 lg:grid-cols-[1fr_320px]">
            <div className="min-w-0">
              {/* MOBILE ONLY: Registered Squad Tools (ONLY shown when user is already registered or host) */}
              {(isRegistered || isHost) && (
                <div className="mb-6 rounded-2xl border border-neon/40 bg-gradient-to-br from-neon/10 via-card to-card p-4 sm:p-5 shadow-sm lg:hidden">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                      <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Squad Registered
                    </span>
                    <span className="text-xs font-bold text-neon font-mono">
                      {userRegRecord?.teamName || "Squad Pass"}
                    </span>
                  </div>

                  {/* Mobile Organizer Banner if Organizer */}
                  {isHost && (
                    <div className="mt-3 rounded-xl border border-neon/50 bg-neon/10 p-3 text-xs">
                      <div className="flex items-center justify-between font-bold text-neon">
                        <span className="flex items-center gap-1.5">
                          <Crown className="size-4 text-amber-400" />
                          Organizer Control
                        </span>
                        <span className="text-[10px] font-mono text-neon bg-neon/20 px-2 py-0.5 rounded-full">
                          {regCount} registrations
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] text-muted-foreground">
                        Access live attendee registrations, team rosters, and download CSV.
                      </p>
                      <Button
                        asChild
                        size="sm"
                        className="mt-2.5 w-full rounded-lg bg-neon text-primary-foreground font-black text-xs hover:brightness-105 shadow-glow-soft"
                      >
                        <Link to="/manage-events" search={{ tab: "registrations", slug: item.slug }}>
                          Open Registrations & CSV Dashboard →
                        </Link>
                      </Button>
                    </div>
                  )}

                  {/* Mobile Registered Team Controls */}
                  {isRegistered && (
                    <div className="mt-3.5 space-y-2.5">
                      {/* PPT Round 1 CTA for Teams with >= 2 members */}
                      {userRegRecord?.teamType === "team" && (1 + (userRegRecord.teammates?.length || 0)) >= 2 ? (
                        <Button
                          type="button"
                          onClick={() => setIdeaModalOpen(true)}
                          className="w-full rounded-xl bg-neon text-primary-foreground font-black text-xs py-3 shadow-glow hover:brightness-105"
                        >
                          <Sparkles className="size-3.5 mr-1.5" />
                          {userRegRecord?.submission?.pptUrl
                            ? "View / Edit Round 1 PPT Deck ✓"
                            : "Submit Round 1 Idea (PPT) 🚀"}
                        </Button>
                      ) : null}

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          onClick={() => setTeamModalOpen(true)}
                          className="h-10 sm:h-11 w-full rounded-xl bg-neon text-black font-extrabold text-xs px-2 shadow-glow-soft hover:brightness-105 flex items-center justify-center gap-1.5"
                        >
                          <Users className="size-3.5 shrink-0 text-black" />
                          <span className="truncate">Manage Team</span>
                        </Button>

                        {userRegRecord?.teamType === "team" && (1 + (userRegRecord.teammates?.length || 0)) < 2 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRegisterClick}
                            className="h-10 sm:h-11 w-full rounded-xl border-amber-500/50 text-xs font-bold text-amber-400 hover:bg-amber-500/15 px-2 flex items-center justify-center gap-1.5"
                          >
                            <Lock className="size-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">Pass Locked</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRegisterClick}
                            className="h-10 sm:h-11 w-full rounded-xl border-neon/50 text-xs font-bold text-neon hover:bg-neon hover:text-black px-2 flex items-center justify-center gap-1.5"
                          >
                            <Ticket className="size-3.5 shrink-0" />
                            <span className="truncate">Entry Pass</span>
                          </Button>
                        )}
                      </div>

                      {/* WhatsApp Community - EXCLUSIVE TO REGISTERED TEAMS & MEMBERS */}
                      {item.groupUrl && (
                        <a
                          href={item.groupUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-400 transition hover:bg-emerald-500/20"
                        >
                          <MessageCircle className="size-3.5 text-emerald-400" />
                          <span>{item.groupLabel ?? "Join WhatsApp Community"}</span>
                          <ExternalLink className="size-3 opacity-80" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Desktop Quick Facts Grid (6-cell grid rendered only on laptop / PC) */}
              <div className="hidden lg:grid overflow-hidden rounded-2xl border border-border bg-card grid-cols-3">
                {facts.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="border-b border-border p-5 [&:nth-child(3n)]:border-r-0 border-r">
                    <Icon className="size-5 text-neon" />
                    <p className="mt-3 text-xs font-semibold text-muted-foreground">{label}</p>
                    <p className="mt-1 text-sm font-semibold break-words leading-tight">{value}</p>
                  </div>
                ))}
              </div>

              {/* External Platform Disclaimer / Listing Notice */}
              {externalPlatform && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-border/80 bg-surface-2/70 p-3 sm:p-3.5 text-xs text-muted-foreground">
                  <Info className="size-4 shrink-0 text-neon mt-0.5" />
                  <p className="leading-relaxed">
                    <span className="font-semibold text-foreground">Platform Listing Notice:</span> This event is officially hosted on <span className="font-semibold text-foreground">{externalPlatform}</span>. Vybe Driven has listed this opportunity for builder community discovery. Registrations, admissions, and event proceedings are handled entirely by the host organization on {externalPlatform}.
                  </p>
                </div>
              )}

              {/* About Section with Read More */}
              <section id="details" className="py-7 sm:py-9 scroll-mt-28">
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="h-6 w-1 rounded-full bg-neon shadow-glow-soft" />
                  <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                    All that you need to know about {item.title}
                  </h2>
                </div>
                <FormattedOverview overview={item.overview} />
              </section>

              {/* Stages and Timeline */}
              {item.schedule && item.schedule.length > 0 && (
                <section id="timeline" className="border-t border-border py-8 sm:py-10 scroll-mt-28">
                  <div className="flex items-center gap-2.5 mb-7">
                    <span className="h-6 w-1 rounded-full bg-neon shadow-glow-soft" />
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Stages and Timelines</h2>
                  </div>

                  <div className="relative pl-7 sm:pl-9 before:absolute before:left-3.5 sm:before:left-4 before:top-4 before:bottom-6 before:w-[2px] before:border-l-2 before:border-dashed before:border-border/80 before:bg-transparent">
                    {item.schedule.map((step, index) => {
                      const dateParts = step.dateBadge?.split(" ") || [];
                      const month = dateParts[0] || `Stage`;
                      const day = dateParts[1] || `${index + 1}`;
                      return (
                        <div key={step.title} className="relative pb-9 last:pb-2">
                          {/* Calendar Node directly over the timeline line */}
                          <div className="flex items-center gap-3 sm:gap-4 mb-3.5 min-w-0">
                            <div className="relative -ml-[25px] sm:-ml-[27px] flex flex-col items-center justify-center rounded-2xl border border-border/80 bg-card px-2.5 py-1.5 shadow-sm min-w-[54px] text-center shrink-0">
                              <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-muted-foreground leading-tight">{month}</span>
                              <span className="text-base sm:text-lg font-black text-foreground leading-none font-mono mt-0.5">{day}</span>
                            </div>
                            <span className="text-xs sm:text-sm font-semibold text-muted-foreground flex items-center gap-1.5 break-words min-w-0">
                              <Calendar className="size-3.5 shrink-0 text-muted-foreground" />
                              <span className="break-words leading-snug">{step.date}</span>
                            </span>
                          </div>

                          {/* Stage Card */}
                          <div className="rounded-2xl border border-border/80 bg-card p-4 sm:p-6 shadow-sm hover:border-border/90 transition">
                            <div className="flex items-center justify-between gap-2 border-b border-border/70 pb-3">
                              <h3 className="text-base sm:text-lg font-extrabold text-foreground">{step.title}</h3>
                              <span className="rounded-full bg-surface-2 border border-border/80 px-2.5 py-0.5 text-xs font-bold text-muted-foreground font-mono shrink-0">
                                {step.stageBadge || `Stage ${index + 1}`}
                              </span>
                            </div>

                            <p className="mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground font-medium break-words">
                              {step.description}
                            </p>

                            {step.bullets && step.bullets.length > 0 && (
                              <ul className="mt-3.5 space-y-2 pl-1 border-t border-border/60 pt-3">
                                {step.bullets.map((b) => (
                                  <li key={b} className="flex items-start gap-2.5 text-xs sm:text-sm text-muted-foreground leading-relaxed break-words">
                                    <span className="mt-2 size-1.5 rounded-full bg-muted-foreground/60 shrink-0" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            )}

                            {step.evaluation && (
                              <div className="mt-4 hidden sm:flex rounded-xl border border-border/80 bg-surface px-4 py-2 text-xs text-muted-foreground flex-wrap items-center gap-2">
                                <span className="font-bold text-foreground uppercase tracking-wider text-[11px] shrink-0">Evaluation:</span>
                                <span className="text-muted-foreground font-medium break-words">{step.evaluation}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              )}

              {/* Important dates & deadlines */}
              {item.importantDates && item.importantDates.length > 0 && (
                <section id="dates" className="border-t border-border py-8 sm:py-10 scroll-mt-28">
                  <div className="flex items-center gap-2.5 mb-6">
                    <span className="h-6 w-1 rounded-full bg-neon shadow-glow-soft" />
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                      Important dates &amp; deadlines?
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-3.5">
                    {item.importantDates.map((d, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-3 sm:gap-4 rounded-2xl border border-border/80 bg-surface/90 p-3 sm:p-4 shadow-sm transition hover:border-neon/50 hover:bg-surface-2/80 hover:shadow-glow-soft"
                      >
                        <div className="flex flex-col items-center justify-center rounded-xl bg-neon/15 border border-neon/50 px-2.5 py-1 sm:px-3 sm:py-1.5 min-w-[50px] sm:min-w-[56px] text-center shrink-0 shadow-inner">
                          <span className="text-sm sm:text-lg font-black text-neon leading-none font-mono">
                            {d.day}
                          </span>
                          <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-muted-foreground leading-tight mt-0.5">
                            {d.month}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs sm:text-sm font-bold text-foreground">
                            {d.title}
                          </p>
                          <p className="text-[11px] sm:text-xs text-muted-foreground font-mono mt-0.5 break-words">
                            {d.fullDate}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Rewards, Perks & Opportunities */}
              {(item.rewards || item.prize || (item.perks && item.perks.length > 0)) && (
                <section id="rewards" className="border-t border-border py-8 sm:py-10 scroll-mt-28">
                  <div className="flex items-center gap-2.5 mb-2">
                    <span className="h-6 w-1 rounded-full bg-neon shadow-glow-soft" />
                    <h2 className="text-xl sm:text-2xl font-bold text-foreground">Rewards and Prizes</h2>
                  </div>
                  {item.rewardsSubtitle && (
                    <p className="text-xs sm:text-sm text-muted-foreground mb-6">
                      {item.rewardsSubtitle}
                    </p>
                  )}

                  {item.rewards && item.rewards.length > 0 ? (
                    <div className="space-y-3.5">
                      {item.rewards.map((rew) => (
                        (rew.amountSub === "WORTH" || rew.type === "cash" || rew.amount) ? (
                          /* Grand Amber Trophy Card (Matching Goa Buildathon & Quasar 5.0 Golden Trophy Style) */
                          <div
                            key={rew.title}
                            className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-amber-500/40 bg-gradient-to-r from-amber-500/10 via-[#0a0f0a] to-[#070b07] p-4 sm:p-6 shadow-[0_0_24px_rgba(245,158,11,0.12)] transition hover:border-amber-400"
                          >
                            <div className="absolute left-0 top-0 bottom-0 w-1.5 sm:w-2 bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-500" />
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 pl-1 sm:pl-2">
                              <div className="flex items-center gap-3.5 sm:gap-6 min-w-0">
                                <div className="relative shrink-0">
                                  <img
                                    src="/events/golden-star-trophy.png"
                                    alt="Prize Trophy"
                                    className="h-14 sm:h-18 md:h-20 w-auto object-contain drop-shadow-[0_6px_16px_rgba(245,158,11,0.45)]"
                                  />
                                </div>
                                <div className="flex flex-col min-w-0">
                                  <div className="flex flex-wrap items-baseline gap-1.5 sm:gap-2">
                                    <span className="text-2xl min-[400px]:text-3xl sm:text-4xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
                                      {rew.amount}
                                    </span>
                                    <span className="text-[11px] sm:text-xs font-black tracking-widest text-amber-300 uppercase shrink-0">
                                      {rew.amountSub || "CASH"}
                                    </span>
                                  </div>
                                  <h3 className="mt-1 text-sm sm:text-base md:text-lg font-bold text-foreground">
                                    {rew.title}
                                  </h3>
                                  {rew.description && (
                                    <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                                      {rew.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center self-start sm:self-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/15 px-3.5 py-1.5 text-xs font-bold text-amber-300 shadow-glow-soft">
                                  <Trophy className="size-3.5 text-amber-400" />
                                  <span>{rew.badge || "Certificate"}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          /* Certificate Card */
                          <div
                            key={rew.title}
                            className="rounded-2xl border border-blue-500/35 bg-gradient-to-br from-blue-500/10 via-surface to-surface p-4 sm:p-5 transition hover:border-blue-400/60 shadow-sm"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <div className="flex items-center gap-4 sm:gap-5">
                                <div className="size-12 sm:size-14 rounded-2xl bg-gradient-to-br from-blue-500/25 to-indigo-600/20 border border-blue-400/40 flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(59,130,246,0.25)]">
                                  <Award className="size-6 sm:size-7 text-blue-400" />
                                </div>
                                <div>
                                  <h3 className="text-base sm:text-lg font-bold text-foreground">{rew.title}</h3>
                                  {rew.description && (
                                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                                      {rew.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="shrink-0 flex items-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-400/40 bg-blue-400/10 px-3.5 py-1.5 text-xs font-bold text-blue-300">
                                  <CheckCircle2 className="size-3.5 text-blue-400" />
                                  {rew.badge || "Certificate"}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      ))}

                      {item.rewardsFootnote && (
                        <p className="mt-4 text-xs font-medium text-muted-foreground/90 italic flex items-center gap-2">
                          <span className="size-1.5 rounded-full bg-neon shrink-0" />
                          <span>{item.rewardsFootnote}</span>
                        </p>
                      )}
                    </div>
                  ) : (
                    /* Fallback for items with prize */
                    <div className="space-y-4">
                      {item.prize && (
                        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/15 via-surface to-surface p-6 sm:p-7 shadow-[0_0_30px_rgba(245,158,11,0.15)] transition hover:border-amber-400">
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-amber-400 via-yellow-300 to-amber-500" />
                          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-4 sm:gap-6">
                              <div className="relative shrink-0">
                                <img
                                  src="/events/golden-star-trophy.png"
                                  alt="Prize Trophy"
                                  className="h-20 sm:h-24 w-auto object-contain drop-shadow-[0_8px_20px_rgba(245,158,11,0.5)]"
                                />
                              </div>
                              <div className="flex flex-col">
                                <div className="flex items-baseline gap-2">
                                  <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-amber-400 font-mono tracking-tight drop-shadow-[0_2px_10px_rgba(245,158,11,0.3)]">
                                    {item.prize}
                                  </span>
                                  <span className="text-xs sm:text-sm font-extrabold tracking-widest text-amber-300 uppercase">
                                    TOTAL PRIZE POOL
                                  </span>
                                </div>
                                <h3 className="mt-1 text-base sm:text-lg font-bold text-foreground">Cash Prizes & Recognition</h3>
                                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xl">
                                  Awarded to winning innovators, finalist teams, and category champions.
                                </p>
                              </div>
                            </div>
                            <div className="shrink-0 flex items-center">
                              <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-400/50 bg-amber-400/15 px-4 py-2 text-xs font-bold text-amber-300 shadow-glow-soft">
                                <Trophy className="size-4 text-amber-400" />
                                Certificate & Awards
                              </span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Extra Perks Grid */}
                  {item.perks && item.perks.length > 0 && (
                    <div className="mt-8 pt-6 border-t border-border/70">
                      <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                        Participant Benefits & Perks
                      </p>
                      <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                        {item.perks.map((perk) => (
                          <div
                            key={perk.title}
                            className="group relative flex gap-3.5 rounded-xl sm:rounded-2xl border border-border bg-card p-4 transition duration-300 hover:border-neon/40 hover:bg-surface-2 hover:shadow-glow-soft"
                          >
                            <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-neon/10 text-neon group-hover:bg-neon group-hover:text-primary-foreground transition duration-300">
                              {perk.icon === "gift" ? (
                                <Gift className="size-5" />
                              ) : perk.icon === "rocket" ? (
                                <Rocket className="size-5" />
                              ) : perk.icon === "laptop" ? (
                                <Laptop className="size-5" />
                              ) : perk.icon === "coffee" ? (
                                <Coffee className="size-5" />
                              ) : perk.icon === "award" ? (
                                <Award className="size-5" />
                              ) : perk.icon === "handshake" ? (
                                <Handshake className="size-5" />
                              ) : perk.icon === "brain" ? (
                                <Brain className="size-5" />
                              ) : (
                                <Sparkles className="size-5" />
                              )}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                {perk.emoji && <span className="text-base select-none">{perk.emoji}</span>}
                                <h3 className="text-sm sm:text-base font-bold text-foreground group-hover:text-neon transition">
                                  {perk.title}
                                </h3>
                              </div>
                              {perk.description && (
                                <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                  {perk.description}
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </section>
              )}

              {/* Mobile-Only Contact Queries (Clean, without duplicate Register Now card) */}
              {item.contacts && (
                <div className="mt-6 rounded-2xl border border-border bg-card p-4 sm:p-5 lg:hidden">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">QUERIES</p>
                  <ul className="mt-2 space-y-1.5">
                    {item.contacts.map((contact) => (
                      <li key={contact.phone} className="text-xs">
                        <a
                          href={contact.phone.includes("@") ? `mailto:${contact.phone}` : `tel:${contact.phone}`}
                          className="font-semibold text-foreground hover:text-neon"
                        >
                          {contact.name}
                        </a>
                        <span className="text-muted-foreground"> · {contact.phone}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="mailto:vybedriven@gmail.com"
                    className="mt-2.5 block text-xs text-muted-foreground hover:text-neon transition"
                  >
                    Have questions? Ask Vybe Driven (vybedriven@gmail.com)
                  </a>
                </div>
              )}
            </div>

            {/* Desktop-Only Sticky Registration Sidebar */}
            <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm">
                {/* Host Control Box */}
                {isHost && (
                  <div className="mb-5 rounded-xl border border-neon/40 bg-neon/10 p-3.5 text-xs text-foreground">
                    <div className="flex items-center gap-2 font-bold text-neon">
                      <Crown className="size-4" />
                      <span>You are hosting this event</span>
                    </div>
                    <p className="mt-1 text-muted-foreground">
                      Track registrations and download participant CSV from your organizer dashboard.
                    </p>
                    <div className="mt-2.5 flex flex-col gap-2">
                      <Button asChild size="sm" className="w-full rounded-lg bg-neon text-primary-foreground font-bold hover:brightness-105">
                        <Link to="/manage-events" search={{ tab: "registrations", slug: item.slug }}>
                          Manage {regCount} Registrations →
                        </Link>
                      </Button>
                      <Button asChild size="sm" variant="outline" className="w-full rounded-lg border-border text-xs">
                        <Link to="/host" search={{ edit: item.slug }}>
                          ✏️ Edit Event Details
                        </Link>
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Registration
                  </p>
                  {item.slug === "goa-buildathon-2027" && (
                    <span className="text-xs font-semibold text-neon font-mono">
                      2,000+ Registrations
                    </span>
                  )}
                </div>

                <h2 className="mt-2 text-lg sm:text-xl font-bold">
                  {item.status === "Past event"
                    ? "Event Concluded"
                    : item.status === "Sold out"
                    ? "Sold out"
                    : item.status === "Event full"
                    ? "Event full"
                    : item.status === "Approval required"
                    ? "Approval required"
                    : "Registrations open"}
                </h2>

                <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  {item.registrationNote ??
                    (item.registrationDeadline === "To be announced"
                      ? "Register now to secure your participation spot."
                      : `Apply before ${item.registrationDeadline}.`)}
                </p>

                {/* Already Registered Card */}
                {isRegistered ? (
                  <div className="mt-5 space-y-4">
                    {/* Unstop-Style Round 1: Idea Submission (PPT Round) Widget - Only active when team has at least 2 members */}
                    {(userRegRecord?.teamType !== "team" || (1 + (userRegRecord.teammates?.length || 0)) >= 2) ? (
                      <div className="rounded-2xl border-2 border-neon/50 bg-gradient-to-br from-neon/15 via-emerald-950/20 to-black p-4 shadow-glow-soft">
                        <div className="flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-emerald-400">
                            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            Round Live · Via Vybe Driven
                          </span>
                          <span className="text-[11px] text-muted-foreground font-mono">
                            {item.slug === "quasar-5-international-hackathon-2027" ? "Dec 25, 2026" : "Dec 31, 2026"}
                          </span>
                        </div>

                        <h3 className="mt-2 text-base font-black text-foreground tracking-tight">
                          Idea Submission — PPT Round
                        </h3>
                        <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                          {item.slug === "goa-buildathon-2027"
                            ? "Submit your team's proposed solution deck to qualify for the Grand Finale in Goa."
                            : item.slug === "quasar-5-international-hackathon-2027"
                            ? "Submit your team's proposed solution deck via Vybe Driven to qualify for Round 1 & the 36-Hour Offline Finale at VPPCOE & VA Sion, Mumbai."
                            : "Submit your team's proposed solution deck to qualify for the finale."}
                        </p>

                        <div className="mt-3 space-y-2">
                          <Button
                            onClick={() => setIdeaModalOpen(true)}
                            className="w-full rounded-xl bg-neon text-primary-foreground font-black text-xs sm:text-sm py-2.5 shadow-glow hover:brightness-105"
                          >
                            {userRegRecord?.submission?.pptUrl ? (
                              <>
                                <CheckCircle2 className="size-4 mr-1.5" />
                                View / Edit PPT Submission
                              </>
                            ) : (
                              <>
                                <Sparkles className="size-4 mr-1.5" />
                                Submit Idea / PPT Round 🚀
                              </>
                            )}
                          </Button>

                          {userRegRecord?.submission?.pptUrl && (
                            <div className="flex items-center justify-between text-[11px] px-1 text-muted-foreground">
                              <span className="text-emerald-400 font-bold truncate max-w-[190px]">
                                ✓ {userRegRecord.submission.projectTitle}
                              </span>
                              {!isInvalidPptLink(userRegRecord.submission.pptUrl) ? (
                                <a
                                  href={formatExternalUrl(userRegRecord.submission.pptUrl)}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neon hover:underline font-semibold inline-flex items-center gap-1"
                                >
                                  View Slides ↗
                                </a>
                              ) : (
                                <span className="text-amber-400 font-semibold text-[10px]">
                                  ⚠️ Invalid link (re-submit)
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-xs">
                        <div className="flex items-center gap-2 font-bold text-sm text-amber-300">
                          <Lock className="size-4 text-amber-400" />
                          <span>PPT Submission Locked (2+ Members Required)</span>
                        </div>
                        <p className="mt-1.5 text-amber-200/90 leading-relaxed">
                          PPT submission round via Vybe Driven unlocks once your squad has at least <strong>2 members</strong> (currently {1 + (userRegRecord?.teammates?.length || 0)}/4). Invite a teammate using your team code <strong>{userRegRecord?.teamCode || userRegRecord?.id}</strong>.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => setTeamModalOpen(true)}
                          className="mt-3 w-full rounded-xl bg-amber-500 text-black font-extrabold text-xs hover:bg-amber-400"
                        >
                          <Users className="size-3.5 mr-1.5" />
                          Invite Teammate to Unlock PPT Round
                        </Button>
                      </div>
                    )}

                    {/* Registration & Team Status Box */}
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-foreground font-semibold">
                          <CheckCircle2 className="size-4 text-emerald-400" />
                          <span>Registered as squad</span>
                        </div>
                        <span className="rounded-full bg-surface px-2 py-0.5 text-[10px] font-bold text-muted-foreground border border-border">
                          {userRegRecord?.teamName || "Squad"} ({1 + (userRegRecord?.teammates?.length || 0)}/4)
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <Button
                          size="sm"
                          onClick={() => setTeamModalOpen(true)}
                          className="h-10 sm:h-11 w-full rounded-xl bg-neon text-black font-extrabold text-xs px-2 shadow-glow-soft hover:brightness-105 flex items-center justify-center gap-1.5"
                        >
                          <Users className="size-3.5 shrink-0 text-black" />
                          <span className="truncate">Manage Team</span>
                        </Button>

                        {userRegRecord?.teamType === "team" && (1 + (userRegRecord.teammates?.length || 0)) < 2 ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRegisterClick}
                            className="h-10 sm:h-11 w-full rounded-xl border-amber-500/50 text-xs font-bold text-amber-400 hover:bg-amber-500/15 px-2 flex items-center justify-center gap-1.5"
                          >
                            <Lock className="size-3.5 text-amber-400 shrink-0" />
                            <span className="truncate">Pass Locked</span>
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={handleRegisterClick}
                            className="h-10 sm:h-11 w-full rounded-xl border-neon/50 text-xs font-bold text-neon hover:bg-neon hover:text-black px-2 flex items-center justify-center gap-1.5"
                          >
                            <Ticket className="size-3.5 shrink-0" />
                            <span className="truncate">Entry Pass</span>
                          </Button>
                        )}
                      </div>
                    </div>

                    {/* For Quasar 5.0, Problem Statements link for registered builders (strictly locked until 2+ members join) */}
                    {item.slug === "quasar-5-international-hackathon-2027" && (
                      (1 + (userRegRecord?.teammates?.length || 0)) >= 2 ? (
                        <div className="space-y-2">
                          <a
                            href="https://quasar-vppcoe.vercel.app/#tracks"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 rounded-xl border border-neon/50 bg-neon/15 px-3 py-2.5 text-xs font-bold text-neon hover:bg-neon hover:text-black transition shadow-glow-soft"
                          >
                            <span>▶ Quasar_Problem Statements &amp; Tracks ◀</span>
                            <ExternalLink className="size-3.5" />
                          </a>
                        </div>
                      ) : (
                        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-center text-xs text-amber-300 flex items-center justify-center gap-2">
                          <Lock className="size-3.5 text-amber-400 shrink-0" />
                          <span>🔒 Problem Statements (Unlocks when 2+ members join)</span>
                        </div>
                      )
                    )}

                    {/* Official WhatsApp Community - EXCLUSIVE TO REGISTERED SQUADS & TEAMS */}
                    {item.groupUrl && (
                      <a
                        href={item.groupUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs sm:text-sm font-semibold text-emerald-400 transition hover:border-emerald-500 hover:bg-emerald-500/20 hover:shadow-glow-soft"
                      >
                        <MessageCircle className="size-4 text-emerald-400" />
                        <span>{item.groupLabel ?? "Join Official WhatsApp Community"}</span>
                        <ExternalLink className="size-3.5 opacity-80" />
                      </a>
                    )}
                  </div>
                ) : item.status === "Past event" ? (
                  <div className="mt-5 rounded-2xl border border-white/10 bg-card p-4 text-center">
                    <p className="text-xs text-muted-foreground">This event concluded on {item.date}. Registrations have closed.</p>
                    <Link
                      to="/events"
                      className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-full border border-neon/50 bg-neon/10 px-4 py-2 text-xs font-semibold text-neon hover:bg-neon/20 transition"
                    >
                      Browse Upcoming Events →
                    </Link>
                  </div>
                ) : (
                  <div className="mt-5 space-y-2.5">
                    {/* Primary Registration Action & Join Team Option (3 options) */}
                    {item.registrationUrl ? (
                      <Button
                        type="button"
                        onClick={handleExternalRegisterClick}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-brand px-6 py-5 text-sm font-bold text-primary-foreground shadow-glow hover:brightness-105 transition"
                      >
                        {item.registrationLabel || "Register Now"}
                        <ArrowRight className="size-4" />
                      </Button>
                    ) : (
                      item.status !== "Sold out" && (
                        <>
                          <Button
                            type="button"
                            onClick={handleRegisterClick}
                            className="w-full rounded-2xl bg-gradient-brand text-primary-foreground font-bold py-5 text-sm shadow-glow hover:brightness-105 flex items-center justify-center gap-2"
                          >
                            <span>Register Now</span>
                          </Button>

                          <Button
                            type="button"
                            variant="outline"
                            onClick={handleJoinClick}
                            className="w-full rounded-2xl border-neon/50 bg-neon/10 text-neon font-bold py-5 text-sm shadow-sm hover:bg-neon hover:text-black transition flex items-center justify-center gap-2"
                          >
                            <Users className="size-4" />
                            <span>Join Team with Code</span>
                          </Button>
                        </>
                      )
                    )}

                    {/* Clean Sign In / Login Option ONLY for unauthenticated visitors */}
                    {!user && (
                      <div className="text-center pt-1">
                        <Link
                          to="/auth"
                          search={{ mode: "signin", next: `/opportunities/${item.slug}` }}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-neon transition cursor-pointer"
                        >
                          <LogIn className="size-3.5" />
                          <span>Already in a team? <span className="font-bold text-neon underline">Login</span></span>
                        </Link>
                      </div>
                    )}
                  </div>
                )}

                {/* External Platform Disclaimer / Listing Notice */}
                {externalPlatform && (
                  <div className="mt-4 rounded-xl border border-border/70 bg-surface-2/60 p-3 text-[11px] leading-relaxed text-muted-foreground">
                    <p>
                      <span className="font-semibold text-foreground">Listing Notice:</span> This event is officially hosted on <span className="font-semibold text-foreground">{externalPlatform}</span>. Vybe Driven has listed this opportunity for builder community discovery; registrations and event proceedings are handled on {externalPlatform}.
                    </p>
                  </div>
                )}

                {/* Organizer Contacts */}
                {item.contacts && (
                  <div id="contact" className="mt-5 border-t border-border pt-4 scroll-mt-28">
                    <p className="text-xs font-semibold text-muted-foreground">QUERIES &amp; ORGANIZERS</p>
                    <ul className="mt-2 space-y-1.5">
                      {item.contacts.map((contact) => (
                        <li key={contact.phone} className="text-xs sm:text-sm">
                          <a
                            href={contact.phone.includes("@") ? `mailto:${contact.phone}` : `tel:${contact.phone}`}
                            className="font-medium hover:text-neon"
                          >
                            {contact.name}
                          </a>
                          <span className="text-muted-foreground"> · {contact.phone}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <a
                  href="mailto:vybedriven@gmail.com"
                  className="mt-3.5 block text-center text-xs text-muted-foreground hover:text-neon transition"
                >
                  Have questions? Ask Vybe Driven
                </a>
              </div>
            </aside>
          </div>
        </section>

        {/* MOBILE ONLY: Fixed Docked Bottom Action Bar (Unstop Native Experience) */}
        <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden px-3.5 pb-3 pointer-events-none max-w-full">
          <div className="mx-auto max-w-md pointer-events-auto">
            {/* Centered Curved Dome Tab Resting on the Card (Matching Unstop Image 6 & 8) */}
            <div className="flex justify-center -mb-2 relative z-10">
              <div className="inline-flex items-center gap-1.5 rounded-t-2xl border-t border-x border-neon/40 bg-[#030804] px-4 py-1 text-[11px] font-bold text-neon shadow-[0_-4px_12px_rgba(0,0,0,0.6)]">
                <span className="size-1.5 rounded-full bg-neon animate-pulse" />
                <span>
                  {item.slug === "quasar-5-international-hackathon-2027"
                    ? "1 Month Left"
                    : item.slug === "goa-buildathon-2027"
                    ? "2,000+ Joined"
                    : "Registration Open"}
                </span>
              </div>
            </div>

            {/* Rounded Floating Action Card */}
            <div className="rounded-2xl border border-border/90 bg-[#040a05]/98 backdrop-blur-2xl p-3 shadow-[0_-8px_30px_rgba(0,0,0,0.9)]">
              {isRegistered ? (
                <div className="space-y-1.5">
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      size="sm"
                      onClick={() => setTeamModalOpen(true)}
                      className="rounded-xl bg-neon text-black font-extrabold text-xs h-10 px-2 shadow-glow-soft hover:brightness-105 flex items-center justify-center gap-1.5"
                    >
                      <Users className="size-3.5 shrink-0 text-black" />
                      <span className="truncate">Manage Team</span>
                    </Button>

                    {userRegRecord?.teamType === "team" && (1 + (userRegRecord.teammates?.length || 0)) >= 2 ? (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setIdeaModalOpen(true)}
                        className="rounded-xl border-neon/50 text-neon font-bold text-xs h-10 px-2 hover:bg-neon hover:text-black flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="size-3.5 shrink-0" />
                        <span className="truncate">{userRegRecord?.submission?.pptUrl ? "Edit PPT" : "Submit PPT 🚀"}</span>
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRegisterClick}
                        className="rounded-xl border-neon/50 text-neon font-bold text-xs h-10 px-2 hover:bg-neon hover:text-black flex items-center justify-center gap-1.5"
                      >
                        <Ticket className="size-3.5 shrink-0" />
                        <span className="truncate">View Pass</span>
                      </Button>
                    )}
                  </div>
                  {item.slug === "quasar-5-international-hackathon-2027" && (
                    (1 + (userRegRecord?.teammates?.length || 0)) >= 2 ? (
                      <a
                        href="https://quasar-vppcoe.vercel.app/#tracks"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-lg border border-neon/50 bg-neon/15 px-2.5 py-1.5 text-[11px] font-bold text-neon hover:bg-neon hover:text-black transition"
                      >
                        <span>▶ Quasar_Problem Statements ◀</span>
                        <ExternalLink className="size-3" />
                      </a>
                    ) : (
                      <div className="flex items-center justify-center gap-1.5 rounded-lg border border-amber-500/40 bg-amber-500/10 px-2.5 py-1.5 text-[11px] font-semibold text-amber-300">
                        <Lock className="size-3 text-amber-400 shrink-0" />
                        <span>🔒 Problem Statements Locked (Needs 2+ Members)</span>
                      </div>
                    )
                  )}
                  {item.groupUrl && (
                    <a
                      href={item.groupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1 text-[11px] font-semibold text-emerald-400 hover:underline pt-0.5"
                    >
                      <MessageCircle className="size-3" />
                      <span>{item.groupLabel || "Join WhatsApp Community"}</span>
                    </a>
                  )}
                </div>
              ) : item.status === "Past event" ? (
                <div className="text-center py-1">
                  <p className="text-xs text-muted-foreground">This event has concluded. Registrations closed.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    {item.registrationUrl ? (
                      <Button
                        type="button"
                        onClick={handleExternalRegisterClick}
                        className="col-span-2 w-full rounded-2xl bg-gradient-brand text-primary-foreground font-black h-11 text-sm shadow-glow hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-2"
                      >
                        <span>{item.registrationLabel || "Register"}</span>
                        <ArrowRight className="size-4" />
                      </Button>
                    ) : (
                      <>
                        <Button
                          type="button"
                          onClick={handleRegisterClick}
                          className="w-full rounded-2xl bg-gradient-brand text-primary-foreground font-black h-11 text-xs min-[360px]:text-sm shadow-glow hover:brightness-105 active:scale-[0.98] transition flex items-center justify-center gap-1.5"
                        >
                          <span>Register Now</span>
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={handleJoinClick}
                          className="w-full rounded-2xl border-neon/50 bg-neon/10 text-neon font-black h-11 text-xs min-[360px]:text-sm shadow-sm hover:bg-neon hover:text-black active:scale-[0.98] transition flex items-center justify-center gap-1.5"
                        >
                          <Users className="size-3.5" />
                          <span>Join Team</span>
                        </Button>
                      </>
                    )}
                  </div>

                  {!user && (
                    <div className="text-center pt-0.5">
                      <Link
                        to="/auth"
                        search={{ mode: "signin", next: `/opportunities/${item.slug}` }}
                        className="text-[11px] text-muted-foreground hover:text-neon transition cursor-pointer"
                      >
                        Already in a team? <span className="font-bold text-neon underline">Login</span>
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Registration Dialog */}
      <EventRegistrationModal
        opportunity={item}
        open={regModalOpen}
        onOpenChange={handleRegModalChange}
        onSuccess={() => {
          refreshUserRegistrationFromD1(item.slug, user?.id, user?.email || guestStoredEmail);
        }}
        initialJoinCode={activeJoinCode && activeJoinCode.toUpperCase() !== "JOIN" ? activeJoinCode : undefined}
        initialMode={modalMode}
      />

      {/* Team Management Modal */}
      <TeamManagementModal
        registration={userRegRecord}
        open={teamModalOpen}
        onOpenChange={setTeamModalOpen}
        onUpdated={() => {
          refetchRegistrations();
        }}
        onDeleted={() => {
          refetchRegistrations();
        }}
      />

      {/* Idea Submission (PPT Round) Modal */}
      <IdeaSubmissionModal
        registration={userRegRecord}
        open={ideaModalOpen}
        onOpenChange={setIdeaModalOpen}
      />

      {/* Mandatory Auth Gate for Unauthenticated Visitors */}
      <EventAuthGateDialog
        item={item}
        open={exploreGateOpen}
        onOpenChange={(isOpen) => {
          setExploreGateOpen(isOpen);
          if (!isOpen) {
            setPendingAction(null);
          }
        }}
        pendingAction={pendingAction}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
}

function OpportunityNotFound() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <h1 className="text-4xl font-bold">Event not found</h1>
        <p className="mt-3 text-muted-foreground">This event may have moved or is no longer available.</p>
        <Button asChild className="mt-6 rounded-full">
          <Link to="/discover">Browse all events</Link>
        </Button>
      </main>
      <Footer />
    </div>
  );
}
