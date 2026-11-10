import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Users, Calendar, Trophy, Swords, Zap, Globe, Activity, Code2,
  Search, UsersRound, Rocket, LineChart, Award, Sparkles, CheckCircle2, ShieldCheck,
  HelpCircle, Mail, Building2, UserPlus, ChevronDown, ChevronUp, ExternalLink,
} from "lucide-react";
import { Navbar, Footer } from "@/components/SiteChrome";
import { Reveal, Eyebrow, PrimaryBtn, GhostBtn } from "@/components/ui-hd";

import ornateConferenceHall from "@/assets/community-real/Ornate Conference Hall and Engaged Audience.webp";
import hackOnTrackWinners from "@/assets/community-real/IMG_08741.webp";
import repoForgeCelebration from "@/assets/community-real/1792571314963.webp";
import computerLabSprint from "@/assets/community-real/1792571325314.webp";
import projectPitchDemo from "@/assets/community-real/PXL_20261003_132342890.MP.webp";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Us — Vybe Driven (Vybe) | India's Largest Hackathon & Event Ecosystem" },
      {
        name: "description",
        content: "Vybe Driven (Vybe / Vibe Driven) is one of India's largest hosting platforms for hackathons, collegiate tech fests, builder sprints, and developer summits. Connecting 20k+ daily visitors, 100k+ weekly active builders, and 20,000+ students and working professionals.",
      },
      {
        name: "keywords",
        content: "what is vybe driven, why vybe driven, about vybe driven, host hackathon india, sponsor hackathons, vybe driven community, vybe, vibe driven, student hackathon platform",
      },
      { property: "og:title", content: "About Vybe Driven — Powering India's Ambitious Builders" },
      {
        property: "og:description",
        content: "One of India's premier hosting platforms for hackathons, tech summits, and developer sprints with 100k+ weekly builders.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://www.vybedriven.in/about" },
      { name: "robots", content: "index, follow" },
    ],
    links: [{ rel: "canonical", href: "https://www.vybedriven.in/about" }],
  }),
  component: AboutPage,
});

const statsList = [
  {
    num: "100K+",
    title: "Weekly Active Builders",
    description: "Students & working professionals discovering sprints, hackathons & events.",
    badge: "WEEKLY REACH",
    icon: Activity,
  },
  {
    num: "20K+",
    title: "Daily Active Visitors",
    description: "Builders actively exploring hackathons, workshops, and flagship summits.",
    badge: "DAILY ENGAGEMENT",
    icon: Users,
  },
  {
    num: "20,000+",
    title: "Community Network",
    description: "Connected across official WhatsApp builder squads & regional tech chapters.",
    badge: "WHATSAPP & DISCORD",
    icon: Globe,
  },
  {
    num: "₹10,00,000+",
    title: "Prize Pools & Bounties",
    description: "Direct cash bounties, ecosystem grants, and corporate rewards awarded.",
    badge: "TOTAL VALUE",
    icon: Trophy,
  },
];

const pillars = [
  {
    n: "01",
    i: Zap,
    t: "Powerful Innovation",
    d: "Challenges designed with top college bodies, industry sponsors, and tech leaders around problems that matter right now.",
  },
  {
    n: "02",
    i: Globe,
    t: "Open Community",
    d: "A welcoming, zero-gatekeeping hub for student engineers, solo coders, and creative minds looking to build the future.",
  },
  {
    n: "03",
    i: Activity,
    t: "Real-Time Experience",
    d: "Live updates, transparent submission deadlines, and verified milestones from kickoff to final stage demo.",
  },
  {
    n: "04",
    i: Code2,
    t: "Built for Developers",
    d: "Clean workflows, GitHub-first project evaluation, and direct access to mentors who actively guide and challenge you.",
  },
];

const features = [
  { i: Search, t: "Discover Events", d: "Browse hackathons, competitions and workshops filtered to your stack, location and interests." },
  { i: UsersRound, t: "Assemble Winning Squads", d: "Find teammates with complementary design, backend and AI skills before the countdown begins." },
  { i: Rocket, t: "Build & Submit", d: "Ship working prototypes and present live demos, GitHub repositories and slide decks in one place." },
  { i: LineChart, t: "Track Milestones", d: "Follow real-time stage deadlines, PPT rounds, offline venue schedules, and jury evaluations." },
  { i: Swords, t: "Compete Nationally", d: "Go head to head with the sharpest collegiate innovators and seasoned developers across India." },
  { i: Award, t: "Earn Real Rewards", d: "Win direct cash prizes, official trophies, certificates, and opportunities recruiters actively notice." },
];

interface FaqItem {
  q: string;
  badge: string;
  icon: typeof HelpCircle;
  a: string[];
  action?: { label: string; href: string; external?: boolean };
}

const faqs: FaqItem[] = [
  {
    q: "What is Vybe Driven?",
    badge: "PLATFORM OVERVIEW",
    icon: HelpCircle,
    a: [
      "Vybe Driven (also widely known as Vybe or Vibe Driven) is one of India's largest and premier hosting platforms for offline & online hackathons, collegiate tech fests, developer summits, and creative builder experiences.",
      "Engineered from the ground up to turn ambitious ideas into functional prototypes and venture-ready solutions, Vybe Driven bridges students, developers, designers, and innovators with real-world industry problem statements.",
      "The ecosystem currently powers over 20,000+ daily active visitors, 100,000+ weekly community users, and an active network of 20,000+ student engineers and working professionals connected through dedicated WhatsApp builder squads, college ambassador programs, and regional city chapters.",
    ],
    action: { label: "Explore Hackathons & Events", href: "/hackathons" },
  },
  {
    q: "Why Vybe Driven?",
    badge: "WHY BUILD HERE",
    icon: Zap,
    a: [
      "Unlike generic event directories, Vybe Driven is built builder-first with zero gatekeeping, rapid squad assembly, and transparent evaluation criteria.",
      "• Real Impact & Bounties: Access verified industry problem statements with direct cash prize pools, cloud credits, and direct interview pipelines.",
      "• Squad Matchmaking: Form complementary squads (AI/ML, backend, fullstack, design) instantly with fellow builders.",
      "• Integrated Submission Workflows: Submit PPT decks, GitHub repositories, and live demo links with live status tracking and jury feedback.",
      "• Official Entry Passes: Instant verified passes with digital entry credentials for offline hackathon venues across Goa, Mumbai, Bengaluru, and Pune.",
    ],
    action: { label: "Learn About Our Ethos", href: "#ethos" },
  },
  {
    q: "Want to host a hackathon, college fest, or developer sprint?",
    badge: "HOST AN EVENT",
    icon: Building2,
    a: [
      "Are you a university council, student tech club, developer community, or tech enterprise looking to host a high-energy hackathon or summit?",
      "Vybe Driven offers end-to-end event infrastructure: registration management, automated squad forming, Round 1 PPT deck submissions, jury scoring dashboards, and real-time announcement feeds.",
      "Our team provides marketing reach to 100k+ builders, sponsor connectivity, and on-ground technical advisory to make your event a massive success.",
      "To host your event, click 'Host an Event' below or contact our events desk directly at vybedriven@gmail.com. We will get your event live within 24 hours.",
    ],
    action: { label: "Host on Vybe Driven", href: "/host" },
  },
  {
    q: "Want to be a sponsor or ecosystem partner?",
    badge: "SPONSORS & PARTNERS",
    icon: Award,
    a: [
      "Sponsoring a Vybe Driven hackathon puts your product, developer APIs, cloud platform, or brand directly in front of India's most ambitious engineering and product talent.",
      "We offer tailored partnership packages including custom track bounties, mentor slots, keynote speaking opportunities, resume books, and branded swag showcases.",
      "Past and ongoing partner collaborations include leading AI tooling companies, fintech giants, venture accelerators, and grassroots developer communities.",
      "Reach out to our strategic partnerships team at vybedriven@gmail.com with the subject 'Sponsorship / Partner Inquiry' to discuss customized track opportunities.",
    ],
    action: { label: "Contact Partnerships Desk", href: "/contact" },
  },
  {
    q: "Want to participate as a student or working professional?",
    badge: "JOIN AS A BUILDER",
    icon: UserPlus,
    a: [
      "Participation on Vybe Driven is 100% free, beginner-friendly, and open to anyone passionate about building software, AI agents, hardware, or innovative startups.",
      "1. Browse our Hackathons & Opportunities section and select an event (e.g., Goa Buildathon '27, Beyond 9to5 Buildathons).",
      "2. Sign in with Google or create an account, fill in your profile, and form or join a squad.",
      "3. Submit your Round 1 PPT deck or project concept directly from your dashboard.",
      "4. Unlock your official entry pass and join the exclusive WhatsApp community squad for real-time announcements, mentoring sessions, and problem statements.",
    ],
    action: { label: "Browse Active Hackathons", href: "/hackathons" },
  },
  {
    q: "How can I contact Vybe Driven for queries or support?",
    badge: "QUERIES & SUPPORT",
    icon: Mail,
    a: [
      "We are here to support builders and organizers 7 days a week:",
      "• General Inquiries, Partnerships & Event Hosting: vybedriven@gmail.com",
      "• Direct Contact Form: Visit our Contact Us page to submit your inquiry directly to our team.",
      "We typically respond to emails within 12–24 business hours.",
    ],
    action: { label: "Go to Contact Page", href: "/contact" },
  },
];

function AboutPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq((prev) => (prev === idx ? null : idx));
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map((faq) => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a.join(" "),
      },
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Vybe Driven",
    "alternateName": ["Vybe", "Vibe Driven", "VybeDriven"],
    "url": "https://www.vybedriven.in",
    "logo": "https://www.vybedriven.in/brand/vybe-icon.svg",
    "description": "Vybe Driven is one of India's largest hosting platforms for hackathons, collegiate tech fests, developer summits, and builder sprints with 20k+ daily users, 100k+ weekly active builders, and 20,000+ students and working professionals in WhatsApp community networks.",
    "email": "vybedriven@gmail.com",
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "email": "vybedriven@gmail.com",
        "contactType": "customer service",
        "areaServed": "IN",
        "availableLanguage": ["English", "Hindi"],
      },
    ],
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Search Engine & AI Bot Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgSchema) }}
      />

      <Navbar />

      <main className="overflow-hidden">
        {/* Hero Header */}
        <section className="relative pt-24 sm:pt-32 pb-14 sm:pb-20 border-b border-border/60">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-neon/10 blur-[130px]" />
          <div className="pointer-events-none absolute inset-0 bg-grid opacity-20" />

          <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6 text-center">
            <Reveal>
              <Eyebrow>ABOUT VYBE DRIVEN</Eyebrow>
              <h1 className="mt-3 text-3xl min-[400px]:text-4xl sm:text-6xl font-black tracking-tight leading-[1.08]">
                More Than Events.<br />
                An Ecosystem Built to <span className="text-gradient">Drive What's Next.</span>
              </h1>
              <p className="mx-auto mt-4 sm:mt-6 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
                Vybe Driven (Vybe / Vibe Driven) is one of India&apos;s largest hosting platforms for hackathons, collegiate tech fests, developer summits, and innovation sprints. Connecting <strong className="text-foreground">20K+ daily active visitors</strong> and <strong className="text-foreground">100K+ weekly builders</strong> with industry problem statements and verified talent squads.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                <PrimaryBtn href="/hackathons">Explore Hackathons <ArrowRight className="size-4" /></PrimaryBtn>
                <GhostBtn href="/contact">Partner With Us</GhostBtn>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Impact Metrics Section */}
        <section className="relative mx-auto max-w-[1240px] px-4 sm:px-6 py-12 sm:py-16">
          <Reveal>
            <div className="stats-laser-border">
              <div className="relative rounded-[calc(1.5rem-1.5px)] bg-[#070d08]/95 p-5 sm:p-8 backdrop-blur-2xl">
                <div className="pointer-events-none absolute -right-16 -top-16 size-60 rounded-full bg-neon/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-16 -left-16 size-60 rounded-full bg-lime/10 blur-3xl" />

                {/* Telemetry Header */}
                <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-border/60 pb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="relative flex size-2.5">
                      <span className="absolute inline-flex size-full animate-ping rounded-full bg-neon opacity-80" />
                      <span className="relative inline-flex size-2.5 rounded-full bg-neon" />
                    </span>
                    <span className="text-xs sm:text-sm font-black uppercase tracking-[0.18em] text-neon">
                      Vybe Driven Network Telemetry
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono tracking-wider text-muted-foreground">
                    <span className="inline-block size-1.5 rounded-full bg-neon/60" />
                    <span>VERIFIED LIVE METRICS</span>
                  </div>
                </div>

                {/* 4 Stat Pods */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {statsList.map((stat) => {
                    const Icon = stat.icon;
                    return (
                      <div
                        key={stat.title}
                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/80 bg-surface/60 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-neon/50 hover:bg-surface/90 hover:shadow-glow-soft"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-3">
                            <div className="grid size-11 shrink-0 place-items-center rounded-xl border border-neon/30 bg-neon/10 text-neon transition-all duration-300 group-hover:scale-110 group-hover:bg-neon group-hover:text-black">
                              <Icon className="size-5" />
                            </div>
                            <span className="rounded-full border border-neon/20 bg-neon/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon">
                              {stat.badge}
                            </span>
                          </div>

                          <div className="mt-5">
                            <div className="text-3xl sm:text-4xl font-black tracking-tight text-white transition-colors duration-200 group-hover:text-neon">
                              {stat.num}
                            </div>
                            <p className="mt-1 text-sm sm:text-base font-bold text-foreground">
                              {stat.title}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                              {stat.description}
                            </p>
                          </div>
                        </div>

                        <div className="mt-4 h-[2px] w-full rounded-full bg-border/40 overflow-hidden">
                          <div className="h-full w-0 bg-gradient-to-r from-neon to-lime transition-all duration-500 group-hover:w-full" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Why Vybe Driven - 4 Core Pillars */}
        <section id="ethos" className="relative py-12 sm:py-16 border-t border-border/60 bg-surface/30">
          <div className="relative mx-auto max-w-[1200px] px-4 sm:px-6">
            <Reveal className="text-center">
              <Eyebrow>OUR CORE ETHOS</Eyebrow>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Why <span className="text-gradient">Vybe Driven?</span>
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
                We believe developers learn fastest when they build under real-world constraints, solve genuine problems, and ship with community energy.
              </p>
            </Reveal>

            <div className="mt-10 grid gap-4 sm:gap-6 md:grid-cols-2">
              {pillars.map(({ n, i: Icon, t, d }, idx) => (
                <Reveal key={n} delay={idx * 70}>
                  <div className="relative h-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border bg-gradient-to-br from-surface-2 to-background p-6 sm:p-8">
                    <span className="absolute -right-2 -top-6 text-[84px] sm:text-[130px] font-black leading-none text-neon/10 select-none pointer-events-none">
                      {n}
                    </span>
                    <Icon className="relative size-6 text-neon" />
                    <h3 className="relative mt-5 sm:mt-6 text-xl sm:text-2xl font-bold">{t}</h3>
                    <p className="relative mt-2 max-w-sm text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {d}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Built for Builders - 6 Capability Cards */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-14 sm:py-20">
          <Reveal className="text-center">
            <Eyebrow>BUILT FOR BUILDERS</Eyebrow>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
              Everything You Need to <span className="text-gradient">Build What's Next.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-muted-foreground">
              A single platform engineered to take you from discovering an opportunity to hoisting the trophy on stage.
            </p>
          </Reveal>

          <div className="mt-10 sm:mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ i: Icon, t, d }, idx) => (
              <Reveal key={t} delay={idx * 50}>
                <div className="group h-full rounded-2xl border border-border bg-surface p-6 sm:p-7 transition hover:border-neon/40 hover:shadow-glow-soft">
                  <span className="grid size-11 place-items-center rounded-xl border border-border bg-surface-2 text-neon transition group-hover:bg-neon group-hover:text-primary-foreground">
                    <Icon className="size-5" />
                  </span>
                  <h3 className="mt-4 sm:mt-5 text-base sm:text-lg font-bold">{t}</h3>
                  <p className="mt-2 text-xs sm:text-sm text-muted-foreground leading-relaxed">{d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Real Community Moments Grid */}
        <section className="border-t border-border/60 bg-surface/20 py-14 sm:py-20">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <Reveal className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
              <div>
                <Eyebrow>AUTHENTIC MOMENTS</Eyebrow>
                <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
                  Real Builders. Real Impact.
                </h2>
              </div>
              <p className="max-w-md text-sm text-muted-foreground">
                No stock photos or synthetic simulations — every milestone is forged with real collegiate talent and community partners across India.
              </p>
            </Reveal>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 aspect-[16/10]">
                <img src={ornateConferenceHall} alt="Grand Tech Summits" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-neon" /> Grand Tech Summits & Summits
                </span>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 aspect-[16/10]">
                <img src={hackOnTrackWinners} alt="Winners & Grants" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-neon" /> Direct Cash Prizes & Awards
                </span>
              </div>
              <div className="group relative overflow-hidden rounded-2xl border border-border/60 aspect-[16/10]">
                <img src={projectPitchDemo} alt="Live Project Pitches" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent" />
                <span className="absolute bottom-3 left-3 text-xs font-semibold text-foreground flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-neon" /> Live Demo Days & Jury Pitching
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive FAQ & Knowledge Base (AI Bot & Crawler Optimized) */}
        <section id="faq" className="border-t border-border/60 bg-surface/30 py-16 sm:py-24">
          <div className="mx-auto max-w-[1200px] px-4 sm:px-6">
            <Reveal className="text-center">
              <Eyebrow>FREQUENTLY ASKED QUESTIONS</Eyebrow>
              <h2 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
                Everything You Need to Know About <span className="text-gradient">Vybe Driven</span>
              </h2>
              <p className="mx-auto mt-3 max-w-2xl text-sm sm:text-base text-muted-foreground">
                Official answers regarding platform mission, event hosting, corporate sponsorships, builder registration, and community guidelines.
              </p>
            </Reveal>

            <div className="mt-10 sm:mt-12 mx-auto max-w-4xl space-y-4">
              {faqs.map((faq, idx) => {
                const isOpen = openFaq === idx;
                const FaqIcon = faq.icon;
                return (
                  <Reveal key={faq.q} delay={idx * 40}>
                    <div
                      className={`overflow-hidden rounded-2xl border transition-all duration-300 ${
                        isOpen
                          ? "border-neon/50 bg-surface shadow-glow-soft"
                          : "border-border/80 bg-surface/60 hover:border-border hover:bg-surface/80"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="flex w-full items-start justify-between gap-4 p-5 sm:p-6 text-left transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-neon"
                        aria-expanded={isOpen}
                      >
                        <div className="flex items-start gap-3.5 sm:gap-4">
                          <div className={`mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl border transition-colors ${
                            isOpen
                              ? "border-neon bg-neon text-black"
                              : "border-neon/30 bg-neon/10 text-neon"
                          }`}>
                            <FaqIcon className="size-5" />
                          </div>
                          <div>
                            <span className="inline-block rounded-md border border-neon/20 bg-neon/5 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-neon">
                              {faq.badge}
                            </span>
                            <h3 className="mt-1.5 text-base sm:text-lg font-bold text-foreground">
                              {faq.q}
                            </h3>
                          </div>
                        </div>

                        <div className="mt-1 shrink-0 grid size-8 place-items-center rounded-lg border border-border/80 bg-surface-2 text-muted-foreground transition-transform duration-200">
                          {isOpen ? <ChevronUp className="size-4 text-neon" /> : <ChevronDown className="size-4" />}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-border/40 px-5 pb-6 pt-4 sm:px-6 sm:pb-6">
                          <div className="space-y-3 text-sm sm:text-base leading-relaxed text-muted-foreground">
                            {faq.a.map((paragraph, pIdx) => (
                              <p key={pIdx}>{paragraph}</p>
                            ))}
                          </div>

                          {faq.action && (
                            <div className="mt-5 flex items-center gap-3 pt-2">
                              {faq.action.external ? (
                                <a
                                  href={faq.action.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 rounded-xl bg-neon px-4 py-2 text-xs sm:text-sm font-bold text-black transition hover:bg-neon/90"
                                >
                                  {faq.action.label}
                                  <ExternalLink className="size-3.5" />
                                </a>
                              ) : (
                                <Link
                                  to={faq.action.href}
                                  className="inline-flex items-center gap-2 rounded-xl bg-neon px-4 py-2 text-xs sm:text-sm font-bold text-black transition hover:bg-neon/90"
                                >
                                  {faq.action.label}
                                  <ArrowRight className="size-3.5" />
                                </Link>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Quick Contact Micro-Card */}
            <div className="mt-8 mx-auto max-w-4xl rounded-2xl border border-border/60 bg-surface/40 p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div className="flex items-center gap-3">
                <div className="grid size-10 place-items-center rounded-xl bg-neon/10 text-neon border border-neon/20">
                  <Mail className="size-5" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Need instant coordination?
                  </div>
                  <div className="text-sm font-bold text-foreground">
                    Direct Email: <a href="mailto:vybedriven@gmail.com" className="text-neon hover:underline">vybedriven@gmail.com</a>
                  </div>
                </div>
              </div>
              <Link
                to="/contact"
                className="shrink-0 rounded-xl border border-neon/30 bg-surface-2 px-3.5 py-1.5 text-xs font-bold text-foreground hover:border-neon hover:text-neon transition"
              >
                Send Message →
              </Link>
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="mx-auto max-w-[1200px] px-4 sm:px-6 py-12 sm:py-16">
          <Reveal>
            <div className="rounded-3xl border border-neon/30 bg-surface-3 p-8 sm:p-12 text-center shadow-glow-soft">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Want to partner or bring Vybe Driven to your campus?
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm sm:text-base text-muted-foreground">
                We work closely with colleges, student councils, and developer communities to power high-impact hackathons.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <PrimaryBtn href="/contact">Get in Touch With Us <ArrowRight className="size-4" /></PrimaryBtn>
                <GhostBtn href="/hackathons">Browse Active Hackathons</GhostBtn>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <Footer />
    </div>
  );
}

