# HackDriven navigation, discovery, and account flow

## Build
- Refine only the light-theme palette and navigation treatment using Hackbriven as visual reference; preserve the current dark theme and homepage sections.
- Replace desktop navigation labels with the supplied Home, Trophy, Events, and Compass artwork. Add clear hover tooltips, active states, keyboard focus, and a compact mobile menu.
- Route the icons to Home, Hackathons, Events, and Discover.
- Add shared event data and reusable cards/filter controls so all listing pages stay consistent.
- Build a Hackathons page for all hackathons and competitions.
- Build an Events page for meetups, conferences, and networking events.
- Build a Discover page combining every opportunity type with search and type/location/format filters.
- Build one account screen supporting email/password sign-in and signup plus Google sign-in.
- Show Sign In and Sign Up only when signed out. Show the profile control only after a verified session exists.
- Add a protected progressive profile page for name, headline, location, organization, bio, skills, interests, and portfolio links. Save data to the signed-in user's private profile record.

## Experience details
- Keep signup short, then guide new members to complete their profile after authentication.
- Preserve an intended same-origin destination through authentication.
- Include loading, validation, empty, and error states for auth, profile, and discovery filters.
- Keep existing homepage sections, cards, hero, and footer intact.

## Technical details
- Use Lovable Cloud email/password and managed Google authentication.
- Subscribe once to auth session changes in the shared navbar and clean up on unmount.
- Enforce profile ownership with row-level policies in the database.
- Use the supplied PNG artwork directly; CSS theme handling will keep the icons legible in both themes.
- Verify generated routes, responsive layouts, auth-state navigation, and clean runtime/build logs.
