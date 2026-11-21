import { opportunities, type Opportunity, type OpportunityType, type OpportunityPerk } from "./opportunities";
import evCool from "@/assets/ev-cool.jpg";
import evCyber from "@/assets/ev-cyber.jpg";
import vecnaVersePoster from "@/assets/events/vecna-verse-2026.jpeg.asset.json";
import iplPoster from "@/assets/events/ipl-innovation-pitch-league-2026.jpeg.asset.json";
import aiAtWorkPoster from "@/assets/events/ai-at-work.png.asset.json";
import durableDevOpsPoster from "@/assets/events/durable-devops-tech-meetup.png.asset.json";
import elevatePoster from "@/assets/events/elevate-1-0-2026.png.asset.json";
import { useEffect, useState } from "react";
import { d1Db, d1Query } from "@/integrations/d1/client";

export const PRESET_EVENT_BANNERS = [
  { id: "quasar", title: "Quasar 5.0 (VPPCOE & VA)", image: "/events/quasar-5-banner.jpg" },
  { id: "goa", title: "Goa Buildathon '27", image: "/events/goa-buildathon-2027.jpg" },
  { id: "beyond-mumbai", title: "Beyond 9to5 Mumbai", image: "/events/beyond-9to5-mumbai.jpg" },
  { id: "beyond-bengaluru", title: "Beyond 9to5 Bengaluru", image: "/events/beyond-9to5-bengaluru.jpg" },
  { id: "code-relay", title: "Code Relay 5.0 (IIT BBS)", image: "/events/code-relay-5-iit-bhubaneswar.jpg" },
  { id: "lighthouse", title: "LightHouse Hackathon", image: "/events/lighthouse-hackathon-chandigarh.jpg" },
  { id: "hacksprint", title: "HackSprint 3.0", image: "/events/hacksprint-3-kahe-coimbatore.jpg" },
  { id: "skysparks", title: "Boeing Skysparks (Techkriti)", image: "/events/skysparks-techkriti-iit-kanpur.jpg" },
  { id: "shaastra-ctf", title: "Shaastra CTF (IIT Madras)", image: "/events/shaastra-ctf-iit-madras.jpg" },
  { id: "semiconductor", title: "Semiconductor Deep Dive", image: "/events/semiconductor-deep-dive-hackerfab.jpg" },
  { id: "mumbai-agents", title: "Mumbai AI & Agents Meet", image: "/events/mumbai-community-year-end-meet.jpg" },
  { id: "lovable", title: "Lovable Builders Bangalore", image: "/events/lovable-builders-bangalore.jpg" },
  { id: "art-club", title: "The Big Aaaaart Club Delhi", image: "/events/the-big-aaaart-club-delhi.jpg" },
  { id: "paranormal", title: "Paranormal Philosophy Meetup", image: "/events/paranormal-real-or-not-versova.jpg" },
  { id: "luminar", title: "Luminar Creators Award Gala", image: "/events/luminar-creators-award-2027.jpg" },
  { id: "apify", title: "Apify AI Tools Hackathon", image: "/events/apify-ai-tools-that-earn.jpg" },
  { id: "nwoc", title: "Nerds Winter of Code (Paytm)", image: "/events/nerds-winter-of-code.jpg" },
  { id: "product-mixer", title: "Bangalore Product Mixer", image: "/events/bangalore-product-mixer.jpg" },
  { id: "designmyx", title: "DesignMyx'26 (Myntra)", image: "/events/designmyx-myntra-bangalore.jpg" },
  { id: "unboxed", title: "UNBOXED STEM Education", image: "/events/unboxed-stem-education.jpg" },
  { id: "cyber", title: "Cyber & Security Matrix", image: evCyber },
  { id: "code", title: "Code & Hack Sprint", image: evCool },
];

export type HostedEvent = Opportunity & {
  organizerId: string;
  organizerEmail?: string;
  organizerPhone?: string;
  isHosted: true;
  createdAt: string;
  updatedAt?: string;
  registrationType: "direct" | "external" | "both";
};

export type TeammateDetail = {
  name: string;
  email: string;
  phone?: string;
  collegeOrCompany?: string;
  department?: string;
  graduationYear?: string;
  status?: "verified" | "pending" | "unsaved";
  role?: "leader" | "member";
  confirmedAt?: string;
};

export type EventRegistration = {
  id: string;
  opportunitySlug: string;
  opportunityTitle: string;
  userId?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  gender?: string;
  location?: string;
  collegeOrCompany: string;
  department?: string;
  graduationYear?: string;
  userType?: string;
  teamType: "solo" | "team";
  teamName?: string;
  teamCode?: string;
  teamSize?: string;
  teamMembers?: string;
  teammates?: TeammateDetail[];
  lookingForTeammates?: boolean;
  termsAccepted?: boolean;
  experienceLevel?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  projectIdea?: string;
  submission?: IdeaSubmission;
  status: "Registered" | "Shortlisted" | "Confirmed" | "Attended" | "Cancelled";
  createdAt: string;
  updatedAt?: string;
  teamSubmitted?: boolean;
};

export interface IdeaSubmission {
  projectTitle: string;
  track: string;
  summary: string;
  pptUrl: string;
  demoUrl?: string;
  submittedAt: string;
  submittedBy: string;
  updatedAt?: string;
}

const STORAGE_HOSTED_EVENTS = "hd_hosted_events";
const STORAGE_REGISTRATIONS = "hd_event_registrations";
export const EVENT_CHANGE_SIGNAL = "hd_events_store_updated";

function notifyStoreChange() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(EVENT_CHANGE_SIGNAL));
}

// Initial registrations (empty by default so no dummy/fake attendees ever appear)
const SEED_REGISTRATIONS: EventRegistration[] = [];

// Helper to safely get stored hosted events
export function getStoredHostedEvents(): HostedEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_HOSTED_EVENTS);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as HostedEvent[];
    // Filter out test events
    const cleaned = parsed.filter(
      (e) => !e.slug.includes("satyam") && !e.title?.toLowerCase().includes("satyam")
    );
    if (cleaned.length !== parsed.length) {
      localStorage.setItem(STORAGE_HOSTED_EVENTS, JSON.stringify(cleaned));
    }
    return cleaned;
  } catch (error) {
    console.error("Failed to parse hosted events:", error);
    return [];
  }
}

export const EXCLUDED_TEST_IDS = [
  "GB27-TEST-9019",
  "GB27-45653",
  "GB27-82035",
  "GB27-37406",
  "GB27-43750",
  "TEST-PROBE-1",
  "TEST-PROBE-DUP",
];

export const GOA_BUILDATHON_ORGANIZER_EMAILS = [
  "kartikkvats@gmail.com",
  "goabuildathon@gmail.com",
  "harshhdhankhar@gmail.com",
  "hello@goabuilds.com",
  "pandeysatyam2030@gmail.com",
  "vybedriven@gmail.com",
];

export const QUASAR_ORGANIZER_EMAILS = [
  "pandeysatyam2030@gmail.com",
  "vybedriven@gmail.com",
];

// Helper to safely get stored registrations
export function getStoredRegistrations(): EventRegistration[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_REGISTRATIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify([]));
      return [];
    }
    const list = JSON.parse(raw) as EventRegistration[];
    if (!Array.isArray(list)) return [];
    return list
      .filter(
        (r) =>
          r &&
          r.status !== "deleted" &&
          r.status !== "event_config" &&
          r.status !== "Archived" &&
          r.opportunitySlug !== "archived" &&
          !r.id?.startsWith("JOINQSR5-") &&
          !r.id?.startsWith("JOINGB27-") &&
          !r.id?.startsWith("EVENT_CONFIG::") &&
          !r.id?.startsWith("SYSTEM_") &&
          !EXCLUDED_TEST_IDS.includes(r.id) &&
          !r.email?.toLowerCase().includes("leader-gb27-43750") &&
          !r.email?.toLowerCase().includes("testbuilder@example.com") &&
          !r.email?.toLowerCase().includes("probe@example.com")
      )
      .map((r) => {
        let tm = r.teammates;
        if (typeof tm === "string") {
          try {
            tm = JSON.parse(tm);
          } catch {
            tm = [];
          }
        }
        if (!Array.isArray(tm)) tm = [];
        return {
          ...r,
          teammates: tm,
        };
      });
  } catch (error) {
    console.error("Failed to parse registrations:", error);
    return [];
  }
}

// Generate URL friendly slug
export function slugifyTitle(title: string): string {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return base || "event-" + Math.random().toString(36).substring(2, 8);
}

// Return all opportunities (Built-in + Hosted by users, deduplicated with hosted overrides prioritized)
export function getAllMergedOpportunities(): Opportunity[] {
  const hosted = getStoredHostedEvents();
  const hostedSlugs = new Set(hosted.map((h) => h.slug));
  const remainingBuiltIn = opportunities.filter((o) => !hostedSlugs.has(o.slug));
  return [...hosted, ...remainingBuiltIn];
}

// Get single opportunity by slug
export function findOpportunity(slug: string): Opportunity | undefined {
  const hosted = getStoredHostedEvents().find((e) => e.slug === slug);
  if (hosted) return hosted;
  return opportunities.find((e) => e.slug === slug);
}

// Create and publish a new hosted event
export function createHostedOpportunity(input: {
  title: string;
  type: OpportunityType;
  tag: string;
  description: string;
  overview: string;
  date: string;
  location: string;
  format: "Online" | "In person" | "Hybrid";
  prize?: string;
  perks?: OpportunityPerk[];
  image: string;
  imageFit?: "cover" | "contain";
  organizer: string;
  organizerId: string;
  organizerEmail?: string;
  organizerPhone?: string;
  registrationDeadline: string;
  eligibility: string;
  teamSize: string;
  fee: string;
  status?: Opportunity["status"];
  registrationType?: "direct" | "external" | "both";
  registrationUrl?: string;
  registrationLabel?: "Register now" | "Request to join" | "Join waitlist";
  registrationNote?: string;
  groupUrl?: string;
  groupLabel?: string;
  schedule?: { title: string; date: string; description: string }[];
  contacts?: { name: string; phone: string }[];
}): HostedEvent {
  const existingHosted = getStoredHostedEvents();
  let candidateSlug = slugifyTitle(input.title);
  
  // Ensure unique slug
  let counter = 1;
  while (findOpportunity(candidateSlug)) {
    candidateSlug = `${slugifyTitle(input.title)}-${counter}`;
    counter++;
  }

  const newEvent: HostedEvent = {
    ...input,
    slug: candidateSlug,
    status: input.status || "Registration open",
    registrationType: input.registrationType || "direct",
    isHosted: true,
    createdAt: new Date().toISOString(),
    schedule: input.schedule?.length
      ? input.schedule
      : [
          {
            title: "Registrations Open",
            date: "Open Now",
            description: "Apply and submit your team details on Vybe Driven.",
          },
          {
            title: "Registration Closes",
            date: input.registrationDeadline || "TBA",
            description: "Final team roster freeze and verification.",
          },
          {
            title: "Main Event / Hack Sprint",
            date: input.date,
            description: `Event kicks off ${input.format.toLowerCase()} at ${input.location}.`,
          },
        ],
  };

  const updatedList = [newEvent, ...existingHosted];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_HOSTED_EVENTS, JSON.stringify(updatedList));
    notifyStoreChange();
  }

  // Cloud sync to Cloudflare D1 so new event is immediately visible across all users & devices
  try {
    d1Db.upsertRegistration({
      id: `EVENT_CONFIG::${newEvent.slug}`,
      opportunitySlug: newEvent.slug,
      opportunityTitle: newEvent.title,
      email: newEvent.organizerEmail || "events@vybedriven.in",
      fullName: newEvent.organizer || "Organizer",
      phone: newEvent.organizerPhone || "0000000000",
      collegeOrCompany: "Vybe Driven Platform",
      teamMembers: JSON.stringify(newEvent),
      status: "event_config",
      updatedAt: new Date().toISOString(),
    }).catch(() => {});
  } catch {}

  return newEvent;
}

const envAdminEmails = (
  typeof import.meta !== "undefined" && import.meta.env?.["VITE_ADMIN_EMAILS"]
    ? String(import.meta.env["VITE_ADMIN_EMAILS"])
    : ""
)
  .split(",")
  .map((e: string) => e.trim().toLowerCase())
  .filter(Boolean);

export const ADMIN_EMAILS = [
  "vybedriven@gmail.com",
  "admin@vybedriven.in",
  "pandeysatyam2030@gmail.com",
  ...envAdminEmails,
];

export function isPlatformAdmin(user?: { id?: string; email?: string | null } | null): boolean {
  if (!user?.email) return false;
  return ADMIN_EMAILS.includes(user.email.toLowerCase().trim());
}

// Check strictly if the logged-in user is the creator/organizer of an event
export function isEventOrganizer(
  event?: Opportunity | null,
  user?: { id?: string; email?: string | null } | null
): boolean {
  if (!event || !user) return false;
  const hosted = event as Partial<HostedEvent>;
  const uId = user.id?.trim();
  const uEmail = user.email?.trim().toLowerCase();

  // Specific check for Goa Buildathon 2027 (Authorized organizer emails)
  if (event.slug === "goa-buildathon-2027") {
    if (
      uEmail &&
      (ADMIN_EMAILS.includes(uEmail) ||
        uEmail.includes("goabuilds") ||
        GOA_BUILDATHON_ORGANIZER_EMAILS.includes(uEmail))
    ) {
      return true;
    }
    return false;
  }

  // Specific check for Quasar 5.0 (Authorized organizer emails)
  if (event.slug === "quasar-5-international-hackathon-2027") {
    if (
      uEmail &&
      (ADMIN_EMAILS.includes(uEmail) ||
        QUASAR_ORGANIZER_EMAILS.includes(uEmail))
    ) {
      return true;
    }
    return false;
  }

  // Built-in directory opportunities (HackSprint, Code Relay, Lu.ma/Unstop listings, etc.)
  // are NOT user-hosted events and should never show organizer controls.
  if (!hosted.isHosted) {
    return false;
  }

  const orgId = hosted.organizerId?.trim();
  const orgEmail = hosted.organizerEmail?.trim().toLowerCase();

  if (uId && orgId && uId === orgId) return true;
  if (uEmail && orgEmail && uEmail === orgEmail) return true;
  if (uEmail && ADMIN_EMAILS.includes(uEmail)) return true;

  return false;
}

// Update existing hosted or built-in event with live cloud synchronization
export function updateHostedOpportunity(
  slug: string,
  updates: Partial<HostedEvent>,
  user?: { id?: string; email?: string | null } | null
): HostedEvent | null {
  const list = getStoredHostedEvents();
  const index = list.findIndex((e) => e.slug === slug);
  const existing = findOpportunity(slug);
  if (!existing && index === -1) return null;

  // Authorization check: Only the actual host or platform admin can edit
  const targetEvent = index !== -1 ? list[index] : existing;
  if (user && !isEventOrganizer(targetEvent, user)) {
    throw new Error("Unauthorized: Only the event creator can edit this event.");
  }

  const base = index !== -1 ? list[index] : (existing as HostedEvent);
  const updated: HostedEvent = {
    ...base,
    ...updates,
    slug,
    isHosted: true,
    updatedAt: new Date().toISOString(),
  };

  if (index !== -1) {
    list[index] = updated;
  } else {
    list.unshift(updated);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_HOSTED_EVENTS, JSON.stringify(list));
    notifyStoreChange();
  }

  // Cloud sync to Cloudflare D1 registrations table so all users see the updated event
  try {
    d1Db.upsertRegistration({
      id: `EVENT_CONFIG::${updated.slug}`,
      opportunitySlug: updated.slug,
      opportunityTitle: updated.title,
      email: updated.organizerEmail || "events@vybedriven.in",
      fullName: updated.organizer || "Organizer",
      phone: updated.organizerPhone || "0000000000",
      collegeOrCompany: "Vybe Driven Platform",
      teamMembers: JSON.stringify(updated),
      status: "event_config",
      updatedAt: new Date().toISOString(),
    }).catch(() => {});
  } catch {}

  return updated;
}

// Delete hosted event
export function deleteHostedOpportunity(
  slug: string,
  user?: { id?: string; email?: string | null } | null
): boolean {
  const list = getStoredHostedEvents();
  const target = list.find((e) => e.slug === slug) || (findOpportunity(slug) as HostedEvent | undefined);
  if (!target) return false;

  if (user && !isEventOrganizer(target, user)) {
    throw new Error("Unauthorized: Only the event creator can delete this event.");
  }

  const filtered = list.filter((e) => e.slug !== slug);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_HOSTED_EVENTS, JSON.stringify(filtered));
    notifyStoreChange();
  }

  // Cloud sync deletion to Cloudflare D1
  try {
    d1Db.deleteRegistration(`EVENT_CONFIG::${slug}`).catch(() => {});
  } catch {}

  return true;
}

// Register for an opportunity with multi-step support and Supabase sync
export function submitRegistration(data: {
  opportunitySlug: string;
  opportunityTitle: string;
  userId?: string;
  fullName: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone: string;
  gender?: string;
  location?: string;
  collegeOrCompany: string;
  department?: string;
  userType?: string;
  teamType: "solo" | "team";
  teamName?: string;
  teamCode?: string;
  teamSize?: string;
  teamMembers?: string;
  teammates?: TeammateDetail[];
  lookingForTeammates?: boolean;
  termsAccepted?: boolean;
  experienceLevel?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  projectIdea?: string;
}): EventRegistration {
  const allRegistrations = getStoredRegistrations();

  // Check if already registered with this email
  const existing = allRegistrations.find(
    (r) =>
      r.opportunitySlug === data.opportunitySlug &&
      (r.email.trim().toLowerCase() === data.email.trim().toLowerCase() ||
        (data.userId && r.userId === data.userId))
  );

  if (existing) {
    return existing;
  }

  // Generate branded confirmation ID
  const isGoa = data.opportunitySlug === "goa-buildathon-2027";
  const isQuasar = data.opportunitySlug === "quasar-5-international-hackathon-2027";
  const idPrefix = isGoa ? "GB27" : isQuasar ? "QSR5" : "REG-2026";
  const idNumber = Math.floor(10000 + Math.random() * 90000);
  const newId = `${idPrefix}-${idNumber}`;

  const newReg: EventRegistration = {
    ...data,
    id: newId,
    teamCode: data.teamCode || newId,
    status: "Registered",
    createdAt: new Date().toISOString(),
  };

  const updated = [newReg, ...allRegistrations];
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(updated));
    notifyStoreChange();

    // Background sync to Cloudflare D1 database
    d1Db.upsertRegistration(newReg).catch((err) => {
      console.warn("[Database Sync] Cloudflare D1 notice:", err);
    });
  }

  return newReg;
}

// Merge remote Supabase registrations into local store
export function mergeRemoteRegistrations(remoteRows: any[]): void {
  if (typeof window === "undefined" || !Array.isArray(remoteRows) || !remoteRows.length) return;
  const localList = getStoredRegistrations();
  const map = new Map<string, EventRegistration>();

  // Add existing local registrations to map
  for (const r of localList) {
    map.set(r.id, r);
  }

  // Overlay remote records from Supabase
  let hasEventConfigUpdates = false;

  for (const row of remoteRows) {
    // 1. Process Event Config cloud synchronization (live hackathon updates)
    if (row.id?.startsWith("EVENT_CONFIG::") || row.status === "event_config") {
      const eventSlug = row.opportunity_slug || row.id.replace("EVENT_CONFIG::", "");
      if (row.status === "deleted") {
        const list = getStoredHostedEvents().filter((e) => e.slug !== eventSlug);
        localStorage.setItem(STORAGE_HOSTED_EVENTS, JSON.stringify(list));
        hasEventConfigUpdates = true;
      } else if (row.team_members && typeof row.team_members === "string") {
        try {
          const parsedEvent = JSON.parse(row.team_members);
          if (parsedEvent && parsedEvent.slug) {
            const list = getStoredHostedEvents();
            const idx = list.findIndex((e) => e.slug === parsedEvent.slug);
            if (idx !== -1) {
              list[idx] = { ...list[idx], ...parsedEvent };
            } else {
              list.unshift(parsedEvent);
            }
            localStorage.setItem(STORAGE_HOSTED_EVENTS, JSON.stringify(list));
            hasEventConfigUpdates = true;
          }
        } catch {}
      }
      map.delete(row.id);
      continue;
    }

    // 2. Exclude deleted, system, probe, and dummy records
    if (
      row.status === "deleted" ||
      row.status === "event_config" ||
      row.status === "Archived" ||
      row.opportunity_slug === "archived" ||
      row.id?.startsWith("JOINQSR5-") ||
      row.id?.startsWith("JOINGB27-") ||
      row.id?.startsWith("SYSTEM_") ||
      EXCLUDED_TEST_IDS.includes(row.id) ||
      row.email?.toLowerCase().includes("leader-gb27-43750") ||
      row.email?.toLowerCase().includes("testbuilder@example.com") ||
      row.email?.toLowerCase().includes("probe@example.com")
    ) {
      map.delete(row.id);
      continue;
    }

    const existing = map.get(row.id);
    let parsedSubmission: IdeaSubmission | undefined = existing?.submission;
    let cleanTeamMembers = row.team_members;

    if (row.team_members && typeof row.team_members === "string") {
      if (row.team_members.startsWith("SUBMISSION::")) {
        try {
          parsedSubmission = JSON.parse(row.team_members.slice(12));
        } catch {}
      } else if (row.team_members.startsWith("{")) {
        try {
          const parsedObj = JSON.parse(row.team_members);
          if (parsedObj.submission) parsedSubmission = parsedObj.submission;
          if (parsedObj.summary || parsedObj.members) cleanTeamMembers = parsedObj.summary || parsedObj.members;
        } catch {}
      }
    }

    let parsedTeammates: TeammateDetail[] = [];
    if (Array.isArray(row.teammates)) {
      parsedTeammates = row.teammates;
    } else if (typeof row.teammates === "string" && row.teammates.trim()) {
      try {
        const parsed = JSON.parse(row.teammates);
        if (Array.isArray(parsed)) parsedTeammates = parsed;
      } catch {}
    } else if (Array.isArray(existing?.teammates)) {
      parsedTeammates = existing.teammates;
    }

    const parsed: EventRegistration = {
      id: row.id,
      opportunitySlug: row.opportunity_slug,
      opportunityTitle: row.opportunity_title,
      userId: row.user_id,
      fullName: row.full_name || `${row.first_name || ""} ${row.last_name || ""}`.trim(),
      firstName: row.first_name,
      lastName: row.last_name,
      email: row.email,
      phone: row.phone,
      gender: row.gender,
      location: row.location,
      collegeOrCompany: row.college_or_company,
      department: row.department || existing?.department,
      userType: row.user_type,
      teamType: row.team_type || "solo",
      teamName: row.team_name,
      teamSize: row.team_size,
      teamMembers: cleanTeamMembers,
      teamCode: row.team_code || row.id,
      teammates: parsedTeammates,
      lookingForTeammates: row.looking_for_teammates,
      termsAccepted: row.terms_accepted,
      status: row.status || "Registered",
      submission: parsedSubmission,
      projectIdea: parsedSubmission?.projectTitle || existing?.projectIdea,
      createdAt: row.created_at,
    };
    map.set(parsed.id, parsed);
  }

  const merged = Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const prevJson = typeof window !== "undefined" ? localStorage.getItem(STORAGE_REGISTRATIONS) : null;
  const nextJson = JSON.stringify(merged);

  if (prevJson !== nextJson || hasEventConfigUpdates) {
    if (typeof window !== "undefined") {
      if (prevJson !== nextJson) {
        localStorage.setItem(STORAGE_REGISTRATIONS, nextJson);
      }
      notifyStoreChange();
    }
  }
}

// Get all registrations for an opportunity (organizer view)
export function getRegistrationsBySlug(slug: string): EventRegistration[] {
  return getStoredRegistrations().filter((r) => r.opportunitySlug === slug);
}

// Get count of registrations for an opportunity
export function getRegistrationCount(slug: string): number {
  return getRegistrationsBySlug(slug).length;
}

// Get all registrations made by a user (builder profile view, including leader & invited teammates)
export function getUserRegistrations(
  userId?: string,
  userEmail?: string | null
): EventRegistration[] {
  if (!userId && !userEmail) return [];
  const uId = userId?.trim();
  const uEmail = userEmail?.trim().toLowerCase();

  return getStoredRegistrations().filter((r) => {
    // 1. Primary leader / registrant
    if (uId && r.userId && r.userId === uId) return true;
    if (uEmail && r.email && r.email.trim().toLowerCase() === uEmail) return true;
    // 2. Teammate member
    if (
      uEmail &&
      r.teammates &&
      Array.isArray(r.teammates) &&
      r.teammates.some((t) => t.email && t.email.trim().toLowerCase() === uEmail)
    ) {
      return true;
    }
    return false;
  });
}

// Update team roster (team leader only, while hackathon registration is open)
export function updateTeamRoster(
  registrationId: string,
  updates: {
    teamName?: string;
    teammates: TeammateDetail[];
    lookingForTeammates?: boolean;
  },
  user?: { id?: string; email?: string | null } | null,
  currentFallback?: EventRegistration | null
): EventRegistration {
  const list = getStoredRegistrations();
  let index = list.findIndex((r) => r.id === registrationId || (r.teamCode && r.teamCode === registrationId));
  
  let current: EventRegistration;
  if (index !== -1) {
    current = list[index];
  } else if (currentFallback) {
    current = currentFallback;
    list.push(current);
    index = list.length - 1;
  } else {
    throw new Error("Registration record not found.");
  }

  // Authorization check
  const uId = user?.id?.trim();
  const uEmail = user?.email?.trim().toLowerCase();
  const isAuthorized =
    !user ||
    (uId && current.userId && current.userId === uId) ||
    (uEmail && current.email && current.email.toLowerCase() === uEmail) ||
    isPlatformAdmin(user) ||
    (uEmail &&
      current.teammates &&
      current.teammates.some((t) => t.email && t.email.toLowerCase() === uEmail));

  if (!isAuthorized) {
    throw new Error("Unauthorized: Only team members or administrators can modify the team roster.");
  }

  // Check if event is still open
  const opp = findOpportunity(current.opportunitySlug);
  if (opp && (opp.status === "Event full" || opp.status === "Sold out")) {
    throw new Error("Hackathon registration is closed. Team roster has been locked and automatically submitted.");
  }

  const teamSummary = updates.teammates
    .map((t) => `${(t.name || "Member").trim()} (${(t.email || "").trim()})`)
    .join(", ");

  const updated: EventRegistration = {
    ...current,
    teamName: updates.teamName?.trim() || current.teamName,
    teammates: updates.teammates,
    teamMembers: teamSummary || undefined,
    teamSize: `${1 + updates.teammates.length} members`,
    lookingForTeammates: updates.lookingForTeammates ?? current.lookingForTeammates,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updated;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));
    notifyStoreChange();

    // Background sync to Cloudflare D1
    d1Query(
      `UPDATE registrations SET team_name = ?, team_size = ?, team_members = ?, teammates = ?, looking_for_teammates = ?, updated_at = ? WHERE id = ? OR team_code = ?`,
      [
        updated.teamName || null,
        updated.teamSize,
        updated.teamMembers || null,
        JSON.stringify(updated.teammates || []),
        updated.lookingForTeammates ? 1 : 0,
        new Date().toISOString(),
        updated.id,
        updated.teamCode || updated.id,
      ]
    ).catch((err) => {
      console.warn("[Database Sync] Team roster update notice:", err);
    });
  }

  return updated;
}

// Delete entire team registration (Team Leader or Platform Admin only)
export async function deleteTeamRegistration(
  registrationId: string,
  user?: { id?: string; email?: string | null } | null
): Promise<boolean> {
  const list = getStoredRegistrations();
  const index = list.findIndex((r) => r.id === registrationId);
  if (index === -1) {
    throw new Error("Team registration record not found.");
  }
  const current = list[index];

  const uId = user?.id?.trim();
  const uEmail = user?.email?.trim().toLowerCase();
  const isLeader =
    (uId && current.userId && current.userId === uId) ||
    (uEmail && current.email.toLowerCase() === uEmail) ||
    isPlatformAdmin(user);

  if (!isLeader) {
    throw new Error("Unauthorized: Only the Team Leader can delete this squad.");
  }

  // Remove from localStorage
  const filtered = list.filter((r) => r.id !== registrationId);
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(filtered));
    notifyStoreChange();
  }

  // Cloud sync to Cloudflare D1: mark as deleted/archived so team is removed
  try {
    await d1Db.deleteRegistration(registrationId);
  } catch (err) {
    console.warn("[Cloud Delete Team] Error syncing deletion to D1:", err);
  }

  return true;
}

// Leave a team (Team Member only)
export async function leaveTeamRegistration(
  registrationId: string,
  user: { id?: string; email?: string | null }
): Promise<EventRegistration> {
  if (!user?.email && !user?.id) {
    throw new Error("Please sign in to leave the squad.");
  }

  const list = getStoredRegistrations();
  const index = list.findIndex((r) => r.id === registrationId);
  if (index === -1) {
    throw new Error("Team registration record not found.");
  }
  const current = list[index];

  const uEmail = user.email?.trim().toLowerCase();
  const uId = user.id?.trim();

  // If user is the leader, they must delete the team instead of leaving
  if ((uId && current.userId === uId) || (uEmail && current.email.toLowerCase() === uEmail)) {
    throw new Error("Team Leaders cannot leave the squad. You can delete the team if you wish to start over.");
  }

  const existingTeammates = Array.isArray(current.teammates) ? current.teammates : [];
  const updatedTeammates = existingTeammates.filter(
    (t) =>
      typeof t === "object" &&
      t &&
      !(
        (uEmail && typeof t.email === "string" && t.email.trim().toLowerCase() === uEmail) ||
        (uId && (t as any).userId === uId)
      )
  );

  if (updatedTeammates.length === existingTeammates.length) {
    throw new Error("You are not listed as an active member of this squad.");
  }

  const teamSummary = updatedTeammates
    .map((t) => `${(t.name || "Member").trim()} (${(t.email || "").trim()})`)
    .join(", ");

  const updated: EventRegistration = {
    ...current,
    teammates: updatedTeammates,
    teamMembers: teamSummary || undefined,
    teamSize: `${1 + updatedTeammates.length} members`,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updated;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));
    notifyStoreChange();
  }

  // Cloud sync to Cloudflare D1
  try {
    await d1Db.updateRegistrationTeam(
      updated.id,
      updated.teamSize,
      updated.teamMembers || null,
      updated.teammates || []
    );
  } catch (err) {
    console.warn("[Cloud Leave Team] Error updating team on D1:", err);
  }

  return updated;
}

// Confirm teammate invitation (called when teammate accepts from mail or banner)
export function confirmTeammateInvitation(
  registrationId: string,
  teammateEmail: string
): boolean {
  const list = getStoredRegistrations();
  const index = list.findIndex((r) => r.id === registrationId);
  if (index === -1) return false;

  const current = list[index];
  if (!current.teammates || !current.teammates.length) return false;

  const targetEmail = teammateEmail.trim().toLowerCase();
  let found = false;

  const updatedTeammates = current.teammates.map((t) => {
    if (typeof t === "object" && t && typeof t.email === "string" && t.email.trim().toLowerCase() === targetEmail) {
      found = true;
      return {
        ...t,
        status: "verified" as const,
        confirmedAt: new Date().toISOString(),
      };
    }
    return t;
  });

  if (!found) return false;

  const updated: EventRegistration = {
    ...current,
    teammates: updatedTeammates,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updated;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));
    notifyStoreChange();

    d1Query("UPDATE registrations SET teammates = ?, updated_at = ? WHERE id = ?", [
      JSON.stringify(updatedTeammates),
      new Date().toISOString(),
      updated.id,
    ]).catch((err) => {
      console.warn("[Database Sync] Teammate confirmation notice on D1:", err);
    });
  }

  return true;
}

// Normalize possible team code variations (e.g. QSR5-46634, GB27-43750, 46634)
export function normalizeTeamCodeCandidates(raw: string): string[] {
  if (!raw || typeof raw !== "string") return [];
  const trimmed = raw.trim();
  // Strip accidental "JOIN" prefix if user entered or copied e.g. "JOINQSR5-46634" or "JOIN-QSR5-46634"
  const clean = trimmed.replace(/^JOIN[\s\-_:]*/i, "").trim();
  if (!clean || clean.toUpperCase() === "JOIN") return [];

  const stripped = clean.replace(/\s+/g, "").toUpperCase();
  const candidates = new Set<string>();

  candidates.add(clean);
  candidates.add(stripped);
  candidates.add(clean.toLowerCase());
  candidates.add(stripped.toLowerCase());

  // 4 to 6 digit standalone number e.g. "46634" or "43750"
  if (/^\d{4,6}$/.test(stripped)) {
    candidates.add(`QSR5-${stripped}`);
    candidates.add(`GB27-${stripped}`);
    candidates.add(`qsr5-${stripped.toLowerCase()}`);
    candidates.add(`gb27-${stripped.toLowerCase()}`);
  }
  // "QSR5" missing hyphen e.g. "QSR546634"
  if (/^QSR5\d{4,6}$/i.test(stripped)) {
    const num = stripped.slice(4);
    candidates.add(`QSR5-${num}`);
    candidates.add(`qsr5-${num.toLowerCase()}`);
  }
  // "GB27" missing hyphen e.g. "GB2743750"
  if (/^GB27\d{4,6}$/i.test(stripped)) {
    const num = stripped.slice(4);
    candidates.add(`GB27-${num}`);
    candidates.add(`gb27-${num.toLowerCase()}`);
  }
  // "GB-" missing "27" e.g. "GB-43750"
  if (/^GB-\d{4,6}$/i.test(stripped)) {
    const num = stripped.slice(3);
    candidates.add(`GB27-${num}`);
    candidates.add(`gb27-${num.toLowerCase()}`);
  }

  return Array.from(candidates);
}

// Find team by team code or registration id (checks local cache first, then Supabase cloud)
export async function findTeamByCode(code: string): Promise<EventRegistration | null> {
  if (!code || typeof code !== "string") return null;
  const candidates = normalizeTeamCodeCandidates(code);
  if (candidates.length === 0) return null;

  const list = getStoredRegistrations();

  // 1. Check local storage - EXACT match only
  const localMatch = list.find((r) => {
    if (!r || r.teamType !== "team" || r.status === "Archived") return false;
    const rId = (r.id || "").trim().toUpperCase();
    const rCode = (r.teamCode || "").trim().toUpperCase();
    const rTeam = (r.teamName || "").trim().toUpperCase();
    return candidates.some((c) => {
      const cUpper = c.toUpperCase();
      return rId === cUpper || rCode === cUpper || (cUpper.length >= 4 && rTeam === cUpper);
    });
  });
  if (localMatch) return localMatch;

  // 2. Cloud check on Cloudflare D1 - EXACT match on id or team_name
  try {
    const upperCandidates = candidates.map((c) => c.toUpperCase());
    const lowerCandidates = candidates.map((c) => c.toLowerCase());
    const allMatches = Array.from(new Set([...upperCandidates, ...lowerCandidates, ...candidates]));
    const placeholders = allMatches.map(() => "?").join(",");

    const rows = await d1Query(
      `SELECT * FROM registrations WHERE (id IN (${placeholders}) OR team_name IN (${placeholders})) AND status != 'Archived' AND status != 'deleted' LIMIT 1`,
      [...allMatches, ...allMatches]
    );

    if (rows && rows.length > 0) {
      mergeRemoteRegistrations(rows);
      const freshList = getStoredRegistrations();
      return freshList.find((r) => r.id === rows[0].id) || null;
    }
  } catch (err) {
    console.warn("[Cloud Team Lookup] Error checking team code on D1:", err);
  }

  return null;
}

// Synchronous local team finder for instant UI checks
export function findLocalTeamByCode(code: string): EventRegistration | null {
  if (!code || typeof code !== "string") return null;
  const candidates = normalizeTeamCodeCandidates(code);
  if (candidates.length === 0) return null;

  const list = getStoredRegistrations();
  return (
    list.find((r) => {
      if (!r || r.teamType !== "team" || r.status === "Archived") return false;
      const rId = (r.id || "").trim().toUpperCase();
      const rCode = (r.teamCode || "").trim().toUpperCase();
      const rTeam = (r.teamName || "").trim().toUpperCase();
      return candidates.some((c) => {
        const cUpper = c.toUpperCase();
        return rId === cUpper || rCode === cUpper || (cUpper.length >= 4 && rTeam === cUpper);
      });
    }) || null
  );
}

// Join team with team code (creates verified member entry & updates roster across cloud & local)
export async function joinTeamWithCode(
  teamCode: string,
  memberData: {
    userId?: string;
    fullName: string;
    email: string;
    phone: string;
    collegeOrCompany: string;
    department?: string;
    graduationYear?: string;
    opportunitySlug?: string;
  }
): Promise<EventRegistration> {
  if (!teamCode || typeof teamCode !== "string") {
    throw new Error("Please enter a valid Team Code.");
  }
  const cleanCode = teamCode.trim().replace(/^JOIN[\s\-_:]*/i, "").trim();
  if (!cleanCode || cleanCode.toUpperCase() === "JOIN") {
    throw new Error("Please enter a valid Team Code provided by your Team Leader (e.g. QSR5-XXXXX).");
  }

  const memberEmail = memberData.email.trim().toLowerCase();

  // 1. Fetch current team from local/cloud
  let current = await findTeamByCode(cleanCode);

  // 2. If team record is NOT found, reject immediately! Never create a new team!
  if (!current) {
    throw new Error(
      `Team code "${cleanCode}" not found! Please ask your Team Leader for the exact Team Code (e.g. QSR5-XXXXX).`
    );
  }

  // 3. If team IS found, validate capacity & leader
  const opp = findOpportunity(current.opportunitySlug);
  if (opp && (opp.status === "Event full" || opp.status === "Sold out")) {
    throw new Error("Registration for this hackathon is closed. Team roster has been locked.");
  }

  const existingTeammates: TeammateDetail[] = Array.isArray(current.teammates) ? [...current.teammates] : [];
  const currentTotal = 1 + existingTeammates.length; // 1 Leader + teammates
  if (currentTotal >= 4) {
    throw new Error(`Team "${current.teamName || "Squad"}" is already full (maximum 4 members allowed).`);
  }

  if (current.email && current.email.trim().toLowerCase() === memberEmail) {
    throw new Error("You are already the Team Leader of this team!");
  }

  const alreadyJoined = existingTeammates.some(
    (t) =>
      typeof t === "object" &&
      t &&
      typeof t.email === "string" &&
      t.email.trim().toLowerCase() === memberEmail
  );
  if (alreadyJoined) {
    return current; // Idempotent
  }

  const newMember: TeammateDetail = {
    name: memberData.fullName.trim(),
    email: memberEmail,
    phone: memberData.phone.trim(),
    collegeOrCompany: memberData.collegeOrCompany.trim(),
    department: memberData.department?.trim() || undefined,
    graduationYear: memberData.graduationYear?.trim() || undefined,
    status: "verified",
    role: "member",
    confirmedAt: new Date().toISOString(),
  };

  const updatedTeammates = [...existingTeammates, newMember];
  const teamSummary = updatedTeammates
    .map((t) => `${(t.name || "Member").trim()} (${(t.email || "").trim()})`)
    .join(", ");

  const updatedTeam: EventRegistration = {
    ...current,
    teammates: updatedTeammates,
    teamMembers: teamSummary,
    teamSize: `${1 + updatedTeammates.length} members`,
    teamCode: current.teamCode || current.id,
    updatedAt: new Date().toISOString(),
  };

  const list = getStoredRegistrations();
  const index = list.findIndex((r) => r.id === current.id);
  if (index !== -1) {
    list[index] = updatedTeam;
  } else {
    list.unshift(updatedTeam);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));
    localStorage.setItem("hd_guest_email", memberEmail);
    notifyStoreChange();
  }

  // Persist directly to Cloudflare D1 cloud
  try {
    await d1Db.updateRegistrationTeam(
      updatedTeam.id,
      updatedTeam.teamSize,
      updatedTeam.teamMembers || null,
      updatedTeam.teammates || []
    );
  } catch (err) {
    console.warn("[Database Sync] Team member join error on D1:", err);
  }

  return updatedTeam;
}

// Update participant registration status
export function updateRegistrationStatus(
  registrationId: string,
  newStatus: EventRegistration["status"]
): boolean {
  const list = getStoredRegistrations();
  const index = list.findIndex((r) => r.id === registrationId);
  if (index === -1) return false;

  list[index].status = newStatus;
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));
    notifyStoreChange();
  }
  return true;
}

// Save or update Round 1 Idea Submission (PPT Round)
export function saveIdeaSubmission(
  registrationId: string,
  submissionData: Omit<IdeaSubmission, "submittedAt"> & { submittedAt?: string }
): EventRegistration {
  const list = getStoredRegistrations();
  const index = list.findIndex(
    (r) => r.id === registrationId || r.teamCode === registrationId
  );
  if (index === -1) {
    throw new Error("Registration squad not found.");
  }

  const current = list[index];
  const fullSubmission: IdeaSubmission = {
    ...submissionData,
    submittedAt: current.submission?.submittedAt || submissionData.submittedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  const updated: EventRegistration = {
    ...current,
    submission: fullSubmission,
    projectIdea: fullSubmission.projectTitle,
    updatedAt: new Date().toISOString(),
  };

  list[index] = updated;

  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_REGISTRATIONS, JSON.stringify(list));
    notifyStoreChange();

    // Persist to Cloudflare D1
    const teamSummary =
      updated.teammates && updated.teammates.length > 0
        ? updated.teammates.map((t) => `${t.name} (${t.email})`).join(", ")
        : "";
    const payload = JSON.stringify({
      summary: teamSummary,
      submission: updated.submission,
    });

    d1Query("UPDATE registrations SET team_members = ?, updated_at = ? WHERE id = ?", [
      payload,
      new Date().toISOString(),
      updated.id,
    ]).catch((err) => {
      console.warn("[Database Sync] D1 submission update notice:", err);
    });
  }

  return updated;
}

// Check if user is registered for an opportunity (supports Leader & Verified Teammates)
export function isUserRegistered(slug: string, userIdOrEmail?: string): boolean {
  if (!userIdOrEmail) return false;
  const list = getRegistrationsBySlug(slug);
  const query = userIdOrEmail.toLowerCase().trim();
  return list.some(
    (r) =>
      (r.userId && r.userId === userIdOrEmail) ||
      (r.email && r.email.toLowerCase().trim() === query) ||
      (Array.isArray(r.teammates) &&
        r.teammates.some(
          (t) =>
            typeof t === "object" &&
            t &&
            typeof t.email === "string" &&
            t.email.toLowerCase().trim() === query
        ))
  );
}

// Export CSV of registrants (Organizers & Admins only)
export function exportRegistrationsToCSV(
  slug: string,
  eventTitle: string,
  user?: { id?: string; email?: string | null } | null,
  customList?: EventRegistration[]
) {
  if (typeof window === "undefined") return;
  const targetEvent = findOpportunity(slug);
  if (!targetEvent) {
    alert("Event not found.");
    return;
  }

  // Strict host / admin verification
  if (user && !isEventOrganizer(targetEvent, user)) {
    alert("Unauthorized: You can only export registration data for events you organized.");
    return;
  }

  const list = customList && customList.length ? customList : getRegistrationsBySlug(slug);
  if (!list.length) {
    alert("No registrations to export yet.");
    return;
  }

  const headers = [
    "Registration ID",
    "Registration Date",
    "Full Name",
    "First Name",
    "Last Name",
    "Email",
    "Phone",
    "Gender",
    "Location",
    "College / Organization",
    "User Type",
    "Participation Type",
    "Team Name",
    "Team Size",
    "Teammates Breakdown",
    "Looking for Teammates",
    "Status",
    "Round 1 (PPT) Status",
    "Project Title",
    "Domain / Track",
    "PPT Presentation Link",
    "Demo Link",
    "Solution Summary",
  ];

  const escapeCSV = (str?: string | null) => {
    if (!str) return '""';
    return `"${String(str).replace(/"/g, '""')}"`;
  };

  const rows = list.map((r) => [
    escapeCSV(r.id),
    escapeCSV(new Date(r.createdAt).toLocaleString()),
    escapeCSV(r.fullName),
    escapeCSV(r.firstName || "-"),
    escapeCSV(r.lastName || "-"),
    escapeCSV(r.email),
    escapeCSV(r.phone),
    escapeCSV(r.gender || "-"),
    escapeCSV(r.location || "-"),
    escapeCSV(r.collegeOrCompany),
    escapeCSV(r.userType || "-"),
    escapeCSV(r.teamType),
    escapeCSV(r.teamName || "-"),
    escapeCSV(r.teamSize || "-"),
    escapeCSV(
      r.teammates && Array.isArray(r.teammates) && r.teammates.length
        ? r.teammates
            .map((t) => `${t?.name || "Member"} (${t?.email || ""}${t?.phone ? ", " + t.phone : ""})`)
            .join(" | ")
        : r.teamMembers || "-"
    ),
    escapeCSV(r.lookingForTeammates ? "Yes" : "No"),
    escapeCSV(r.status),
    escapeCSV(r.submission?.pptUrl ? "Submitted" : "Pending"),
    escapeCSV(r.submission?.projectTitle || r.projectIdea || "-"),
    escapeCSV(r.submission?.track || "-"),
    escapeCSV(r.submission?.pptUrl || "-"),
    escapeCSV(r.submission?.demoUrl || "-"),
    escapeCSV(r.submission?.summary || "-"),
  ]);

  const csvContent =
    "\uFEFF" +
    [headers.join(","), ...rows.map((row) => row.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  const filename = `${slugifyTitle(eventTitle)}-registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// React Hook: live synced all opportunities
export function useOpportunities() {
  const [data, setData] = useState<Opportunity[]>(() => getAllMergedOpportunities());

  useEffect(() => {
    const handleUpdate = () => {
      setData(getAllMergedOpportunities());
    };
    window.addEventListener(EVENT_CHANGE_SIGNAL, handleUpdate);
    window.addEventListener("storage", handleUpdate);
    return () => {
      window.removeEventListener(EVENT_CHANGE_SIGNAL, handleUpdate);
      window.removeEventListener("storage", handleUpdate);
    };
  }, []);

  return data;
}

function getOrganizerEvents(userId?: string, userEmail?: string | null): HostedEvent[] {
  if (!userId && !userEmail) return [];
  const uEmail = userEmail?.toLowerCase().trim();
  const isGoaOrganizer = Boolean(
    uEmail &&
      (GOA_BUILDATHON_ORGANIZER_EMAILS.includes(uEmail) || uEmail.includes("goabuilds"))
  );
  const isQuasarOrganizer = Boolean(uEmail && QUASAR_ORGANIZER_EMAILS.includes(uEmail));
  const isAdmin = isPlatformAdmin({ id: userId, email: userEmail });

  const goa = findOpportunity("goa-buildathon-2027");
  const hostedGoa: HostedEvent | null = goa
    ? {
        ...goa,
        organizerId: userId || "goa-organizer",
        organizerEmail: userEmail || "hello@goabuilds.com",
        isHosted: true,
        createdAt: "2026-11-08T00:00:00.000Z",
        registrationType: "direct",
      }
    : null;

  const quasar = findOpportunity("quasar-5-international-hackathon-2027");
  const hostedQuasar: HostedEvent | null = quasar
    ? {
        ...quasar,
        organizerId: userId || "quasar-organizer",
        organizerEmail: userEmail || "quasar@pvppcoe.ac.in",
        isHosted: true,
        createdAt: "2026-11-20T00:00:00.000Z",
        registrationType: "direct",
      }
    : null;

  // Specific restriction: Goa Buildathon organizers who are not platform admins get ONLY Goa Buildathon
  if (isGoaOrganizer && !isAdmin) {
    return hostedGoa ? [hostedGoa] : [];
  }

  // Specific restriction: Quasar organizers who are not platform admins get ONLY Quasar
  if (isQuasarOrganizer && !isAdmin) {
    return hostedQuasar ? [hostedQuasar] : [];
  }

  const stored = getStoredHostedEvents().filter((e) =>
    isEventOrganizer(e, { id: userId, email: userEmail })
  );

  // Platform admins get Quasar and Goa prepended if not already stored
  if (isAdmin) {
    const list: HostedEvent[] = [];
    if (hostedQuasar && !stored.some((e) => e.slug === "quasar-5-international-hackathon-2027")) {
      list.push(hostedQuasar);
    }
    if (hostedGoa && !stored.some((e) => e.slug === "goa-buildathon-2027")) {
      list.push(hostedGoa);
    }
    return [...list, ...stored];
  }
  return stored;
}

// React Hook: live synced hosted events strictly belonging to the logged-in organizer
export function useHostedEvents(userId?: string, userEmail?: string | null) {
  const [events, setEvents] = useState<HostedEvent[]>(() => getOrganizerEvents(userId, userEmail));

  useEffect(() => {
    const update = () => {
      setEvents(getOrganizerEvents(userId, userEmail));
    };
    update();
    window.addEventListener(EVENT_CHANGE_SIGNAL, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(EVENT_CHANGE_SIGNAL, update);
      window.removeEventListener("storage", update);
    };
  }, [userId, userEmail]);

  return events;
}

// React Hook: live synced registrations for an event with cloud Supabase polling & realtime focus
export function useEventRegistrations(slug: string, options?: { enabled?: boolean }) {
  const [list, setList] = useState<EventRegistration[]>(() => getRegistrationsBySlug(slug));
  const isEnabled = options?.enabled ?? true;

  useEffect(() => {
    let active = true;

    const update = () => {
      const next = getRegistrationsBySlug(slug);
      setList((prev) => {
        if (
          prev.length === next.length &&
          prev.every(
            (p, i) =>
              p.id === next[i]?.id &&
              p.updatedAt === next[i]?.updatedAt &&
              (p.teammates?.length || 0) === (next[i]?.teammates?.length || 0) &&
              p.submission?.pptUrl === next[i]?.submission?.pptUrl
          )
        ) {
          return prev;
        }
        return next;
      });
    };
    update();
    window.addEventListener(EVENT_CHANGE_SIGNAL, update);
    window.addEventListener("storage", update);

    let lastFetch = 0;
    const fetchCloud = () => {
      if (!isEnabled) return;
      const now = Date.now();
      if (now - lastFetch < 2000) return;
      lastFetch = now;
      d1Query(
        "SELECT id, opportunity_slug, user_id, full_name, email, phone, college_or_company, team_type, team_name, team_size, teammates, status, created_at FROM registrations WHERE opportunity_slug = ? AND status != 'deleted'",
        [slug]
      )
        .then((data) => {
          if (!active || !data || !Array.isArray(data)) return;
          mergeRemoteRegistrations(data);
          update();
        })
        .catch(() => {});
    };

    if (isEnabled) {
      fetchCloud();
    }

    return () => {
      active = false;
      window.removeEventListener(EVENT_CHANGE_SIGNAL, update);
      window.removeEventListener("storage", update);
    };
  }, [slug, isEnabled]);

  return list;
}

// Global cloud synchronizer for hosted events config
let cloudSyncDone = false;
export function syncCloudStore(): void {
  if (typeof window === "undefined" || cloudSyncDone) return;
  cloudSyncDone = true;
  d1Query("SELECT * FROM registrations WHERE id LIKE 'EVENT_CONFIG::%'")
    .then((data) => {
      if (data && Array.isArray(data)) {
        mergeRemoteRegistrations(data);
      }
    })
    .catch(() => {});
}

// Live refresh for a specific user's registration and team roster from Cloudflare D1
export async function refreshUserRegistrationFromD1(
  slug: string,
  userId?: string,
  email?: string
): Promise<EventRegistration | null> {
  if (typeof window === "undefined") return null;
  const cleanEmail = (email || "").trim().toLowerCase();
  const cleanId = (userId || "").trim();
  if (!cleanId && !cleanEmail) return null;

  try {
    const rows = await d1Query(
      `SELECT * FROM registrations 
       WHERE opportunity_slug = ? 
         AND status != 'deleted' 
         AND status != 'Archived' 
         AND (
           user_id = ? 
           OR LOWER(email) = ? 
           OR teammates LIKE ? 
           OR team_members LIKE ?
         ) 
       ORDER BY created_at DESC LIMIT 5`,
      [slug, cleanId || "__none__", cleanEmail || "__none__", `%${cleanEmail}%`, `%${cleanEmail}%`]
    );

    if (rows && Array.isArray(rows) && rows.length > 0) {
      mergeRemoteRegistrations(rows);
      notifyStoreChange();
      const freshList = getStoredRegistrations();
      return (
        freshList.find(
          (r) =>
            r.opportunitySlug === slug &&
            (r.userId === cleanId ||
              r.email.toLowerCase() === cleanEmail ||
              r.teammates?.some((t) => t.email?.toLowerCase() === cleanEmail))
        ) || null
      );
    }
  } catch (err) {
    console.warn("[D1 Sync] Could not refresh user registration:", err);
  }
  return null;
}


