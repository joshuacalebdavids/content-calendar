# Calio architecture

## Product boundary

Calio separates the public website, authenticated interactive workspace, persistence, and billing concerns. The current release implements public marketing, Neon-managed identity, protected workspace access, and local content persistence.

```text
Next.js application
├── Public marketing site
├── Neon Auth proxy and session middleware
├── Authenticated interactive workspace
└── Server-side data access layer (next milestone)
        │
        ▼
Neon
├── Managed Better Auth
├── Lakebase Postgres
└── Branch-first infrastructure configuration
```

Billing is not coupled to the workspace model. A later provider integration will translate verified webhook events into internal plan entitlements without making product components depend on Paystack, Lemon Squeezy, Paddle, or Stripe-specific objects.

## Domain model

- A user owns a profile.
- A workspace contains content, pillars, and members.
- A workspace member has an `owner`, `editor`, or `viewer` role.
- A content item belongs to exactly one workspace and can reference one pillar.
- Platform selections are stored as a constrained text array until platform-specific publishing behavior exists.

## Authorization

The `/demo` route is protected by Neon Auth middleware and restores the signed-in session from secure cookies. Future workspace tables must enforce membership within the server-side data layer for every read and mutation.

Client-side visibility is never treated as authorization. The authenticated application must perform a secure workspace membership check for every mutation, even when invoked through a Server Action.

## Demo persistence

The demo stores `ContentItem[]` under the `calio-demo-content-v2` local-storage key. Demo records intentionally use the same field names as the cloud `content_items` table, which keeps the eventual migration explicit.

## Next milestones

1. Add a server-only Lakebase Postgres data-access layer and workspace selection.
2. Replace local demo persistence with authorized cloud mutations.
3. Adapt the legacy schema draft in `supabase/migrations` for Neon-managed user IDs.
4. Add invitations and realtime collaboration.
5. Configure custom SMTP and production trusted domains before launch.
6. Select and integrate the South African-compatible billing provider.
