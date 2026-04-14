/* eslint-disable @typescript-eslint/no-require-imports */
const { PrismaClient } = require("@prisma/client");
const { PrismaNeon } = require("@prisma/adapter-neon");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not set");
}

const prisma = new PrismaClient({
  adapter: new PrismaNeon({ connectionString: process.env.DATABASE_URL }),
});

const users = [
  {
    id: "seed-user-instructor-design",
    clerkId: "seed_instructor_design",
    name: "Maya Chen",
    email: "maya@luma.seed",
    role: "INSTRUCTOR",
  },
  {
    id: "seed-user-instructor-fullstack",
    clerkId: "seed_instructor_fullstack",
    name: "Arjun Patel",
    email: "arjun@luma.seed",
    role: "INSTRUCTOR",
  },
  {
    id: "seed-user-instructor-ai",
    clerkId: "seed_instructor_ai",
    name: "Elena Ruiz",
    email: "elena@luma.seed",
    role: "INSTRUCTOR",
  },
  {
    id: "seed-user-student-1",
    clerkId: "seed_student_1",
    name: "Nora Blake",
    email: "nora@luma.seed",
    role: "STUDENT",
  },
  {
    id: "seed-user-student-2",
    clerkId: "seed_student_2",
    name: "Samir Khan",
    email: "samir@luma.seed",
    role: "STUDENT",
  },
  {
    id: "seed-user-student-3",
    clerkId: "seed_student_3",
    name: "Ivy Morgan",
    email: "ivy@luma.seed",
    role: "STUDENT",
  },
];

const courses = [
  {
    id: "seed-course-react-foundations",
    title: "React Foundations for Builders",
    description:
      "A clean introduction to React fundamentals, state, component composition, and real UI thinking.",
    instructorId: "seed_instructor_fullstack",
    price: 0,
    chapters: [
      {
        id: "seed-chapter-react-1",
        title: "React Mental Model",
        order: 1,
        lessons: [
          {
            id: "seed-lesson-react-1",
            title: "Why React works",
            description: "Understand components, props, and the render model.",
            youtubeVideoId: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
            order: 1,
          },
          {
            id: "seed-lesson-react-2",
            title: "State and events",
            description: "Handle user input without turning your UI into a mess.",
            youtubeVideoId: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
            order: 2,
          },
          {
            id: "seed-lesson-react-3",
            title: "Lists and composition",
            description: "Build reusable views from small components.",
            youtubeVideoId: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
            order: 3,
          },
        ],
      },
      {
        id: "seed-chapter-react-2",
        title: "Hooks in practice",
        order: 2,
        lessons: [
          {
            id: "seed-lesson-react-4",
            title: "useState and useEffect",
            description: "Apply hooks without cargo-culting them.",
            youtubeVideoId: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
            order: 1,
          },
          {
            id: "seed-lesson-react-5",
            title: "Data flow patterns",
            description: "Keep state close to where it matters.",
            youtubeVideoId: "https://www.youtube.com/watch?v=Ke90Tje7VS0",
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: "seed-course-typescript-teams",
    title: "TypeScript for Real Projects",
    description:
      "Learn the parts of TypeScript that actually matter when codebases get large and messy.",
    instructorId: "seed_instructor_fullstack",
    price: 0,
    chapters: [
      {
        id: "seed-chapter-ts-1",
        title: "TypeScript basics that stick",
        order: 1,
        lessons: [
          {
            id: "seed-lesson-ts-1",
            title: "The type system without the fluff",
            description: "Build intuition for unions, narrowing, and structural typing.",
            youtubeVideoId: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
            order: 1,
          },
          {
            id: "seed-lesson-ts-2",
            title: "Functions, objects, and interfaces",
            description: "Write types that stay useful as requirements change.",
            youtubeVideoId: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
            order: 2,
          },
        ],
      },
      {
        id: "seed-chapter-ts-2",
        title: "Practical patterns",
        order: 2,
        lessons: [
          {
            id: "seed-lesson-ts-3",
            title: "Typing async workflows",
            description: "Model server responses and failure states cleanly.",
            youtubeVideoId: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
            order: 1,
          },
          {
            id: "seed-lesson-ts-4",
            title: "Refactoring with confidence",
            description: "Use the compiler as leverage instead of fighting it.",
            youtubeVideoId: "https://www.youtube.com/watch?v=BwuLxPH8IDs",
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: "seed-course-ui-systems",
    title: "Design Systems with Taste",
    description:
      "Build interfaces that look intentional, scale across screens, and avoid generic component soup.",
    instructorId: "seed_instructor_design",
    price: 0,
    chapters: [
      {
        id: "seed-chapter-design-1",
        title: "Visual hierarchy",
        order: 1,
        lessons: [
          {
            id: "seed-lesson-design-1",
            title: "Typography and spacing",
            description: "Make screens readable before making them flashy.",
            youtubeVideoId: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
            order: 1,
          },
          {
            id: "seed-lesson-design-2",
            title: "Color and contrast",
            description: "Create a palette that feels like a product, not a template.",
            youtubeVideoId: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
            order: 2,
          },
        ],
      },
      {
        id: "seed-chapter-design-2",
        title: "Component language",
        order: 2,
        lessons: [
          {
            id: "seed-lesson-design-3",
            title: "Reusable UI decisions",
            description: "Turn visual choices into consistent system rules.",
            youtubeVideoId: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
            order: 1,
          },
          {
            id: "seed-lesson-design-4",
            title: "Responsive polish",
            description: "Keep layouts sharp on mobile and desktop.",
            youtubeVideoId: "https://www.youtube.com/watch?v=OXGznpKZ_sA",
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: "seed-course-node-apis",
    title: "Node APIs That Don’t Rot",
    description:
      "Build backend services with better boundaries, cleaner handlers, and fewer hidden failure modes.",
    instructorId: "seed_instructor_fullstack",
    price: 0,
    chapters: [
      {
        id: "seed-chapter-node-1",
        title: "HTTP and application structure",
        order: 1,
        lessons: [
          {
            id: "seed-lesson-node-1",
            title: "Requests, responses, and routing",
            description: "Understand the boring core well enough to move fast later.",
            youtubeVideoId: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
            order: 1,
          },
          {
            id: "seed-lesson-node-2",
            title: "Validation and error handling",
            description: "Stop leaking broken assumptions into production.",
            youtubeVideoId: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
            order: 2,
          },
        ],
      },
      {
        id: "seed-chapter-node-2",
        title: "Persistence and auth",
        order: 2,
        lessons: [
          {
            id: "seed-lesson-node-3",
            title: "Database access patterns",
            description: "Keep query logic predictable and measurable.",
            youtubeVideoId: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
            order: 1,
          },
          {
            id: "seed-lesson-node-4",
            title: "Protecting mutating routes",
            description: "Move trust boundaries to the server where they belong.",
            youtubeVideoId: "https://www.youtube.com/watch?v=TlB_eWDSMt4",
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: "seed-course-llm-product",
    title: "Shipping LLM Features Responsibly",
    description:
      "A pragmatic guide to building AI product features without hallucinating your way into a support nightmare.",
    instructorId: "seed_instructor_ai",
    price: 0,
    chapters: [
      {
        id: "seed-chapter-llm-1",
        title: "Product framing",
        order: 1,
        lessons: [
          {
            id: "seed-lesson-llm-1",
            title: "Where AI actually helps",
            description: "Choose problems where model variability is acceptable.",
            youtubeVideoId: "https://www.youtube.com/watch?v=aircAruvnKk",
            order: 1,
          },
          {
            id: "seed-lesson-llm-2",
            title: "Prompt design fundamentals",
            description: "Treat prompts like inputs to a system, not magic spells.",
            youtubeVideoId: "https://www.youtube.com/watch?v=aircAruvnKk",
            order: 2,
          },
        ],
      },
      {
        id: "seed-chapter-llm-2",
        title: "Operational safety",
        order: 2,
        lessons: [
          {
            id: "seed-lesson-llm-3",
            title: "Guardrails and evals",
            description: "Measure failure before your users do.",
            youtubeVideoId: "https://www.youtube.com/watch?v=aircAruvnKk",
            order: 1,
          },
          {
            id: "seed-lesson-llm-4",
            title: "Feedback loops",
            description: "Use production signals to improve prompts and UX.",
            youtubeVideoId: "https://www.youtube.com/watch?v=aircAruvnKk",
            order: 2,
          },
        ],
      },
    ],
  },
  {
    id: "seed-course-sql-prisma",
    title: "Prisma and SQL Without Illusions",
    description:
      "Use Prisma productively while still understanding the database work happening underneath it.",
    instructorId: "seed_instructor_ai",
    price: 0,
    chapters: [
      {
        id: "seed-chapter-prisma-1",
        title: "Data modeling",
        order: 1,
        lessons: [
          {
            id: "seed-lesson-prisma-1",
            title: "Schema design fundamentals",
            description: "Model data around query patterns, not just domain nouns.",
            youtubeVideoId: "https://www.youtube.com/watch?v=RebA5J-rlwg",
            order: 1,
          },
          {
            id: "seed-lesson-prisma-2",
            title: "Relations and constraints",
            description: "Protect data integrity before the app layer sees problems.",
            youtubeVideoId: "https://www.youtube.com/watch?v=RebA5J-rlwg",
            order: 2,
          },
        ],
      },
      {
        id: "seed-chapter-prisma-2",
        title: "Query performance",
        order: 2,
        lessons: [
          {
            id: "seed-lesson-prisma-3",
            title: "Selecting less data",
            description: "Stop dragging unnecessary payload through your app.",
            youtubeVideoId: "https://www.youtube.com/watch?v=RebA5J-rlwg",
            order: 1,
          },
          {
            id: "seed-lesson-prisma-4",
            title: "Indexes that matter",
            description: "Match indexes to actual filters, joins, and order clauses.",
            youtubeVideoId: "https://www.youtube.com/watch?v=RebA5J-rlwg",
            order: 2,
          },
        ],
      },
    ],
  },
];

const enrollments = [
  { userId: "seed_student_1", courseId: "seed-course-react-foundations" },
  { userId: "seed_student_1", courseId: "seed-course-ui-systems" },
  { userId: "seed_student_2", courseId: "seed-course-node-apis" },
  { userId: "seed_student_2", courseId: "seed-course-sql-prisma" },
  { userId: "seed_student_3", courseId: "seed-course-llm-product" },
  { userId: "seed_student_3", courseId: "seed-course-typescript-teams" },
];

async function seedUsers() {
  for (const user of users) {
    await prisma.user.upsert({
      where: { clerkId: user.clerkId },
      update: {
        name: user.name,
        email: user.email,
        role: user.role,
      },
      create: user,
    });
  }
}

async function seedCourses() {
  for (const course of courses) {
    await prisma.course.upsert({
      where: { id: course.id },
      update: {
        title: course.title,
        description: course.description,
        price: course.price,
        instructorId: course.instructorId,
        stripeProductId: null,
        stripePriceId: null,
      },
      create: {
        id: course.id,
        title: course.title,
        description: course.description,
        price: course.price,
        instructorId: course.instructorId,
      },
    });

    for (const chapter of course.chapters) {
      await prisma.chapter.upsert({
        where: { id: chapter.id },
        update: {
          title: chapter.title,
          order: chapter.order,
          courseId: course.id,
        },
        create: {
          id: chapter.id,
          title: chapter.title,
          order: chapter.order,
          courseId: course.id,
        },
      });

      for (const lesson of chapter.lessons) {
        await prisma.lesson.upsert({
          where: { id: lesson.id },
          update: {
            title: lesson.title,
            description: lesson.description,
            youtubeVideoId: lesson.youtubeVideoId,
            order: lesson.order,
            chapterId: chapter.id,
          },
          create: {
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            youtubeVideoId: lesson.youtubeVideoId,
            order: lesson.order,
            chapterId: chapter.id,
          },
        });
      }
    }
  }
}

async function seedEnrollments() {
  for (const enrollment of enrollments) {
    await prisma.enrollment.upsert({
      where: {
        userId_courseId: enrollment,
      },
      update: {},
      create: enrollment,
    });
  }
}

async function main() {
  await seedUsers();
  await seedCourses();
  await seedEnrollments();

  console.log(`Seeded ${users.length} users, ${courses.length} courses, and ${enrollments.length} enrollments.`);
}

main()
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
