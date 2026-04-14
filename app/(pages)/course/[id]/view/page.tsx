import prisma from "@/lib/db/prisma"
import { currentUser } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"
import { StudentView } from "@/app/(pages)/course/[id]/view/student-view"
import { getCourseContent } from "@/lib/course-queries"

export default async function viewcourse({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [user, courseData] = await Promise.all([currentUser(), getCourseContent(id)])
  if (!user) redirect("/sign-in")

  if (!courseData) redirect("/Courses")

  const isInstructor = user.id === courseData?.instructorId
  const isEnrolled = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId: id
      }
    }
  })

  if (!isInstructor && !isEnrolled) redirect("/Courses")

  // Convert Decimal to string for client component serialization
  const serializedCourse = {
    ...courseData,
    price: courseData.price.toString(),
  }

  return <StudentView course={serializedCourse} />
}
