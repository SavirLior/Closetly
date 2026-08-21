# Closetly

Closetly is an AI-powered personal wardrobe and outfit stylist. Its defining rule is simple: every recommendation is built from clothes the user actually owns.

The included V1 is a complete consumer-facing demo with onboarding, image upload and multi-item review, AI analysis fallback, wardrobe search/filter/favorites, item details, deterministic outfit scoring, three-look generation, locked items, per-piece replacement, feedback, saved looks, and editable preferences.

## Stack

- Next.js 16, React 19, strict TypeScript, Tailwind CSS
- Reusable shadcn-style UI primitives and Lucide icons
- PostgreSQL with Prisma ORM and pgvector for production data
- Cloudflare D1/R2 adapters for Sites-hosted demo persistence and uploads
- Provider interfaces for clothing vision, outfit ranking, embeddings, weather, background removal, auth, and S3-compatible object storage
- Zod validation at every AI and API boundary

## Local development

Requirements: Node.js 22+, PostgreSQL 16+ with the `vector` extension, and npm.

```bash
cp .env.example .env
npm install
npm run db:prisma:generate
npm run db:prisma:migrate
npm run db:seed
npm run dev
```

Open `http://localhost:3000`. `DEMO_MODE=true` provides a complete wardrobe and realistic AI fallback without external keys. The first screen offers onboarding or immediate demo exploration.

## Database

`prisma/schema.prisma` is the production PostgreSQL schema. It includes user ownership on every user-specific entity, Auth.js-compatible accounts/sessions, confidence-aware analysis fields, normalized outfit relations, feedback, saved-look snapshots, indexes, and a pgvector embedding column.

Set `DATABASE_URL` to the pooled application URL and `DIRECT_URL` to a direct connection for migrations. Apply committed migrations with:

```bash
npm run db:prisma:migrate
```

The initial SQL migration lives in `prisma/migrations/202608210001_init/migration.sql`. It enables pgvector and creates an HNSW cosine-similarity index.

Sites deployment uses the logical `DB` D1 binding for lightweight hosted-demo persistence and `WARDROBE_IMAGES` for R2. The PostgreSQL/Prisma model remains the production source of truth when deploying to a conventional Next.js runtime.

## Demo data

Run `npm run db:seed` to create `demo@closetly.style`, its preferences, and 17 representative wardrobe pieces. The browser demo also ships with the same data so the product can be evaluated before a database is connected.

## AI providers

Set `AI_PROVIDER=demo` for the zero-key provider. The application depends on interfaces, not a vendor SDK:

- `ClothingVisionProvider` analyzes one image and may return multiple detected pieces.
- `OutfitAIProvider` ranks pre-generated candidate combinations and may use only supplied wardrobe IDs.
- `EmbeddingProvider` supports text and image embeddings.

Provider contracts are in `lib/ai/providers.ts`; Zod schemas are in `lib/ai/schemas.ts`; prompts are isolated in `lib/ai/prompts.ts`. To switch providers:

1. Implement the relevant interface.
2. Validate the provider response with the existing Zod schema.
3. Select it in the server-side provider factory using `AI_PROVIDER`.
4. Set its secret in the runtime environment. Never expose it with a `NEXT_PUBLIC_` prefix.

The `ClothingAnalysisService` never stores raw model output without validation. The prompt forbids guessing brands, prices, or exact fabrics and requires confidence scores for uncertain attributes.

## Outfit pipeline

`OutfitGenerationService`:

1. Parses the request context.
2. Applies occasion, formality, season, weather, and locked-item constraints.
3. Generates valid top + bottom + shoes combinations, with optional outerwear.
4. Scores color, style, formality, silhouette, season, and learned preference fit.
5. Sends only the top candidates to the ranking provider.
6. Validates and returns three wardrobe-only looks.

Weights live in `lib/outfit-engine/outfit-scoring.service.ts`. Color coordination is a flexible signal, not a hard rule.

## Images and storage

Production uploads belong in S3-compatible object storage (AWS S3, Cloudflare R2, or MinIO). `ObjectStorageProvider` isolates storage from UI and AI services. Images are validated server-side by MIME type and size; database rows store object keys and ownership metadata. `BackgroundRemovalProvider` is optional and falls back to a no-op provider.

## Authentication and security

The Sites build uses platform-issued authenticated identity headers and server-side ownership. The production Prisma schema is compatible with passwordless email authentication and later Google/Apple OAuth through the `Account`, `Session`, and `VerificationToken` models.

Security boundaries:

- Server-side user identity for all writes
- User ID scoping on all queries and relations
- Zod validation for API/AI inputs
- 10 MB image limit and explicit MIME allowlist in the upload flow
- No raw AI output is trusted
- Secrets only through environment variables
- No wardrobe data is sent to outfit AI until deterministic retrieval narrows the candidates

Set `DEMO_MODE=false` in a non-Sites production deployment to reject anonymous API requests.

## Useful commands

```bash
npm run dev                 # local development
npm run build               # production build
npm run lint                # lint
npm run db:generate         # generate D1/Drizzle migration
npm run db:prisma:generate  # generate Prisma client
npm run db:prisma:migrate   # apply PostgreSQL migrations
npm run db:seed             # seed demo wardrobe
```
