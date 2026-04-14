"use client";

// Imports: We bring in needed hooks and UI components for handling state, navigation, and design
import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

// Actions for updating/creating/removing courses, chapters, and lessons (server-side)
import {
  updateCourse,
  createChapter,
  updateChapter,
  deleteChapter,
  createLesson,
  updateLesson,
  deleteLesson,
} from "./actions";

// --- INTERFACES ------
// These define the shape of our data objects, so TypeScript helps us avoid mistakes.

// One lesson in a chapter
interface Lesson {
  id: string;
  title: string;
  youtubeVideoId: string | null;
  description: string | null;
  order: number; // For sorting/ordering in UI
}

// A chapter, can have multiple lessons
interface Chapter {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

// Course with multiple chapters, price is a string for easier state management
interface CourseData {
  id: string;
  title: string;
  description: string | null;
  price: string;
  chapters: Chapter[];
}

// MAIN REACT CLIENT COMPONENT
// Lets instructors manage a course: edit course info, chapters, and lessons
export function ManageChaptersClient({
  course: initialCourse, // from parent/server, this is our starting course data (props)
}: {
  course: CourseData;
}) {
  const router = useRouter(); // Next router (for client-side navigation and refreshes)
  // useTransition is for handling UI during async actions (like "Saving...", disabling buttons, etc.)
  const [isPending, startTransition] = useTransition();

  // All our state hooks:

  // Course state — Actual course data as we manipulate fields on the page
  const [course, setCourse] = useState(initialCourse);

  // Set of expanded chapter IDs. Which chapters are "opened"/expanded to show their lessons in the UI?
  const [expandedChapters, setExpandedChapters] = useState<Set<string>>(
    new Set()
  );

  // Show "Add Chapter" form?
  const [addingChapter, setAddingChapter] = useState(false);
  // "New chapter" title text box value
  const [newChapterTitle, setNewChapterTitle] = useState("");
  // Which chapter ID is currently showing the "Add Lesson" form? (null if none)
  const [addingLessonTo, setAddingLessonTo] = useState<string | null>(null);
  // State for new lesson form fields
  const [newLesson, setNewLesson] = useState({
    title: "",
    youtubeVideoId: "",
    description: "",
  });

  // Toggle expand/collapse for a chapter. Updates the expandedChapters Set.
  const toggleChapter = (chapterId: string) => {
    const newSet = new Set(expandedChapters);
    if (newSet.has(chapterId)) {
      newSet.delete(chapterId);
    } else {
      newSet.add(chapterId);
    }
    setExpandedChapters(newSet);
  };

  // SUBMIT COURSE FORM — Edit title, description, price etc. Validate first, then call the server action
  const handleUpdateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    startTransition(async () => {
      try {
        await updateCourse(course.id, {
          title: course.title,
          description: course.description,
          price: parseFloat(course.price),
        });
        toast.success("Course saved successfully!");
        router.push("/dashboard"); // Redirect to dashboard (fresh data)
      } catch (error) {
        toast.error("Error: " + (error instanceof Error ? error.message : "Unknown"));
      }
    });
  };

  // ADD A CHAPTER (triggered from UI). Validates then calls action
  const handleAddChapter = async () => {
    if (!newChapterTitle.trim()) {
      toast.error("Chapter title required");
      return;
    }
    startTransition(async () => {
      try {
        const created = await createChapter(course.id, newChapterTitle);
        toast.success("Chapter added!");
        setCourse((prev) => ({
          ...prev,
          chapters: [
            ...prev.chapters,
            {
              ...created,
              lessons: [],
            },
          ].sort((a, b) => a.order - b.order),
        }));
        setExpandedChapters((prev) => new Set(prev).add(created.id));
        setNewChapterTitle("");
        setAddingChapter(false);
      } catch (error) {
        toast.error("Error: " + (error instanceof Error ? error.message : "Unknown"));
      }
    });
  };

  // DELETE A CHAPTER (with confirm)
  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm("Delete this chapter and all lessons?")) return;
    startTransition(async () => {
      try {
        await deleteChapter(chapterId);
        toast.success("Chapter deleted");
        setCourse((prev) => ({
          ...prev,
          chapters: prev.chapters.filter((ch) => ch.id !== chapterId),
        }));
        setExpandedChapters((prev) => {
          const next = new Set(prev);
          next.delete(chapterId);
          return next;
        });
      } catch (error) {
        toast.error("Error: " + (error instanceof Error ? error.message : "Unknown"));
      }
    });
  };

  // Add a lesson to a chapter. Shows add lesson form, validates, and syncs
  const handleAddLesson = async (chapterId: string) => {
    if (!newLesson.title.trim() || !newLesson.youtubeVideoId.trim()) {
      toast.error("Lesson title and YouTube ID required");
      return;
    }
    startTransition(async () => {
      try {
        const created = await createLesson(chapterId, {
          title: newLesson.title,
          youtubeVideoId: newLesson.youtubeVideoId,
          description: newLesson.description || null,
        });
        toast.success("Lesson added!");
        setCourse((prev) => ({
          ...prev,
          chapters: prev.chapters.map((ch) =>
            ch.id === chapterId
              ? { ...ch, lessons: [...ch.lessons, created].sort((a, b) => a.order - b.order) }
              : ch
          ),
        }));
        setNewLesson({ title: "", youtubeVideoId: "", description: "" });
        setAddingLessonTo(null);
      } catch (error) {
        toast.error("Error: " + (error instanceof Error ? error.message : "Unknown"));
      }
    });
  };
  // Delete a lesson (shows confirmation dialog)
  const handleDeleteLesson = async (lessonId: string) => {
    if (!confirm("Delete this lesson?")) return;
    startTransition(async () => {
      try {
        await deleteLesson(lessonId);
        toast.success("Lesson deleted");
        setCourse((prev) => ({
          ...prev,
          chapters: prev.chapters.map((ch) => ({
            ...ch,
            lessons: ch.lessons.filter((lesson) => lesson.id !== lessonId),
          })),
        }));
      } catch (error) {
        toast.error("Error: " + (error instanceof Error ? error.message : "Unknown"));
      }
    });
  };

  // JSX return — This is the main UI for managing a course and its chapters/lessons
  return (
    <>
      {/* 
        COURSE INFO FORM
        - Allows editing main title, description, and price of the course.
        - Controlled inputs reflect current state.
        - Submitting triggers handleUpdateCourse
      */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Course Information</CardTitle>
          <CardDescription>Set the essentials students will see first.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            <div>
              <Label htmlFor="title">Title</Label>
              {/* Controlled input for course title */}
              <Input
                id="title"
                value={course.title}
                onChange={(e) =>
                  setCourse({ ...course, title: e.target.value })
                }
                required
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              {/* Controlled textarea for description */}
              <Textarea
                id="description"
                value={course.description || ""}
                onChange={(e) =>
                  setCourse({ ...course, description: e.target.value })
                }
                rows={4}
              />
            </div>

            <div>
              <Label htmlFor="price">Price (USD)</Label>
              {/* Controlled input for price. Value is string for controlled input, convert as needed */}
              <Input
                id="price"
                type="number"
                min="0"
                max="1000000"
                step="0.01"
                value={course.price}
                onChange={(e) =>
                  setCourse({ ...course, price: e.target.value })
                }
                required
              />
            </div>

            {/* Save button disables during pending requests */}
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/******************
             CHAPTERS UI
        - List all chapters.
        - Can edit title, delete, expand/collapse to reveal lessons.
        - Each chapter displays a "Add Lesson" button and its own lessons.
        - "Add Chapter" button at bottom.
      ******************/}
      <Card>
        <CardHeader>
          <CardTitle>Manage Chapters</CardTitle>
          <CardDescription>Organize lessons into a clear path.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* If no chapters, show message */}
          {course.chapters.length === 0 ? (
            <p className="text-muted-foreground">
              No chapters yet. Add one to get started.
            </p>
          ) : (
            <div className="space-y-3">
              {/* For each chapter: */}
              {course.chapters.map((chapter) => (
                <div key={chapter.id} className="border border-border/70 rounded-2xl p-4 space-y-3 bg-card/70">
                  {/* Chapter header: Title, Expand/Collapse, Edit and Delete buttons */}
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleChapter(chapter.id)}
                      className="flex items-center gap-2 flex-1 text-left font-medium hover:text-primary"
                    >
                      {/* Arrow looks different for expanded vs collapsed */}
                      <span>
                        {expandedChapters.has(chapter.id) ? "▼" : "▶"}
                      </span>
                      {chapter.title}
                    </button>

                    {/* Edit and Delete chapter controls */}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          // Simple prompt dialog for new title
                          const newTitle = prompt(
                            "New chapter title:",
                            chapter.title
                          );
                          if (newTitle) {
                            // Edits use server action and on success, page refreshes
                            startTransition(async () => {
                              try {
                                const updated = await updateChapter(chapter.id, newTitle);
                                setCourse((prev) => ({
                                  ...prev,
                                  chapters: prev.chapters.map((ch) =>
                                    ch.id === updated.id ? { ...ch, title: updated.title } : ch
                                  ),
                                }));
                                toast.success("Chapter updated");
                              } catch (error) {
                                toast.error("Error: " + (error instanceof Error ? error.message : "Unknown"));
                              }
                            });
                          }
                        }}
                        disabled={isPending}
                      >
                        Edit
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteChapter(chapter.id)}
                        disabled={isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>

                  {/* When chapter is expanded, display its lessons and the "Add Lesson" form */}
                  {expandedChapters.has(chapter.id) && (
                    <div className="ml-6 space-y-2">
                      {/* If no lessons: */}
                      {chapter.lessons.length === 0 ? (
                        <p className="text-sm text-muted-foreground">
                          No lessons yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {/* Show each lesson in this chapter */}
                          {chapter.lessons.map((lesson) => (
                    <div
                              key={lesson.id}
                              className="flex items-center justify-between p-3 bg-muted/60 rounded-xl border border-border/60"
                            >
                              <div className="flex-1">
                                <p className="text-sm font-medium">
                                  • {lesson.title}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  ID: {lesson.youtubeVideoId}
                                </p>
                              </div>

                              {/* Edit and Delete lesson controls */}
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => {
                                    // Use prompt to edit the lesson title only (but submit full data)
                                    const newTitle = prompt(
                                      "New lesson title:",
                                      lesson.title
                                    );
                                    if (newTitle) {
                                      startTransition(async () => {
                                        try {
                                          const updated = await updateLesson(lesson.id, {
                                            title: newTitle,
                                            youtubeVideoId: lesson.youtubeVideoId || "",
                                            description: lesson.description,
                                          });
                                          setCourse((prev) => ({
                                            ...prev,
                                            chapters: prev.chapters.map((ch) => ({
                                              ...ch,
                                              lessons: ch.lessons.map((l) =>
                                                l.id === updated.id ? { ...l, title: updated.title } : l
                                              ),
                                            })),
                                          }));
                                          toast.success("Lesson updated");
                                        } catch (error) {
                                          toast.error("Error: " + (error instanceof Error ? error.message : "Unknown"));
                                        }
                                      });
                                    }
                                  }}
                                  disabled={isPending}
                                >
                                  Edit
                                </Button>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleDeleteLesson(lesson.id)}
                                  disabled={isPending}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* "Add Lesson" form: Only show for the active chapter being added to */}
                      {addingLessonTo === chapter.id ? (
                        <div className="space-y-2 p-2 bg-accent/20 rounded">
                          {/* Lesson title input */}
                          <Input
                            placeholder="Lesson title"
                            value={newLesson.title}
                            onChange={(e) =>
                              setNewLesson({
                                ...newLesson,
                                title: e.target.value,
                              })
                            }
                          />
                          {/* YouTube video id input */}
                          <Input
                            placeholder="YouTube Video ID (e.g., dQw4w9WgXcQ)"
                            value={newLesson.youtubeVideoId}
                            onChange={(e) =>
                              setNewLesson({
                                ...newLesson,
                                youtubeVideoId: e.target.value,
                              })
                            }
                          />
                          {/* Optional description */}
                          <Textarea
                            placeholder="Lesson description (optional)"
                            value={newLesson.description}
                            onChange={(e) =>
                              setNewLesson({
                                ...newLesson,
                                description: e.target.value,
                              })
                            }
                            rows={2}
                          />
                          {/* Save/Cancel buttons for the lesson form */}
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAddLesson(chapter.id)}
                              disabled={isPending}
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setAddingLessonTo(null);
                                setNewLesson({
                                  title: "",
                                  youtubeVideoId: "",
                                  description: "",
                                });
                              }}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        // "Add lesson" button (shows the above form when clicked)
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setAddingLessonTo(chapter.id)}
                        >
                          + Add Lesson
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 
            "Add Chapter" form appears when addingChapter is true.
            Otherwise, show a button to start adding a chapter.
          */}
          {addingChapter ? (
            <div className="space-y-2 p-4 bg-accent/20 rounded">
              <Input
                placeholder="Chapter title"
                value={newChapterTitle}
                onChange={(e) => setNewChapterTitle(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleAddChapter}
                  disabled={isPending}
                >
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setAddingChapter(false);
                    setNewChapterTitle("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              onClick={() => setAddingChapter(true)}
              className="w-full"
            >
              + Add Chapter
            </Button>
          )}
        </CardContent>
      </Card>
    </>
  );
}
