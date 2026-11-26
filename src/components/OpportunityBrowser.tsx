import { useMemo, useState } from "react";
import { Calendar, MapPin, Search, Trophy, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { type Opportunity, type OpportunityType } from "@/data/opportunities";
import { useOpportunities } from "@/data/events-store";
import { Button } from "@/components/ui/button";

const types: (OpportunityType | "All")[] = ["All", "Hackathon", "Competition", "Meetup", "Conference", "Networking"];
const formats = ["All formats", "Online", "In person", "Hybrid"] as const;

function OpportunityCard({ item }: { item: Opportunity }) {
  const isHosted = Boolean((item as any).isHosted);
  const isPast = item.status === "Past event";

  return (
    <Link to="/opportunities/$slug" params={{ slug: item.slug }} aria-label={`View ${item.title} details`} className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background">
      <article className={`flex h-full flex-col overflow-hidden rounded-2xl border bg-card shadow-sm transition duration-300 group-hover:-translate-y-1 ${isPast ? "border-border/70 opacity-90 group-hover:border-zinc-500" : "border-border group-hover:border-neon/50 group-hover:shadow-glow-soft"}`}>
        <div className="relative aspect-[16/9] overflow-hidden">
          <img src={item.image} alt={item.title} style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined} className={`h-full w-full bg-surface transition duration-700 group-hover:scale-[1.02] ${item.imageFit === "contain" ? "object-contain" : "object-cover"} ${isPast ? "grayscale-[25%]" : ""}`} />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-border bg-popover/90 px-3 py-1 text-xs font-semibold text-popover-foreground backdrop-blur">{item.type}</span>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isPast ? "border border-white/10 bg-zinc-800/90 text-zinc-300" : "bg-neon text-primary-foreground"}`}>
              {isPast ? "Concluded" : item.status}
            </span>
            {isHosted && (
              <span className="inline-flex items-center gap-1 rounded-full border border-neon/50 bg-black/80 px-2.5 py-1 text-xs font-semibold text-neon backdrop-blur">
                <Sparkles className="size-3" /> Community Hosted
              </span>
            )}
          </div>
        </div>
        <div className="flex flex-1 flex-col p-5">
          <p className={`text-xs font-semibold ${isPast ? "text-muted-foreground" : "text-neon"}`}>{item.tag.toUpperCase()}</p>
          <h2 className="mt-2 text-xl font-bold text-card-foreground">{item.title}</h2>
          <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{item.description}</p>
          <div className="mt-5 flex flex-wrap gap-3 border-t border-border pt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5"><Calendar className={`size-3.5 ${isPast ? "text-muted-foreground" : "text-neon"}`} />{item.date}</span>
            <span className="flex items-center gap-1.5"><MapPin className={`size-3.5 ${isPast ? "text-muted-foreground" : "text-neon"}`} />{item.location}</span>
            {item.prize && <span className="flex items-center gap-1.5"><Trophy className={`size-3.5 ${isPast ? "text-muted-foreground" : "text-neon"}`} />{item.prize}</span>}
          </div>
          <p className={`mt-4 text-sm font-semibold ${isPast ? "text-muted-foreground group-hover:text-foreground" : "text-neon"}`}>
            {isPast ? "View recap & details →" : "View details →"}
          </p>
        </div>
      </article>
    </Link>
  );
}

const HACKATHON_PAGE_ORDER: Record<string, number> = {
  "quasar-5-international-hackathon-2027": 1,
  "goa-buildathon-2027": 2,
  "supernova-2026-quantumhack": 3,
  "beyond-9to5-buildathon-bengaluru-2026": 4,
  "beyond-9to5-buildathon-mumbai-2026": 5,
  "code-relay-5-iit-bhubaneswar": 6,
  "apify-ai-tools-that-earn-bangalore-2026": 7,
  "lighthouse-hackathon-chandigarh-university-2027": 8,
  "hacksprint-3-kahe-coimbatore": 9,
  "skysparks-boeing-techkriti-iit-kanpur-2027": 10,
  "shaastra-ctf-iit-madras-2027": 11,
  "idea-competition-2026": 12,
  "hack-in-hills-2026": 13,
};

export function OpportunityBrowser({ allowedTypes, showTypeFilter = false }: { allowedTypes?: OpportunityType[]; showTypeFilter?: boolean }) {
  const allOpportunities = useOpportunities();
  const [timeTab, setTimeTab] = useState<"upcoming" | "past">("upcoming");
  const [query, setQuery] = useState("");
  const [type, setType] = useState<OpportunityType | "All">("All");
  const [format, setFormat] = useState<(typeof formats)[number]>("All formats");

  const isHackathonView = Boolean(
    allowedTypes &&
    allowedTypes.includes("Hackathon") &&
    !allowedTypes.includes("Meetup")
  );

  const { upcomingList, pastList } = useMemo(() => {
    const scoped = allOpportunities.filter((item) => {
      const allowed = !allowedTypes || allowedTypes.includes(item.type);
      const matchesType = type === "All" || item.type === type;
      const matchesFormat = format === "All formats" || item.format === format;
      const haystack = `${item.title} ${item.tag} ${item.location} ${item.description}`.toLowerCase();
      return allowed && matchesType && matchesFormat && haystack.includes(query.toLowerCase());
    });

    const upcoming = scoped.filter((item) => item.status !== "Past event");
    const past = scoped.filter((item) => item.status === "Past event");

    if (isHackathonView) {
      upcoming.sort((a, b) => {
        const orderA = HACKATHON_PAGE_ORDER[a.slug] ?? 99;
        const orderB = HACKATHON_PAGE_ORDER[b.slug] ?? 99;
        return orderA - orderB;
      });
    }

    return { upcomingList: upcoming, pastList: past };
  }, [allOpportunities, allowedTypes, format, isHackathonView, query, type]);

  const list = timeTab === "upcoming" ? upcomingList : pastList;

  return (
    <>
      {/* Time Tab Switcher: Upcoming vs Past Events */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setTimeTab("upcoming")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
            timeTab === "upcoming"
              ? "bg-neon text-primary-foreground shadow-glow-soft font-bold"
              : "border border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Upcoming</span>
          <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${timeTab === "upcoming" ? "bg-black/20 text-black font-mono font-bold" : "bg-surface text-muted-foreground"}`}>
            {upcomingList.length}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setTimeTab("past")}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs sm:text-sm font-semibold transition ${
            timeTab === "past"
              ? "bg-surface border border-white/30 text-foreground font-bold shadow-sm"
              : "border border-border bg-card text-muted-foreground hover:text-foreground"
          }`}
        >
          <span>Past Events</span>
          <span className={`rounded-full px-1.5 py-0.5 text-[11px] ${timeTab === "past" ? "bg-white/10 text-foreground font-mono" : "bg-surface text-muted-foreground"}`}>
            {pastList.length}
          </span>
        </button>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-3 shadow-sm md:flex-row">
        <label className="flex min-h-11 flex-1 items-center gap-3 rounded-xl bg-surface px-4 focus-within:ring-2 focus-within:ring-ring">
          <Search className="size-4 text-muted-foreground" />
          <span className="sr-only">Search opportunities</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, topic or city" className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
        </label>
        {showTypeFilter && (
          <select aria-label="Opportunity type" value={type} onChange={(event) => setType(event.target.value as OpportunityType | "All")} className="min-h-11 rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
            {types.map((item) => <option key={item}>{item}</option>)}
          </select>
        )}
        <select aria-label="Format" value={format} onChange={(event) => setFormat(event.target.value as (typeof formats)[number])} className="min-h-11 rounded-xl border border-border bg-surface px-4 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring">
          {formats.map((item) => <option key={item}>{item}</option>)}
        </select>
      </div>
      <p className="mt-6 text-sm text-muted-foreground">
        Showing {list.length} {timeTab === "upcoming" ? "upcoming" : "past"} {list.length === 1 ? "opportunity" : "opportunities"}
      </p>
      {list.length ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{list.map((item) => <OpportunityCard key={item.slug} item={item} />)}</div>
      ) : (
        <div className="mt-5 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface text-center">
          <Search className="size-8 text-muted-foreground" />
          <h2 className="mt-4 font-semibold">
            {timeTab === "upcoming" ? "No upcoming matches found" : "No past events found"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or format filters.</p>
          <Button variant="outline" className="mt-5 rounded-full" onClick={() => { setQuery(""); setType("All"); setFormat("All formats"); }}>Clear filters</Button>
        </div>
      )}
    </>
  );
}
