import prisma from "@/lib/db/prisma";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import { updateCourse } from "../../actions";

export default async function EditCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // 1. Get course ID from URL
  const { id } = await params;

  // 2. Get logged-in user
  const user = await currentUser();
  if (!user) redirect("/sign-in");

  // 3. Fetch course from DB
  const course = await prisma.course.findUnique({
    where: { id },
  });

  // 4. Course doesn't exist → 404
  if (!course) notFound();

  // 5. Check: Does THIS user own THIS course? (SECURITY)
  if (course.instructorId !== user.id) {
    redirect("/dashboard");  // Not their course, kick them out
  }

  return (
    <Container className="flex flex-col items-center justify-center min-h-screen py-12">
      <div className="w-full max-w-lg space-y-8">
        {/* Back button */}
        <Link href="/dashboard" className="text-sm text-primary/80 hover:text-primary transition-colors mb-4 block">
          ← Back to Dashboard
        </Link>

        <div className="text-center">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">
            Course settings
          </p>
          <h2 className="text-3xl sm:text-4xl font-semibold tracking-tight">Edit Course</h2>
        </div>

        {/* Form */}
        <div className="rounded-3xl border border-border/70 bg-card/80 p-6 sm:p-8 shadow-lg">
          <form
            action={async (formData) => {
              "use server";

              // Get form values
              const title = (formData.get("title") as string)?.trim();
              const description = (formData.get("description") as string)?.trim() || null;
              const price = Number(formData.get("price") || 0);

              // Validate
              if (!title) throw new Error("Title required");

              // Call updateCourse from actions.ts
              await updateCourse(id, { title, description, price });
            }}
            className="space-y-5"
          >
            {/* Title field */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={course.title}  // ← Pre-fill with current title
                required
              />
            </div>

            {/* Description field */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={course.description || ""}  // ← Pre-fill
                rows={4}
                required
              />
            </div>

            {/* Price field */}
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD)</Label>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                max="1000000"
                step="0.10"
                defaultValue={course.price.toString()}
                required
              />
              <p className="text-xs text-muted-foreground">Adjust pricing carefully—updates apply immediately.</p>
            </div>

            {/* Submit button */}
            <Button type="submit" className="w-full">
              Update Course
            </Button>
          </form>
        </div>
      </div>
    </Container>
  );
}
