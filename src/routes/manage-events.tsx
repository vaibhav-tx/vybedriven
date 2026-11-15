import { createFileRoute, Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useState, useMemo, useEffect } from "react";
import {
  Users,
  Calendar,
  Trophy,
  Download,
  ExternalLink,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Mail,
  Phone,
  MessageCircle,
  Eye,
  Trash2,
  Sparkles,
  ArrowRight,
  UserCheck,
  Building2,
  Ticket,
  X,
} from "lucide-react";
import { Navbar, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { TeamManagementModal } from "@/components/TeamManagementModal";
import { useAuth } from "@/lib/auth";
import {
  useHostedEvents,
  getStoredRegistrations,
  getRegistrationsBySlug,
  exportRegistrationsToCSV,
  updateRegistrationStatus,
  updateHostedOpportunity,
  deleteHostedOpportunity,
  getUserRegistrations,
  isEventOrganizer,
  mergeRemoteRegistrations,
  EVENT_CHANGE_SIGNAL,
  GOA_BUILDATHON_ORGANIZER_EMAILS,
  ADMIN_EMAILS,
  findOpportunity,
  type EventRegistration,
  type HostedEvent,
} from "@/data/events-store";
import { toast } from "sonner";

type ManageSearch = {
  tab?: "events" | "registrations" | "my-registrations";
  slug?: string;
};

export const Route = createFileRoute("/manage-events")({
  validateSearch: (search: Record<string, unknown>): ManageSearch => ({
    tab: search["tab"] === "registrations"
      ? "registrations"
      : search["tab"] === "my-registrations"
      ? "my-registrations"
      : "events",
    slug: typeof search["slug"] === "string" ? search["slug"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Organizer Dashboard & Registrations — Vybe Driven" },
      { name: "description", content: "Manage your hosted hackathons and attendee registrations." },
    ],
  }),
  component: ManageEventsPage,
});

function ManageEventsPage() {
  const { user, loading } = useAuth();
  const search = Route.useSearch();
  const location = useLocation();
  const navigate = useNavigate();

  // Enforce Login
  useEffect(() => {
    if (!loading && !user) {
      toast.info("Please sign in to access your organizer dashboard.");
      navigate({
        to: "/auth",
        search: { mode: "signin", next: location.href },
        replace: true,
      });
    }
  }, [user, loading, navigate, location.href]);

  const userEmail = user?.email?.toLowerCase().trim();
  const isGoaOrganizer = Boolean(
    userEmail &&
      (GOA_BUILDATHON_ORGANIZER_EMAILS.includes(userEmail) ||
        ADMIN_EMAILS.includes(userEmail) ||
        userEmail.includes("goabuilds"))
  );

  const [activeTab, setActiveTab] = useState<"events" | "registrations" | "my-registrations">(
    search.tab || (isGoaOrganizer ? "registrations" : "events")
  );
  const [selectedEventSlug, setSelectedEventSlug] = useState<string>(
    search.slug || (isGoaOrganizer ? "goa-buildathon-2027" : "")
  );

  useEffect(() => {
    if (isGoaOrganizer && !search.tab) {
      setActiveTab("registrations");
      if (!selectedEventSlug) setSelectedEventSlug("goa-buildathon-2027");
    }
  }, [isGoaOrganizer, search.tab, selectedEventSlug]);

  const [applicantQuery, setApplicantQuery] = useState("");
  const [applicantStatusFilter, setApplicantStatusFilter] = useState<string>("All");
  const [teamSizeFilter, setTeamSizeFilter] = useState<"all" | "1" | "2" | "3" | "4">("all");
  const [pptFilter, setPptFilter] = useState<"all" | "submitted" | "pending">("all");
  const [teamTypeFilter, setTeamTypeFilter] = useState<"all" | "team" | "solo">("all");
  const [syncTick, setSyncTick] = useState(0);
  const [inspectingApplicant, setInspectingApplicant] = useState<EventRegistration | null>(null);
  const [managingTeamReg, setManagingTeamReg] = useState<EventRegistration | null>(null);

  const getRegistrationTeamSize = (r: EventRegistration): number => {
    if (r.teamType === "solo") return 1;
    const tmCount = Array.isArray(r.teammates) ? r.teammates.length : 0;
    return tmCount + 1;
  };

  const getRegistrationPptStatus = (r: EventRegistration): "submitted" | "pending" => {
    if (r.submission?.pptUrl?.trim() || r.submission?.projectTitle?.trim()) {
      return "submitted";
    }
    return "pending";
  };

  // Sync Supabase registrations on mount and listen to store changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const onSync = () => setSyncTick((t) => t + 1);
    window.addEventListener(EVENT_CHANGE_SIGNAL, onSync);
    window.addEventListener("storage", onSync);

    let active = true;
    import("@/integrations/supabase/client")
      .then(({ supabase }) => {
        supabase
          .from("registrations" as any)
          .select("*")
          .then(({ data, error }) => {
            if (!active || error || !data || !Array.isArray(data)) return;
            mergeRemoteRegistrations(data);
            setSyncTick((t) => t + 1);
          })
          .catch(() => {});
      })
      .catch(() => {});

    return () => {
      active = false;
      window.removeEventListener(EVENT_CHANGE_SIGNAL, onSync);
      window.removeEventListener("storage", onSync);
    };
  }, []);

  // Strictly get only the events hosted by this authenticated user
  const myEvents = useHostedEvents(user?.id, user?.email);

  // Selected event for applicants view (must be owned by the current organizer)
  const currentEvent = useMemo(() => {
    if (selectedEventSlug) {
      const matched = myEvents.find((e) => e.slug === selectedEventSlug);
      if (matched) return matched;
      if (selectedEventSlug === "goa-buildathon-2027") {
        const goa = findOpportunity("goa-buildathon-2027");
        if (goa) {
          return {
            ...goa,
            organizerId: user?.id || "goa-organizer",
            organizerEmail: user?.email || "hello@goabuilds.com",
            isHosted: true,
            createdAt: "2026-11-08T00:00:00.000Z",
            registrationType: "direct" as const,
          };
        }
      }
    }
    if (myEvents.length) return myEvents[0];
    if (isGoaOrganizer) {
      const goa = findOpportunity("goa-buildathon-2027");
      if (goa) {
        return {
          ...goa,
          organizerId: user?.id || "goa-organizer",
          organizerEmail: user?.email || "hello@goabuilds.com",
          isHosted: true,
          createdAt: "2026-11-08T00:00:00.000Z",
          registrationType: "direct" as const,
        };
      }
    }
    return null;
  }, [myEvents, selectedEventSlug, isGoaOrganizer, user]);

  // Registrations strictly for this organizer's selected event
  const eventRegistrations = useMemo(() => {
    if (!currentEvent || !isEventOrganizer(currentEvent, user)) return [];
    return getRegistrationsBySlug(currentEvent.slug);
  }, [currentEvent, user, syncTick]);

  // Registrations user personally made as a builder
  const myRegistrations = useMemo(() => {
    return getUserRegistrations(user?.id, user?.email);
  }, [user, syncTick]);

  // Overall stats strictly for this organizer
  const totalRegistrations = useMemo(() => {
    return myEvents.reduce((acc, e) => acc + getRegistrationsBySlug(e.slug).length, 0);
  }, [myEvents, syncTick]);

  // Detailed slice stats for the active event (Team sizes, PPT counts, etc.)
  const eventSliceStats = useMemo(() => {
    let soloCount = 0;
    let size2Count = 0;
    let size3Count = 0;
    let size4Count = 0;
    let pptSubmittedCount = 0;
    let pptPendingCount = 0;

    for (const r of eventRegistrations) {
      const sz = getRegistrationTeamSize(r);
      if (sz === 1) soloCount++;
      else if (sz === 2) size2Count++;
      else if (sz === 3) size3Count++;
      else if (sz >= 4) size4Count++;

      const ppt = getRegistrationPptStatus(r);
      if (ppt === "submitted") pptSubmittedCount++;
      else pptPendingCount++;
    }

    return {
      total: eventRegistrations.length,
      soloCount,
      size2Count,
      size3Count,
      size4Count,
      pptSubmittedCount,
      pptPendingCount,
    };
  }, [eventRegistrations]);

  // Filtered applicants based on Search, Status, Team Size, and PPT submission
  const filteredApplicants = useMemo(() => {
    return eventRegistrations.filter((r) => {
      // 1. Status Filter
      const matchesStatus =
        applicantStatusFilter === "All" || r.status === applicantStatusFilter;

      // 2. Team Size Filter
      const sz = getRegistrationTeamSize(r);
      let matchesSize = true;
      if (teamSizeFilter === "1") matchesSize = sz === 1;
      else if (teamSizeFilter === "2") matchesSize = sz === 2;
      else if (teamSizeFilter === "3") matchesSize = sz === 3;
      else if (teamSizeFilter === "4") matchesSize = sz >= 4;

      // 3. PPT Filter
      const ppt = getRegistrationPptStatus(r);
      let matchesPpt = true;
      if (pptFilter === "submitted") matchesPpt = ppt === "submitted";
      else if (pptFilter === "pending") matchesPpt = ppt === "pending";

      // 4. Team Type Filter
      let matchesType = true;
      if (teamTypeFilter === "team") matchesType = r.teamType === "team";
      else if (teamTypeFilter === "solo") matchesType = r.teamType === "solo";

      // 5. Text Search Query
      const haystack = `${r.fullName || ""} ${r.email || ""} ${r.phone || ""} ${r.collegeOrCompany || ""} ${r.teamName || ""} ${r.submission?.projectTitle || ""} ${r.submission?.track || ""}`.toLowerCase();
      const matchesQuery = !applicantQuery || haystack.includes(applicantQuery.toLowerCase());

      return matchesStatus && matchesSize && matchesPpt && matchesType && matchesQuery;
    });
  }, [
    eventRegistrations,
    applicantStatusFilter,
    teamSizeFilter,
    pptFilter,
    teamTypeFilter,
    applicantQuery,
  ]);

  const isAnyFilterActive =
    teamSizeFilter !== "all" ||
    pptFilter !== "all" ||
    teamTypeFilter !== "all" ||
    applicantStatusFilter !== "All" ||
    Boolean(applicantQuery.trim());

  const resetAllFilters = () => {
    setTeamSizeFilter("all");
    setPptFilter("all");
    setTeamTypeFilter("all");
    setApplicantStatusFilter("All");
    setApplicantQuery("");
  };

  const handleStatusChange = (
    regId: string,
    newStatus: EventRegistration["status"]
  ) => {
    updateRegistrationStatus(regId, newStatus);
    toast.success(`Updated status to ${newStatus}`);
  };

  const handleToggleEventStatus = (event: HostedEvent) => {
    const nextStatus =
      event.status === "Registration open" ? "Event full" : "Registration open";
    updateHostedOpportunity(event.slug, { status: nextStatus }, user);
    toast.success(`Event status changed to "${nextStatus}"`);
  };

  const handleDeleteEvent = (slug: string, title: string) => {
    if (confirm(`Are you sure you want to remove "${title}"?`)) {
      deleteHostedOpportunity(slug, user);
      toast.success("Event deleted.");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-[1200px] px-4 sm:px-6 py-8 sm:py-12">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-border pb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neon">
              <Sparkles className="size-4" /> Vybe Driven Host Hub
            </div>
            <h1 className="mt-2 text-3xl sm:text-4xl font-black text-foreground">
              Organizer Dashboard
            </h1>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              Track hosted events, view registered participants, and export rosters in real time.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild className="rounded-full bg-gradient-brand text-primary-foreground font-bold shadow-glow hover:brightness-105">
              <Link to="/host">
                <PlusCircle className="mr-1.5 size-4" /> Host New Event
              </Link>
            </Button>
          </div>
        </div>

        {/* Metric Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Hosted Events
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">
              {myEvents.length}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">Active in discovery</p>
          </div>

          <div className="rounded-2xl border border-neon/40 bg-neon/10 p-4 sm:p-5 shadow-glow-soft">
            <p className="text-xs font-semibold text-neon uppercase tracking-wider">
              Total Applicants
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-neon">
              {totalRegistrations}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">Across all your listings</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Selected Event
            </p>
            <p className="mt-2 text-lg sm:text-xl font-bold text-foreground truncate">
              {currentEvent?.title || "No event selected"}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">
              {eventRegistrations.length} registrations
            </p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-4 sm:p-5">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              My Registrations
            </p>
            <p className="mt-2 text-2xl sm:text-3xl font-extrabold text-foreground">
              {myRegistrations.length}
            </p>
            <p className="mt-1 text-[11px] text-muted-foreground">Events you joined</p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8 flex flex-wrap gap-2 border-b border-border pb-3">
          <button
            type="button"
            onClick={() => setActiveTab("events")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              activeTab === "events"
                ? "bg-neon text-primary-foreground shadow-glow-soft"
                : "text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <Calendar className="size-4" />
            <span>My Hosted Events ({myEvents.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("registrations")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              activeTab === "registrations"
                ? "bg-neon text-primary-foreground shadow-glow-soft"
                : "text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <Users className="size-4" />
            <span>Applicant Explorer ({eventRegistrations.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("my-registrations")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs sm:text-sm font-semibold transition ${
              activeTab === "my-registrations"
                ? "bg-neon text-primary-foreground shadow-glow-soft"
                : "text-muted-foreground hover:bg-surface hover:text-foreground"
            }`}
          >
            <Ticket className="size-4" />
            <span>My Registrations ({myRegistrations.length})</span>
          </button>
        </div>

        {/* TAB 1: HOSTED EVENTS LIST */}
        {activeTab === "events" && (
          <div className="mt-6">
            {myEvents.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                <Calendar className="size-10 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-bold">You haven't hosted any events yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Host your first hackathon or tech meetup in under 2 minutes. Publish and start collecting registrations right away!
                </p>
                <Button asChild className="mt-5 rounded-full bg-gradient-brand text-primary-foreground font-bold">
                  <Link to="/host">Host an Event Now →</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {myEvents.map((event) => {
                  const regCount = getRegistrationsBySlug(event.slug).length;
                  return (
                    <article
                      key={event.slug}
                      className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:border-neon/40 hover:shadow-glow-soft"
                    >
                      <div className="relative aspect-[16/9] overflow-hidden bg-surface">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute left-3 top-3 flex gap-1.5">
                          <span className="rounded-full border border-border bg-black/80 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur">
                            {event.type}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                              event.status === "Registration open"
                                ? "bg-neon text-primary-foreground"
                                : "bg-destructive text-destructive-foreground"
                            }`}
                          >
                            {event.status}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-5">
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-semibold text-neon">{event.tag}</p>
                          <span className="inline-flex items-center gap-1 rounded-full bg-neon/15 px-2.5 py-0.5 text-xs font-bold text-neon font-mono">
                            <Users className="size-3" /> {regCount} Registered
                          </span>
                        </div>

                        <h3 className="mt-2 text-lg font-bold text-foreground line-clamp-1">
                          {event.title}
                        </h3>
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                          {event.description}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-2 text-xs text-muted-foreground border-t border-border pt-3">
                          <span>📅 {event.date}</span>
                          <span>📍 {event.location}</span>
                        </div>

                        {/* Event Action Buttons */}
                        <div className="mt-5 grid grid-cols-2 gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setSelectedEventSlug(event.slug);
                              setActiveTab("registrations");
                            }}
                            className="rounded-xl bg-neon text-primary-foreground font-bold hover:brightness-105 text-xs"
                          >
                            <Users className="mr-1.5 size-3.5" />
                            View ({regCount})
                          </Button>

                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => exportRegistrationsToCSV(event.slug, event.title, user)}
                            disabled={regCount === 0}
                            className="rounded-xl border-border text-xs"
                          >
                            <Download className="mr-1.5 size-3.5" />
                            Export CSV
                          </Button>
                        </div>

                        <div className="mt-2.5 flex items-center justify-between border-t border-border pt-2 text-xs">
                          <div className="flex items-center gap-3">
                            <Link
                              to="/opportunities/$slug"
                              params={{ slug: event.slug }}
                              className="inline-flex items-center gap-1 font-semibold text-neon hover:underline"
                            >
                              View Public Page <ExternalLink className="size-3" />
                            </Link>
                            <Link
                              to="/host"
                              search={{ edit: event.slug }}
                              className="inline-flex items-center gap-1 font-semibold text-foreground hover:text-neon transition"
                            >
                              ✏️ Edit Details
                            </Link>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleToggleEventStatus(event)}
                              className="text-[11px] text-muted-foreground hover:text-foreground"
                            >
                              {event.status === "Registration open" ? "Mark Full" : "Reopen"}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteEvent(event.slug, event.title)}
                              className="text-[11px] text-destructive hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: APPLICANT EXPLORER & CSV EXPORT */}
        {activeTab === "registrations" && (
          <div className="mt-6 space-y-6">
            {/* Event Selector & Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 rounded-2xl border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-1 items-center gap-3">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Select Event:
                </span>
                <select
                  value={currentEvent?.slug || ""}
                  onChange={(e) => setSelectedEventSlug(e.target.value)}
                  className="rounded-xl border border-border bg-surface px-3 py-2 text-xs sm:text-sm font-semibold text-foreground outline-none focus:border-neon max-w-md truncate"
                >
                  {myEvents.map((ev) => (
                    <option key={ev.slug} value={ev.slug}>
                      {ev.title} ({getRegistrationsBySlug(ev.slug).length} registered)
                    </option>
                  ))}
                </select>
              </div>

              {currentEvent && (
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => exportRegistrationsToCSV(currentEvent.slug, currentEvent.title, user, filteredApplicants)}
                    disabled={eventRegistrations.length === 0}
                    className="rounded-full bg-neon text-primary-foreground font-bold shadow-glow-soft hover:brightness-105 text-xs sm:text-sm"
                  >
                    <Download className="mr-2 size-4" /> Download Excel/CSV{" "}
                    {filteredApplicants.length < eventRegistrations.length
                      ? `(${filteredApplicants.length} filtered)`
                      : `(${eventRegistrations.length})`}
                  </Button>
                </div>
              )}
            </div>

            {/* Quick Interactive Stat Chips for Organizers */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Quick Analytics & Slices:
                </span>
                {isAnyFilterActive && (
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-neon hover:underline"
                  >
                    <X className="size-3" /> Clear All Filters
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {/* Total */}
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    !isAnyFilterActive
                      ? "border-neon bg-neon text-primary-foreground shadow-glow-soft"
                      : "border-border bg-card text-foreground hover:border-neon/50"
                  }`}
                >
                  <Users className="size-3.5" />
                  <span>All Registered</span>
                  <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[11px] font-mono">
                    {eventSliceStats.total}
                  </span>
                </button>

                {/* 4 Members */}
                <button
                  type="button"
                  onClick={() => setTeamSizeFilter((prev) => (prev === "4" ? "all" : "4"))}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    teamSizeFilter === "4"
                      ? "border-emerald-500 bg-emerald-500 text-black font-bold shadow-glow-soft"
                      : "border-border bg-card text-foreground hover:border-emerald-500/50"
                  }`}
                >
                  <span>🔥 4 Members (Squad)</span>
                  <span className="rounded-full bg-emerald-950/40 text-emerald-300 px-1.5 py-0.2 text-[11px] font-mono">
                    {eventSliceStats.size4Count}
                  </span>
                </button>

                {/* 3 Members */}
                <button
                  type="button"
                  onClick={() => setTeamSizeFilter((prev) => (prev === "3" ? "all" : "3"))}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    teamSizeFilter === "3"
                      ? "border-emerald-500 bg-emerald-500 text-black font-bold shadow-glow-soft"
                      : "border-border bg-card text-foreground hover:border-emerald-500/50"
                  }`}
                >
                  <span>👥 3 Members</span>
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.2 text-[11px] font-mono">
                    {eventSliceStats.size3Count}
                  </span>
                </button>

                {/* 2 Members */}
                <button
                  type="button"
                  onClick={() => setTeamSizeFilter((prev) => (prev === "2" ? "all" : "2"))}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    teamSizeFilter === "2"
                      ? "border-emerald-500 bg-emerald-500 text-black font-bold shadow-glow-soft"
                      : "border-border bg-card text-foreground hover:border-emerald-500/50"
                  }`}
                >
                  <span>✌️ 2 Members</span>
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.2 text-[11px] font-mono">
                    {eventSliceStats.size2Count}
                  </span>
                </button>

                {/* Solo */}
                <button
                  type="button"
                  onClick={() => setTeamSizeFilter((prev) => (prev === "1" ? "all" : "1"))}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    teamSizeFilter === "1"
                      ? "border-emerald-500 bg-emerald-500 text-black font-bold shadow-glow-soft"
                      : "border-border bg-card text-foreground hover:border-emerald-500/50"
                  }`}
                >
                  <span>👤 Solo / 1 Member</span>
                  <span className="rounded-full bg-surface-2 px-1.5 py-0.2 text-[11px] font-mono">
                    {eventSliceStats.soloCount}
                  </span>
                </button>

                {/* PPT Submitted */}
                <button
                  type="button"
                  onClick={() => setPptFilter((prev) => (prev === "submitted" ? "all" : "submitted"))}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    pptFilter === "submitted"
                      ? "border-neon bg-neon text-primary-foreground font-bold shadow-glow-soft"
                      : "border-border bg-card text-foreground hover:border-neon/50"
                  }`}
                >
                  <CheckCircle2 className="size-3.5 text-emerald-400" />
                  <span>PPT Submitted</span>
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 px-1.5 py-0.2 text-[11px] font-mono font-bold">
                    {eventSliceStats.pptSubmittedCount}
                  </span>
                </button>

                {/* PPT Pending */}
                <button
                  type="button"
                  onClick={() => setPptFilter((prev) => (prev === "pending" ? "all" : "pending"))}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                    pptFilter === "pending"
                      ? "border-amber-500 bg-amber-500 text-black font-bold shadow-glow-soft"
                      : "border-border bg-card text-foreground hover:border-amber-500/50"
                  }`}
                >
                  <Clock className="size-3.5 text-amber-400" />
                  <span>PPT Pending</span>
                  <span className="rounded-full bg-amber-500/15 text-amber-300 px-1.5 py-0.2 text-[11px] font-mono">
                    {eventSliceStats.pptPendingCount}
                  </span>
                </button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm lg:flex-row lg:items-center">
              <label className="flex min-h-11 flex-1 items-center gap-3 rounded-xl bg-surface px-4 focus-within:ring-2 focus-within:ring-ring">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={applicantQuery}
                  onChange={(e) => setApplicantQuery(e.target.value)}
                  placeholder="Search participants by name, email, phone, college, team, or project title..."
                  className="w-full bg-transparent text-xs sm:text-sm outline-none placeholder:text-muted-foreground"
                />
                {applicantQuery && (
                  <button
                    type="button"
                    onClick={() => setApplicantQuery("")}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </label>

              {/* Filters Group */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Team Size Dropdown */}
                <select
                  value={teamSizeFilter}
                  onChange={(e) => setTeamSizeFilter(e.target.value as any)}
                  className="h-11 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-foreground outline-none focus:border-neon"
                >
                  <option value="all">All Team Sizes</option>
                  <option value="4">4 Members (Full Squad)</option>
                  <option value="3">3 Members</option>
                  <option value="2">2 Members</option>
                  <option value="1">Solo (1 Member)</option>
                </select>

                {/* PPT Status Dropdown */}
                <select
                  value={pptFilter}
                  onChange={(e) => setPptFilter(e.target.value as any)}
                  className="h-11 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-foreground outline-none focus:border-neon"
                >
                  <option value="all">All PPT Status</option>
                  <option value="submitted">PPT Submitted (Round 1)</option>
                  <option value="pending">PPT Pending</option>
                </select>

                {/* Participation Type Dropdown */}
                <select
                  value={teamTypeFilter}
                  onChange={(e) => setTeamTypeFilter(e.target.value as any)}
                  className="h-11 rounded-xl border border-border bg-surface px-3 text-xs font-semibold text-foreground outline-none focus:border-neon"
                >
                  <option value="all">All Participation Types</option>
                  <option value="team">Teams Only</option>
                  <option value="solo">Solo Builders Only</option>
                </select>

                {isAnyFilterActive && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={resetAllFilters}
                    className="h-11 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10"
                  >
                    <X className="mr-1 size-3.5" /> Reset
                  </Button>
                )}
              </div>
            </div>

            {/* Active Filters Summary */}
            <div className="flex items-center justify-between text-xs text-muted-foreground px-1">
              <span>
                Showing <strong className="text-foreground">{filteredApplicants.length}</strong> of{" "}
                <strong className="text-foreground">{eventRegistrations.length}</strong> registered participants
                {isAnyFilterActive && " (Filtered)"}
              </span>
            </div>

            {/* Applicant Table */}
            {filteredApplicants.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                <Users className="size-8 text-muted-foreground" />
                <h4 className="mt-3 text-base font-semibold">No participants found</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  {eventRegistrations.length === 0
                    ? "Registrations for this event have not started or no one has applied yet."
                    : "No participants matched your current search filters."}
                </p>
              </div>
            ) : (
              <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs sm:text-sm">
                    <thead className="border-b border-border bg-surface text-muted-foreground text-[11px] font-bold uppercase tracking-wider">
                      <tr>
                        <th className="px-4 py-3">Participant</th>
                        <th className="px-4 py-3">Contact & Links</th>
                        <th className="px-4 py-3">College / Company</th>
                        <th className="px-4 py-3">Team Details</th>
                        <th className="px-4 py-3">Round 1 (PPT)</th>
                        <th className="px-4 py-3">Applied At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {filteredApplicants.map((applicant) => (
                        <tr key={applicant.id} className="transition hover:bg-surface/50">
                          {/* Name */}
                          <td className="px-4 py-3.5">
                            <div className="font-semibold text-foreground">
                              {applicant.fullName}
                            </div>
                            <span className="font-mono text-[10px] text-neon">
                              {applicant.id}
                            </span>
                            {applicant.projectIdea && (
                              <p className="mt-1 text-[11px] text-muted-foreground line-clamp-1 italic max-w-xs">
                                "{applicant.projectIdea}"
                              </p>
                            )}
                          </td>

                          {/* Contact */}
                          <td className="px-4 py-3.5">
                            <div className="flex items-center gap-1.5 text-xs text-foreground">
                              <Mail className="size-3 text-muted-foreground" />
                              <a href={`mailto:${applicant.email}`} className="hover:text-neon">
                                {applicant.email}
                              </a>
                            </div>
                            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                              <Phone className="size-3 text-muted-foreground" />
                              <a
                                href={`https://wa.me/${applicant.phone.replace(/[^\d]/g, "")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-neon text-[11px] flex items-center gap-1"
                              >
                                {applicant.phone}
                                <MessageCircle className="size-2.5 text-green-500" />
                              </a>
                            </div>
                            <div className="mt-1.5 flex gap-2 text-[11px]">
                              {applicant.githubUrl && (
                                <a
                                  href={applicant.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neon hover:underline"
                                >
                                  GitHub
                                </a>
                              )}
                              {applicant.linkedinUrl && (
                                <a
                                  href={applicant.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-neon hover:underline"
                                >
                                  LinkedIn
                                </a>
                              )}
                            </div>
                          </td>

                          {/* College */}
                          <td className="px-4 py-3.5 text-xs text-foreground">
                            <div className="flex items-center gap-1.5">
                              <Building2 className="size-3 text-muted-foreground shrink-0" />
                              <span className="font-medium">{applicant.collegeOrCompany}</span>
                              {applicant.gender && (
                                <span className="text-[10px] text-muted-foreground">({applicant.gender})</span>
                              )}
                            </div>
                            <div className="mt-1 flex flex-wrap items-center gap-1.5">
                              {applicant.userType && (
                                <span className="rounded bg-neon/10 px-1.5 py-0.5 text-[10px] font-semibold text-neon">
                                  {applicant.userType}
                                </span>
                              )}
                              {applicant.location && (
                                <span className="text-[11px] text-muted-foreground">
                                  📍 {applicant.location}
                                </span>
                              )}
                            </div>
                            {applicant.experienceLevel && !applicant.userType && (
                              <span className="mt-1 inline-block rounded bg-surface px-1.5 py-0.5 text-[10px] text-muted-foreground">
                                {applicant.experienceLevel}
                              </span>
                            )}
                          </td>

                          {/* Team Details */}
                          <td className="px-4 py-3.5 text-xs">
                            {applicant.teamType === "team" ? (
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-extrabold text-neon">
                                    {applicant.teamName || "Squad"}
                                  </span>
                                  <span className="rounded-full bg-surface-2 border border-border px-1.5 py-0.2 text-[10px] font-semibold text-muted-foreground">
                                    {applicant.teammates && applicant.teammates.length > 0
                                      ? `${applicant.teammates.length + 1} Members`
                                      : applicant.teamSize || "Team"}
                                  </span>
                                </div>

                                {/* Quick Member Status Chips */}
                                <div className="flex flex-wrap gap-1">
                                  <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400">
                                    <span className="size-1.5 rounded-full bg-emerald-400" />
                                    {applicant.fullName.split(" ")[0]} (Leader)
                                  </span>
                                  {applicant.teammates &&
                                    applicant.teammates.map((m, idx) => {
                                      const isVer = m.status === "verified";
                                      return (
                                        <span
                                          key={idx}
                                          className={`inline-flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] font-semibold border ${
                                            isVer
                                              ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                                              : "bg-amber-500/15 border-amber-500/30 text-amber-400"
                                          }`}
                                        >
                                          <span
                                            className={`size-1.5 rounded-full ${
                                              isVer ? "bg-emerald-400" : "bg-amber-400 animate-pulse"
                                            }`}
                                          />
                                          {m.name.split(" ")[0] || `Member ${idx + 2}`} {isVer ? "✓" : "⏳"}
                                        </span>
                                      );
                                    })}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => setInspectingApplicant(applicant)}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-neon hover:underline cursor-pointer pt-0.5"
                                >
                                  <Users className="size-3" /> View Team Roster Details →
                                </button>
                              </div>
                            ) : (
                              <div>
                                <span className="text-muted-foreground">Solo Entry</span>
                              </div>
                            )}
                          </td>

                          {/* Round 1 PPT Submission */}
                          <td className="px-4 py-3.5 text-xs">
                            {applicant.submission?.pptUrl ? (
                              <div className="space-y-1">
                                <span className="inline-flex items-center gap-1 rounded bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                                  <CheckCircle2 className="size-3" /> Submitted
                                </span>
                                <div className="font-semibold text-foreground truncate max-w-[180px]">
                                  {applicant.submission.projectTitle}
                                </div>
                                <div className="text-[10px] text-muted-foreground truncate max-w-[180px]">
                                  {applicant.submission.track}
                                </div>
                                <a
                                  href={applicant.submission.pptUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-neon hover:underline"
                                >
                                  Open Slides ↗
                                </a>
                              </div>
                            ) : (
                              <span className="rounded bg-surface-2 border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                Pending
                              </span>
                            )}
                          </td>

                          {/* Applied date */}
                          <td className="px-4 py-3.5 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(applicant.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: MY REGISTRATIONS (AS A PARTICIPANT) */}
        {activeTab === "my-registrations" && (
          <div className="mt-6 space-y-4">
            {myRegistrations.length === 0 ? (
              <div className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-8 text-center">
                <Ticket className="size-8 text-muted-foreground" />
                <h4 className="mt-3 text-base font-semibold">No registrations yet</h4>
                <p className="mt-1 text-xs text-muted-foreground">
                  Explore exciting hackathons and tech competitions and join them in one click.
                </p>
                <Button asChild className="mt-4 rounded-full bg-gradient-brand text-primary-foreground font-bold">
                  <Link to="/discover">Explore Events & Hackathons →</Link>
                </Button>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {myRegistrations.map((reg) => (
                  <div
                    key={reg.id}
                    className="flex flex-col justify-between rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-neon/40"
                  >
                    <div>
                      <div className="flex items-center justify-between border-b border-border pb-3">
                        <span className="font-mono text-xs font-bold text-neon">{reg.id}</span>
                        <span className="rounded-full bg-neon/15 px-2.5 py-0.5 text-xs font-bold text-neon">
                          {reg.status}
                        </span>
                      </div>
                      <h4 className="mt-3 font-bold text-base text-foreground">
                        {reg.opportunityTitle}
                      </h4>
                      <p className="mt-1 text-xs text-muted-foreground">
                        Registered as {reg.fullName} ({reg.teamType === "team" ? `Team ${reg.teamName}` : "Solo"})
                      </p>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-border">
                      <div className="flex items-center gap-2">
                        <Link
                          to="/opportunities/$slug"
                          params={{ slug: reg.opportunitySlug }}
                          className="text-xs font-semibold text-neon hover:underline"
                        >
                          View Event →
                        </Link>
                        {reg.teamType === "team" && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setManagingTeamReg(reg)}
                            className="rounded-full text-[11px] font-bold border-neon/50 text-neon hover:bg-neon hover:text-black py-0.5 px-2.5 h-7"
                          >
                            <Users className="size-3 mr-1" /> Manage Team Roster
                          </Button>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(reg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Organizer Team Roster Inspector Dialog */}
        <Dialog open={Boolean(inspectingApplicant)} onOpenChange={(open) => !open && setInspectingApplicant(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-border bg-[#070e0a] p-5 sm:p-7 text-foreground shadow-2xl">
            <DialogHeader className="border-b border-border/70 pb-4">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neon">
                <Users className="size-4" /> Organizer Roster Inspector
              </div>
              <DialogTitle className="mt-1 text-xl sm:text-2xl font-black text-foreground">
                Team: {inspectingApplicant?.teamName || "Squad"}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Event: {inspectingApplicant?.opportunityTitle} · Registration ID: {inspectingApplicant?.id}
              </DialogDescription>
            </DialogHeader>

            {inspectingApplicant && (
              <div className="mt-4 space-y-4">
                {/* Team Leader */}
                <div className="rounded-2xl border border-emerald-500/40 bg-emerald-950/20 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="text-sm sm:text-base font-extrabold text-foreground">
                          {inspectingApplicant.fullName}
                        </h4>
                        <span className="rounded-full bg-emerald-500/20 border border-emerald-500/40 px-2 py-0.5 text-[10px] font-extrabold text-emerald-300">
                          Team Leader
                        </span>
                      </div>
                      <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                        <p>📧 Email: <a href={`mailto:${inspectingApplicant.email}`} className="text-foreground hover:text-neon">{inspectingApplicant.email}</a></p>
                        <p>📱 Phone: <a href={`https://wa.me/${inspectingApplicant.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="text-foreground hover:text-neon">{inspectingApplicant.phone}</a></p>
                        <p>🏛️ College/Org: {inspectingApplicant.collegeOrCompany}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                      <CheckCircle2 className="size-3" /> Verified
                    </span>
                  </div>
                </div>

                {/* Teammates List */}
                {inspectingApplicant.teammates && inspectingApplicant.teammates.length > 0 ? (
                  <div className="space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                      Invited Teammates ({inspectingApplicant.teammates.length})
                    </p>
                    {inspectingApplicant.teammates.map((m, idx) => {
                      const isVer = m.status === "verified";
                      return (
                        <div
                          key={idx}
                          className={`rounded-2xl border p-4 ${
                            isVer
                              ? "border-emerald-500/40 bg-emerald-950/20"
                              : "border-amber-500/40 bg-amber-950/20"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-sm font-bold text-foreground">{m.name}</h4>
                                <span className="rounded-full bg-surface-2 border border-border px-2 py-0.5 text-[10px] text-muted-foreground">
                                  Member #{idx + 2}
                                </span>
                              </div>
                              <div className="mt-2 space-y-1 text-xs text-muted-foreground">
                                <p>📧 Email: <a href={`mailto:${m.email}`} className="text-foreground hover:text-neon">{m.email}</a></p>
                                {m.phone && (
                                  <p>📱 Phone: <a href={`https://wa.me/${m.phone.replace(/[^\d]/g, "")}`} target="_blank" rel="noreferrer" className="text-foreground hover:text-neon">{m.phone}</a></p>
                                )}
                                {m.collegeOrCompany && <p>🏛️ College: {m.collegeOrCompany}</p>}
                                {m.department && <p>🎓 Department: {m.department} ({m.graduationYear || "Year"})</p>}
                              </div>
                            </div>
                            <span
                              className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-bold ${
                                isVer
                                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                                  : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                              }`}
                            >
                              {isVer ? "🟢 Confirmed & Joined" : "⏳ Confirmation Pending"}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground italic">
                    No additional teammates invited yet.
                  </p>
                )}

                <div className="flex justify-end pt-3 border-t border-border">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setInspectingApplicant(null)}
                    className="rounded-full text-xs"
                  >
                    Close Roster
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Builder Team Management Modal */}
        <TeamManagementModal
          registration={managingTeamReg}
          open={Boolean(managingTeamReg)}
          onOpenChange={(open) => !open && setManagingTeamReg(null)}
          onUpdated={() => {
            // Signal store update
            setManagingTeamReg(null);
          }}
        />
      </main>

      <Footer />
    </div>
  );
}

