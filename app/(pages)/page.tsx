import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BookOpen, GraduationCap, Video, ArrowRight, CheckCircle } from "lucide-react";

export const revalidate = 3600;

export default function Page() {
  const features = [
    {
      icon: Video,
      title: "Learn from YouTube",
      description: "Access curated educational content from the best creators",
    },
    {
      icon: GraduationCap,
      title: "Expert Instructors",
      description: "Learn from industry professionals and experienced educators",
    },
    {
      icon: BookOpen,
      title: "Structured Learning",
      description: "Follow organized courses with chapters and lessons",
    },
  ];

  const stats = [
    { value: "10+", label: "Courses" },
    { value: "100+", label: "Students" },
    { value: "5+", label: "Instructors" },
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 lg:py-28">
        <Container className="relative z-10">
          <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-4">
                Premium learning platform
              </p>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold text-foreground mb-6">
                Transform YouTube into an elegant learning experience.
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground mb-8">
                LUMA turns scattered content into beautifully structured courses
                with chapters, lessons, and clarity for both students and instructors.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/Courses">
                  <Button size="lg" className="w-full sm:w-auto gap-2">
                    Browse Courses
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto">
                    Get Started
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-xl backdrop-blur">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Featured course</p>
                    <h3 className="text-xl font-semibold mt-2">Designing with Clarity</h3>
                  </div>
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Video className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="space-y-3">
                  {["Foundations", "Visual Systems", "Crafted Delivery"].map((item) => (
                    <div
                      key={item}
                      className="flex items-center justify-between rounded-2xl border border-border/70 bg-background/70 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <span className="text-sm text-foreground/80">{item}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">12 min</span>
                    </div>
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Curated by LUMA</span>
                  <span className="text-sm font-semibold text-foreground">$49</span>
                </div>
              </div>
              
            </div>
          </div>
        </Container>
      </section>

      {/* Features Section */}
      <section className="py-16 sm:py-24 border-y border-border/70">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4">Why Choose LUMA?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We bring structure to online learning with curated content from the best educators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group p-6 rounded-2xl border border-border/70 bg-card/80 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Stats Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-border/70 bg-card/80 px-6 py-8 text-center shadow-sm">
                <div className="text-4xl sm:text-5xl font-semibold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* For Instructors Section */}
      <section className="py-16 sm:py-24 bg-muted/40">
        <Container>
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-semibold mb-4">
                  Become an Instructor
                </h2>
                <p className="text-muted-foreground mb-6">
                  Share your knowledge and earn. Create courses using YouTube videos 
                  and reach students worldwide.
                </p>
                <ul className="space-y-3">
                  {[
                    "Zero video hosting costs",
                    "Easy course creation",
                    "Built-in monetization",
                    "Reach global audience",
                  ].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <Link href="/sign-up">
                    <Button className="gap-2">
                      Start Teaching
                      <ArrowRight className="w-4 h-4" />
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-video rounded-3xl border border-border/70 bg-card/80 flex items-center justify-center shadow-lg">
                  <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                    <GraduationCap className="h-12 w-12 text-primary" />
                  </div>
                </div>
                
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-24">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-semibold mb-4">
              Ready to Start Learning?
            </h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of students learning on LUMA today. Browse our courses 
              and start your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/Courses">
                <Button size="lg" className="w-full sm:w-auto">
                  Explore All Courses
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Create Free Account
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/70 py-8">
        <Container>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} LUMA. All rights reserved.
            </p>
            <div className="flex gap-6">
              <Link href="/Courses" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Courses
              </Link>
              <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </div>
          </div>
        </Container>
      </footer>
    </main>
  );
}
