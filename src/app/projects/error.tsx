"use client";

import Link from "next/link";

export default function ProjectsError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-8"
      style={{ backgroundColor: "#F8F5F0" }}
    >
      <div className="text-center max-w-sm">
        <div
          className="w-12 h-12 rounded-full border mx-auto mb-6 flex items-center justify-center"
          style={{ borderColor: "#E5DDD4" }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="7" stroke="#6B6560" strokeWidth="1.2" />
            <path d="M6 6l4 4M10 6l-4 4" stroke="#6B6560" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </div>
        <h1
          className="text-xl font-light mb-3"
          style={{ color: "#1A1814", fontFamily: "'DM Sans', sans-serif" }}
        >
          Failed to load projects
        </h1>
        <p
          className="text-sm mb-8"
          style={{ color: "#6B6560", fontFamily: "'DM Sans', sans-serif" }}
        >
          Could not retrieve the project list. Please try again.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={reset}
            className="px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase text-white transition-all duration-300 hover:opacity-80"
            style={{ backgroundColor: "#1A1814" }}
          >
            Try Again
          </button>
          <Link
            href="/"
            className="px-6 py-3 rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-300 border"
            style={{
              borderColor: "#E5DDD4",
              color: "#6B6560",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}
