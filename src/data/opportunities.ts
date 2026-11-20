import inspirePoster from "@/assets/inspire-colloquium.png.asset.json";
import iplPoster from "@/assets/events/ipl-innovation-pitch-league-2026.jpeg.asset.json";
import elevatePoster from "@/assets/events/elevate-1-0-2026.png.asset.json";
import hackInHillsPoster from "@/assets/events/hack-in-hills-2026.jpeg.asset.json";
import vecnaVersePoster from "@/assets/events/vecna-verse-2026.jpeg.asset.json";
import unicornSummitPoster from "@/assets/events/unicorn-ai-gpu-pre-summit.png.asset.json";
import structuringAiPoster from "@/assets/events/structuring-the-ai-way.png.asset.json";
import aiAtWorkPoster from "@/assets/events/ai-at-work.png.asset.json";
import enterpriseAiSummitPoster from "@/assets/events/enterprise-ai-summit-mumbai-2026.png.asset.json";
import clinicalAiPoster from "@/assets/events/clinical-ai-summit-2026.png.asset.json";
import durableDevOpsPoster from "@/assets/events/durable-devops-tech-meetup.png.asset.json";
import allInOnePoster from "@/assets/events/allin1place-ai-human-touch.png.asset.json";

export type OpportunityType = "Hackathon" | "Competition" | "Meetup" | "Conference" | "Networking";

export type OpportunityPerk = {
  icon?: "gift" | "rocket" | "laptop" | "coffee" | "award" | "handshake" | "brain" | string;
  emoji?: string;
  title: string;
  description?: string;
};

export type OpportunityScheduleStage = {
  title: string;
  stageBadge?: string;
  date: string;
  dateBadge?: string;
  description: string;
  bullets?: string[];
  evaluation?: string;
  actionUrl?: string;
  actionLabel?: string;
};

export type OpportunityImportantDate = {
  day: string;
  month: string;
  fullDate: string;
  title: string;
};

export type OpportunityReward = {
  amount?: string;
  amountSub?: string;
  title: string;
  description?: string;
  badge?: string;
  type?: "cash" | "certificate" | "perk";
};

export type Opportunity = {
  slug: string;
  title: string;
  type: OpportunityType;
  tag: string;
  description: string;
  date: string;
  location: string;
  format: "Online" | "In person" | "Hybrid";
  prize?: string;
  perks?: OpportunityPerk[];
  image: string;
  imagePosition?: string;
  imageFit?: "cover" | "contain";
  organizer: string;
  registrationDeadline: string;
  eligibility: string;
  teamSize: string;
  fee: string;
  status: "Opening soon" | "Registration open" | "Approval required" | "Event full" | "Sold out" | "Past event";
  registrationUrl?: string;
  registrationLabel?: "Register now" | "Request to join" | "Join waitlist";
  registrationNote?: string;
  groupUrl?: string;
  groupLabel?: string;
  contacts?: { name: string; phone: string }[];
  relatedLinks?: { label: string; url: string }[];
  overview: string;
  schedule?: OpportunityScheduleStage[];
  importantDates?: OpportunityImportantDate[];
  rewardsSubtitle?: string;
  rewards?: OpportunityReward[];
  rewardsFootnote?: string;
};

export const opportunities: Opportunity[] = [
  {
    slug: "beyond-9to5-buildathon-mumbai-2026",
    title: "BEYOND 9TO5 — Buildathon (Mumbai Edition)",
    type: "Hackathon",
    tag: "8-Hour Offline Buildathon · Working Professionals",
    description: "Your 9TO5 Ends. Your Building Begins. An 8-hour offline buildathon at Paytm Office, Mumbai for working professionals, engineers, and founders to turn ideas into working prototypes.",
    date: "Nov 22, 2026 · 10:00 AM – 6:00 PM IST",
    location: "Paytm Office, Mumbai (Vile Parle)",
    format: "In person",
    prize: "Showcases, Mentorship & Partner Perks",
    image: "/events/beyond-9to5-mumbai.jpg",
    imageFit: "contain",
    organizer: "Vybe Driven × EtriqAI × Paytm AI",
    registrationDeadline: "Nov 21, 2026 · 11:59 PM IST",
    eligibility: "Working professionals, developers, engineers, founders & technology enthusiasts",
    teamSize: "Solo or 1–4 Members",
    fee: "Free (Approval Required)",
    status: "Registration open",
    registrationUrl: "https://luma.com/ikcmraz8?utm_source=vybedriven&utm_medium=community&utm_campaign=beyond9to5_mumbai",
    registrationLabel: "Request to Join",
    registrationNote: "Participation is application-based and strictly limited to 150 selected participants. Applications are reviewed on a rolling basis.",
    groupUrl: "https://chat.whatsapp.com/B55qEAoXwRWJIzqMivTsZk?s=cl&p=a&mlu=4&ilr=4&utm_source=luma",
    groupLabel: "Join Official WhatsApp Group",
    contacts: [
      { name: "Vybe Driven Support", phone: "+91 80979 26578" },
      { name: "Mumbai Tech Community", phone: "hello@vybedriven.in" },
    ],
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/ikcmraz8?utm_source=vybedriven&utm_medium=community&utm_campaign=beyond9to5_mumbai" },
      { label: "Paytm Office Venue (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=19.1073081%2C72.85295780000001&query_place_id=ChIJZ-9pOgDJ5zsRcaixJ14BC2o" },
      { label: "WhatsApp Announcements", url: "https://chat.whatsapp.com/B55qEAoXwRWJIzqMivTsZk?s=cl&p=a&mlu=4&ilr=4&utm_source=luma" },
    ],
    perks: [
      {
        icon: "rocket",
        emoji: "⚡",
        title: "8 Hours of High-Energy Building",
        description: "Intense, focused sprint solving real-world problem statements shared directly by organizers.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Expert Mentorship & Guidance",
        description: "Hands-on guidance and code architecture reviews from experienced builders and tech leads.",
      },
      {
        icon: "award",
        emoji: "🏆",
        title: "Live Prototype Demos & Judging",
        description: "Present working prototypes to industry judges, founders, and peer builders.",
      },
      {
        icon: "coffee",
        emoji: "🏢",
        title: "Paytm Office Experience & Networking",
        description: "In-person building at Paytm Office, Mumbai alongside 150 curated developers and founders.",
      },
    ],
    overview: `### Your 9TO5 Ends. Your Building Begins.

What if your best ideas started after work? **BEYOND 9TO5** is an 8-hour offline buildathon designed specifically for working professionals, engineers, product builders, founders, and technology enthusiasts who want to step beyond their day jobs, solve real-world problems, and turn innovative ideas into functional prototypes.

Bring your skills, collaborate with fellow builders, and transform ideas into practical solutions.

---

### What to Expect
- **8 Hours of Focused Building**: Rapid prototyping and collaborative execution in a fast-paced environment.
- **Real-World Problem Statements**: Handcrafted problem statements shared on the event morning.
- **Hands-On Mentorship**: Direct guidance from seasoned tech leads, engineers, and entrepreneurs.
- **Functional Prototypes & Demos**: Showcase what you built to the entire room and get instant expert feedback.
- **High-Impact Networking**: Connect with 150 selected builders across Mumbai's thriving tech ecosystem.

---

### Key Information & Venue
- **Date**: Sunday, 22 November 2026 (10:00 AM – 6:00 PM IST)
- **Venue**: Paytm Office — Viacom Building, Tukaram Sandam Marg, Navpada, Netaji Subhash Nagar, Vile Parle, Mumbai, Maharashtra 400057, India.
- **Team Size**: Solo or 1–4 members per team.
- **Capacity**: Strictly limited to 150 selected participants.
- **Format**: 100% Offline Buildathon.

---

### Partners
- **Platform Partner**: Vybe Driven (vybedriven.in)
- **Ecosystem Partners**: EtriqAI, Paytm AI
- **Community Partners**: Oriane, Tavily, Nexconn, Mumbai Tech Community

---

### Selection & Approval Process
Participation is application-based and limited to 150 selected participants. Submitting an application does not guarantee selection. Shortlisted participants will receive approval confirmation and further instructions via email and WhatsApp.`,
    schedule: [
      {
        title: "Check-in & Opening Address",
        dateBadge: "10:00 AM",
        date: "22 Nov 2026 · 10:00 AM – 10:30 AM",
        description: "Arrival at Paytm Office Mumbai, attendee verification, and welcome keynote.",
      },
      {
        title: "Problem Statements Reveal & Team Formation",
        dateBadge: "10:30 AM",
        date: "22 Nov 2026 · 10:30 AM – 11:00 AM",
        description: "Official announcement of problem tracks, rules, and finalizing squad rosters.",
      },
      {
        title: "8-Hour Build Sprint & Checkpoint Mentoring",
        dateBadge: "11:00 AM",
        date: "22 Nov 2026 · 11:00 AM – 4:30 PM",
        description: "Intense prototyping, development sprints, and architecture feedback from mentors.",
      },
      {
        title: "Project Submission & Code Freeze",
        dateBadge: "4:30 PM",
        date: "22 Nov 2026 · 04:30 PM",
        description: "Final submission of working code repositories, live demo links, and presentation decks.",
      },
      {
        title: "Live Showcases, Judging & Awards",
        dateBadge: "5:00 PM",
        date: "22 Nov 2026 · 5:00 PM – 6:00 PM",
        description: "Finalists demo their prototypes to jury members, followed by announcements and networking.",
      },
    ],
    rewards: [
      {
        title: "Top Prototype Winner Accolades",
        description: "Top-rated prototypes receive official awards, ecosystem recognition, and media spotlights.",
        badge: "Winner",
        type: "certificate",
      },
      {
        title: "Partner Tool Credits & Perks",
        description: "Exclusive API credits, platform access, and perks supported by ecosystem partners.",
        badge: "Perks",
        type: "perk",
      },
      {
        title: "Certificate of Participation",
        description: "Official certificate released for all attending builders who build and ship at the event.",
        badge: "Certificate",
        type: "certificate",
      },
    ],
  },

  {
    slug: "beyond-9to5-buildathon-bengaluru-2026",
    title: "BEYOND 9TO5 — Buildathon (Bengaluru Edition)",
    type: "Hackathon",
    tag: "8-Hour Offline Buildathon · Working Professionals",
    description: "Your 9TO5 Ends. Your Building Begins. An 8-hour offline buildathon at Paytm Office, Bengaluru for working professionals, developers, AI/ML practitioners, and founders.",
    date: "Nov 21, 2026 · 10:00 AM – 6:00 PM IST",
    location: "Paytm Office, Bengaluru (J. P. Nagar)",
    format: "In person",
    prize: "Showcases, Mentorship & Partner Perks",
    image: "/events/beyond-9to5-bengaluru.jpg",
    imageFit: "contain",
    organizer: "Vybe Driven × EtriqAI × Paytm AI",
    registrationDeadline: "Nov 20, 2026 · 11:59 PM IST",
    eligibility: "Working professionals, developers, software engineers, AI/ML practitioners, Web3 builders, cybersecurity professionals, quantum enthusiasts & founders",
    teamSize: "Solo or 1–4 Members",
    fee: "Free (Approval Required)",
    status: "Registration open",
    registrationUrl: "https://luma.com/sfljztb7?utm_source=vybedriven&utm_medium=community&utm_campaign=beyond9to5_bengaluru",
    registrationLabel: "Request to Join",
    registrationNote: "Participation is application-based and limited to 150–200 selected participants. Applications are reviewed on a rolling basis.",
    groupUrl: "https://chat.whatsapp.com/GqDy72gqOIUAjcbQdTFTP4?s=cl&p=a&mlu=4&ilr=4&utm_source=luma",
    groupLabel: "Join Official WhatsApp Group",
    contacts: [
      { name: "Vybe Driven Desk", phone: "+91 80979 26578" },
      { name: "India Tech Community", phone: "hello@vybedriven.in" },
    ],
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/sfljztb7?utm_source=vybedriven&utm_medium=community&utm_campaign=beyond9to5_bengaluru" },
      { label: "Paytm Office Venue (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=12.916787%2C77.5790099&query_place_id=ChIJwxiOJgAVrjsRzCmUmq72y8U" },
      { label: "WhatsApp Announcements", url: "https://chat.whatsapp.com/GqDy72gqOIUAjcbQdTFTP4?s=cl&p=a&mlu=4&ilr=4&utm_source=luma" },
    ],
    perks: [
      {
        icon: "rocket",
        emoji: "⚡",
        title: "8 Hours of Focused Building",
        description: "Turn your ideas into functional working prototypes in a fast-paced, high-energy environment.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Mentorship & Guidance",
        description: "Direct guidance and technical reviews from experienced builders and engineering leaders.",
      },
      {
        icon: "award",
        emoji: "🏆",
        title: "Expert Judging & Demos",
        description: "Demonstrate your working MVP in front of industry experts, founders, and peer builders.",
      },
      {
        icon: "coffee",
        emoji: "🏢",
        title: "Paytm Office Experience & Networking",
        description: "Collaborate in-person at Paytm Office Bengaluru alongside 150–200 curated tech professionals.",
      },
    ],
    overview: `### Your 9TO5 Ends. Your Building Begins.

What if your best ideas started after work? **BEYOND 9TO5** is an 8-hour offline buildathon designed for working professionals who want to step beyond their daily roles, explore new possibilities, and turn ideas into working prototypes.

Whether you're a developer, software engineer, AI/ML practitioner, Web3 builder, cybersecurity professional, quantum enthusiast, or founder — bring your skills, collaborate with fellow builders, and build something that matters.

---

### What to Expect
- **8 Hours of Focused Building**: Rapid prototyping, technical innovation, and practical problem-solving.
- **Prototypes Over Slides**: An environment focused on shipping working code and functional MVPs.
- **Freedom to Build**: Participate solo or collaborate with a team of up to 4 members.
- **Experienced Mentorship**: Mentorship and architecture feedback from seasoned builders.
- **Expert Judging & Showcases**: Present your project to an esteemed jury and ecosystem leaders.
- **High-Impact Networking**: Connect with 150–200 top tech professionals across Bengaluru.

---

### Key Information & Venue
- **Date**: Saturday, 21 November 2026 (10:00 AM – 6:00 PM IST)
- **Venue**: Paytm Office (keralam) — WH8H+PJ6, CR Layout, 1st Phase, J. P. Nagar, Bengaluru, Karnataka 560078, India.
- **Team Size**: Solo or 1–4 members per team.
- **Capacity**: Strictly 150–200 selected participants.
- **Format**: 100% Offline Buildathon.

---

### Partners
- **Platform Partner**: Vybe Driven (vybedriven.in)
- **Ecosystem Partners**: EtriqAI, Paytm AI
- **Community Partners**: Oriane, Tavily, Nexconn, India Tech Community

---

### Selection & Approval Process
Participation is application-based and limited to 150–200 selected participants. Submitting an application does not guarantee selection. Shortlisted participants will receive approval confirmation and further instructions via email and WhatsApp.`,
    schedule: [
      {
        title: "Check-in & Opening Address",
        dateBadge: "10:00 AM",
        date: "21 Nov 2026 · 10:00 AM – 10:30 AM",
        description: "Arrival at Paytm Office Bengaluru, attendee verification, and opening remarks.",
      },
      {
        title: "Problem Statements Reveal & Team Formation",
        dateBadge: "10:30 AM",
        date: "21 Nov 2026 · 10:30 AM – 11:00 AM",
        description: "Official announcement of problem tracks, rules, and finalizing squad rosters.",
      },
      {
        title: "8-Hour Build Sprint & Checkpoint Mentoring",
        dateBadge: "11:00 AM",
        date: "21 Nov 2026 · 11:00 AM – 4:30 PM",
        description: "Intense prototyping, development sprints, and architecture feedback from mentors.",
      },
      {
        title: "Project Submission & Code Freeze",
        dateBadge: "4:30 PM",
        date: "21 Nov 2026 · 04:30 PM",
        description: "Final submission of working code repositories, live demo links, and presentation decks.",
      },
      {
        title: "Live Showcases, Judging & Awards",
        dateBadge: "5:00 PM",
        date: "21 Nov 2026 · 5:00 PM – 6:00 PM",
        description: "Finalists demo their prototypes to jury members, followed by announcements and networking.",
      },
    ],
    rewards: [
      {
        title: "Top Prototype Winner Accolades",
        description: "Top-rated prototypes receive official awards, ecosystem recognition, and media spotlights.",
        badge: "Winner",
        type: "certificate",
      },
      {
        title: "Partner Tool Credits & Perks",
        description: "Exclusive API credits, platform access, and perks supported by ecosystem partners.",
        badge: "Perks",
        type: "perk",
      },
      {
        title: "Certificate of Participation",
        description: "Official certificate released for all attending builders who build and ship at the event.",
        badge: "Certificate",
        type: "certificate",
      },
    ],
  },

  {
    slug: "quasar-5-international-hackathon-2027",
    title: "Quasar 5.0: 36-Hour International Hackathon",
    type: "Hackathon",
    tag: "36-Hour Offline International Hackathon · Sion, Mumbai",
    description: "Flagship 36-hour offline hackathon by Vasantdada Patil Pratishthan's College of Engineering and Visual Arts (PVPPCOE), Sion Mumbai. Turn bold ideas into prototypes and compete for ₹1,50,000 cash prizes.",
    date: "Jan 23, 2027, 8:00 AM – Jan 24, 2027, 11:59 PM IST",
    location: "Vasantdada Patil Pratishthan's College of Engineering, Sion, Mumbai, Maharashtra 400022",
    format: "In person",
    prize: "₹1,50,000 Cash",
    perks: [
      {
        icon: "gift",
        emoji: "💰",
        title: "₹1,50,000 Cash Prize Pool",
        description: "5 dedicated Problem Statement tracks with ₹30,000 cash prize per track awarded via cheque within 1 day.",
      },
      {
        icon: "award",
        emoji: "📜",
        title: "Official Certificates",
        description: "Verified certificates of merit for winners and official participation certificates for all attending teams.",
      },
      {
        icon: "rocket",
        emoji: "⚡",
        title: "36-Hour Offline Sprint",
        description: "Intense 36 hours of non-stop offline building, technical mentorship, food, and high-energy developer environment.",
      },
      {
        icon: "brain",
        emoji: "🎯",
        title: "5 Challenging Problem Statements",
        description: "Work on real-world engineering challenges across software, systems, automation, and emerging tech.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Co-Powered by Vybe Driven",
        description: "Official co-powering partner powering registrations, team rosters & builder discovery.",
      },
      {
        icon: "coffee",
        emoji: "🏛️",
        title: "PVPPCOE Sion Mumbai Campus",
        description: "Experience the vibrant campus of Vasantdada Patil Pratishthan's College of Engineering in central Mumbai.",
      },
    ],
    image: "/events/quasar-5-banner.jpg",
    imageFit: "contain",
    imagePosition: "center center",
    organizer: "PVPPCOE Mumbai · Powered by ATS & Unstop · Co-Powered by Vybe Driven",
    organizerEmail: "quasar@pvppcoe.ac.in",
    registrationDeadline: "Dec 21, 2026 · 11:59 PM IST",
    eligibility: "Inter-college and inter-organization teams across undergraduate, postgraduate, engineering & tech students nationwide",
    teamSize: "2–4 Members",
    fee: "Free",
    status: "Registration open",
    registrationNote: "Round 0 (PPT Submission) is open until 25 Dec 2026. Register on Vybe Driven to secure your team slot and submit your idea deck.",
    groupUrl: "https://chat.whatsapp.com/K3sHKGtXYJ06l02R2eLmVA",
    groupLabel: "Join Quasar WhatsApp Group",
    contacts: [
      { name: "Saish Gosavi (Organizer)", phone: "+91 91374 55278" },
      { name: "Shanmukh Tawde (Organizer)", phone: "+91 98201 12919" },
      { name: "Quasar Support Desk", phone: "quasar@pvppcoe.ac.in" },
    ],
    relatedLinks: [
      { label: "Official Quasar Portal", url: "https://quasar-vppcoe.vercel.app" },
      { label: "Problem Statements & Tracks", url: "https://quasar-vppcoe.vercel.app/#tracks" },
      { label: "Instagram @quasar_vppcoe", url: "https://www.instagram.com/quasar_vppcoe" },
    ],
    overview: `Quasar 5.0 is the flagship 36-hour offline international hackathon organized by Vasantdada Patil Pratishthan’s College of Engineering and Visual Arts (PVPPCOE), Sion Mumbai, scheduled for 23–24 January 2027.

This 36-hour hackathon provides a dynamic platform for students, developers, designers, and innovators to collaborate, think creatively, and develop technology-driven solutions to real-world challenges.

The event encourages innovation, teamwork, technical excellence, and entrepreneurial thinking while enabling participants to showcase their skills and compete for a prize pool of ₹1,50,000.

Key Highlights:
• Duration: 36 hours offline hackathon
• Dates: 23–24 January 2027
• Venue: Vasantdada Patil Pratishthan's College of Engineering and Visual Arts, Sion, Mumbai
• Registration Fee: Completely free
• Prize Pool: ₹1,50,000 Cash (₹30,000 Cash x 5 Problem Statements via Cheque)
• Eligibility: Inter-college and inter-organization teams (2–4 members)
• Evaluation: Two-stage review (Online PPT Submission & Shortlist Presentation, followed by 36-hour Offline Finale)`,
    schedule: [
      {
        title: "Round 0 : PPT Submission Round",
        stageBadge: "Round 0",
        dateBadge: "Dec 1",
        date: "01 Dec 26, 12:00 AM IST → 25 Dec 26, 11:59 PM IST",
        description:
          "In the first round of Quasar 5.0, participants are required to submit a PowerPoint presentation outlining their proposed solutions & approaches to given problem statements.",
        actionUrl: "https://quasar-vppcoe.vercel.app/#tracks",
        actionLabel: "▶︎ Quasar_Problem Statements ◀︎",
        bullets: [
          "This submission must outline the identified problem, the innovative solution, and the expected impact.",
          "It should include a brief introduction of team members, an overview of beneficiaries & a summary of progress.",
          "This round is crucial for teams to demonstrate their understanding of the problem and showcase creativity and technical skills for advancement.",
        ],
        evaluation: "Problem understanding, engineering approach, innovation, feasibility, and impact.",
      },
      {
        title: "Round 1: Online PPT Presentation",
        stageBadge: "Round 1",
        dateBadge: "Dec 21",
        date: "21 Dec 26, 12:00 AM IST → 30 Dec 26, 11:59 PM IST",
        description:
          "Round 1 of Quasar 5.0 involves an online PowerPoint presentation in which participating teams must showcase their proposed solutions to the selected problem statements.",
        bullets: [
          "Presentations should highlight the relevance and impact of the proposed solution, along with its engineering approach, technical feasibility, and technologies involved.",
          "Following submission, shortlisted teams will present their PPTs during live online evaluation sessions (5 minutes allocated per presentation).",
          "Teams must effectively communicate their problem understanding, innovative approach, implementation strategy, and expected outcomes.",
          "Crucial round for selecting teams to advance to the offline hackathon scheduled for 23–24 January 2027.",
          "Invitations and instructions regarding PPT submissions and online evaluation will be communicated to participants via email.",
        ],
        evaluation: "5-minute live technical pitch, architecture feasibility, implementation roadmap, and jury Q&A.",
      },
      {
        title: "Final Offline Round : 36 Hour Hackathon",
        stageBadge: "Final Round",
        dateBadge: "Jan 23",
        date: "23 Jan 27, 08:00 AM IST → 24 Jan 27, 11:59 PM IST",
        description:
          "During this round, participating teams present solutions to judges for evaluation and receive valuable feedback for improvement, refining outcomes during the non-stop 36-hour hackathon.",
        bullets: [
          "Teams will have the opportunity to refine and enhance their solutions during the 36-hour hackathon, incorporating jury feedback to develop more effective, innovative, and practical outcomes.",
          "Emphasizes adaptability, creativity, technical expertise, and real-time problem-solving.",
          "Teams will be evaluated on their ability to implement improvements, strengthen their solutions, and demonstrate innovation in addressing the given problem statements.",
          "The final evaluation will play a crucial role in determining the winners of Quasar 5.0.",
        ],
        evaluation: "Working prototype, code quality, technical execution, user experience, and final presentation.",
      },
    ],
    importantDates: [
      {
        day: "21",
        month: "Dec",
        fullDate: "21 Dec 26, 11:59 PM IST",
        title: "Registration Deadline",
      },
      {
        day: "23",
        month: "Oct",
        fullDate: "23 Oct 26, 12:00 AM IST",
        title: "Registrations Start",
      },
      {
        day: "1",
        month: "Nov",
        fullDate: "01 Nov 26, 12:00 AM IST",
        title: "Revealing the Problem Statement",
      },
      {
        day: "1",
        month: "Dec",
        fullDate: "01 Dec 26, 12:00 AM IST",
        title: "PPT Submission Round (Via UnStop) Starts",
      },
      {
        day: "21",
        month: "Dec",
        fullDate: "21 Dec 26, 12:00 AM IST",
        title: "Round 1: PPT Presentations Start",
      },
      {
        day: "25",
        month: "Dec",
        fullDate: "25 Dec 26, 11:59 PM IST",
        title: "PPT Submission Round End",
      },
      {
        day: "2",
        month: "Jan",
        fullDate: "02 Jan 27, 12:00 AM IST",
        title: "Round 1 Result Declaration",
      },
      {
        day: "23",
        month: "Jan",
        fullDate: "23 Jan 27, 08:00 AM IST",
        title: "Final Round : 36 Hour Hackathon",
      },
    ],
    rewardsSubtitle: "Quasar 5.0 features a ₹1,50,000 prize pool, awarded to winning teams via cheque.",
    rewards: [
      {
        amount: "₹30,000",
        amountSub: "CASH",
        title: "Problem Statement 1",
        description: "Winner of Problem Statement 1 – Quasar 5.0",
        badge: "Certificate",
        type: "cash",
      },
      {
        amount: "₹30,000",
        amountSub: "CASH",
        title: "Problem Statement 2",
        description: "Winner of Problem Statement 2 – Quasar 5.0",
        badge: "Certificate",
        type: "cash",
      },
      {
        amount: "₹30,000",
        amountSub: "CASH",
        title: "Problem Statement 3",
        description: "Winner of Problem Statement 3 – Quasar 5.0",
        badge: "Certificate",
        type: "cash",
      },
      {
        amount: "₹30,000",
        amountSub: "CASH",
        title: "Problem Statement 4",
        description: "Winner of Problem Statement 4 – Quasar 5.0",
        badge: "Certificate",
        type: "cash",
      },
      {
        amount: "₹30,000",
        amountSub: "CASH",
        title: "Problem Statement 5",
        description: "Winner of Problem Statement 5 – Quasar 5.0",
        badge: "Certificate",
        type: "cash",
      },
    ],
    rewardsFootnote: "* All the prizes and certificate will be released within 1 days after the event is over",
  },

  {
    slug: "goa-buildathon-2027",
    title: "Goa Buildathon '27",
    type: "Hackathon",
    tag: "36-Hour Offline Hackathon · AI & Emerging Tech",
    description: "36-hour offline hackathon in Goa, India bringing together developers, designers, AI builders and innovators to turn ideas into reality. ₹10,00,000 worth prize pool.",
    date: "To be announced (TBA) · 36 Hours Offline",
    location: "Goa, India (South Goa)",
    format: "In person",
    prize: "₹10,00,000 Worth",
    perks: [
      {
        icon: "gift",
        emoji: "💰",
        title: "₹10,00,000 Worth Prize Pool",
        description: "Targeting an overall prize pool of ₹10,00,000 for top winning teams and category champions.",
      },
      {
        icon: "award",
        emoji: "📜",
        title: "Participation Certificate",
        description: "Official certificate of participation released for all attending builders and teams.",
      },
      {
        icon: "rocket",
        emoji: "⚡",
        title: "36-Hour Offline Hackathon",
        description: "36 hours of non-stop offline building in Goa with developer mentors, food, and high energy.",
      },
      {
        icon: "brain",
        emoji: "🤖",
        title: "AI Agents & Emerging Tech",
        description: "Hands-on tracks for AI agents, web apps, automation workflows, data science, and hardware.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Platform Partner: Vybe Driven",
        description: "Official technology and platform partner support powering discovery across India.",
      },
      {
        icon: "coffee",
        emoji: "🌴",
        title: "Goa Builder Community",
        description: "Connect with mentors, judges, founders, and cross-college tech communities in Goa.",
      },
    ],
    image: "/events/goa-buildathon-2027.jpg",
    imageFit: "contain",
    imagePosition: "center center",
    organizer: "Goa Buildathon · Vybe Driven (Platform & Technology Partner)",
    organizerEmail: "hello@goabuilds.com",
    registrationDeadline: "Dec 31, 2026 · 12:59 PM IST",
    eligibility: "Students, aspiring developers, designers, AI builders and technology enthusiasts across all colleges",
    teamSize: "2–4 Members",
    fee: "Free",
    status: "Registration open",
    registrationNote: "Idea Submission (PPT Round) deadline is 31 Dec 2026. Register on Vybe Driven to secure your official team slot.",
    groupUrl: "https://chat.whatsapp.com/HXLGLzUJ6G2Hr1FL8RE7yW",
    groupLabel: "Join WhatsApp Community",
    contacts: [
      { name: "Goa Buildathon Desk", phone: "hello@goabuilds.com" },
      { name: "Vybe Driven Support", phone: "vybedriven@gmail.com" },
    ],
    relatedLinks: [
      { label: "Official Website (goabuilds.com)", url: "https://goabuilds.com/" },
      { label: "Instagram @goabuildathon27", url: "https://www.instagram.com/goabuildathon27" },
    ],
    overview: `GOA BUILDATHON ’27 is a 36-hour offline hackathon planned for January 2027 in Goa, India. It aims to bring together developers, designers, AI enthusiasts, problem-solvers and innovators from colleges and communities to turn ideas into working solutions.

This is where ideas move beyond discussions and become prototypes. Whether you're exploring AI agents, developing web applications, automating everyday workflows or experimenting with emerging technologies, GOA BUILDATHON ’27 is designed to give you the space to build, collaborate and challenge yourself.

Our vision is to create an environment where students can experiment with new technologies, solve meaningful problems, learn from experienced builders and connect with people who share the same passion for creating.

Not just another hackathon. A place to turn ideas into reality.

What To Expect:
• 36 hours of offline building in Goa
• Collaboration with developers, designers and innovators
• Hands-on experimentation with AI, AI agents and automation
• Web development, software engineering and emerging technology
• Teamwork, rapid prototyping and practical problem-solving
• Opportunities to connect with mentors, judges and technology communities
• Project showcases and opportunities to present your ideas
• Community partnerships and potential sponsor-led challenges
• An environment focused on learning, creativity and building real solutions

Who Can Participate?:
GOA BUILDATHON ’27 welcomes students, aspiring developers, designers, AI builders and technology enthusiasts who want to learn by building. Whether you're an experienced hackathon participant or attending your first hackathon, the focus is on curiosity, collaboration and the willingness to create something meaningful. Bring your skills, find teammates, explore unfamiliar technologies and turn your ideas into something people can experience.

What Can You Build?:
• Artificial Intelligence & AI Agents: Build intelligent assistants, agentic workflows and practical AI-powered applications.
• Web Development: Create websites, platforms and full-stack applications that address real problems.
• Automation: Develop tools that reduce repetitive work and improve everyday processes.
• Data Science & Analytics: Turn data into insights, useful tools and better decisions.
• Software & Developer Tools: Build products that improve workflows, productivity and collaboration.
• Electronics & Emerging Technology: Explore innovative solutions that connect software with the physical world.

The goal is not simply to present an idea, but to make meaningful progress towards a working solution within the hackathon.

Why Goa?:
Goa offers a distinctive setting for bringing people together to learn, collaborate and create. GOA BUILDATHON ’27 aims to combine the energy of a technology-building event with a community-driven experience where new connections and ideas can grow. We want participants to leave with more than a project: new skills, valuable connections, practical experience and the confidence to keep building.

Official Channels & Contact:
• Website: https://goabuilds.com/
• Email: hello@goabuilds.com
• WhatsApp Community: Exclusively unlocked for registered teams
• Instagram: https://www.instagram.com/goabuildathon27
• Platform & Technology Partner: Vybe Driven (vybedriven.in)

Be Part Of The Build:
We're bringing together people who don't just want to talk about ideas — they want to build them. Build > Collaborate > Create real impact. Let's build something that matters.`,
    schedule: [
      {
        title: "Idea Submission — PPT Round",
        dateBadge: "Nov 2",
        date: "02 Nov 26, 10:20 PM IST → 31 Dec 26, 12:59 PM IST",
        description: "Participants submit a PPT explaining their proposed solution to a real-world problem. PPT should include:",
        bullets: [
          "Problem statement",
          "Proposed solution",
          "Innovation and uniqueness",
          "Target users and expected impact",
          "Proposed technology stack",
          "Implementation plan",
        ],
        evaluation: "Innovation, feasibility, relevance, impact and technical approach.",
      },
      {
        title: "36-Hour Hackathon — Grand Finale",
        dateBadge: "TBA",
        date: "Dates to be announced (TBA) · In-Person in Goa",
        description: "Shortlisted teams build a working prototype, collaborate with other developers and present their projects to the judging panel live in Goa.",
      },
    ],
    rewards: [
      {
        amount: "₹10,00,000",
        amountSub: "WORTH",
        title: "Overall Prize Pool",
        description: "GOA BUILDATHON '27 is targeting a total prize pool of ₹10,00,000. The final prize distribution and rewards will be announced once confirmed. Stay tuned for updates.",
        badge: "Certificate",
        type: "cash",
      },
      {
        title: "Participation Certificate",
        description: "Official certificate of participation released for all attending builders and teams.",
        badge: "Certificate",
        type: "certificate",
      },
    ],
    rewardsFootnote: "* All the prizes and certificate will be released within 30 days after the event is over",
  },

  {
    slug: "luminar-creators-award-2027",
    title: "Luminar Creators Award 2027",
    type: "Competition",
    tag: "Micro-Creators · Brand Deals & Awards",
    description: "Barter deals se aage badhne ka time aa gaya hai! India ke 1K–10K micro-creators ke liye 24 paid brand collabs, ₹5K cash, official trophy & red carpet Grand Finale.",
    date: "Jan 8, 2027 · Doors open 05:00 PM IST",
    location: "Lata Mangeshkar Auditorium, Mira Road, Mumbai",
    format: "In person",
    prize: "₹5,000 Cash + 24 Paid Collabs + PR",
    perks: [
      {
        icon: "handshake",
        emoji: "🤝",
        title: "1-Year Agency Subscription",
        description: "Direct Registration Benefit: Saal ke 24 PAID brand collaborations across the year.",
      },
      {
        icon: "rocket",
        emoji: "🚀",
        title: "3 Included Brand Collabs",
        description: "Website pe register hote hi 3 brand collabs milenge, jinke video engagement se Top 100 shortlist honge.",
      },
      {
        icon: "award",
        emoji: "🏆",
        title: "Official Trophy & Certificate",
        description: "Handcrafted 24k champagne gold Luminar statuette & official Certificate of Merit for Top 100 creators.",
      },
      {
        icon: "gift",
        emoji: "💰",
        title: "₹5,000 Cash Prize",
        description: "Guaranteed ₹5,000 cash reward for each of the Top 100 shortlisted creators.",
      },
      {
        icon: "brain",
        emoji: "📰",
        title: "50+ Digital Media & 15+ Billboards",
        description: "50+ digital news & media PR coverage plus photos featured on 15+ prominent digital billboard screens.",
      },
      {
        icon: "laptop",
        emoji: "🎟️",
        title: "Red Carpet Zone + Guest Pass",
        description: "Mumbai Grand Finale mein Red Carpet Zone entry with 1 complimentary guest pass.",
      },
    ],
    image: "/events/luminar-creators-award-2027.jpg",
    imageFit: "contain",
    imagePosition: "center center",
    organizer: "Luminar Creators Award · Powered by Casheco · Vybe Driven (Platform Partner)",
    registrationDeadline: "Dec 30, 2026",
    eligibility: "India's 1K–10K micro-creators, digital influencers & content creators across all genres",
    teamSize: "Individual / Solo Creator",
    fee: "₹999 (Early Bird Offer)",
    status: "Registration open",
    registrationUrl: "https://luminarcreatorsaward.com",
    registrationNote: "Register now on the official Luminar Creators portal (Early Bird ₹999) to lock your nomination and agency benefits.",
    contacts: [
      { name: "Luminar Creators Support", phone: "+919820123456" },
      { name: "Casheco Creator Desk", phone: "+919820654321" },
    ],
    overview: `Barter deals se aage badhne ka time aa gaya hai!

Luminar Creators Award lekar aaya hai India ke 1K–10K micro-creators ke liye growth aur direct brand deals ka mauka.

1️⃣ Direct Registration Benefit:
✅ 1-Year Agency Subscription — Saal ke 24 PAID brand collaborations

2️⃣ Top 100 Selection Process:
Website pe register hote hi Luminar Creators Award team tumhein 3 brand collaborations degi. In brands ke saath collab videos banakar apne page pe post karni hain, aur in 3 videos ke engagement ke basis par Top 100 creators shortlist honge!

3️⃣ Top 100 Rewards:
💰 ₹5,000 Cash Prize
🏆 Official Trophy & Certificate of Merit
📰 50+ Digital Media Channels mein PR coverage
🌟 15+ Digital Billboard Screens pe photo feature
🎟️ Mumbai Grand Finale mein Red Carpet Zone Entry + 1 Guest Pass

🔗 Apply Kaise Karein:
Bio ke link pe click karo (luminarcreatorsaward.com), form fill karo aur apna slot lock karo!

#LuminarCreatorsAward #PaidCollabs #MicroInfluencerIndia #ContentCreatorIndia #CreatorEconomy #DesiCreators #MumbaiEvents #CreatorGrowth`,
    schedule: [
      {
        title: "Slot Booking & Agency Activation",
        date: "Open Now",
        description: "Register at luminarcreatorsaward.com (Early bird ₹999) to lock your spot and immediately activate your 1-Year Agency Subscription.",
      },
      {
        title: "3 Brand Collaborations & Content Creation",
        date: "Nov – Dec 2026",
        description: "Create and publish collaboration videos with 3 partner brands. Shortlisting is evaluated on genuine audience engagement.",
      },
      {
        title: "Top 100 Shortlist & Honor Roll",
        date: "Dec 28, 2026",
        description: "Top 100 creators announced. Awarded ₹5,000 cash prizes, media press releases, billboard features, and trophies.",
      },
      {
        title: "Mumbai Grand Finale & Red Carpet Gala",
        date: "Jan 8, 2027 · 05:00 PM IST",
        description: "Live black-tie ceremony at Lata Mangeshkar Auditorium, Mira Road, Mumbai with red carpet arrivals, VIP networking, and statuette felicitation.",
      },
    ],
  },
  {
    slug: "idea-competition-2026",
    title: "IDEA COMPETITION 2026",
    type: "Hackathon",
    tag: "Idea to Incubation · Startup Program",
    description: "Turn your idea into a potential startup with E-Cell CRCE. 4 impact tracks, expert mentorship, incubation handoff & ₹50K+ prizes.",
    date: "Oct 28, 2026 – Feb 6, 2027",
    location: "Fr. CRCE, Bandra, Mumbai · Hybrid",
    format: "Hybrid",
    prize: "₹50,000+",
    perks: [
      {
        icon: "rocket",
        emoji: "🚀",
        title: "Incubation Opportunities",
        description: "Direct incubation pathway and handoff for eligible finalists to launch and scale real startups.",
      },
      {
        icon: "laptop",
        emoji: "💻",
        title: "Interview Opportunities",
        description: "Exclusive interview and internship access for all eligible teams with partner companies.",
      },
      {
        icon: "brain",
        emoji: "🧠",
        title: "Expert Mentorship & Hands-on POC",
        description: "2–3 months of 1-on-1 guidance from founders and industry leaders to validate ideas and engineer functional prototypes.",
      },
      {
        icon: "award",
        emoji: "🪪",
        title: "Certificates on Clearing Each Round",
        description: "Official achievement certificates awarded on clearing each round, recognized by E-Cell CRCE & partners.",
      },
      {
        icon: "gift",
        emoji: "🎁",
        title: "Exciting Goodies & Perks",
        description: "Exclusive builder swag, digital perks, and goodies for participants.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Networking with Founders & Leaders",
        description: "Direct networking with successful founders, investors, and startup leaders at the Grand Finale.",
      },
      {
        icon: "coffee",
        emoji: "🍣",
        title: "Light Snacks & Beverages",
        description: "Complimentary refreshments and snacks provided during offline mentoring sessions and the Grand Finale.",
      },
    ],
    image: "/events/idea-competition-2026.webp",
    imageFit: "contain",
    imagePosition: "center center",
    organizer: "E-Cell CRCE · Union Bank of India · Vybe Driven",
    registrationDeadline: "Oct 28, 2026",
    eligibility: "Student innovators, developers, aspiring founders, and teams across all colleges and departments",
    teamSize: "1–4 members",
    fee: "Free",
    status: "Registration open",
    registrationUrl: "https://unstop.com/hackathons/idea-competition-2026-fr-conceicao-rodrigues-college-of-engineering-frcrce-bandra-1736048",
    contacts: [
      { name: "Atharva Jagtap", phone: "+917066935597" },
      { name: "Arnav Potale", phone: "+918830331242" },
    ],
    relatedLinks: [
      { label: "Official Exploration Portal", url: "https://ideacompetition.ecell-crce.in/explore" },
    ],
    overview: "IDEA COMPETITION 2026 is an idea-to-incubation startup program presented by E-Cell CRCE (Fr. Conceicao Rodrigues College of Engineering, Bandra) with Title Sponsor Union Bank of India, Platform Partner Vybe Driven, and Community Partner Mumbai Tech Week. Designed to bridge the gap between ideation and a real startup, the challenge features 4 core impact tracks: 1) Healthcare & Well-being, 2) Energy & Sustainability, 3) Education & Technology, and 4) Smart Cities & Urban Development. Top teams receive 2–3 months of intensive mentorship to build functional POCs, followed by an offline Grand Finale on 6th February 2027 at Fr. CRCE Bandra before venture founders and incubation partners. Over ₹50,000 in prize pool, incubation handoff, interview opportunities, goodies, and round-wise certificates.",
    schedule: [
      { title: "Round 1 · Register & Submit Idea (Online)", date: "Deadline: Oct 28, 2026", description: "Register and submit your problem statement, market approach, and proposed solution via PPT." },
      { title: "Round 2 · Mentorship & Judging (Online)", date: "Nov 2026 – Jan 2027", description: "Shortlisted teams receive 2–3 months of 1-on-1 expert mentorship to validate their idea and engineer a working Proof of Concept (POC)." },
      { title: "Round 3 · Grand Finale (Offline)", date: "Feb 6, 2027", description: "Pitch your developed prototype and venture live to founders, investors, and incubation heads at Fr. CRCE, Bandra, Mumbai." },
    ],
  },
  // UPCOMING NEW EVENTS
  {
    slug: "semiconductor-deep-dive-hackerfab-mumbai",
    title: "Semiconductor Deep Dive: Lecture by HackerFab",
    type: "Meetup",
    tag: "Semiconductors · Hardware · Fabrication",
    description: "An in-depth lecture by HackerFab IIT Bombay exploring semiconductor fabrication fundamentals, global industry trends, hardware startup journeys, and the India Semiconductor Mission.",
    date: "Dec 5, 2026 · 2:00 PM – 5:00 PM IST",
    location: "ATLAS SkillTech University, Kurla West, Mumbai",
    format: "In person",
    prize: "Deep Tech Knowledge & Founder Networking",
    image: "/events/semiconductor-deep-dive-hackerfab.jpg",
    imageFit: "cover",
    organizer: "HackerFab IIT Bombay × M33 × ABC",
    registrationDeadline: "Dec 5, 2026 · 1:30 PM IST",
    eligibility: "Students, founders, researchers, hardware engineers, chip designers & deep tech builders",
    teamSize: "Individual registration",
    fee: "Free (Approval Required)",
    status: "Approval required",
    registrationUrl: "https://luma.com/qjs01ta3",
    registrationLabel: "Request to join",
    registrationNote: "Your registration is subject to host approval. Please register to request an invite.",
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/qjs01ta3" },
      { label: "Host (M33)", url: "https://luma.com/m33hq?k=c" },
      { label: "ATLAS SkillTech University (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=19.070910299999998%2C72.8759417&query_place_id=ChIJ45sEySvJ5zsR7VTed_4-MG4" },
    ],
    perks: [
      {
        icon: "brain",
        emoji: "🔬",
        title: "Fabrication Physics & Theory",
        description: "Demystify cleanrooms, lithography, silicon wafer processing, and precision fabrication tools.",
      },
      {
        icon: "rocket",
        emoji: "🇮🇳",
        title: "India Semiconductor Mission",
        description: "Learn what the policy incentives and domestic foundries mean for founders, researchers, and engineers.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Deep Tech Community Connect",
        description: "Network with IIT Bombay builders, deep tech entrepreneurs, hardware researchers, and investors.",
      },
    ],
    overview: `### Semiconductors: Industry, Fabrication & Opportunities

Semiconductors are at the heart of almost every major technological shift happening today. But how does the industry actually work, and where are the opportunities to build?

Join us for an in-depth lecture by **HackerFab IIT Bombay**, covering the fundamentals of semiconductor fabrication, the tools and technologies behind it, and the current state of the global semiconductor industry.

---

### What We'll Explore
- **How semiconductor fabrication works**: from the underlying theory and physics to the specialized tools and cleanroom equipment used in fabrication.
- **Where the semiconductor industry stands today** and where it is headed globally over the next decade.
- **A breakdown of semiconductor startups**: their journeys, critical engineering hurdles, and what made them succeed or fail.
- **The India Semiconductor Mission (ISM)**: what it means for the domestic ecosystem, and how individuals, researchers, and engineers can get involved.

---

### Who Should Join?
Students, hardware engineers, founders, researchers, chip designers, investors, and anyone interested in building in the semiconductor space.

Hosted by **M33**, with **ABC** as the venue partner.
📅 **5 Dec 2026** · 📍 **ATLAS SkillTech University, Kurla West, Mumbai**`,
    schedule: [
      { title: "Doors Open & Check-in", date: "Dec 5, 2026 · 2:00 PM", description: "Arrive at ATLAS SkillTech University (Equinox Business Park, Kurla West) and settle in." },
      { title: "Deep Dive Lecture by HackerFab IITB", date: "Dec 5, 2026 · 2:30 PM", description: "Fabrication fundamentals, semiconductor physics, tooling, and global industry breakdown." },
      { title: "Semiconductor Startups & India Mission", date: "Dec 5, 2026 · 4:00 PM", description: "Venture pathways, startup lessons, and opportunities in India's semiconductor landscape." },
      { title: "Open Q&A and Community Mixer", date: "Dec 5, 2026 · 4:30 PM – 5:00 PM", description: "Interactive conversation with HackerFab leads, founders, and peer builders." },
    ],
  },
  {
    slug: "mumbai-community-year-end-meet-ai-agents",
    title: "Mumbai Community's Year-End Meet: with AI & Agents",
    type: "Meetup",
    tag: "AI Agents · UiPath · Interactive Simulation",
    description: "An interactive year-end meetup by Agent Builders Community & UiPath. No boring slides — the room acts as leadership making high-stakes AI & agent orchestration decisions for a live fictional company.",
    date: "Dec 5, 2026 · 10:00 AM – 3:30 PM IST",
    location: "Yashwantrao Chavan Centre, Nariman Point, Mumbai",
    format: "In person",
    prize: "Interactive Simulation, Swag & Year-End Mixer",
    image: "/events/mumbai-community-year-end-meet.jpg",
    imageFit: "cover",
    organizer: "Agent Builders Community × UiPath",
    registrationDeadline: "Dec 5, 2026 · 9:30 AM IST",
    eligibility: "Developers, automation architects, AI engineers, product leaders & curious builders",
    teamSize: "Individual registration",
    fee: "Free",
    status: "Registration open",
    registrationUrl: "https://luma.com/8acb6kin",
    registrationLabel: "Register now",
    registrationNote: "Welcome! Free registration on Lu.ma. No prep or laptop needed — just bring your curiosity and a fully charged phone for live interactive voting.",
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/8acb6kin" },
      { label: "Agent Builders Community", url: "https://luma.com/agentbuilders?k=c" },
      { label: "Yashwantrao Chavan Centre (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=18.9249445%2C72.8265239&query_place_id=ChIJd74E9enR5zsRaPX_EAepD3M" },
    ],
    perks: [
      {
        icon: "laptop",
        emoji: "🎮",
        title: "Live Room Interactive Simulation",
        description: "Vote in real time from your mobile phone as leadership decisions reshape the company trajectory.",
      },
      {
        icon: "brain",
        emoji: "🤖",
        title: "AI Agent Orchestration Framework",
        description: "Gain a practical, battle-tested mental model: 'Should we use an AI agent for this?'",
      },
      {
        icon: "coffee",
        emoji: "🎉",
        title: "Year-End Community Celebration",
        description: "Connect with Mumbai's brightest AI & automation builders at Yashwantrao Chavan Centre, Nariman Point.",
      },
    ],
    overview: `### Mumbaiiiii! Wrap Up The Year With AI & Agents 🎬

**One Company. A Dozen Tough Calls. You Decide.**

2026 has been a big year for UiPath. Autonomous agents, desktop assistants, intelligent task mining, and multi-flavor orchestration… the announcements kept coming. And with every launch, the question got louder in our community:
> *"Okay, but which one do I actually use, and when?"*

This year-end session, we’re not walking you through a feature list. We’re putting you in charge.

---

### How It Works: The Interactive Simulation
Meet a fictional company with a very real problem. Its leaders have a bold mandate, a tight deadline, and a growing pile of decisions to make. Over the course of the session, you’ll follow their journey stage by stage, and at every turn **the room decides what happens next**.

You’ll weigh the options. You’ll vote. You’ll defend your choice. Some answers will seem obvious until they aren’t. Some choices will come back to bite. And just when the room thinks it has everything figured out… expect a twist or two! 😉

By the end, you’ll have helped build something together, and you’ll leave with a simple way of thinking you can use the very next time someone at work asks, *"Should we use AI for this?"*

---

### This Session Is For You If You:
- 🤔 Have lost track of what’s new in the UiPath & AI agent ecosystem this year
- 🏗️ Design or recommend automation solutions and want a sharper way to choose the right tool
- 🎯 Prefer interactive gamification to watching passive slides
- 🙋 Like having an opinion and having it tested by peer architects

**No prep and no laptop needed.** Just bring your curiosity, your instincts, and a fully charged phone. 📱

Can't wait to enjoy the day with you all!`,
    schedule: [
      { title: "Doors Open & Morning Coffee", date: "Dec 5, 2026 · 10:00 AM – 10:30 AM", description: "Check-in at Yashwantrao Chavan Centre, Nariman Point and grab welcome refreshments." },
      { title: "The Mandate & Stage 1 Decisions", date: "Dec 5, 2026 · 10:30 AM – 12:00 PM", description: "Meet the fictional company, analyze technical constraints, and vote on architecture." },
      { title: "Community Lunch & Networking", date: "Dec 5, 2026 · 12:00 PM – 1:00 PM", description: "Enjoy lunch and debate decisions with fellow architects and builders." },
      { title: "Stage 2: Twists, Agents & Orchestration", date: "Dec 5, 2026 · 1:00 PM – 2:45 PM", description: "Handling high-concurrency twists, agent guardrails, and room defense." },
      { title: "Wrap-up, Framework & Group Photos", date: "Dec 5, 2026 · 2:45 PM – 3:30 PM", description: "Final synthesis, key takeaways, and year-end community celebration." },
    ],
  },
  {
    slug: "paranormal-real-or-not-philosophical-discussion",
    title: "Paranormal: Real or Not? (A Philosophical Discussion)",
    type: "Meetup",
    tag: "Philosophy · Paranormal · Open Debate",
    description: "An afternoon of honest conversation and critical inquiry into the paranormal at Love & Latte, Versova. Believers, skeptics, and the curious examine true stories, scientific debunking, and psychological experiences.",
    date: "Nov 29, 2026 · 2:00 PM – 5:00 PM IST",
    location: "Love & Latte Versova, Andheri West, Mumbai",
    format: "In person",
    prize: "Rich Conversations & Diverse Perspectives",
    image: "/events/paranormal-real-or-not-versova.jpg",
    imageFit: "cover",
    organizer: "Philosophy Connect · Hosted by Shravan Vishwakarma",
    registrationDeadline: "Nov 29, 2026 · 1:30 PM IST",
    eligibility: "Believers, skeptics, philosophers, storytellers & open-minded thinkers",
    teamSize: "Individual registration",
    fee: "Free (RSVP Required · Pay for own refreshments)",
    status: "Registration open",
    registrationUrl: "https://luma.com/wd2bwcm5",
    registrationLabel: "Register now",
    registrationNote: "Welcome! Free RSVP on Lu.ma. Ghosts are welcome too, but they have to RSVP like everyone else. Please leave the Ouija board at home.",
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/wd2bwcm5" },
      { label: "Love & Latte Versova (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=19.1329998%2C72.81226219999999&query_place_id=ChIJkeAQrjm35zsRpJLAByQUzPQ" },
    ],
    perks: [
      {
        icon: "coffee",
        emoji: "☕",
        title: "Cozy Versova Café Ambience",
        description: "Intimate and relaxed setting at Love & Latte in Aram Nagar Part 2, Versova.",
      },
      {
        icon: "brain",
        emoji: "👻",
        title: "Philosophical & Scientific Inquiry",
        description: "Examine unexplained phenomena through epistemology, psychology, and evidence.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Open, Non-Judgmental Debate",
        description: "A respectful room where skeptics and believers can share raw experiences and analyze them together.",
      },
    ],
    overview: `### You've Heard The Stories.

The house that was never quite empty. The “based on a true story” movie that kept you up all night. The friend of a friend who swears they saw something in the shadows. Everyone has one, and nobody can explain it.

Join us for an afternoon of honest conversation about the paranormal at **Love & Latte, Versova**. Believers, skeptics, and the just plain curious are all warmly welcome. Ghosts are welcome too, but they have to RSVP like everyone else!

---

### What We'll Explore
- **Does the paranormal actually exist?** Exploring metaphysical concepts, consciousness, and what science can and cannot measure.
- **Popular horror movies and true claims**: Examining stories claimed to be based on real events, and what holds up when analyzed scientifically.
- **How people fake it & scams**: The history of spiritualism hoaxes, optical illusions, sleep paralysis, and psychological tricks that prey on believers.
- **Your own personal encounters**: An open floor to recount unexplained moments without ridicule.

The conversation is open and guided — think real stories, thoughtful debate, and warm coffee, not dry lectures.

**No prep needed.** Just show up with your experiences, your doubts, and an open mind. *(Please leave the Ouija board at home.)*`,
    schedule: [
      { title: "Arrival & Coffee Break", date: "Nov 29, 2026 · 2:00 PM – 2:30 PM", description: "Grab your drink, settle into Aram Nagar, and meet fellow attendees." },
      { title: "Scientific Scrutiny & Famous Cases", date: "Nov 29, 2026 · 2:30 PM – 3:45 PM", description: "Horror media, psychology of fear, and documented historical hoaxes." },
      { title: "Open Floor: Personal Stories & Skeptic Inquiry", date: "Nov 29, 2026 · 3:45 PM – 4:45 PM", description: "Participants share unexplainable experiences in an open, respectful circle." },
      { title: "Closing Reflections & Farewell", date: "Nov 29, 2026 · 4:45 PM – 5:00 PM", description: "Wrap-up thoughts and continued conversations over coffee." },
    ],
  },
  {
    slug: "lovable-builders-in-bangalore-2026",
    title: "Lovable Builders in Bangalore",
    type: "Meetup",
    tag: "AI Builders · Lovable · Bengaluru Tech",
    description: "A high-energy community meetup at WeWork Koramangala bringing together developers, designers, founders, and creators building next-gen web apps and AI products with Lovable.",
    date: "Dec 12, 2026 · 11:00 AM – 6:00 PM IST",
    location: "WeWork Prestige Atlanta, Koramangala, Bengaluru",
    format: "In person",
    prize: "Showcases, Feedback & Community Connections",
    image: "/events/lovable-builders-bangalore.jpg",
    imageFit: "cover",
    organizer: "Lovable Community · Hosted by Vinay Singh & Prasoon Nigam",
    registrationDeadline: "Dec 11, 2026 · 11:59 PM IST",
    eligibility: "Developers, software engineers, UI/UX designers, founders, creators & technology innovators",
    teamSize: "Individual registration",
    fee: "Free (Approval Required)",
    status: "Approval required",
    registrationUrl: "https://luma.com/1mjcegf0",
    registrationLabel: "Request to join",
    registrationNote: "Your registration is subject to host approval. Please register to request your builder spot.",
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/1mjcegf0" },
      { label: "WeWork Koramangala (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=12.9289492%2C77.6328922&query_place_id=ChIJITev0WAUrjsR1bMfF3B3VAc" },
    ],
    perks: [
      {
        icon: "rocket",
        emoji: "🚀",
        title: "Live Product Demos",
        description: "Watch live demos of products, SaaS tools, and prototypes built rapidly using Lovable.",
      },
      {
        icon: "laptop",
        emoji: "💻",
        title: "Koramangala Startup Heart",
        description: "Collaborate at WeWork Prestige Atlanta, 80 Feet Road, in the center of Koramangala.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Co-Founder & Builder Matching",
        description: "Find technical collaborators, design partners, and fellow indie hackers.",
      },
    ],
    overview: `### Lovable Builders in Bangalore

**Lovable Builders in Bangalore** is a community meetup bringing together builders, developers, designers, founders, creators, and innovators from across Bengaluru.

It's a space to connect, network, exchange ideas, and share perspectives on how we can use technology, modern AI generation tools, and creativity to solve real-world problems across different industries and sectors.

Together, let's explore what we can build today, imagine what's possible tomorrow, and create meaningful solutions that shape a better future for the next generation.

---

### What to Expect
- **Real-World Builder Demos**: Watch fellow developers demo micro-SaaS, prototypes, and internal tools built at unprecedented speed.
- **Prompt Architecture & Full-Stack AI**: Learn architectural best practices for connecting AI frontends to real Supabase tables, Edge Functions, and external APIs.
- **Creator Collisions**: Connect with creators looking for technical co-founders or design partners in Koramangala.
- **Collaborative Hack & Feedback**: Get instant feedback on your projects from seasoned software engineers and founders.

Come with ideas, curiosity, and a passion to build. Let's connect, collaborate, and create something meaningful!`,
    schedule: [
      { title: "Doors Open & Welcome", date: "Dec 12, 2026 · 11:00 AM – 11:45 AM", description: "Check-in at WeWork Prestige Atlanta, Koramangala." },
      { title: "The New Era of AI Building", date: "Dec 12, 2026 · 11:45 AM – 12:30 PM", description: "Keynote on rapid application generation and full-stack software development." },
      { title: "Builder Demos & Showcases", date: "Dec 12, 2026 · 12:30 PM – 2:00 PM", description: "Live demos of apps and startup products built with Lovable." },
      { title: "Lunch & Networking Mixer", date: "Dec 12, 2026 · 2:00 PM – 3:00 PM", description: "Connect with developers, designers, and founders over lunch." },
      { title: "Collaborative Jam & Teardowns", date: "Dec 12, 2026 · 3:00 PM – 5:00 PM", description: "Hands-on feedback circles and architecture reviews." },
      { title: "Wrap-up & Community Group Photo", date: "Dec 12, 2026 · 5:00 PM – 6:00 PM", description: "Closing thoughts, community shoutouts, and open networking." },
    ],
  },
  {
    slug: "the-big-aaaart-club-delhi-2026",
    title: "The Big Aaaaart Club (South Delhi)",
    type: "Meetup",
    tag: "Art & Sketching · Creative Community · Open Air",
    description: "An open-air evening of painting, sketching, and artistic conversations at Priya Park, Vasant Vihar, South Delhi. No prior art experience needed — just bring your curiosity and creative energy!",
    date: "Nov 29, 2026 · 2:00 PM – 6:00 PM IST",
    location: "Priya Park, Vasant Vihar, South Delhi",
    format: "In person",
    prize: "Art Community Bond, Showcases & Open Air Vibes",
    image: "/events/the-big-aaaart-club-delhi.jpg",
    imageFit: "cover",
    organizer: "The Art Curry",
    registrationDeadline: "Nov 29, 2026 · 1:00 PM IST",
    eligibility: "Everyone welcome! Whether you sketch daily or haven't held a pencil since childhood.",
    teamSize: "Individual registration",
    fee: "Free (RSVP Required)",
    status: "Registration open",
    registrationUrl: "https://luma.com/vkvi441n",
    registrationLabel: "Register now",
    registrationNote: "Welcome! Free RSVP on Lu.ma. Note: If you register & do not show up, you are blacklisted for the next three events. Please attend if you RSVP!",
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/vkvi441n" },
      { label: "The Art Curry Calendar", url: "https://luma.com/calendar/cal-dVfxSmkduoss1Fh" },
    ],
    perks: [
      {
        icon: "gift",
        emoji: "🎨",
        title: "Pure Creative Freedom",
        description: "Zero rules, zero critiques — paint, draw, or doodle whatever brings you peace.",
      },
      {
        icon: "coffee",
        emoji: "🌳",
        title: "Priya Park Open Green Lawn",
        description: "Lush green grass and fresh winter breeze in Vasant Vihar, South Delhi.",
      },
      {
        icon: "handshake",
        emoji: "💖",
        title: "Warm Creative Community",
        description: "Meet artists, designers, and people who simply enjoy slowing down to create.",
      },
    ],
    overview: `### The Big Aaaaart Club is Back Again! 🎨

Join us on **Sunday, 29th November** for an evening of art, conversations, and community as we bring together people who simply love making, discovering, and experiencing art.

Think of it as your excuse to step away from the usual Sunday screen routine and spend a few mindful hours exploring your creative side. Whether you sketch all the time, haven’t picked up a pencil in years, or just want to meet like-minded, warm souls — **there is no right or wrong way to be here.**

Come as you are, bring your curiosity, and be ready to create, explore, and connect.

---

### Important Venue & Timing Details
- 📍 **Location**: Priya Park, Vasant Vihar, South Delhi
- 📅 **Date**: Sunday, 29th November 2026
- ⏰ **Time**: 2:00 PM – 6:00 PM IST
- 🎨 **Materials**: Bring your favorite sketchbook, paints, pencils, or whatever medium you enjoy!

No prior art experience needed. Just bring yourself and your creative energy <3

*(Notice from organizers: If you register & do not show up, you are blacklisted for the next three events. Please ensure you can make it before RSVPing!)*`,
    schedule: [
      { title: "Arrival & Picnic Blanket Setup", date: "Nov 29, 2026 · 2:00 PM – 2:30 PM", description: "Find a cozy spot on the lawn under the trees at Priya Park, Vasant Vihar." },
      { title: "Open Creative Session", date: "Nov 29, 2026 · 2:30 PM – 4:30 PM", description: "Sketch, paint, doodle, or write at your own relaxed pace." },
      { title: "Show & Tell and Art Circles", date: "Nov 29, 2026 · 4:30 PM – 5:30 PM", description: "Share your sketches, talk about your process, and learn from each other." },
      { title: "Sunset Wrap-up & Group Photos", date: "Nov 29, 2026 · 5:30 PM – 6:00 PM", description: "Capture memories, exchange Instagram handles, and wrap up before evening." },
    ],
  },
  {
    slug: "nerds-winter-of-code-paytm-noida-2026",
    title: "Nerds Winter of Code (NWOC 2026)",
    type: "Meetup",
    tag: "Winter of Code · Paytm Noida · Real Projects",
    description: "A community-driven initiative by Nerds Room & The AI Collective at Paytm Office, Noida. Work on real-world projects, explore emerging tech, and build with top mentors all winter.",
    date: "Nov 21, 2026 · 8:30 AM – 9:30 AM IST (Kickoff)",
    location: "Paytm Office, One Skymark, Sector 98, Noida, Uttar Pradesh",
    format: "In person",
    prize: "Real Project Portfolios, Mentorship & Recognition",
    image: "/events/nerds-winter-of-code.jpg",
    imageFit: "cover",
    organizer: "Nerds Room × The AI Collective",
    registrationDeadline: "Nov 21, 2026 · 8:00 AM IST",
    eligibility: "Developers, students, designers, and tech enthusiasts of all skill levels",
    teamSize: "Individual / Project squads",
    fee: "Free (Approval Required)",
    status: "Approval required",
    registrationUrl: "https://luma.com/nerds-winter-of-code",
    registrationLabel: "Request to join",
    registrationNote: "Hosted at Paytm One Skymark, Noida. Register on Lu.ma to request your kickoff invite.",
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/nerds-winter-of-code" },
      { label: "AI Collective Host", url: "https://luma.com/genai-collective?k=c" },
      { label: "Paytm Noida (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=28.5324297%2C77.3612574&query_place_id=ChIJffiYu3TlDDkR3NQsZV6hSfU" },
    ],
    perks: [
      {
        icon: "laptop",
        emoji: "💻",
        title: "Hands-on Project Building",
        description: "Work on production-grade open source projects and AI tools all winter.",
      },
      {
        icon: "coffee",
        emoji: "🏢",
        title: "Paytm One Skymark Kickoff",
        description: "Meet fellow builders live at Paytm's iconic Noida headquarters.",
      },
      {
        icon: "award",
        emoji: "🏆",
        title: "Mentorship & Recognition",
        description: "Direct guidance from senior developers and certificates of achievement.",
      },
    ],
    overview: `### Winter Is Here, And It's Time To Build!

**Nerds Winter of Code (NWOC) 2026** is a community-driven initiative by **Nerds Room** and **The AI Collective**, bringing together developers, students, designers, and aspiring tech enthusiasts to learn, build, experiment, and collaborate on real-world technology projects.

Starting **November 21, 2026** at the **Paytm Headquarters in Noida**, participants will get the opportunity to work on exciting projects, explore new technologies, collaborate with experienced mentors, and turn their ideas into working solutions.

---

### What to Expect
- **Real-World Projects**: Work on practical projects that solve meaningful problems.
- **Hands-on Learning**: Explore technologies, frameworks, tools, and development workflows.
- **Mentorship**: Learn from experienced developers and industry professionals.
- **Community Collaboration**: Connect with developers, creators, and builders from across India.
- **Building Challenges**: Participate in exciting challenges and project-based activities.
- **Recognition**: Get recognised for your creativity, consistency, and project outcomes.

The best way to learn technology is to build with it. Build Together. Learn Together. Grow Together!`,
    schedule: [
      { title: "Kickoff & Registration at Paytm", date: "Nov 21, 2026 · 8:30 AM – 9:30 AM IST", description: "Gather at Paytm One Skymark, Sector 98, Noida for the opening address and project allocation." },
      { title: "Winter Building Sprint", date: "Nov 21 – Dec 30, 2026", description: "Collaborate in squads, receive mentor checkpoints, and ship weekly progress." },
      { title: "Project Showcases & Awards", date: "Jan 2027", description: "Present working software to community leads and receive certificates." },
    ],
  },
  {
    slug: "designmyx-26-myntra-bangalore",
    title: "DesignMyx'26 — Hosted by Myntra Design",
    type: "Meetup",
    tag: "Design Leaders · UX/UI · Myntra Office",
    description: "Get ready to unleash your creativity at DesignMyx'26 hosted by Myntra Design. Fireside chats, enlightening talks, and networking with top design leaders of the industry at Myntra Office, Bengaluru.",
    date: "Dec 4, 2026 · 3:00 PM – 7:00 PM IST",
    location: "Myntra Office, Kadubeesanahalli, Bengaluru",
    format: "In person",
    prize: "Design Masterclasses, Portfolio Reviews & Leader Mixer",
    image: "/events/designmyx-myntra-bangalore.jpg",
    imageFit: "cover",
    organizer: "Myntra Design Team",
    registrationDeadline: "Dec 4, 2026 · 2:00 PM IST",
    eligibility: "Product designers, UX/UI designers, design researchers, design leaders & creative technologists",
    teamSize: "Individual registration",
    fee: "Free (Approval Required)",
    status: "Approval required",
    registrationUrl: "https://luma.com/vsr5vbew",
    registrationLabel: "Request to join",
    registrationNote: "Your registration is subject to host approval. Please register to request entry to Myntra Office.",
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/vsr5vbew" },
      { label: "Myntra Office (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=12.9435144%2C77.6986423&query_place_id=ChIJaUnHeUcTrjsRICoKpfaQaXI" },
    ],
    perks: [
      {
        icon: "brain",
        emoji: "🎨",
        title: "Myntra Design Leadership Talks",
        description: "Fireside chats and talks with heads of product design shaping e-commerce UX.",
      },
      {
        icon: "laptop",
        emoji: "🏢",
        title: "Inside Myntra Office",
        description: "Experience the vibrant campus at Indiqube Star, Outer Ring Road, Kadubeesanahalli.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Peer Design Networking",
        description: "Connect with fellow creative minds, UI/UX researchers, and design system leads.",
      },
    ],
    overview: `### Unleash Your Creativity at DesignMyx'26

Get ready to unleash your creativity at **DesignMyx'26** brought to you by **Myntra Design**!

The event is packed with a variety of activities to keep you engaged and entertained. You can look forward to a fireside chat, enlightening talks, and get a chance to meet and network with design leaders of the industry. And of course, there will be plenty of opportunities for networking with other designers as well.

So, come along and join the party. Let's celebrate design, learn from each other, and have a blast!

---

### Key Highlights
- **Fireside Chats**: Honest conversations on building scalable design systems for millions of shoppers.
- **Design Critique & Portfolio Jam**: Get candid feedback on product designs from senior Myntra leads.
- **Networking & Socials**: Mingle with product designers, graphic illustrators, and UX researchers.`,
    schedule: [
      { title: "Doors Open & Welcome", date: "Dec 4, 2026 · 3:00 PM – 3:30 PM", description: "Check-in at Myntra Office (Indiqube Star, Kadubeesanahalli) and welcome drinks." },
      { title: "Design Keynote & Fireside Chat", date: "Dec 4, 2026 · 3:30 PM – 5:00 PM", description: "Talks by leading design architects on future consumer interfaces and AI-assisted design." },
      { title: "Interactive Workshop & Lightning Demos", date: "Dec 4, 2026 · 5:00 PM – 6:00 PM", description: "Hands-on creative challenge and design critiques." },
      { title: "High-Tea & Community Networking", date: "Dec 4, 2026 · 6:00 PM – 7:00 PM", description: "Celebrate design, exchange contacts, and wrap up." },
    ],
  },
  {
    slug: "bangalore-product-mixer-product-reactor",
    title: "Bangalore Product Mixer #4 | Product Reactor",
    type: "Meetup",
    tag: "Product Management · High Value Mixer · Bengaluru",
    description: "A relaxed, high-value networking meetup created exclusively for product managers. Connect, exchange experiences, and build professional relationships with peers in the product craft.",
    date: "Dec 5, 2026 · 6:00 PM – 8:00 PM IST",
    location: "Bengaluru, Karnataka (Exact address revealed upon approval)",
    format: "In person",
    prize: "Product Insights, PM Community & Mentor Collisions",
    image: "/events/bangalore-product-mixer.jpg",
    imageFit: "cover",
    organizer: "Product Reactor",
    registrationDeadline: "Dec 5, 2026 · 5:00 PM IST",
    eligibility: "Product managers of all levels. (Note: Exclusively for practicing PMs. Not open to current students or interns).",
    teamSize: "Individual registration",
    fee: "Free (Approval Required)",
    status: "Approval required",
    registrationUrl: "https://luma.com/232qy3xn",
    registrationLabel: "Request to join",
    registrationNote: "Registration is subject to host approval. Exclusively for practicing product professionals.",
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/232qy3xn" },
      { label: "Product Reactor Host Profile", url: "https://luma.com/productreactor?k=c" },
    ],
    perks: [
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Curated PM Community",
        description: "Exclusively for practicing product managers across seed startups to tech unicorns.",
      },
      {
        icon: "brain",
        emoji: "💡",
        title: "Real Product Insights",
        description: "Candid conversations on roadmaps, discovery frameworks, PRDs, and AI tooling.",
      },
      {
        icon: "coffee",
        emoji: "☕",
        title: "Intimate Networking Evening",
        description: "Relaxed Saturday evening mixer in the heart of Bengaluru.",
      },
    ],
    overview: `### Bangalore Product Mixer #4 | Product Reactor

**Product Managers Connect** is a relaxed, high value networking meetup created exclusively for product managers.

The goal is simple: connect, exchange experiences, and build professional relationships with peers in the product community.

---

### What to Expect
- A casual, conversation-driven environment.
- Dedicated space to meet fellow product managers from diverse industries.
- Discussions around product challenges, tools, workflows, and career growth.
- Opportunities to discover collaborators, and mentors.

### Who Should Attend?
Product managers of all levels who want to expand their network and engage with a community of people who understand the product craft.

*(NOTE: Do not attend if you are currently interning or still a student. Lying, misrepresentation or misleading of any sort will lead to permanent blacklisting).*`,
    schedule: [
      { title: "Arrival & Warm Welcome", date: "Dec 5, 2026 · 6:00 PM – 6:30 PM", description: "Arrive at the private Bengaluru venue, grab refreshments, and settle in." },
      { title: "Roundtable: Product Challenges & AI Workflows", date: "Dec 5, 2026 · 6:30 PM – 7:30 PM", description: "Open discussion on modern product discovery, telemetry, and metrics that matter." },
      { title: "Peer Networking & Connections", date: "Dec 5, 2026 · 7:30 PM – 8:00 PM", description: "Exchange contacts, find mentors, and explore collaborations." },
    ],
  },
  {
    slug: "unboxed-reimagining-stem-education-mumbai",
    title: "UNBOXED: Reimagining STEM Education",
    type: "Meetup",
    tag: "Experiential Pop-Up · STEM Education · MakerGhat",
    description: "An experiential pop-up by MakerGhat & Shikshagraha at Shikha Academy, Borivali Mumbai. Explore student projects, classrooms of the future, and hands-on learning by doing.",
    date: "Dec 12, 2026 · 9:00 AM – 5:00 PM IST",
    location: "Shikha Academy, Sumer Nagar, Borivali West, Mumbai",
    format: "In person",
    prize: "Interactive STEM Exhibits, Workshops & Ideas Exchange",
    image: "/events/unboxed-stem-education.jpg",
    imageFit: "cover",
    organizer: "MakerGhat × Shikshagraha",
    registrationDeadline: "Dec 12, 2026 · 8:30 AM IST",
    eligibility: "Students, educators, parents, school leaders, NGOs, edtech builders & community members",
    teamSize: "Individual / Family registration",
    fee: "Free",
    status: "Registration open",
    registrationUrl: "https://luma.com/pfurunwu",
    registrationLabel: "Register now",
    registrationNote: "Welcome! Free registration on Lu.ma. Step into a space to explore the building blocks of our world and experiment with STEM in new ways.",
    relatedLinks: [
      { label: "Lu.ma Registration Page", url: "https://luma.com/pfurunwu" },
      { label: "MakerGhat Calendar", url: "https://luma.com/calendar/cal-glGcU5BRiiKdwoL" },
      { label: "Shikha Academy (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=19.2192933%2C72.853634&query_place_id=ChIJt1UpINi35zsR_jesoPSQbRQ" },
    ],
    perks: [
      {
        icon: "rocket",
        emoji: "🚀",
        title: "Hands-on STEM Exhibits",
        description: "Interact with physical student prototypes, science kits, and creative DIY inventions.",
      },
      {
        icon: "brain",
        emoji: "🏫",
        title: "Classrooms of the Future",
        description: "Walk through learning environments designed to encourage experimentation and inquiry.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Cross-Sector Education Dialogue",
        description: "Engage with educators, government bodies, edtech founders, and community champions.",
      },
    ],
    overview: `### An Experiential Pop-Up by MakerGhat

**What does meaningful STEM learning look like for a child?**

Step into **UNBOXED**, a space to explore the building blocks of our world, experiment with ideas, take on challenges, and discover STEM education in new ways.

Explore hands-on experiences, discover student projects, walk through classrooms of the future, and see what learning can look like when children get to ask questions, experiment, and learn by doing.

UNBOXED brings together students, educators, parents, schools, government, organisations, and communities to experience each other's work, exchange ideas, and reimagine STEM education together.`,
    schedule: [
      { title: "Doors Open & Exhibit Walkthrough", date: "Dec 12, 2026 · 9:00 AM – 11:30 AM", description: "Explore hands-on student science models and interactive technology experiments." },
      { title: "Panel: Reimagining STEM Classrooms", date: "Dec 12, 2026 · 11:30 AM – 1:00 PM", description: "Educators, parents, and innovators discuss inquiry-based learning." },
      { title: "Maker Workshops for Students & Teachers", date: "Dec 12, 2026 · 2:00 PM – 4:00 PM", description: "Hands-on building activities, electronics kits, and prototyping." },
      { title: "Reflections & Closing Ceremony", date: "Dec 12, 2026 · 4:00 PM – 5:00 PM", description: "Community commitments to advancing experiential STEM in schools." },
    ],
  },

  // UPCOMING NATIONAL HACKATHONS & COMPETITIONS
  {
    slug: "code-relay-5-iit-bhubaneswar",
    title: "Code Relay 5.0",
    type: "Hackathon",
    tag: "Web2 & Web3 Hackathon · IIT Bhubaneswar",
    description: "The flagship hackathon by WebnD, IIT Bhubaneswar. Web2 & Web3 tracks, ₹3,10,000 prizes, AI tokens, and direct PPI opportunities from CSM Technologies.",
    date: "Nov 15, 2026 – Jan 17, 2027",
    location: "IIT Bhubaneswar Campus, Odisha · Hybrid",
    format: "Hybrid",
    prize: "₹3,10,000 Worth + PPIs",
    image: "/events/code-relay-5-iit-bhubaneswar.jpg",
    imageFit: "cover",
    organizer: "WebnD · IIT Bhubaneswar",
    registrationDeadline: "Dec 12, 2026 · 11:59 PM IST",
    eligibility: "Open to everyone! Students from any college, discipline, degree, or background. Cross-college teams welcome.",
    teamSize: "2–4 Members",
    fee: "Free",
    status: "Registration open",
    registrationUrl: "https://unstop.com/hackathons/code-relay-50-indian-institute-of-technology-iit-bhubaneswar-1810370",
    registrationLabel: "Register now",
    registrationNote: "Problem statements released to registered teams. Submit your idea PPT using the official template by Dec 12. Working prototype adds bonus points!",
    contacts: [
      { name: "Shantaneel Sarkar", phone: "gamingshantaneel@gmail.com" },
      { name: "Aarush Mahawar", phone: "aarushmahawar2007@gmail.com" },
      { name: "Kshitij Bhaisare", phone: "iitkshitijj@gmail.com" },
    ],
    relatedLinks: [
      { label: "Unstop Official Registration", url: "https://unstop.com/hackathons/code-relay-50-indian-institute-of-technology-iit-bhubaneswar-1810370" },
      { label: "Submission PPT Template", url: "https://d8it4huxumps7.cloudfront.net/uploads/attachements/files/a54a23bc-57b8-4245-bee6-1222252a0a0e.pptx" },
      { label: "AI x Web3 Track Guidelines", url: "https://d8it4huxumps7.cloudfront.net/uploads/attachements/files/fb58242f-0f80-44fb-812e-1eb67eae6e56.pdf" },
      { label: "Agentic AI & Automation Guidelines", url: "https://d8it4huxumps7.cloudfront.net/uploads/attachements/files/14e9ee7d-55a5-44fb-a335-11563409d61a.pdf" },
      { label: "Onchain Payments Guidelines", url: "https://d8it4huxumps7.cloudfront.net/uploads/attachements/files/5cfa1f7f-351a-4b0c-8a15-be72065bdb6b.pdf" },
    ],
    perks: [
      {
        icon: "laptop",
        emoji: "💼",
        title: "CSM Technologies PPIs",
        description: "Top performers in Web2 tracks get Pre-Placement Interview (PPI) opportunities.",
      },
      {
        icon: "gift",
        emoji: "💰",
        title: "₹3,10,000 Total Rewards",
        description: "₹1,50,000 cash prizes, ₹1,00,000 AI model credits, and ₹60,000 swag kits.",
      },
      {
        icon: "rocket",
        emoji: "⚡",
        title: "30-Hour IIT BBS Onsite Sprint",
        description: "Shortlisted teams advance to an intense 30-hour offline hackathon at IIT Bhubaneswar.",
      },
      {
        icon: "award",
        emoji: "📜",
        title: "Official Merit & Participation Certificates",
        description: "Valid submissions from Round 1 receive verified certificates from WebnD IIT Bhubaneswar.",
      },
    ],
    overview: `### Five Editions. Pass The Baton, Build The Future.

**WebnD**, the Web and Design Society of **IIT Bhubaneswar**, is back with the fifth edition of its flagship hackathon: **Code Relay 5.0**. Builders, dreamers, and problem-solvers from across India battle it out in two electrifying tracks: **Web2** and **Web3**.

---

### Challenge Tracks
- **Web2 Tracks**:
  - *Agentic AI × TrueFoundry*: Autonomous workflows, multi-agent frameworks, tool-calling bots. (₹40,000 Cash + Certificate)
  - *AI for Bharat*: Groundbreaking solutions solving real-world Indian socio-economic challenges. (₹30,000 Cash + Certificate)
  - *Social*: Technology tackling high-impact civic, community, and educational problems. (₹10,000 Cash + Certificate)
- **Web3 Tracks**:
  - *AI × Web3*: Intelligent dApps, decentralized agents, zero-knowledge AI inference. (₹30,000 Cash + Certificate)
  - *Onchain Payments*: Next-generation micro-transactions, streaming money, crypto merchant rails. (₹40,000 Cash + Certificate)

---

### PPI & Placement Opportunities
Top performers in the Web2 tracks get a direct shot at **Pre-Placement Interview (PPI) opportunities from CSM Technologies**. Build something great and land your dream tech career!

---

### Round Structure
1. **Round 1 (Ideathon & Prototyping - Online)**: Nov 15 – Dec 12, 2026. Submit your problem statement PPT using the template. Bonus points for working prototype demos!
2. **Round 2 (30-Hour Onsite Hackathon at IIT Bhubaneswar)**: Jan 15 – Jan 17, 2027. Shortlisted squads travel to IIT Bhubaneswar for a 30-hour marathon build sprint.`,
    schedule: [
      { title: "Round 1: Ideathon & Prototyping (Online)", date: "Nov 15 – Dec 12, 2026 · 11:59 PM IST", description: "Submit your team PPT deck using the official template. Attach working prototype demo for extra score." },
      { title: "Registration & PPT Deadline", date: "Dec 12, 2026 · 11:59 PM IST", description: "Final cutoff to submit your proposal on Unstop." },
      { title: "Shortlist Announcement", date: "Late Dec 2026", description: "Shortlisted teams selected for the offline round." },
      { title: "Round 2: 30-Hour Onsite Hackathon (IIT Bhubaneswar)", date: "Jan 15, 10:00 AM – Jan 17, 11:59 PM IST, 2027", description: "Onsite build marathon at IIT Bhubaneswar campus with mentors, food, and live judging." },
    ],
  },
  {
    slug: "lighthouse-hackathon-chandigarh-university-2027",
    title: "LightHouse - Hackathon",
    type: "Hackathon",
    tag: "Agentic AI · Autonomous Agents · Global Hackathon",
    description: "International hackathon for builders of agentic AI by Chandigarh University. Ship autonomous AI agents that plan, reason, and take action. ₹5,10,000 prizes + Pre-Placement Interviews.",
    date: "Nov 15, 2026 – Jan 10, 2027",
    location: "Chandigarh University · Online Global Hackathon",
    format: "Online",
    prize: "₹5,10,000 (Cash + In-Kind) + PPIs",
    image: "/events/lighthouse-hackathon-chandigarh.jpg",
    imageFit: "cover",
    organizer: "Chandigarh University (CU)",
    registrationDeadline: "Dec 31, 2026 · 12:00 AM IST",
    eligibility: "Open to students, developers, and AI builders worldwide. Inter-college and inter-specialization teams welcome.",
    teamSize: "2–5 Members",
    fee: "Free",
    status: "Registration open",
    registrationUrl: "https://unstop.com/hackathons/lighthouse-hackathon-chandigarh-university-cu-ajitgarh-punjab-1809486",
    registrationLabel: "Register now",
    registrationNote: "Mandatory: All team members (2 to 5) must individually fill the Profile Review Form at https://tally.so/r/1Wd0MM using their Unstop email.",
    contacts: [
      { name: "Subhash", phone: "subhash.t2282@cumail.in" },
    ],
    relatedLinks: [
      { label: "Unstop Official Registration", url: "https://unstop.com/hackathons/lighthouse-hackathon-chandigarh-university-cu-ajitgarh-punjab-1809486" },
      { label: "Mandatory Profile Review Form", url: "https://tally.so/r/1Wd0MM" },
    ],
    perks: [
      {
        icon: "laptop",
        emoji: "💼",
        title: "Pre-Placement Interviews (PPIs)",
        description: "Grab direct interview opportunities with partner tech companies and AI startups.",
      },
      {
        icon: "brain",
        emoji: "🤖",
        title: "Agentic AI Focus",
        description: "Build cutting-edge multi-agent systems, tool-use chains, and reasoning architectures.",
      },
      {
        icon: "gift",
        emoji: "💰",
        title: "₹5,10,000 Prize Value",
        description: "Cash rewards for top 3 teams plus ₹5,00,000 in partner credits, tooling, and mentorship perks.",
      },
    ],
    overview: `### LightHouse: Build Autonomous AI Agents That Take Action

**LightHouse** is an international, online hackathon by **Chandigarh University** for builders of agentic AI. Over several weeks, teams design and ship autonomous AI agents that plan, reason, use tools, and take real-world action.

Whether you're a student, a software engineer, or an early-stage founder, this is your chance to build, get noticed by tech employers, and win.

---

### Mandatory Registration Step
Registration is complete **only** when all team members (2 to 5 members) individually fill out the Profile Review Form:
👉 **Profile Review Form**: [https://tally.so/r/1Wd0MM](https://tally.so/r/1Wd0MM)

---

### Rewards Breakdown
- **1st Place (Winner)**: ₹5,000 Cash + Pre-Placement Interview
- **2nd Place (Runner-up)**: ₹3,000 Cash + Pre-Placement Interview
- **3rd Place**: ₹2,000 Cash + Pre-Placement Interview
- **In-Kind Pool**: Share of ₹5,00,000 partner credits, developer tools, and cloud infrastructure
- **Participation Certificates**: Official certificates for all active squads`,
    schedule: [
      { title: "Profile Review & Registration", date: "Nov 15 – Dec 1, 2026 · 10:23 PM IST", description: "Form squads of 2–5 members and complete the individual profile review form." },
      { title: "Problem Statements Release & Research", date: "Dec 1 – Dec 30, 2026", description: "Official agentic problem statements revealed for in-depth architecture research." },
      { title: "Build Phase & Code Sprint", date: "Jan 1 – Jan 10, 2027", description: "Sprint to code, evaluate, and deploy autonomous agents." },
      { title: "Evaluation & Winner Announcement", date: "Jan 2027", description: "Jury review and Pre-Placement Interview handoffs." },
    ],
  },
  {
    slug: "apify-ai-tools-that-earn-bangalore-2026",
    title: "AI Tools that Earn: A Hackathon by Apify",
    type: "Hackathon",
    tag: "1-Day Hackathon · Apify Actors · Zostel Whitefield",
    description: "Most hackathons die on Sunday night. This one is designed so yours doesn't. Build monetization-ready AI tools & Actors at Zostel Plus Whitefield, Bangalore. $1,500+ (₹1.5 Lakh) cash prizes + Apify credits.",
    date: "Nov 22, 2026 · 8:00 AM – 6:00 PM IST",
    location: "Zostel Plus Bangalore (Whitefield), Bengaluru",
    format: "In person",
    prize: "$1,500+ (₹1.5 Lakh) Cash + Credits",
    image: "/events/apify-ai-tools-that-earn.jpg",
    imageFit: "cover",
    organizer: "Apify Events",
    registrationDeadline: "Nov 21, 2026 · 11:59 PM IST",
    eligibility: "Developers, AI builders, data engineers, and founders. Solo or squads of 1–4 members.",
    teamSize: "1–4 Members",
    fee: "Free (Event Full · Waitlist Open)",
    status: "Event full",
    registrationUrl: "https://luma.com/apify-yc12",
    registrationLabel: "Join waitlist",
    registrationNote: "The hackathon is currently at full capacity. Join the waitlist on Lu.ma to be alerted if spots open up. Complimentary breakfast, lunch, and chai provided!",
    relatedLinks: [
      { label: "Lu.ma Registration & Waitlist", url: "https://luma.com/apify-yc12" },
      { label: "Apify Store", url: "https://apify.com/store?utm_source=luma" },
      { label: "Apify Documentation", url: "https://docs.apify.com/?utm_source=luma" },
      { label: "Zostel Plus Whitefield (Google Maps)", url: "https://www.google.com/maps/search/?api=1&query=12.9724332%2C77.7469155&query_place_id=ChIJ2acQJwANrjsRKs5JnAfPc1E" },
    ],
    perks: [
      {
        icon: "gift",
        emoji: "💰",
        title: "$1,500+ (₹1.5L) Cash Prize Pool",
        description: "1st: $750 (₹75K) | 2nd: $500 (₹50K) | 3rd: $250 (₹25K) | 4th-10th: $50 Apify credits per member.",
      },
      {
        icon: "brain",
        emoji: "🧑‍🏫",
        title: "13 Top Apify Creator Judges",
        description: "Work directly alongside top creators from India & Nepal who make their living shipping Actors.",
      },
      {
        icon: "coffee",
        emoji: "🏡",
        title: "Hacker House Vibes at Zostel Plus",
        description: "Intense 1-day build sprint at Zostel Plus Whitefield with breakfast, lunch, snacks, and chai all day.",
      },
    ],
    overview: `### Most Hackathons Die on Sunday Night. This One Doesn't.

The **AI Tools that Earn Hackathon** is an exclusive, one-day event hosted by **Apify** at a **Zostel Plus hacker house in Whitefield, Bangalore**.

The challenge: **Build solutions someone would actually pay for, not just a demo.** Extract data, combine tools, draw conclusions, trigger actions. If you can name who'd pay for it, you're on theme.

---

### Why Build On Apify?
You'll build on the **Apify platform** and ship your project as an **Actor** to **Apify Store**, where 10k+ developers already publish and earn. Every Actor works with AI agents out of the box via **MCP (Model Context Protocol)** and agent plugins.

Thirteen of the top creators from India and Nepal will be in the room all day as your mentors and judges. Several of them make their living from projects that started exactly like yours!

---

### Judging: The Commercial Test
Every project is judged against one question: **Would someone actually pay for this?**
Picture a real person who needs the output of your Actor. Your demo should name that person, show what they get, and run live.`,
    schedule: [
      { title: "Breakfast & Registration Check-in", date: "Nov 22, 2026 · 8:00 AM – 9:00 AM IST", description: "Arrive at Zostel Plus Whitefield, enjoy breakfast, and form squads." },
      { title: "Opening Address & Keynote", date: "Nov 22, 2026 · 9:00 AM – 9:30 AM IST", description: "How to build high-value Actors using AI by Pushpak." },
      { title: "Build Sprint & Mentorship", date: "Nov 22, 2026 · 10:15 AM – 2:30 PM IST", description: "Non-stop hacking with 13 top creator mentors on the floor (Lunch: 12-1 PM)." },
      { title: "2-Minute Preliminary Demos", date: "Nov 22, 2026 · 2:30 PM – 3:15 PM IST", description: "Pitch live to the judges and demonstrate real commercial value." },
      { title: "Top 10 Stage Demos & Awards", date: "Nov 22, 2026 · 3:30 PM – 6:00 PM IST", description: "Grand stage pitches, winner announcements, and closing celebration." },
    ],
  },
  {
    slug: "hacksprint-3-kahe-coimbatore",
    title: "HackSprint 3.0",
    type: "Hackathon",
    tag: "36-Hour National Hackathon · Coimbatore",
    description: "National-level 36-hour hackathon by Dept. of CSE, Karpagam Academy of Higher Education & Metaverse Association. Transform ideas into working prototypes.",
    date: "Nov 8, 2026 – Feb 6, 2027",
    location: "KAHE Campus, Coimbatore, Tamil Nadu · Hybrid",
    format: "Hybrid",
    prize: "Cash Prizes, Metaverse Perks & Certificates",
    image: "/events/hacksprint-3-kahe-coimbatore.jpg",
    imageFit: "cover",
    organizer: "KAHE CSE × Metaverse Association",
    registrationDeadline: "Dec 28, 2026 · 11:59 PM IST",
    eligibility: "Undergraduate, Postgraduate, Engineering, Management, Arts & Science students nationwide",
    teamSize: "2–4 Members",
    fee: "Free",
    status: "Registration open",
    registrationUrl: "https://unstop.com/hackathons/hacksprint-30-karpagam-academy-of-higher-education-1778597",
    registrationLabel: "Register now",
    registrationNote: "Round 1 is an online idea proposal. Shortlisted teams advance to a 36-hour offline hackathon on KAHE campus in Coimbatore.",
    contacts: [
      { name: "KAHE Helpdesk", phone: "24becse016@kahedu.edu.in" },
    ],
    relatedLinks: [
      { label: "Unstop Official Registration", url: "https://unstop.com/hackathons/hacksprint-30-karpagam-academy-of-higher-education-1778597" },
    ],
    perks: [
      {
        icon: "rocket",
        emoji: "⚡",
        title: "36-Hour Offline Arena",
        description: "Intense overnight building experience on KAHE campus in Coimbatore.",
      },
      {
        icon: "brain",
        emoji: "🌐",
        title: "Metaverse & AI Ecosystem",
        description: "Organized in collaboration with the Metaverse Association with senior tech evaluators.",
      },
      {
        icon: "award",
        emoji: "🏆",
        title: "National Recognition & Certificates",
        description: "Official merit certificates, trophies, and cash prizes for top winning teams.",
      },
    ],
    overview: `### HackSprint 3.0 — Build Bold. Ride Beyond.

**HackSprint 3.0** is a national-level, 36-hour hackathon organized by the **Department of Computer Science and Engineering, Karpagam Academy of Higher Education (KAHE), Coimbatore**, in collaboration with the **Metaverse Association**.

It brings together passionate developers, designers, problem-solvers, and innovators from across India to transform creative ideas into impactful, technology-driven solutions.

---

### Format
- **Round 1 (Online Idea Submission)**: Nov 8 – Dec 28, 2026. Submit your problem statement, proposed solution, tech stack, and potential impact.
- **Round 2 (Offline Grand Finale)**: Feb 5 – Feb 6, 2027. 36-hour non-stop prototyping sprint on KAHE campus in Coimbatore demonstrating live functional software to the jury.`,
    schedule: [
      { title: "Round 1: Idea Submission (Online)", date: "Nov 8 – Dec 28, 2026 · 11:59 PM IST", description: "Submit project title, problem statement, key features, and intended tech stack." },
      { title: "Shortlist Announcement", date: "Jan 2027", description: "Top performing squads selected for the 36-hour offline round." },
      { title: "Round 2: 36-Hour Offline Finale (KAHE Coimbatore)", date: "Feb 5, 08:00 AM – Feb 6, 08:00 PM IST, 2027", description: "36-hour coding marathon, mentor checkpoints, and final live demos." },
    ],
  },
  {
    slug: "skysparks-boeing-techkriti-iit-kanpur-2027",
    title: "Skysparks - Boeing Aeromodelling Competition",
    type: "Competition",
    tag: "Aerospace · RC Aircraft · IIT Kanpur & Boeing",
    description: "The official Boeing National Aeromodelling Competition at Techkriti'27, IIT Kanpur. Design, build, and pilot fixed-wing RC electric aircraft carrying payload drops.",
    date: "Jan 28 – 31, 2027 (Registration closes Dec 31, 2026)",
    location: "IIT Kanpur Campus, Kalyanpur, Uttar Pradesh",
    format: "In person",
    prize: "Boeing LoRs, Cash Prizes & Official Techkriti Awards",
    image: "/events/skysparks-techkriti-iit-kanpur.jpg",
    imageFit: "cover",
    organizer: "Techkriti IIT Kanpur × The Boeing Company",
    registrationDeadline: "Dec 31, 2026 · 01:50 PM IST",
    eligibility: "Mechanical, Aerospace, Design, and Engineering students passionate about aeromodelling & robotics",
    teamSize: "2–4 Members",
    fee: "Free",
    status: "Registration open",
    registrationUrl: "https://unstop.com/hackathons/skysparks-boeing-national-aeromodelling-competition-techkriti27-techkriti-1764461",
    registrationLabel: "Register now",
    registrationNote: "Design and construct a fixed-wing RC aircraft (Max weight 1kg, wingspan limit 1.2m, electric only) to carry and drop payloads accurately within designated zones.",
    contacts: [
      { name: "Pratyush Srivastava", phone: "+91 87563 66441" },
      { name: "Ridham Solanki", phone: "+91 84337 68226" },
    ],
    relatedLinks: [
      { label: "Unstop Official Registration", url: "https://unstop.com/hackathons/skysparks-boeing-national-aeromodelling-competition-techkriti27-techkriti-1764461" },
      { label: "Skysparks Rulebook (PDF)", url: "https://d8it4huxumps7.cloudfront.net/uploads/attachements/files/c95465b9-c128-44c5-af73-feeaa4a0bc8f.pdf" },
      { label: "Techkriti 27 Fest Page", url: "https://unstop.com/college-fests/techkriti27-indian-institute-of-technology-iit-kanpur-513311" },
    ],
    perks: [
      {
        icon: "rocket",
        emoji: "✈️",
        title: "Letters of Recommendation from Boeing",
        description: "Official Boeing LoRs and direct recognition for top aircraft engineers.",
      },
      {
        icon: "gift",
        emoji: "🏆",
        title: "Cash Prizes & Techkriti Statuettes",
        description: "Substantial cash rewards, winner trophies, and podium certificates.",
      },
      {
        icon: "laptop",
        emoji: "🛫",
        title: "IIT Kanpur Flight Airstrip Arena",
        description: "Compete live on IIT Kanpur's renowned airstrip during Asia's premier annual technical festival.",
      },
    ],
    overview: `### Boeing National Aeromodelling Competition: Skysparks

**Skysparks** is the flagship aeromodelling championship of **Techkriti'27 (33rd Edition), IIT Kanpur**, powered by **The Boeing Company**.

Engineering teams design, fabricate, and fly fixed-wing RC aircraft subjected to rigorous flight endurance and precision payload drop trials.

---

### Aircraft & Flight Specifications
- **Weight**: Maximum all-up weight of 1.0 kg (without payload).
- **Wingspan**: Maximum wingspan limit of 1.2 meters.
- **Power**: Only electric motors permitted (no IC engines).
- **Control**: Manual RC flying (gyroscopes, FPV, and pre-programmed flight assistance strictly prohibited).
- **Mission**: Carry and drop payloads (golf balls) into designated landing zones after a minimum continuous flight time of 30 seconds.`,
    schedule: [
      { title: "Design Abstract & Registration", date: "Until Dec 31, 2026 · 01:50 PM IST", description: "Submit team abstract with design specs, airfoil profile, and CAD details." },
      { title: "Zonal Selection & Inspection", date: "Jan 2027", description: "Technical scrutiny and safety validation." },
      { title: "On-Site Flying Arena (IIT Kanpur)", date: "Jan 28 – 31, 2027", description: "Payload drop runs, maneuver scoring, and Boeing LoR awards." },
    ],
  },
  {
    slug: "shaastra-ctf-iit-madras-2027",
    title: "CTF - Capture The Flag (Shaastra 2027)",
    type: "Competition",
    tag: "Cybersecurity · Jeopardy CTF · IIT Madras",
    description: "A nationwide Jeopardy-style Capture The Flag challenge by Shaastra 2027, IIT Madras. ₹70,000 cash prizes across Web Exploitation, Cryptography, Reverse Engineering & Forensics.",
    date: "Dec 15, 2026 (Prelims) – Jan 6, 2027 (Finals)",
    location: "Online Prelims · On-Campus Finale at IIT Madras, Chennai",
    format: "Hybrid",
    prize: "₹70,000 Total Cash Prizes",
    image: "/events/shaastra-ctf-iit-madras.jpg",
    imageFit: "cover",
    organizer: "Shaastra 2027 · IIT Madras",
    registrationDeadline: "Dec 1, 2026 · 12:00 AM IST",
    eligibility: "Open to cybersecurity enthusiasts, ethical hackers, and computer science students of all skill levels.",
    teamSize: "1–2 Members",
    fee: "Free",
    status: "Registration open",
    registrationUrl: "https://unstop.com/hackathons/ctf-capture-the-flag-iit-madras-1782683",
    registrationLabel: "Register now",
    registrationNote: "Whether you're an experienced hacker or a curious beginner, race to capture flags across Web, OSINT, Crypto, and Reverse Engineering.",
    contacts: [
      { name: "Surya B", phone: "+91 79041 70145" },
    ],
    relatedLinks: [
      { label: "Unstop Official Registration", url: "https://unstop.com/hackathons/ctf-capture-the-flag-iit-madras-1782683" },
      { label: "Shaastra 2027 Fest Page", url: "https://unstop.com/college-fests/shaastra-2027-indian-institute-of-technology-iit-madras-522673" },
    ],
    perks: [
      {
        icon: "gift",
        emoji: "💰",
        title: "₹70,000 Cash Prize Pool",
        description: "1st: ₹22,500 | 2nd: ₹17,500 | 3rd: ₹13,000 | 4th: ₹10,000 | 5th: ₹7,000.",
      },
      {
        icon: "rocket",
        emoji: "🏁",
        title: "IIT Madras Finals",
        description: "Qualifying teams race offline on IIT Madras campus during Shaastra 2027.",
      },
      {
        icon: "brain",
        emoji: "🛡️",
        title: "Comprehensive Cyber Domains",
        description: "Challenges in Web Exploitation, OSINT, Reverse Engineering, Binary Exploitation, Forensics & Cryptography.",
      },
    ],
    overview: `### Welcome to CTF — Shaastra 2027 (IIT Madras)

A nationwide **Capture The Flag (CTF)** competition for cybersecurity enthusiasts of every skill level. Whether you’re an experienced ethical hacker or a curious beginner, this event is designed for you.

The competition follows a **Jeopardy-style CTF format**, and participants may form teams of up to 2 members.

---

### Challenge Categories
- 🌐 **Web Exploitation**: XSS, SQLi, CSRF, SSRF, authentication bypasses
- 🕵️ **OSINT**: Open source intelligence and forensic investigation
- ⚙️ **Reverse Engineering**: Disassembling binaries and analyzing assembly flow
- 💥 **Binary Exploitation**: Buffer overflows, ROP chains, memory corruption
- 🔍 **Digital Forensics**: Memory dumps, packet captures (PCAP), hidden steganography
- 🔐 **Cryptography**: Modern and classical ciphers, RSA, elliptic curve attacks

---

### Rewards (Total ₹70,000 Cash Pool)
- **1st Rank**: ₹22,500 Cash + Certificate of Merit
- **2nd Rank**: ₹17,500 Cash + Certificate of Merit
- **3rd Rank**: ₹13,000 Cash + Certificate of Merit
- **4th Rank**: ₹10,000 Cash + Certificate of Merit
- **5th Rank**: ₹7,000 Cash + Certificate of Merit
- **Participation Certificates**: Issued for all valid submissions`,
    schedule: [
      { title: "Registration Closes", date: "Dec 1, 2026 · 12:00 AM IST", description: "Squad cutoff to register on Unstop." },
      { title: "Online Prelims Round", date: "Dec 15, 2026", description: "Jeopardy-style speed CTF challenge online." },
      { title: "Final Round (IIT Madras Campus)", date: "Jan 6, 2027 · 01:46 PM – 03:47 PM IST", description: "Live speed hacking battle on IIT Madras campus." },
    ],
  },

  // UPCOMING HACKATHONS & CONFERENCES (Nov 20 onwards)
  { slug: "hack-in-hills-2026", title: "Hack in Hills ’26", type: "Hackathon", tag: "PPT → Prototype → Manali", description: "Compete online for one of 40 builder spots at a 24+ hour offline hackathon in the mountains of Manali.", date: "Nov 20, 2026", location: "Manali, Himachal Pradesh", format: "Hybrid", prize: "₹50,000 bounty pool", image: hackInHillsPoster.url, imageFit: "contain", organizer: "Web3 India × Builder Base", registrationDeadline: "Oct 5, 2026", eligibility: "Open registration; only 40 builders advance to the offline finale", teamSize: "See official registration", fee: "Free", status: "Registration open", registrationUrl: "https://unstop.com/o/dRs01iP/?ref=punmZRNS", overview: "Hack in Hills ’26 takes builders from PPT to prototype and then to Manali. From more than 7,000 registrations and 190,000+ reach, only 40 builders will qualify for the 24+ hour offline finale in the mountains, competing for a ₹50,000 bounty pool. Registration is completely free.", schedule: [{ title: "Registration closes", date: "Oct 5, 2026", description: "Submit through the official registration page." }, { title: "PPT and prototype selection", date: "Before Nov 20, 2026", description: "Entries progress from idea presentation to prototype review as 40 finalists are selected." }, { title: "Offline mountain sprint", date: "Nov 20, 2026", description: "The selected 40 builders compete in a 24+ hour offline hackathon in Manali." }] },
  { slug: "enterprise-ai-summit-mumbai-2026", title: "Enterprise AI Summit Mumbai 2026", type: "Conference", tag: "Enterprise AI / India Stack", description: "A full-day summit on scaling autonomous systems across India’s digital public infrastructure.", date: "Dec 5, 2026 · 9 AM–6 PM", location: "Jio World Convention Centre, BKC, Mumbai", format: "In person", image: enterpriseAiSummitPoster.url, imageFit: "contain", organizer: "Stage-X", registrationDeadline: "Until capacity is reached", eligibility: "Enterprise leaders, technology decision-makers, builders, and AI practitioners", teamSize: "Individual registration", fee: "See official registration", status: "Registration open", registrationUrl: "https://luma.com/y2o1cuts", overview: "Stage-X Enterprise AI Summit Mumbai brings together people, ideas, and real-world impact around India Stack, scale, and digital public infrastructure. The Mumbai gathering focuses on deploying enterprise AI and scaling autonomous systems, as part of the Nine Cities, One Mission global summit network.", schedule: [{ title: "Registration", date: "Open now", description: "Register through the official event page while places remain." }, { title: "Enterprise AI Summit", date: "Dec 5, 2026 · 9 AM–6 PM", description: "A full day at Jio World Convention Centre focused on enterprise AI at scale." }] },

  // PAST COMPLETED EVENTS (Concluded before Nov 18, 2026)
  { slug: "vecna-verse-2026", title: "VECNA VERSE", type: "Hackathon", tag: "National Level Hackathon", description: "Enter the unknown, build the impossible, and compete for prizes, opportunities, and national recognition.", date: "Oct 24–25, 2026", location: "Online round · Offline finale for qualifiers", format: "Hybrid", prize: "₹3 lakh+", image: vecnaVersePoster.url, imageFit: "contain", organizer: "Vybe Driven · RAAHIWORKS", registrationDeadline: "Concluded", eligibility: "B.Sc, B.Tech, B.E, M.Tech, PhD, and Diploma students from any year; cross-college, cross-branch, and cross-year teams welcome", teamSize: "Up to 4 members", fee: "See official registration", status: "Past event", registrationUrl: "https://forms.gle/cchs5bTCBp5N9g9X9", groupUrl: "https://chat.whatsapp.com/Bq82iqnQZz58uJbRp2k2C9", groupLabel: "Join WhatsApp Group for Details", overview: "VECNA VERSE is a national-level hackathon presented by Vybe Driven and powered by RAAHIWORKS. Participants entered an online first round (Oct 24–25) before qualifying teams advanced to an offline finale. The ₹3 lakh+ prize pool was joined by cash prizes, internship and job opportunities, exclusive goodies, platform credits, and networking with industry experts.", schedule: [{ title: "Registration", date: "Concluded", description: "Team registration concluded." }, { title: "Round 1 · Online", date: "Oct 24–25, 2026", description: "Teams competed online during the first qualifying round." }, { title: "Round 2 · Offline Finale", date: "Concluded", description: "Qualifying teams competed in the offline finale." }] },
  {
    slug: "adappt-5-0",
    title: "ADAPPT 5.0",
    type: "Hackathon",
    tag: "Venture Sprint · Overnight",
    description: "An innovation-driven challenge where you pitch, build, adapt & evolve your idea through technical twists and expert interactions.",
    date: "Oct 23–24, 2026",
    location: "MPSTME, Mumbai",
    format: "Hybrid",
    prize: "₹50,000",
    perks: [
      {
        icon: "rocket",
        emoji: "⛱️",
        title: "Staycation for Winners",
        description: "Special staycation package awarded to the top winning team.",
      },
      {
        icon: "award",
        emoji: "📜",
        title: "Certificates from GfK, Partners & BMW",
        description: "Official co-branded certificates recognized by top global and tech organizations.",
      },
      {
        icon: "gift",
        emoji: "🎁",
        title: "Hampers Worth 10K & Goodies",
        description: "Gift hampers for winners and runner-ups plus free goodies for Round 2 qualifiers.",
      },
      {
        icon: "laptop",
        emoji: "💼",
        title: "Internship Opportunities",
        description: "Direct internship opportunities for top performing builders.",
      },
      {
        icon: "handshake",
        emoji: "🤝",
        title: "Industrial Connections",
        description: "Build relationships and interact with industry evaluators and technical mentors.",
      },
    ],
    image: "/events/adappt-5-0.webp",
    imageFit: "contain",
    imagePosition: "center top",
    organizer: "IETE-SF MPSTME · Vybe Driven",
    registrationDeadline: "Oct 19, 2026",
    eligibility: "College students, developers, and tech innovators · Teams of 1–4 members across any branch and year",
    teamSize: "1–4 members",
    fee: "₹300 per participant",
    status: "Past event",
    registrationUrl: "https://adappt.ietempstme.com/",
    contacts: [
      { name: "Arnab Mukhopadhyay", phone: "+918104530548" },
      { name: "Arushi Dube", phone: "+919137086087" },
    ],
    relatedLinks: [
      { label: "Official ADAPPT 5.0 Website", url: "https://adappt.ietempstme.com/" },
      { label: "IETE-SF MPSTME Portal", url: "https://ietempstme.com" },
    ],
    overview: "ADAPPT 5.0 Venture Sprint is an innovation-driven challenge presented by IETE-SF MPSTME in collaboration with Vybe Driven and GeeksforGeeks. Participants selected a challenge across three core domains: 1) Cybersecurity in Smart Homes, 2) AI in FoodTech, and 3) Robotics & Automation in Natural Disaster Management. In Round 1, submitted their solution deck and video pitch. Shortlisted teams advanced to an intense 24-hour overnight development challenge at MPSTME Mumbai, adapting their code to live technical twists.",
    schedule: [
      { title: "Round 1 · Online Idea Pitch", date: "Deadline: Oct 19, 2026", description: "Problem statement selection and PPT pitch submission." },
      { title: "Shortlist Announcement", date: "Oct 20–21, 2026", description: "Top performing teams selected for the offline round." },
      { title: "Round 2 · Overnight Sprint", date: "Oct 23–24, 2026", description: "Overnight technical development at MPSTME, Mumbai." },
    ],
  },
  { slug: "inspire-colloquium-2026", title: "INSPIRE Colloquium 2026", type: "Hackathon", tag: "Research / Innovation", description: "Present your research or idea at IEEE SLRTCE's research and idea colloquium.", date: "Oct 17, 2026 · 9 AM–5 PM", location: "SLRTCE Campus, Mira Road, Mumbai", format: "In person", image: inspirePoster.url, imagePosition: "center top", imageFit: "contain", organizer: "IEEE SLRTCE · Mumbai Tech Community", registrationDeadline: "Oct 11, 2026", eligibility: "UG & Diploma: teams of 2–4 · PG & PhD: individual · Inter-college participants welcome", teamSize: "2–4 members (UG & Diploma) or individual (PG & PhD)", fee: "₹300 per team for shortlisted teams", status: "Past event", registrationUrl: "https://inspire-colloquium.vercel.app/", contacts: [{ name: "Krishna Dubey", phone: "+919321599039" }, { name: "Shweta Mishra", phone: "+919768122297" }, { name: "Meet Shah", phone: "+919987594531" }], overview: "INSPIRE 2026 is a research and idea colloquium by IEEE SLRTCE, presented with Mumbai Tech Community as Community Partner. Interdisciplinary next-generation scientific ideas, research, and exploration — aligned with the UN Sustainable Development Goals.", schedule: [{ title: "Registration opens", date: "Sep 21, 2026", description: "Register on the official INSPIRE Colloquium website." }, { title: "Colloquium day", date: "Oct 17, 2026 · 9 AM–5 PM", description: "Present at SLRTCE Campus, Mira Road, Mumbai." }] },
  { slug: "ipl-innovation-pitch-league-2026", title: "IPL – Innovation Pitch League", type: "Hackathon", tag: "Innovation / Talent", description: "A two-day IPL-inspired experience combining placements, an auction, team building, and a six-hour innovation hackathon.", date: "Oct 9–10, 2026 · 8 AM", location: "SIES Graduate School of Technology, Nerul", format: "In person", prize: "₹30,000", image: iplPoster.url, imageFit: "contain", organizer: "IET On Campus SIES GST", registrationDeadline: "Concluded", eligibility: "Individual participation; shortlisted participants advance from aptitude, GD, and resume review", teamSize: "Individual entry; selected teams have 1 captain, 5 participants, and a mentor", fee: "₹100 per participant", status: "Past event", registrationUrl: "https://forms.gle/Ku84EXvjiFvU25us9", contacts: [{ name: "Gaurav", phone: "+918850439707" }, { name: "Ovee", phone: "+918850544242" }, { name: "Sudhanshu", phone: "+919325959412" }, { name: "Taazeen", phone: "+918591524096" }], relatedLinks: [{ label: "Event website", url: "https://iet-ipl-2026.vercel.app" }], overview: "IET On Campus SIES GST presented a two-day, IPL-inspired mega event with a mock placement experience, internship opportunities, talent auction, leadership and team-building activities, food, and a six-hour hackathon.", schedule: [{ title: "Innovation Challenge", date: "Oct 10, 2026", description: "Teams competed in a six-hour hackathon on real-world industry problems." }] },
  { slug: "elevate-1-0-2026", title: "ELEVATE 1.0", type: "Hackathon", tag: "National / 24 Hours", description: "A national-level 24-hour hackathon where teams turn real-world challenges into working technology solutions.", date: "Oct 10–11, 2026", location: "Dwarkadas J. Sanghvi College of Engineering, Mumbai", format: "In person", prize: "₹1,00,000+", image: elevatePoster.url, imageFit: "contain", organizer: "DJS NSDC × DJS InfoMatrix", registrationDeadline: "Oct 3, 2026", eligibility: "Builders ready to tackle real-world challenges at a national-level hackathon", teamSize: "Team participation", fee: "See official registration", status: "Past event", registrationUrl: "https://unstop.com/o/PMU41BH", contacts: [{ name: "Vrindaa Talwar", phone: "+919419253635" }, { name: "Swayam Panchal", phone: "+919833507492" }, { name: "Samarth Bhirud", phone: "+918408917498" }], relatedLinks: [{ label: "Explore ELEVATE 1.0", url: "https://elevate1-0.vercel.app/" }], overview: "ELEVATE 1.0 was a national-level hackathon organised by DJS NSDC and DJS InfoMatrix, with Mumbai Tech Community as Community Partner. Across 24 hours, participants tackled real-world challenges and built working solutions.", schedule: [{ title: "Hackathon begins", date: "Oct 10, 2026", description: "Teams started 24 hours of coding, building, and problem-solving." }, { title: "Final demos and awards", date: "Oct 11, 2026", description: "Teams presented solutions and winners were awarded." }] },
  { slug: "unicorn-ai-gpu-pre-summit", title: "UNICORN × AI × GPU Pre Summit", type: "Networking", tag: "GPU / Datacentre", description: "A focused Mumbai connect for GPU and datacentre leaders.", date: "Oct 15, 2026 · 4–6 PM", location: "Earth Cafe @ BKC, Bandra East, Mumbai", format: "In person", image: unicornSummitPoster.url, imageFit: "contain", organizer: "GPU.NET", registrationDeadline: "Concluded", eligibility: "GPU, AI infrastructure, and datacentre leaders and professionals", teamSize: "Individual registration", fee: "See official registration", status: "Past event", registrationUrl: "https://luma.com/d1f99fgo", overview: "GPU.NET presented the UNICORN × AI × GPU Pre Summit in Mumbai, bringing GPU and datacentre leaders together for an evening of focused conversation and connections at Earth Cafe in BKC.", schedule: [{ title: "Leaders connect", date: "Oct 15, 2026 · 4–6 PM", description: "Met GPU and datacentre leaders at Earth Cafe @ BKC in Mumbai." }] },
  { slug: "structuring-the-ai-way", title: "Structuring the AI Way", type: "Meetup", tag: "AI / Financial Workflows", description: "See how AI transforms complex structuring workflows into fast, reliable execution.", date: "Oct 24, 2026 · 10 AM–1 PM", location: "Mumbai, Maharashtra", format: "In person", image: structuringAiPoster.url, imageFit: "contain", organizer: "Kannan · OpenArrow", registrationDeadline: "Concluded", eligibility: "Wealth managers, bank relationship managers, structured product issuers", teamSize: "Individual registration", fee: "See official registration", status: "Past event", registrationUrl: "https://luma.com/c6v1qjx0", registrationLabel: "Request to join", overview: "An exclusive OpenArrow walkthrough showing how intelligent automation can reduce manual term-sheet friction, accelerate pricing workflows, and improve desk efficiency.", schedule: [{ title: "Live walkthrough", date: "Oct 24, 2026 · 10 AM", description: "AI-driven structuring, term-sheet generation, risk modelling, and desk execution in practice." }] },
  { slug: "ai-at-work-copilot-apps-agents", title: "AI at Work: Copilot, Apps & Agents", type: "Meetup", tag: "AI-Native Work", description: "A closed-door Mumbai session with real demonstrations and candid discussion about AI at work.", date: "Oct 24, 2026 · 11 AM–3 PM", location: "Mumbai, Maharashtra", format: "In person", image: aiAtWorkPoster.url, imageFit: "contain", organizer: "Mumbai Techy", registrationDeadline: "Concluded", eligibility: "Operators, builders, and decision-makers interested in practical AI adoption", teamSize: "Individual registration", fee: "See official registration", status: "Past event", registrationUrl: "https://luma.com/gbzxsgj4", registrationLabel: "Join waitlist", overview: "AI at Work was an exclusive, limited-seat session for operators, builders, and decision-makers exploring practical AI adoption, live demonstrations, and candid conversation about Copilot, Apps, and Agents.", schedule: [{ title: "AI at Work session", date: "Oct 24, 2026 · 11 AM–3 PM", description: "Explored practical uses of Copilot, Apps, and Agents through live demonstrations." }] },
  { slug: "clinical-ai-summit-2026", title: "Clinical AI Summit 2026", type: "Conference", tag: "Healthcare AI / Clinical Practice", description: "A clinician-led summit on practical AI deployment, governance, diagnostics, and patient care.", date: "Oct 11, 2026 · 8:30–9:30 PM", location: "ITC Grand Central, Parel, Mumbai", format: "In person", image: clinicalAiPoster.url, imageFit: "contain", organizer: "TIS-H", registrationDeadline: "Concluded", eligibility: "Healthcare professionals, researchers, clinicians, and technology innovators", teamSize: "Individual registration", fee: "₹4,500", status: "Past event", registrationUrl: "https://luma.com/3fs83hz8", registrationNote: "This event has concluded.", relatedLinks: [{ label: "Event website", url: "https://tish-summit.com" }], overview: "Clinical AI Summit 2026 was a focused gathering exploring how artificial intelligence is reshaping clinical practice, diagnostics, and patient care.", schedule: [{ title: "Clinical AI Summit", date: "Oct 11, 2026 · 8:30–9:30 PM", description: "Clinician-led session at ITC Grand Central in Parel, Mumbai." }] },
  { slug: "durable-devops-tech-meetup", title: "Durable DevOps Tech Meetup", type: "Meetup", tag: "DevOps / AI / Tech Careers", description: "A practical Mumbai meetup on DevOps, AI, careers, community, and resilient applications.", date: "Oct 17, 2026 · 6–9 PM", location: "Bhim Nagar, Andheri East, Mumbai", format: "In person", image: durableDevOpsPoster.url, imageFit: "contain", organizer: "Merge & Rise × Temporal Community", registrationDeadline: "Concluded", eligibility: "Engineers and professionals across DevOps and AI", teamSize: "Individual registration", fee: "See official registration", status: "Past event", registrationUrl: "https://luma.com/uvc7v42g", overview: "Merge & Rise and Temporal presented a practical tech meetup covering DevOps, AI, careers, and resilient applications in Andheri East, Mumbai.", schedule: [{ title: "Career and DevOps sessions", date: "Oct 17, 2026", description: "Women’s career panel and DevOps career discussion in the era of AI." }] },
  { slug: "ai-automation-human-touch", title: "AI, Automation & the Human Touch", type: "Meetup", tag: "AI / Customer Relationships", description: "An interactive Thane meetup about balancing intelligent automation with genuine human connection.", date: "Oct 31, 2026 · 1–3 PM", location: "Ricci's caffè, Hiranandani Estate, Thane", format: "In person", image: allInOnePoster.url, imageFit: "contain", organizer: "Allin1Place Mumbai Chapter", registrationDeadline: "Concluded", eligibility: "Professionals and builders interested in AI and customer relationships", teamSize: "Individual registration", fee: "Free", status: "Past event", registrationUrl: "https://luma.com/rt22ydyb", registrationLabel: "Request to join", overview: "The Allin1Place Mumbai Mini-Meetup explored where AI can help teams work smarter, what should be automated, and where human connection still matters.", schedule: [{ title: "Activities and discussion", date: "Oct 31, 2026 · 1 PM", description: "Explored automation, human-centred customer relationships, and real-world AI use cases." }] },
];

export function getOpportunity(slug: string): Opportunity | undefined {
  const seed = opportunities.find((item) => item.slug === slug);
  if (seed) return seed;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem("hd_hosted_events");
      if (raw) {
        const hosted = JSON.parse(raw);
        const found = hosted.find((item) => item.slug === slug);
        if (found) return found;
      }
    } catch {
      // Fallback
    }
  }
  return undefined;
}
