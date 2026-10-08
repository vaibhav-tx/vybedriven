import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "@/components/ListingPage";
import { OpportunityBrowser } from "@/components/OpportunityBrowser";

export const Route = createFileRoute("/events")({
  head: () => ({ meta: [
    { title: "Tech Events & Meetups — Vybe Driven" },
    { name: "description", content: "Find technology meetups, conferences and networking events near you." },
    { property: "og:title", content: "Tech Events & Meetups — Vybe Driven" },
    { property: "og:description", content: "Meet builders, learn from experts and grow your network." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: EventsPage,
});

function EventsPage() {
  return <ListingPage eyebrow="MEET THE COMMUNITY" title="Events worth showing up for." description="Browse meetups, conferences and networking experiences created for curious technology builders."><OpportunityBrowser allowedTypes={["Meetup", "Conference", "Networking"]} /></ListingPage>;
}