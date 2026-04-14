"use server";

import prisma from "@/lib/db/prisma";
import { requireCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";

const MIN_PRICE = 0;
const MAX_PRICE = 1000000;

async function requireInstructorId() {
  const user = await requireCurrentUser();

  if ((user.publicMetadata.role as string | undefined) !== "INSTRUCTOR") {
    throw new Error("Unauthorized");
  }

  return user.id;
}

export async function deleteCourse(courseId: string) {
  const userId = await requireInstructorId();
  const course = await prisma.course.findUnique({
    where: { id: courseId },
  });

  if (!course || course.instructorId !== userId) {
    throw new Error("Unauthorized: You can only delete your own courses");
  }

  await prisma.course.delete({
    where: { id: courseId },
  });

  revalidateTag("course:list", "max");
  revalidateTag(`course:${courseId}`, "max");

  redirect("/dashboard");
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
    throw new Error("Title is required");
  }

  if (data.price < MIN_PRICE || data.price > MAX_PRICE) {
    throw new Error(`Price must be between $${MIN_PRICE} and $${MAX_PRICE}`);
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

  redirect("/dashboard");
}
