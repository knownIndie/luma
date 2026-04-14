# Luma

A simple e-learning app built with **Next.js (App Router)**, **Clerk auth**, **Prisma + Postgres (Neon adapter)**, and **Stripe checkout**.

## What you can do

- **Browse courses**: `/Courses`
- **View a course landing page** (and buy if paid): `/course/[id]`
- **Access course content** if you’re the instructor or enrolled: `/course/[id]/view`
- **Instructor dashboard** (manage your courses): `/dashboard`
- **Course builder** (chapters + lessons): `/Courses/[id]/manage`

## Tech stack

- **Web**: Next.js 16, React 19, Tailwind
- **Auth**: Clerk (`@clerk/nextjs`)
- **DB**: Prisma + Postgres (`@prisma/adapter-neon`, `@neondatabase/serverless`)
- **Payments**: Stripe (Checkout + webhook)

## Local setup

### 1) Install deps

Use whatever package manager you’re using in this repo (scripts show `pnpm`, but `npm`/`yarn` can work too).

```bash
pnpm install
```

### 2) Configure env vars

Copy the template and fill in values:

```bash
cp .env.example .env
```

Required variables are in `.env.example`:
- `DATABASE_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_APP_URL`

### 3) Set up the database

This repo uses Prisma. Apply migrations (or create your own workflow) and generate the client:

```bash
pnpm prisma generate
pnpm prisma migrate dev
```

Optional: seed sample data (users, courses, chapters, lessons, enrollments):

```bash
pnpm db:seed
```

### 4) Run the app

```bash
pnpm dev
```

App runs at `http://localhost:3000` by default.

## Notes / gotchas (kept short)

- **Roles**: the app checks `user.publicMetadata.role` from Clerk. `"INSTRUCTOR"` gets the instructor dashboard + course builder; everyone else is treated as a student.
- **Course access**: `/course/[id]/view` is gated. You can view if you are the **course instructor** or have an **Enrollment** record for that course.
- **Stripe webhook**: `POST /api/webhooks/stripe` listens for `checkout.session.completed`. It records the event and upserts an `Enrollment` using `session.metadata.userId` and `session.metadata.courseId`.

## Scripts

- `pnpm dev`: run Next dev server
- `pnpm build`: build
- `pnpm lint`: lint
- `pnpm db:seed`: seed the DB from `prisma/seed.js`