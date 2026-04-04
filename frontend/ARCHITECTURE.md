# Frontend Architecture

This frontend now uses Next.js App Router with route groups:

- `src/app/user` for storefront UX
- `src/app/(admin)` for dashboard and operational routes

Core rules:

- Route files compose screens only.
- Feature modules own `components`, `hooks`, `services`, and `types`.
- Cross-feature concerns live in `src/shared`.
- Legacy compatibility imports are preserved through `src/lib/*` and existing UI components.

Suggested expansion path:

1. Move remaining route-specific hooks from legacy locations into the owning feature module.
2. Move reusable design-system pieces into `src/shared/components` if you want a stricter shared boundary.
3. Add server actions or repository adapters per feature when backend contracts stabilize.
