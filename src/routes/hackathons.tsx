import { createFileRoute } from "@tanstack/react-router";
import { ListingPage } from "@/components/ListingPage";
import { OpportunityBrowser } from "@/components/OpportunityBrowser";

export const Route = createFileRoute("/hackathons")({
  head: () => ({ meta: [
    { title: "Hackathons & Competitions — Vybe Driven" },
    { name: "description", content: "Explore upcoming hackathons and technology competitions on Vybe Driven." },
    { property: "og:title", content: "Hackathons & Competitions — Vybe Driven" },
    { property: "og:description", content: "Find your next challenge and build something remarkable." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: HackathonsPage,
});

function HackathonsPage() {
  return <ListingPage eyebrow="COMPETE & BUILD" title="Hackathons for builders who ship." description="Discover focused challenges, ambitious teams and real opportunities to turn an idea into impact."><OpportunityBrowser allowedTypes={["Hackathon", "Competition"]} /></ListingPage>;
}