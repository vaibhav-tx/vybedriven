import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "@/components/ListingPage";
import { OpportunityBrowser } from "@/components/OpportunityBrowser";

export const Route = createFileRoute("/discover")({
  head: () => ({ meta: [
    { title: "Discover Opportunities — Vybe Driven" },
    { name: "description", content: "Search every Vybe Driven hackathon, competition, meetup, conference and networking event." },
    { property: "og:title", content: "Discover Opportunities — Vybe Driven" },
    { property: "og:description", content: "One place to find every opportunity for technology builders." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: DiscoverPage,
});

function DiscoverPage() {
  return <ListingPage eyebrow="EXPLORE EVERYTHING" title="Your next opportunity starts here." description="Search all hackathons, competitions, meetups, conferences and networking events in one place."><OpportunityBrowser showTypeFilter /></ListingPage>;
}