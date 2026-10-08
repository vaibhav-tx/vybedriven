# Complete HackDriven event journey

## Build
- Add the confirmed Instagram profile and contact email to the footer and contact page.
- Make light-theme navigation artwork monochrome by default, with a green circular active state; preserve the current dark theme.
- Give every opportunity a stable URL and richer event information from the shared event source.
- Add a public event-detail page with overview, schedule, eligibility, format, location, prize, organizer, and a clear registration action.
- Connect homepage, Hackathons, Events, and Discover cards to the matching detail page.
- Replace touched dead links with working destinations and avoid presenting unavailable actions as functional.

## Experience details
- Follow the familiar Unstop/Hackbriven flow: summary first, key facts at a glance, full details, then a persistent action area.
- Keep sample event information internally consistent and clearly mark registration status when no live external registration URL exists.
- Preserve the current homepage design, authentication, profile flow, and dark theme.

## Technical details
- Keep event content in one shared data module and navigate through a typed `/opportunities/$slug` route.
- Add unique metadata and a not-found state for event details.
- Verify desktop and mobile rendering, keyboard navigation, all touched links, and clean runtime/build logs.