# Calio architecture

## Product boundary

Calio separates the public website, interactive demo, authenticated product, persistence, and billing concerns. The current release implements the first two and defines the database contract for the authenticated product.

```text
Next.js application
├── Public marketing site
├── Local interactive demo
├── Authenticated workspace (next milestone)
└── Server-side data access layer (next milestone)
        │
        ▼
Supabase
├── Authentication
├── PostgreSQL
├── Row Level Security
└── Storage
```

Billing is not coupled to the workspace model. A later provider integration will translate verified webhook events into internal plan entitlements without making product components depend on Paystack, Lemon Squeezy, Paddle, or Stripe-specific objects.

## Domain model

- A user owns a profile.
- A workspace contains content, pillars, and members.
- A workspace member has an `owner`, `editor`, or `viewer` role.
- A content item belongs to exactly one workspace and can reference one pillar.
- Platform selections are stored as a constrained text array until platform-specific publishing behavior exists.

## Authorization

Every workspace table has Row Level Security enabled. Membership checks are centralized in security-definer functions so policies remain consistent and avoid recursive membership queries.

Client-side visibility is never treated as authorization. The authenticated application must perform a secure workspace membership check for every mutation, even when invoked through a Server Action.

## Demo persistence

The demo stores `ContentItem[]` under the `calio-demo-content-v2` local-storage key. Demo records intentionally use the same field names as the cloud `content_items` table, which keeps the eventual migration explicit.

## Next milestones

1. Provision Supabase and apply the initial migration.
2. Implement email and OAuth authentication.
3. Add a server-only data-access layer and workspace selection.
4. Replace demo persistence with optimistic cloud mutations.
5. Add invitations and realtime collaboration.
6. Select and integrate the South African-compatible billing provider.
