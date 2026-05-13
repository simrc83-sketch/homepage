"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import type { Project } from "@/db/schema";

const PLACEHOLDER_COLORS = [
  "#DDD5C8", "#C8C0B0", "#E5DDD4", "#D4C8B8", "#BFBBB4",
  "#CCC5BB", "#D8D0C5", "#E0D9D0", "#CAC2B8", "#D6CEC4",
];

const SPACE_TYPES = ["All", "Residential", "Commercial", "Hospitality", "Office"];

// ——— Vertical Grid Item ———
function GridProjectItem({
  project,
  index,
  onClick,
}: {
  project: Project;
  index: number;
  onClick: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const bg = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `all 0.8s cubic-bezier(0.23,1,0.32,1) ${index * 0.07}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden mb-4"
        style={{ height: "300px", backgroundColor: bg }}
      >
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.8s cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#6B6560] text-xs tracking-widest opacity-30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {project.spaceType}
            </span>
          </div>
        )}

        {/* Hover overlay */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            background: "rgba(26,24,20,0.4)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div
            className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center"
            style={{
              transform: hovered ? "scale(1)" : "scale(0.8)",
              transition: "transform 0.4s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
              <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>

        {/* Index */}
        <div className="absolute top-3 left-3">
          <span className="text-white/50 text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Info row */}
      <div className="flex justify-between items-start">
        <div>
          <h3
            className="text-base font-light text-[#1A1814] transition-colors duration-300"
            style={{
              fontFamily: "'Cormorant Garamond', serif",
              color: hovered ? "#C8A96E" : "#1A1814",
            }}
          >
            {project.title}
          </h3>
          <p className="text-[10px] text-[#6B6560] tracking-[0.25em] uppercase mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {project.spaceType}
          </p>
        </div>
        <span className="text-xs text-[#C8A96E] mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          {project.year}
        </span>
      </div>
      <div
        className="h-px mt-3"
        style={{
          background: "var(--border)",
          transform: hovered ? "scaleX(1)" : "scaleX(0.3)",
          transformOrigin: "left",
          transition: "transform 0.5s ease",
        }}
      />
    </div>
  );
}

// ——— Horizontal Scroll Card ———
function HScrollCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const bg = PLACEHOLDER_COLORS[(index + 5) % PLACEHOLDER_COLORS.length];

  return (
    <div
      className="h-scroll-item flex-shrink-0 cursor-pointer"
      style={{ width: "360px" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onOpen}
    >
      <div
        className="relative overflow-hidden"
        style={{ height: "480px", backgroundColor: bg }}
      >
        {project.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={project.coverImage}
            alt={project.title}
            className="w-full h-full object-cover"
            style={{
              transform: hovered ? "scale(1.06)" : "scale(1)",
              transition: "transform 0.8s cubic-bezier(0.23,1,0.32,1)",
            }}
          />
        ) : (
          <div className="w-full h-full flex items-end p-6" style={{ background: `linear-gradient(135deg, ${bg}, ${bg}cc)` }}>
            <span className="text-[#6B6560]/40 text-xs tracking-widest" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {project.spaceType}
            </span>
          </div>
        )}
        <div
          className="absolute inset-0 flex items-end p-6"
          style={{
            background: "linear-gradient(to top, rgba(26,24,20,0.6) 0%, transparent 60%)",
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.4s ease",
          }}
        >
          <div>
            <p className="text-white text-xl font-light mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              {project.title}
            </p>
            <p className="text-white/60 text-[10px] tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              View Details
            </p>
          </div>
        </div>
      </div>
      <div className="pt-4">
        <div className="flex justify-between items-start">
          <div>
            <p
              className="text-sm font-light transition-colors duration-300"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                color: hovered ? "#C8A96E" : "#1A1814",
              }}
            >
              {project.title}
            </p>
            <p className="text-[10px] text-[#6B6560] tracking-widest uppercase mt-0.5" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {project.spaceType}
            </p>
          </div>
          <span className="text-xs text-[#C8A96E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {project.year}
          </span>
        </div>
      </div>
    </div>
  );
}

// ——— Project Detail Modal ———
function ProjectModal({ project, onClose }: { project: Project; onClose: () => void }) {
  const [currentImg, setCurrentImg] = useState(0);
  const allImages = [
    ...(project.coverImage ? [project.coverImage] : []),
    ...(project.images ?? []),
  ];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-end"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div
        className="relative w-full md:w-[560px] h-full bg-[#F8F5F0] overflow-y-auto"
        style={{ animation: "slideInRight 0.5s cubic-bezier(0.23,1,0.32,1) forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-10 h-10 rounded-full border border-[#E5DDD4] flex items-center justify-center hover:bg-[#C8A96E] hover:border-[#C8A96E] transition-all duration-300 group"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative" style={{ height: "55vh", backgroundColor: "#DDD5C8" }}>
          {allImages.length > 0 ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={allImages[currentImg]}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-[#6B6560] text-xs tracking-widest opacity-30" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                No Image
              </span>
            </div>
          )}

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="absolute bottom-4 left-4 flex gap-2">
              {allImages.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentImg(i)}
                  className="w-10 h-10 rounded overflow-hidden border-2 transition-colors duration-200"
                  style={{ borderColor: i === currentImg ? "#C8A96E" : "transparent" }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-8 md:p-10">
          <p
            className="text-xs text-[#C8A96E] tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {project.spaceType}
          </p>
          <h2
            className="font-light text-[#1A1814] mb-2"
            style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "36px", lineHeight: 1.1 }}
          >
            {project.title}
          </h2>
          <p className="text-[#C8A96E] text-sm mb-8" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {project.year}
            {project.location ? ` · ${project.location}` : ""}
          </p>

          <div className="h-px bg-[#E5DDD4] mb-8" />

          {project.description && (
            <p
              className="text-[#6B6560] text-sm leading-relaxed mb-8"
              style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: "1.9" }}
            >
              {project.description}
            </p>
          )}

          <div className="grid grid-cols-3 gap-4">
            <div className="border-t border-[#E5DDD4] pt-4">
              <p className="text-[10px] text-[#C8A96E] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Type</p>
              <p className="text-sm text-[#1A1814]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{project.spaceType}</p>
            </div>
            <div className="border-t border-[#E5DDD4] pt-4">
              <p className="text-[10px] text-[#C8A96E] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Year</p>
              <p className="text-sm text-[#1A1814]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{project.year}</p>
            </div>
            {project.location && (
              <div className="border-t border-[#E5DDD4] pt-4">
                <p className="text-[10px] text-[#C8A96E] tracking-[0.3em] uppercase mb-1" style={{ fontFamily: "'DM Sans', sans-serif" }}>Location</p>
                <p className="text-sm text-[#1A1814]" style={{ fontFamily: "'DM Sans', sans-serif" }}>{project.location}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
}

// ——— Main Projects Client ———
export default function ProjectsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);
  const hScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => { if (Array.isArray(data)) setProjects(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const updateScrollBtns = useCallback(() => {
    const el = hScrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = hScrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", updateScrollBtns);
    updateScrollBtns();
    return () => el.removeEventListener("scroll", updateScrollBtns);
  }, [updateScrollBtns, projects]);

  const scrollHoriz = (dir: "left" | "right") => {
    const el = hScrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "right" ? 400 : -400, behavior: "smooth" });
  };

  const filteredProjects = filter === "All"
    ? projects
    : projects.filter((p) => p.spaceType === filter);

  // Split: featured (first 5) for grid, rest for horizontal scroll
  const gridProjects = filteredProjects.slice(0, 5);
  const scrollProjects = filteredProjects.slice(5);

  return (
    <main style={{ backgroundColor: "var(--warm-white)" }}>
      {/* Page Header */}
      <div
        className="pt-32 pb-16 px-8 md:px-16"
        style={{
          opacity: mounted ? 1 : 0,
          transition: "opacity 0.8s ease 0.2s",
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
            <div>
              <p
                className="text-xs text-[#C8A96E] tracking-[0.4em] uppercase mb-4"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Portfolio
              </p>
              <h1
                className="font-light text-[#1A1814]"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "clamp(40px, 6vw, 96px)",
                  lineHeight: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                All Projects
              </h1>
            </div>
            <p
              className="text-[#6B6560] text-sm max-w-xs leading-relaxed"
              style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: "1.8" }}
            >
              A curated selection of residential, commercial and hospitality spaces.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-8 md:px-16 pb-12">
        <div className="flex items-center gap-2 flex-wrap">
          {SPACE_TYPES.map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className="px-4 py-2 text-[10px] tracking-[0.25em] uppercase transition-all duration-300 rounded-full border"
              style={{
                fontFamily: "'DM Sans', sans-serif",
                borderColor: filter === type ? "#C8A96E" : "#E5DDD4",
                backgroundColor: filter === type ? "#C8A96E" : "transparent",
                color: filter === type ? "white" : "#6B6560",
              }}
            >
              {type}
            </button>
          ))}
          <span className="ml-auto text-xs text-[#6B6560]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            {filteredProjects.length} projects
          </span>
        </div>
      </div>

      {/* Divider */}
      <div className="px-8 md:px-16 mb-12">
        <div className="h-px" style={{ backgroundColor: "var(--border)" }} />
      </div>

      {loading ? (
        <div className="px-8 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded" style={{ height: "260px", backgroundColor: "var(--border)" }} />
          ))}
        </div>
      ) : filteredProjects.length === 0 ? (
        <div className="py-32 text-center">
          <p className="text-[#6B6560] text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
            No projects in this category yet.
          </p>
        </div>
      ) : (
        <>
          {/* ── Section Label: Featured ── */}
          <div className="px-8 md:px-16 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-6 h-px bg-[#C8A96E]" />
              <span className="text-[10px] tracking-[0.4em] uppercase text-[#C8A96E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                Featured Projects
              </span>
            </div>
          </div>

          {/* ── VERTICAL GRID ── */}
          <div className="px-8 md:px-16 mb-24">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {gridProjects.map((p, i) => (
                <GridProjectItem
                  key={p.id}
                  project={p}
                  index={i}
                  onClick={() => setSelectedProject(p)}
                />
              ))}
            </div>
          </div>

          {/* ── TRANSITION DIVIDER ── */}
          {scrollProjects.length > 0 && (
            <>
              <div className="px-8 md:px-16 mb-8 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-6 h-px bg-[#C8A96E]" />
                  <span className="text-[10px] tracking-[0.4em] uppercase text-[#C8A96E]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    More Projects
                  </span>
                </div>
                {/* Scroll nav buttons */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => scrollHoriz("left")}
                    disabled={!canScrollLeft}
                    className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30"
                    style={{ borderColor: "#E5DDD4" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M8 1L3 6l5 5" stroke="#1A1814" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => scrollHoriz("right")}
                    disabled={!canScrollRight}
                    className="w-9 h-9 rounded-full border flex items-center justify-center transition-all duration-300 disabled:opacity-30 hover:bg-[#C8A96E] hover:border-[#C8A96E] group"
                    style={{ borderColor: "#C8A96E" }}
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="group-hover:text-white">
                      <path d="M4 1l5 5-5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* ── HORIZONTAL SCROLL ── */}
              <div className="relative mb-16">
                {/* Left fade */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none"
                  style={{
                    background: "linear-gradient(to right, var(--warm-white), transparent)",
                    opacity: canScrollLeft ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                />

                <div
                  ref={hScrollRef}
                  className="h-scroll-container gap-6 px-8 md:px-16 pb-6"
                >
                  {scrollProjects.map((p, i) => (
                    <HScrollCard
                      key={p.id}
                      project={p}
                      index={i}
                      onOpen={() => setSelectedProject(p)}
                    />
                  ))}

                  {/* "View Project Page" final card */}
                  <div
                    className="h-scroll-item flex-shrink-0 flex items-center justify-center"
                    style={{ width: "280px" }}
                  >
                    <div className="flex flex-col items-center gap-6 text-center p-8">
                      <div
                        className="w-16 h-16 rounded-full border border-[#C8A96E] flex items-center justify-center"
                        style={{ animation: "pulseRing 2s ease infinite" }}
                      >
                        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                          <path d="M1 9h16M9 1l8 8-8 8" stroke="#C8A96E" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs tracking-[0.3em] uppercase text-[#C8A96E] mb-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          That's all
                        </p>
                        <p className="text-2xl font-light text-[#1A1814]" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          Get in Touch
                        </p>
                        <p className="text-xs text-[#6B6560] mt-2" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                          Let's create your space
                        </p>
                      </div>
                      <a
                        href="/#contact"
                        className="px-6 py-3 rounded-full text-xs tracking-widest uppercase border border-[#1A1814] hover:bg-[#1A1814] hover:text-white transition-all duration-300"
                        style={{ fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Contact Us
                      </a>
                    </div>
                  </div>
                </div>

                {/* Right fade + arrow hint */}
                <div
                  className="absolute right-0 top-0 bottom-6 w-24 z-10 flex items-center justify-end pr-4 pointer-events-none"
                  style={{
                    background: "linear-gradient(to left, var(--warm-white) 50%, transparent)",
                    opacity: canScrollRight ? 1 : 0,
                    transition: "opacity 0.3s",
                  }}
                >
                  <div className="flex flex-col items-center gap-1 pointer-events-auto" onClick={() => scrollHoriz("right")}>
                    <div
                      className="w-8 h-8 rounded-full bg-[#C8A96E] flex items-center justify-center cursor-pointer"
                      style={{ animation: "bounceX 1.5s ease infinite" }}
                    >
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M2 5h6M5 2l3 3-3 3" stroke="white" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
      )}

      <style jsx>{`
        @keyframes pulseRing {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.08); opacity: 0.8; }
        }
        @keyframes bounceX {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
      `}</style>
    </main>
  );
}
