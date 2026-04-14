import prisma from "@/lib/db/prisma";
import { unstable_cache } from "next/cache";

export const getCourseContent = (id: string) =>
  unstable_cache(
    async () =>
      prisma.course.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          price: true,
          instructorId: true,
          chapters: {
            orderBy: { order: "asc" },
            select: {
              id: true,
              title: true,
              order: true,
              lessons: {
                orderBy: { order: "asc" },
                select: {
                  id: true,
                  title: true,
                  description: true,
                  youtubeVideoId: true,
                  order: true,
                },
              },
            },
          },
        },
      }),
    ["course:content", id],
    { tags: [`course:${id}`], revalidate: 300 }
  )();

export const getCoursePublic = (id: string) =>
  unstable_cache(
    async () =>
      prisma.course.findUnique({
        where: { id },
        select: {
          id: true,
          title: true,
          description: true,
          price: true,
          instructorId: true,
          instructor: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      }),
    ["course:public", id],
    { tags: [`course:${id}`], revalidate: 300 }
  )();
