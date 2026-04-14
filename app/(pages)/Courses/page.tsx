import prisma from "@/lib/db/prisma";
import { Container } from "@/components/container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { BookOpen, Search } from "lucide-react";
import { unstable_cache } from "next/cache";

export const revalidate = 300;

const getCourses = unstable_cache(
  async (page: number, pageSize: number) => {
    const take = pageSize + 1;
    return prisma.course.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        price: true,
        instructor: {
          select: {
            name: true,
            email: true,
          },
        },
        _count: {
          select: {
            chapters: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take,
      skip: (page - 1) * pageSize,
    });
  },
  ["course:list"],
  { tags: ["course:list"], revalidate: 300 }
);

export default async function CoursesPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const page = Math.max(1, Number(resolvedSearchParams?.page ?? "1") || 1);
  const pageSize = 9;
  const results = await getCourses(page, pageSize);
  const hasMore = results.length > pageSize;
  const courses = hasMore ? results.slice(0, pageSize) : results;

  return (
    <Container className="py-8 sm:py-12">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl sm:text-4xl font-semibold">All Courses</h1>
          <p className="text-muted-foreground mt-2">
            Discover courses from our expert instructors.
          </p>
        </div>
        {/* <div className="flex w-full sm:w-auto gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search courses"
              className="pl-9"
            />
          </div>
          <Button variant="outline" size="sm">
            Filters
          </Button>
        </div> */}
      </div>

      {courses.length === 0 ? (
        <EmptyState
          icon={BookOpen}
          title="No courses available"
          description="Check back soon! New courses are being added regularly."
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => {
            const priceValue =
              typeof course.price === "number"
                ? course.price
                : typeof course.price === "string"
                  ? Number(course.price)
                  : course.price.toNumber();
            const isFree = priceValue === 0;
            const chapterCount = course._count.chapters;

            return (
              <Card key={course.id} className="group overflow-hidden border border-border/70 bg-card/80 hover:shadow-lg transition-all duration-300">
                {/* Thumbnail placeholder */}
                <div className="h-48 bg-gradient-to-br from-primary/15 via-background to-background flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/10 to-transparent" />
                  <BookOpen className="text-primary w-12 h-12 relative z-10" />
                  <Badge className="absolute top-3 right-3 z-10" variant={isFree ? "secondary" : "default"}>
                    {isFree ? "Free" : `$${priceValue.toFixed(2)}`}
                  </Badge>
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="line-clamp-1 text-lg group-hover:text-primary transition-colors">
                    {course.title}
                  </CardTitle>
                  <CardDescription className="line-clamp-1">
                    by {course.instructor.name || course.instructor.email}
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground line-clamp-2 min-h-[2.5rem]">
                    {course.description || "No description provided"}
                  </p>

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{chapterCount} {chapterCount === 1 ? "chapter" : "chapters"}</span>
                    <Badge variant="outline" className="text-xs rounded-full">
                      {isFree ? "Free" : "Paid"}
                    </Badge>
                  </div>

                  <Link href={`/course/${course.id}`}>
                    <Button className="w-full">View Course</Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {(page > 1 || hasMore) && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link href={`/Courses?page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          {hasMore && (
            <Link href={`/Courses?page=${page + 1}`}>
              <Button>Load more</Button>
            </Link>
          )}
        </div>
      )}
    </Container>
  );
}
