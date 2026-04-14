import prisma from "@/lib/db/prisma";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckoutButton } from "./checkout-button";
import { getCoursePublic } from "@/lib/course-queries";

export default async function CoursePage({
	params,
}: {
	params: Promise<{ id: string }>; // next js 16 bs
}) {
	const { id } = await params; // ← AWAIT params

	const [course, user] = await Promise.all([getCoursePublic(id), currentUser()]);

	if (!course) notFound();
	const isOwner = user?.id === course.instructorId;

	let isEnrolled = false;
	if (user) {
		isEnrolled = !!(await prisma.enrollment.findUnique({
			where: {
				userId_courseId: {
					userId: user.id,
					courseId: id,
				},
			},
		}));
	}
	return (
		<Container className="py-10 sm:py-16 max-w-3xl">
			<Link
				href="/Courses"
				className="text-sm text-primary/80 hover:text-primary transition-colors mb-4 sm:mb-6 block"
			>
				← Back to Courses
			</Link>

			<div className="rounded-3xl border border-border/70 bg-card/80 p-6 sm:p-8 shadow-lg backdrop-blur">
				<div className="flex flex-wrap items-center gap-3 mb-4">
					<Badge variant="secondary" className="rounded-full">Premium course</Badge>
					<Badge variant="outline" className="rounded-full">
						{(typeof course.price === "number"
							? course.price
							: typeof course.price === "string"
								? Number(course.price)
								: course.price.toNumber()) === 0 ? "Free" : "Paid"}
					</Badge>
				</div>
				<h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold">
					{course.title}
				</h1>
				<p className="text-muted-foreground mt-2 text-sm sm:text-base">
					by {course.instructor.name || course.instructor.email}
				</p>
				<p className="mt-4 text-muted-foreground text-sm sm:text-base">
					{course.description || "No description provided"}
				</p>
				<div className="mt-6 flex items-center justify-between">
					<p className="text-3xl sm:text-4xl font-semibold text-foreground">
						${(typeof course.price === "number"
							? course.price
							: typeof course.price === "string"
								? Number(course.price)
								: course.price.toNumber()
						).toFixed(2)}
					</p>
					<span className="text-sm text-muted-foreground">Lifetime access</span>
				</div>

				<div className="mt-6">
					{isOwner ? (
						<Link href={`/course/${id}/view`}>
							<Button className="w-full">View Course</Button>
						</Link>
					) : user ? (
						isEnrolled ? (
							<Link href={`/course/${id}/view`}>
								<Button className="w-full">View Course</Button>
							</Link>
						) : (
							<CheckoutButton
								courseId={id}
								price={(typeof course.price === "number"
									? course.price
									: typeof course.price === "string"
										? Number(course.price)
										: course.price.toNumber()
								).toFixed(2)}
							/> // ← CHANGE: use id, not params.id
						)
					) : (
						<Link href="/sign-in">
							<Button className="w-full">Sign in to buy</Button>
						</Link>
					)}
				</div>
			</div>
		</Container>
	);
}
