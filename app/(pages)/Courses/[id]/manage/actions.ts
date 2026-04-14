"use server";

import prisma from "@/lib/db/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { revalidateTag } from "next/cache";

async function requireInstructorId() {
  const user = await requireCurrentUser();

  if ((user.publicMetadata.role as string | undefined) !== "INSTRUCTOR") {
    throw new Error("Unauthorized");
  }

  return user.id;
}

export async function updateCourse(
  courseId: string,
  data: { title: string; description: string | null; price: number }
) {
  const userId = await requireInstructorId();
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course || course.instructorId !== userId) {
    throw new Error("Unauthorized");
  }

  if (!data.title?.trim()) {
    throw new Error("Title required");
  }

  if (data.price < 0 || data.price > 1000000) {
    throw new Error("Price must be between 0 and 1,000,000");
  }

  await prisma.course.update({
    where: { id: courseId },
    data: {
      title: data.title.trim(),
      description: data.description?.trim() || null,
      price: data.price,
    },
  });

  revalidateTag("course:list", "max");
  revalidateTag(`course:${courseId}`, "max");
}

export async function createChapter(courseId: string, title: string) {
  const userId = await requireInstructorId();
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course || course.instructorId !== userId) {
    throw new Error("Unauthorized");
  }

  if (!title?.trim()) {
    throw new Error("Chapter title required");
  }

  const chapterCount = await prisma.chapter.count({
    where: { courseId },
  });

  const chapter = await prisma.chapter.create({
    data: {
      title: title.trim(),
      courseId,
      order: chapterCount + 1,
    },
  });

  revalidateTag(`course:${courseId}`, "max");
  return chapter;
}

export async function updateChapter(chapterId: string, title: string) {
  const userId = await requireInstructorId();
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });

  if (!chapter || chapter.course.instructorId !== userId) {
    throw new Error("Unauthorized");
  }

  if (!title?.trim()) {
    throw new Error("Chapter title required");
  }

  const updated = await prisma.chapter.update({
    where: { id: chapterId },
    data: { title: title.trim() },
  });

  revalidateTag(`course:${chapter.courseId}`, "max");
  return updated;
}

export async function deleteChapter(chapterId: string) {
  const userId = await requireInstructorId();
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });

  if (!chapter || chapter.course.instructorId !== userId) {
    throw new Error("Unauthorized");
  }

  const deleted = await prisma.chapter.delete({
    where: { id: chapterId },
  });

  revalidateTag(`course:${chapter.courseId}`, "max");
  return deleted;
}

export async function createLesson(
  chapterId: string,
  data: {
    title: string;
    youtubeVideoId: string;
    description: string | null;
  }
) {
  const userId = await requireInstructorId();
  const chapter = await prisma.chapter.findUnique({
    where: { id: chapterId },
    include: { course: true },
  });

  if (!chapter || chapter.course.instructorId !== userId) {
    throw new Error("Unauthorized");
  }

  if (!data.title?.trim()) {
    throw new Error("Lesson title required");
  }

  if (!data.youtubeVideoId?.trim()) {
    throw new Error("YouTube ID required");
  }

  const lessonCount = await prisma.lesson.count({
    where: { chapterId },
  });

  const lesson = await prisma.lesson.create({
    data: {
      title: data.title.trim(),
      youtubeVideoId: data.youtubeVideoId.trim(),
      description: data.description?.trim() || null,
      chapterId,
      order: lessonCount + 1,
    },
  });

  revalidateTag(`course:${chapter.courseId}`, "max");
  return lesson;
}

export async function updateLesson(
  lessonId: string,
  data: {
    title: string;
    youtubeVideoId: string;
    description: string | null;
  }
) {
  const userId = await requireInstructorId();
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });

  if (!lesson || lesson.chapter.course.instructorId !== userId) {
    throw new Error("Unauthorized");
  }

  if (!data.title?.trim()) {
    throw new Error("Lesson title required");
  }

  if (!data.youtubeVideoId?.trim()) {
    throw new Error("YouTube ID required");
  }

  const updated = await prisma.lesson.update({
    where: { id: lessonId },
    data: {
      title: data.title.trim(),
      youtubeVideoId: data.youtubeVideoId.trim(),
      description: data.description?.trim() || null,
    },
  });

  revalidateTag(`course:${lesson.chapter.courseId}`, "max");
  return updated;
}

export async function deleteLesson(lessonId: string) {
  const userId = await requireInstructorId();
  const lesson = await prisma.lesson.findUnique({
    where: { id: lessonId },
    include: { chapter: { include: { course: true } } },
  });

  if (!lesson || lesson.chapter.course.instructorId !== userId) {
    throw new Error("Unauthorized");
  }

  const deleted = await prisma.lesson.delete({
    where: { id: lessonId },
  });

  revalidateTag(`course:${lesson.chapter.courseId}`, "max");
  return deleted;
}
