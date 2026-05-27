export default function RootLoading() {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#F8F5F0" }}
    >
      <div className="flex flex-col items-center gap-4">
        <div
          className="w-8 h-8 border-2 rounded-full animate-spin"
          style={{ borderColor: "#C8A96E", borderTopColor: "transparent" }}
        />
        <p
          className="text-xs tracking-[0.25em] uppercase text-[#6B6560]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Loading
        </p>
      </div>
    </div>
  );
}
