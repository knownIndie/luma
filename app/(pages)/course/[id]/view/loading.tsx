export default function LoadingCourseView() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden lg:block w-80 border-r border-border/70 bg-card/80">
        <div className="animate-pulse p-6 space-y-4">
          <div className="h-6 w-2/3 rounded-full bg-muted" />
          <div className="h-4 w-24 rounded-full bg-muted" />
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-11 rounded-xl bg-muted" />
          ))}
        </div>
      </div>

      <div className="flex-1">
        <div className="animate-pulse border-b border-border/70 px-4 py-5 lg:px-8 space-y-3">
          <div className="h-4 w-32 rounded-full bg-muted" />
          <div className="h-8 w-1/2 rounded-full bg-muted" />
          <div className="h-4 w-2/3 rounded-full bg-muted" />
        </div>

        <div className="px-4 py-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 h-[320px] rounded-2xl bg-muted animate-pulse" />
            <div className="h-[320px] rounded-2xl bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
