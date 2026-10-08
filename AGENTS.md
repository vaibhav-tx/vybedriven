# Architecture Decisions

- Use shared event data and reusable listing controls across public discovery routes so content and filters stay consistent.
- Keep authentication-required profile surfaces under the managed protected route layout so public event pages remain shareable.
- Centralize client authentication state in the root provider so navigation and protected account surfaces share one session source.
- Use stable opportunity slugs and one public detail route so every discovery card has a complete, shareable destination.
- Store fixed website photography, event posters, and partner logos as local CDN asset pointers so the experience stays reliable without runtime hotlinks.
