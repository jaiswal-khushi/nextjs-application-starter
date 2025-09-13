# Plan for Buyer Lead Intake App

## Information Gathered
- **Existing Setup:** Next.js 15+ with App Router, TypeScript, shadcn/ui, Tailwind CSS, and UI components already configured in `src/`. This provides a solid foundation for building the app without starting from scratch.
- **Task Requirements:** Build a lead management app with CRUD, search/filter, CSV import/export, auth, validations, and quality features. Key constraints include exact data models, pages, ownership, and scoring criteria.
- **Dependencies Needed:** Prisma (for SQLite DB + migrations), Zod (validation), NextAuth or simple auth lib (for demo login), additional libs for CSV handling (e.g., papaparse), rate limiting (e.g., express-rate-limit or custom), and testing (Jest).
- **Data Model:** Two tables (`buyers`, `buyer_history`) with specific fields, enums, and validations. Enums must be strictly enforced.
- **Pages/Flows:** 3 main pages with SSR, pagination, URL sync, concurrency, and history. CSV features with transactional safety.
- **Auth:** Demo login (hardcoded users) for simplicity; ownership checks on edit/delete.
- **Quality:** Unit test, rate limit, error boundary, empty states, accessibility basics.
- **Nice-to-Haves:** Implement 2-3 (tag chips with typeahead, status quick-actions, full-text search).
- **Constraints:** No comments in code, use existing UI components, ensure SSR for data fetching.

## Plan: Detailed Code Update Plan at File Level
1. **Setup Database & Auth (Foundation):**
   - Install dependencies: `prisma`, `@prisma/client`, `zod`, `next-auth`, `papaparse`, `express-rate-limit`, `@types/papaparse`, `jest`, `@testing-library/react`.
   - Create `prisma/schema.prisma`: Define `buyers` and `buyer_history` tables with exact fields, enums, and relations.
   - Create `src/lib/db.ts`: Prisma client setup.
   - Create `src/lib/auth.ts`: Simple demo auth with hardcoded users (e.g., user1, admin).
   - Run `npx prisma generate` and `npx prisma db push` for migrations.

2. **Data Models & Validations:**
   - Create `src/lib/validations.ts`: Zod schemas for buyer creation/update, CSV import, with all rules (e.g., phone length, budget logic, conditional bhk).
   - Create `src/types/buyer.ts`: TypeScript types for buyers and history.

3. **Auth & Middleware:**
   - Create `src/app/api/auth/[...nextauth]/route.ts`: NextAuth setup for demo login.
   - Create `src/middleware.ts`: Auth middleware for protected routes.
   - Create `src/components/AuthGuard.tsx`: Wrapper for auth checks.

4. **API Routes (Backend Logic):**
   - Create `src/app/api/buyers/route.ts`: GET (list with filters/search/pagination), POST (create with validation + history).
   - Create `src/app/api/buyers/[id]/route.ts`: GET (view), PUT (edit with concurrency + history), DELETE (ownership check).
   - Create `src/app/api/buyers/import/route.ts`: POST for CSV import (validate rows, transactional insert, return errors).
   - Create `src/app/api/buyers/export/route.ts`: GET for CSV export (respect filters).
   - Add rate limiting to create/update routes (e.g., 10 req/min per user).

5. **Pages (Frontend):**
   - Create `src/app/buyers/new/page.tsx`: Form with Zod validation, conditional fields (bhk), submit to API.
   - Create `src/app/buyers/page.tsx`: SSR list with pagination, filters (URL params), search (debounced), sort, table with actions.
   - Create `src/app/buyers/[id]/page.tsx`: View/edit form, concurrency check, history display (last 5).
   - Update `src/app/layout.tsx`: Add auth provider, error boundary, empty states.

6. **Components & UI:**
   - Create `src/components/BuyerForm.tsx`: Reusable form for create/edit with validations.
   - Create `src/components/BuyerTable.tsx`: Table for list with quick-actions (status dropdown).
   - Create `src/components/TagChips.tsx`: Typeahead for tags.
   - Create `src/components/HistoryList.tsx`: Display history changes.
   - Create `src/components/ErrorBoundary.tsx`: Global error handling.
   - Create `src/components/EmptyState.tsx`: For no data scenarios.
   - Leverage existing shadcn/ui components (e.g., Button, Input, Table, Dialog).

7. **CSV & Extras:**
   - Implement import/export logic in API routes using papaparse.
   - Add full-text search (on fullName/email/notes) using Prisma's search capabilities.
   - Add optimistic updates with rollback for edits.

8. **Testing & Quality:**
   - Create `src/__tests__/validations.test.ts`: Unit test for Zod validators (e.g., budget logic).
   - Add accessibility: ARIA labels, keyboard navigation, error announcements.
   - Ensure responsive design using Tailwind.

9. **README & Deployment:**
   - Update `README.md`: Setup instructions, features, scoring notes.
   - Optional: Configure for Vercel deploy (add vercel.json if needed).

## Dependent Files to be Edited/Created
- **New Files:** prisma/schema.prisma, src/lib/db.ts, src/lib/auth.ts, src/lib/validations.ts, src/types/buyer.ts, src/middleware.ts, src/components/AuthGuard.tsx, src/components/BuyerForm.tsx, src/components/BuyerTable.tsx, src/components/TagChips.tsx, src/components/HistoryList.tsx, src/components/ErrorBoundary.tsx, src/components/EmptyState.tsx, src/app/api/auth/[...nextauth]/route.ts, src/app/api/buyers/route.ts, src/app/api/buyers/[id]/route.ts, src/app/api/buyers/import/route.ts, src/app/api/buyers/export/route.ts, src/app/buyers/new/page.tsx, src/app/buyers/page.tsx, src/app/buyers/[id]/page.tsx, src/__tests__/validations.test.ts.
- **Edited Files:** package.json (add deps), src/app/layout.tsx (add providers), README.md (update docs).
- **No Breaking Changes:** Existing files (e.g., globals.css) remain untouched per rules.

## Followup Steps
- Install dependencies and run Prisma setup.
- Implement and test each section incrementally (e.g., auth first, then CRUD).
- Run unit tests and manual QA (CRUD, filters, CSV, concurrency).
- Commit changes meaningfully (e.g., "feat: setup Prisma schema").
- Test locally on http://localhost:8000.
- Optional: Deploy to Vercel and update README.
- Verify scoring criteria: Correctness/UX (30), Code Quality (20), Validation/Safety (15), Data/SSR (15), Import/Export (10), Polish/Extras (10).
