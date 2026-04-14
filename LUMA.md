# LUMA (project notes)

This file is a lightweight, internal-ish overview of how the app is wired today. It’s intentionally short and based on what’s currently in the repo (not a wish-list).

## Core domain

Models live in `prisma/schema.prisma`:

- **User**
  - Auth is handled by Clerk.
  - The DB stores `User.clerkId` (unique) to link a Clerk user to app data.
  - `role`: `STUDENT` or `INSTRUCTOR`.
- **Course**
  - Owned by an instructor via `instructorId` (stores the instructor’s **Clerk user id**).
  - Has optional Stripe product/price IDs.
- **Chapter** → **Lesson**
  - Ordered by `order`.
  - Cascade delete: deleting a Course deletes its Chapters; deleting a Chapter deletes its Lessons.
- **Enrollment**
  - Join table: (`userId`, `courseId`) is unique.
  - `userId` is the **Clerk user id** (stored in the `Enrollment.userId` field).
- **StripeWebhookEvent**
  - Stores processed Stripe event IDs to avoid double-processing.

## Key routes (App Router)

- **Course list**: `app/(pages)/Courses/page.tsx`
  - Cached with `unstable_cache` and revalidated via the `course:list` tag.
- **Course landing page**: `app/(pages)/course/[id]/page.tsx`
  - Shows price and a CTA:
    - Owner (instructor) → “View course”
    - Enrolled student → “View course”
    - Otherwise → checkout (or sign-in)
- **Course content (gated)**: `app/(pages)/course/[id]/view/page.tsx`
  - Access allowed if user is:
    - the instructor (`user.id === course.instructorId`), OR
    - enrolled (`Enrollment` exists for `user.id + courseId`)
- **Instructor dashboard**: `app/(pages)/dashboard/page.tsx`
  - Uses Clerk `publicMetadata.role` to decide instructor vs student UI.
- **Course builder**: `app/(pages)/Courses/[id]/manage/*`
  - Instructor-only server actions for:
    - updating course fields
    - creating/updating/deleting chapters
    - creating/updating/deleting lessons

## File map

Use this as “where do I change X?”.

### App Router pages (UI)

- **Home / marketing**: `app/(pages)/page.tsx`
- **Courses (catalog)**: `app/(pages)/Courses/page.tsx`
  - Server page; lists courses with `unstable_cache` (`course:list` tag).
- **Course landing + buy CTA**: `app/(pages)/course/[id]/page.tsx`
  - Shows course details; decides between sign-in, checkout, or “View Course”.
- **Course content (gated)**: `app/(pages)/course/[id]/view/page.tsx`
  - Checks instructor or `Enrollment` before rendering `StudentView`.
- **Course content UI (client)**: `app/(pages)/course/[id]/view/student-view.tsx`
  - Client-side course player/lesson UI (receives serialized course data).
- **Dashboard**: `app/(pages)/dashboard/page.tsx`
  - Instructor dashboard (owned courses) vs student dashboard (enrolled courses).
- **Edit course settings**: `app/(pages)/dashboard/[id]/edit/page.tsx`
  - Server page; owner-only edit form that calls dashboard `updateCourse`.
- **Create course**: `app/(pages)/create/page.tsx`
  - Client form that submits to `app/(pages)/create/action` (course creation).
- **Course builder (server loader)**: `app/(pages)/Courses/[id]/manage/page.tsx`
  - Server page; owner-only; loads chapters/lessons and renders the client builder.
- **Course builder UI (client)**: `app/(pages)/Courses/[id]/manage/manage-client.tsx`
  - Instructor UI for editing course fields + managing chapters/lessons.
- **Course builder actions (server)**: `app/(pages)/Courses/[id]/manage/actions.ts`
  - Instructor-only mutations; calls Prisma and `revalidateTag(course:list, course:${id})`.
- **Onboarding / role picker**: `app/(pages)/onboarding/page.tsx`
  - Forces users to pick STUDENT vs INSTRUCTOR (uses Clerk metadata + DB as fallback).
- **Auth pages**: `app/(pages)/sign-in/*`, `app/(pages)/sign-up/*`
  - Clerk-provided sign-in/up routes.
- **Placeholder**: `app/(pages)/bootcamp/page.tsx`

### API routes (server)

- **Stripe webhook**: `app/api/webhooks/stripe/route.ts`
  - Handles `checkout.session.completed`, dedupes via `StripeWebhookEvent`, upserts `User` and `Enrollment`.

### Shared server helpers (`lib/`)

- **Prisma client (Neon adapter)**: `lib/db/prisma.ts`
- **Auth helper**: `lib/auth.ts` (`requireCurrentUser()`)
- **Course queries (cached)**: `lib/course-queries.ts`
  - `getCoursePublic()`, `getCourseContent()` with `course:${id}` cache tag.
- **Stripe client**: `lib/stripe.ts` (`stripe()` reads `STRIPE_SECRET_KEY`)
- **Serialization helpers**: `lib/serialize.ts`
  - Converts Prisma `Decimal` prices to strings for client components.
- **YouTube helpers**: `lib/youtube.ts` (`extractYouTubeId()`)
- **Tailwind class helper**: `lib/utils.ts` (`cn()`)

### Database (`prisma/`)

- **Schema**: `prisma/schema.prisma` (User/Course/Chapter/Lesson/Enrollment/StripeWebhookEvent)
- **Migrations**: `prisma/migrations/*`
- **Seed**: `prisma/seed.js` (run via `pnpm db:seed`)

## Stripe flow (current implementation)

- Checkout completion is handled by `app/api/webhooks/stripe/route.ts`.
- Only `checkout.session.completed` is processed.
- Expected metadata on the Checkout Session:
  - `userId` (Clerk user id)
  - `courseId` (Course id)
- On webhook:
  - Create `StripeWebhookEvent` row (`eventId` unique).
  - Upsert a `User` row for that `clerkId` (email placeholder: `${userId}@clerk.local`).
  - Upsert an `Enrollment` for (`userId`, `courseId`).

## Caching / revalidation

- Course list and course content use Next cache tags:
  - `course:list`
  - `course:${courseId}`
- Instructor mutations call `revalidateTag(...)` after writes.

## Local development quick checklist

- Fill `.env` (see `.env.example`)
- Run Prisma generate/migrate
- Optional seed: `pnpm db:seed`