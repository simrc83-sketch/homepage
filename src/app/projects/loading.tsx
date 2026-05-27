export default function ProjectsLoading() {
  return (
    <div style={{ backgroundColor: "#F8F5F0" }}>
      <div className="pt-32 pb-16 px-8 md:px-16">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <div className="w-24 h-3 rounded mb-4 animate-pulse" style={{ backgroundColor: "#E5DDD4" }} />
              <div className="w-64 h-12 rounded animate-pulse" style={{ backgroundColor: "#E5DDD4" }} />
            </div>
            <div className="w-48 h-8 rounded animate-pulse" style={{ backgroundColor: "#E5DDD4" }} />
          </div>
        </div>
      </div>
      <div className="px-8 md:px-16 pb-12">
        <div className="flex gap-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="w-20 h-8 rounded-full animate-pulse" style={{ backgroundColor: "#E5DDD4" }} />
          ))}
        </div>
      </div>
      <div className="px-8 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="animate-pulse rounded" style={{ height: "260px", backgroundColor: "#E5DDD4" }} />
        ))}
      </div>
    </div>
  );
}
