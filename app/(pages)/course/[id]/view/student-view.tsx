"use client"

import { memo, useCallback, useMemo, useState } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"
import { extractYouTubeId } from "@/lib/youtube"

type SerializedLesson = {
  id: string
  title: string
  description: string | null
  youtubeVideoId: string | null
  order: number
}

type SerializedChapter = {
  id: string
  title: string
  order: number
  lessons: SerializedLesson[]
}

type SerializedCourse = {
  id: string
  title: string
  instructorId: string
  price: string
  chapters: SerializedChapter[]
}

type Chapter = SerializedCourse["chapters"][number]
type Lesson = Chapter["lessons"][number]

const Sidebar = memo(function Sidebar({
  courseTitle,
  chapters,
  expandedChapters,
  selectedLessonId,
  sidebarOpen,
  onToggleChapter,
  onSelectLesson,
}: {
  courseTitle: string
  chapters: Chapter[]
  expandedChapters: string[]
  selectedLessonId: string
  sidebarOpen: boolean
  onToggleChapter: (chapterId: string) => void
  onSelectLesson: (lessonId: string) => void
}) {
  return (
    <div
      className={`fixed lg:static top-16 lg:top-0 left-0 z-50 h-[calc(100vh-4rem)] lg:h-screen w-[85vw] max-w-sm lg:w-80 border-r border-border/70 bg-card/90 backdrop-blur overflow-y-auto transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      }`}
    >
      <div className="p-5 lg:p-6 border-b border-border/70">
        <h2 className="text-lg lg:text-xl font-semibold">{courseTitle}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          {chapters.length} chapters
        </p>
      </div>

      <div className="p-4">
        {chapters.map((chapter) => (
          <div key={chapter.id} className="mb-3">
            <button
              onClick={() => onToggleChapter(chapter.id)}
              className="w-full flex items-center gap-2 p-3 rounded-xl hover:bg-accent text-left"
            >
              {expandedChapters.includes(chapter.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronUp className="w-4 h-4" />
              )}
              <span className="font-medium text-sm">{chapter.title}</span>
            </button>

            {expandedChapters.includes(chapter.id) && (
              <div className="ml-3 mt-2 space-y-1">
                {chapter.lessons.map((lesson: Lesson) => (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson(lesson.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedLessonId === lesson.id
                        ? "bg-primary/10 text-foreground"
                        : "hover:bg-accent"
                    }`}
                  >
                    {lesson.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
})

export function StudentView({ course }: { course: SerializedCourse }) {
  const [expandedChapters, setExpandedChapters] = useState<string[]>([
    course.chapters[0]?.id || ""
  ])
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    course.chapters[0]?.lessons[0]?.id || ""
  )
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeVideoLessonId, setActiveVideoLessonId] = useState<string>("")

  const toggleChapter = useCallback((chapterId: string) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId]
    )
  }, [])

  const handleSelectLesson = useCallback((lessonId: string) => {
    setSelectedLessonId(lessonId)
    setSidebarOpen(false)
  }, [])

  const allLessons = useMemo(
    () => course.chapters.flatMap((ch) => ch.lessons),
    [course.chapters]
  )
  const selectedLesson = useMemo(
    () => allLessons.find((lesson) => lesson.id === selectedLessonId),
    [allLessons, selectedLessonId]
  )
  const currentLessonIndex = useMemo(
    () => Math.max(0, allLessons.findIndex((lesson) => lesson.id === selectedLessonId)),
    [allLessons, selectedLessonId]
  )

  const videoId = selectedLesson?.youtubeVideoId
    ? extractYouTubeId(selectedLesson.youtubeVideoId)
    : null

  const isVideoActive = activeVideoLessonId === selectedLessonId
  return (
    <div className="flex min-h-screen bg-background">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-foreground/10 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <Sidebar
        courseTitle={course.title}
        chapters={course.chapters}
        expandedChapters={expandedChapters}
        selectedLessonId={selectedLessonId}
        sidebarOpen={sidebarOpen}
        onToggleChapter={toggleChapter}
        onSelectLesson={handleSelectLesson}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="border-b border-border/70 px-4 py-5 lg:px-8 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground mb-2">
              Lesson {currentLessonIndex + 1} of {allLessons.length}
            </p>
            <h1 className="text-xl lg:text-2xl font-semibold">{selectedLesson?.title}</h1>
            <p className="text-muted-foreground mt-2 text-sm lg:text-base">
              {selectedLesson?.description}
            </p>
          </div>
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm"
          >
            Chapters
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Player */}
            <div className="lg:col-span-2">
              {videoId ? (
                <div className="aspect-video rounded-2xl overflow-hidden bg-black shadow-lg mb-4">
                  {!isVideoActive ? (
                    <button
                      type="button"
                      onClick={() => setActiveVideoLessonId(selectedLessonId)}
                      className="w-full h-full flex items-center justify-center bg-gradient-to-br from-foreground/5 via-background to-background text-foreground/80"
                    >
                      <span className="rounded-full border border-border/60 bg-card/80 px-5 py-2 text-sm shadow-sm">
                        Play lesson
                      </span>
                    </button>
                  ) : (
                    <iframe
                      width="100%"
                      height="100%"
                      loading="lazy"
                      src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&controls=1`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  )}
                </div>
              ) : (
                <div className="aspect-video rounded-2xl bg-muted flex items-center justify-center mb-4">
                  <p className="text-muted-foreground">No video available</p>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="lg:col-span-1 bg-card/80 rounded-2xl p-5 border border-border/70 shadow-sm">
              <h3 className="font-semibold mb-3">About this lesson</h3>
              <p className="text-sm text-muted-foreground">
                {selectedLesson?.description || "No description available"}
                {selectedLesson?.youtubeVideoId && (
                  <span className="block mt-2 text-xs break-all">
                    {selectedLesson.youtubeVideoId}
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
