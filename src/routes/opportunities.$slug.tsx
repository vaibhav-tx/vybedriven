import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Calendar, CheckCircle2, Clock3, ExternalLink, MapPin, Trophy, Users, WalletCards } from "lucide-react";
import { Navbar, Footer } from "@/components/SiteChrome";
import { Button } from "@/components/ui/button";
import { getOpportunity } from "@/data/opportunities";

export const Route = createFileRoute("/opportunities/$slug")({
  loader: ({ params }) => {
    const opportunity = getOpportunity(params.slug);
    if (!opportunity) throw notFound();
    return opportunity;
  },
  head: ({ loaderData }) => {
    const title = loaderData ? `${loaderData.title} — Vybe Driven` : "Event unavailable — Vybe Driven";
    const description = loaderData?.description ?? "This Vybe Driven event is unavailable.";
    return { meta: [{ title }, { name: "description", content: description }, { property: "og:title", content: title }, { property: "og:description", content: description }, { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" }] };
  },
  component: OpportunityDetails,
  notFoundComponent: OpportunityNotFound,
});

function OpportunityDetails() {
  const item = Route.useLoaderData();
  const facts = [
    { icon: Calendar, label: "Event dates", value: item.date },
    { icon: MapPin, label: "Format", value: `${item.format} · ${item.location}` },
    { icon: Clock3, label: "Registration deadline", value: item.registrationDeadline },
    { icon: Users, label: "Team size", value: item.teamSize },
    { icon: CheckCircle2, label: "Eligibility", value: item.eligibility },
    { icon: WalletCards, label: "Entry fee", value: item.fee },
  ];
  return <div className="min-h-screen bg-background"><Navbar /><main>
    <section className="border-b border-border bg-surface"><div className="mx-auto grid max-w-[1200px] gap-6 sm:gap-7 px-4 sm:px-6 pb-8 pt-8 sm:pb-10 sm:pt-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center"><div><div className="flex flex-wrap gap-2"><span className="rounded-full border border-border bg-background px-3 py-1 text-xs font-semibold">{item.type}</span><span className="rounded-full bg-neon px-3 py-1 text-xs font-semibold text-primary-foreground">{item.status}</span></div><p className="mt-4 sm:mt-6 text-xs sm:text-sm font-semibold text-neon">{item.tag.toUpperCase()}</p><h1 className="mt-2 text-3xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">{item.title}</h1><p className="mt-3 sm:mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted-foreground">{item.description}</p><p className="mt-4 sm:mt-5 text-xs sm:text-sm text-muted-foreground">Hosted by <span className="font-semibold text-foreground">{item.organizer}</span></p></div><img src={item.image} alt={item.title} style={item.imagePosition ? { objectPosition: item.imagePosition } : undefined} className={`aspect-[16/10] w-full rounded-2xl bg-background ${item.imageFit === "contain" ? "object-contain" : "object-cover"}`} /></div></section>
    <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-6 sm:py-8"><div className="grid gap-7 lg:grid-cols-[1fr_320px]"><div>
      <div className="grid overflow-hidden rounded-2xl border border-border bg-card grid-cols-2 lg:grid-cols-3">{facts.map(({ icon: Icon, label, value }) => <div key={label} className="border-b border-border p-4 sm:p-5 [&:nth-child(odd)]:border-r sm:[&:nth-child(even)]:border-r"><Icon className="size-4 sm:size-5 text-neon" /><p className="mt-2 sm:mt-3 text-[11px] sm:text-xs font-semibold text-muted-foreground">{label}</p><p className="mt-1 text-xs sm:text-sm font-semibold">{value}</p></div>)}</div>
      <section className="py-7 sm:py-9"><h2 className="text-xl sm:text-2xl font-bold">About this {item.type.toLowerCase()}</h2><p className="mt-3 sm:mt-4 max-w-3xl text-sm sm:text-base leading-relaxed text-muted-foreground">{item.overview}</p></section>
      <section className="border-t border-border py-7 sm:py-9"><h2 className="text-xl sm:text-2xl font-bold">Stages and timeline</h2><ol className="mt-6 space-y-5">{item.schedule.map((step, index) => <li key={step.title} className="grid grid-cols-[36px_1fr] gap-3 sm:gap-4"><span className="grid size-9 place-items-center rounded-full bg-neon font-bold text-primary-foreground">{index + 1}</span><div><div className="flex flex-wrap items-baseline justify-between gap-1.5 sm:gap-2"><h3 className="text-sm sm:text-base font-semibold">{step.title}</h3><p className="text-xs sm:text-sm font-medium text-neon">{step.date}</p></div><p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">{step.description}</p></div></li>)}</ol></section>
      {item.prize && <section className="border-t border-border py-8 sm:py-12"><Trophy className="size-6 sm:size-7 text-neon" /><h2 className="mt-3 sm:mt-4 text-xl sm:text-2xl font-bold">Rewards and prizes</h2><p className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-extrabold text-neon">{item.prize}</p><p className="mt-2 text-xs sm:text-sm text-muted-foreground">Final distribution and award categories will be announced with registration.</p></section>}
    </div><aside className="lg:sticky lg:top-28 lg:self-start"><div className="rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-sm"><p className="text-xs font-semibold text-muted-foreground">REGISTRATION</p>{item.registrationUrl ? (<><h2 className="mt-2 text-lg sm:text-xl font-bold">{item.status === "Sold out" ? "Sold out" : item.status === "Event full" ? "Event full" : item.status === "Approval required" ? "Approval required" : "Registrations open"}</h2><p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">{item.registrationNote ?? (item.registrationDeadline === "To be announced" ? "Register now through the official event link. The closing date will be announced." : `Register through the official event link before ${item.registrationDeadline}.`)}</p>{item.status !== "Sold out" && <Button asChild className="mt-5 sm:mt-6 w-full rounded-full bg-gradient-brand text-primary-foreground"><a href={item.registrationUrl} target="_blank" rel="noopener noreferrer">{item.registrationLabel ?? "Register now"}<ExternalLink className="ml-2 inline size-4" /></a></Button>}{item.relatedLinks && <div className="mt-4 space-y-2">{item.relatedLinks.map((link) => <a key={link.url} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-xs sm:text-sm font-medium hover:border-neon hover:text-neon"><span>{link.label}</span><ExternalLink className="size-3.5" /></a>)}</div>}{item.contacts && (<div className="mt-5 border-t border-border pt-4"><p className="text-xs font-semibold text-muted-foreground">QUERIES</p><ul className="mt-2 space-y-1.5">{item.contacts.map((contact) => <li key={contact.phone} className="text-xs sm:text-sm"><a href={`tel:${contact.phone}`} className="font-medium hover:text-neon">{contact.name}</a><span className="text-muted-foreground"> · {contact.phone}</span></li>)}</ul></div>)}<a href="mailto:vybedriven@gmail.com" className="mt-4 block text-center text-xs sm:text-sm font-semibold text-neon">Ask Vybe Driven</a></>) : (<><h2 className="mt-2 text-lg sm:text-xl font-bold">Opening soon</h2><p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed text-muted-foreground">Registration is not live yet. Sign in now to prepare your profile for when applications open.</p><Button asChild className="mt-5 sm:mt-6 w-full rounded-full bg-gradient-brand text-primary-foreground"><Link to="/auth" search={{ mode: "signin", next: `/opportunities/${item.slug}` }}>Sign in to Vybe Driven</Link></Button><a href="mailto:vybedriven@gmail.com" className="mt-4 block text-center text-xs sm:text-sm font-semibold text-neon">Ask the organiser</a></>)}</div></aside></div></section>
  </main><Footer /></div>;
}

function OpportunityNotFound() {
  return <div className="min-h-screen bg-background"><Navbar /><main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center"><h1 className="text-4xl font-bold">Event not found</h1><p className="mt-3 text-muted-foreground">This event may have moved or is no longer available.</p><Button asChild className="mt-6 rounded-full"><Link to="/discover">Browse all events</Link></Button></main><Footer /></div>;
}