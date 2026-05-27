"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import type { Project } from "@/db/schema";

const PLACEHOLDER_COLORS = [
  "#DDD5C8", "#C8C0B0", "#E5DDD4", "#D4C8B8", "#BFBBB4",
];

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const isLarge = index % 3 === 0;
  const bgColor = PLACEHOLDER_COLORS[index % PLACEHOLDER_COLORS.length];

  return (
    <div
      ref={ref}
      id={`project-${project.id}`}
      className={`relative cursor-pointer ${isLarge ? "md:col-span-2" : "md:col-span-1"}`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(40px)",
        transition: `all 0.8s cubic-bezier(0.23, 1, 0.32, 1) ${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link href={`/projects#project-${project.id}`} className="block group">
        {/* Image container */}
        <div
          className="relative overflow-hidden"
          style={{
            height: isLarge ? "520px" : "360px",
            backgroundColor: bgColor,
          }}
        >
          {project.coverImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={project.coverImage}
              alt={project.title}
              className="w-full h-full object-cover"
              style={{
                transform: hovered ? "scale(1.06)" : "scale(1)",
                transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
              }}
            />
          ) : (
            <div className="w-full h-full flex items-end justify-start p-6">
              <span
                className="text-[#6B6560] text-sm tracking-widest opacity-40"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {project.spaceType}
              </span>
            </div>
          )}

          {/* Overlay */}
          <div
            className="absolute inset-0 flex items-end p-6"
            style={{
              background: "linear-gradient(to top, rgba(26,24,20,0.55) 0%, transparent 60%)",
              opacity: hovered ? 1 : 0,
              transition: "opacity 0.4s ease",
            }}
          >
            <div
              style={{
                transform: hovered ? "translateY(0)" : "translateY(12px)",
                transition: "transform 0.4s ease",
              }}
            >
              <p
                className="text-white text-2xl font-light mb-1"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {project.title}
              </p>
              <p
                className="text-white/70 text-xs tracking-widest"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                View Project →
              </p>
            </div>
          </div>

          {/* Number badge */}
          <div
            className="absolute top-4 right-4 w-7 h-7 rounded-full border border-white/30 flex items-center justify-center"
            style={{ opacity: hovered ? 0 : 1, transition: "opacity 0.3s ease" }}
          >
            <span className="text-white/60 text-[10px]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="pt-4 pb-2 flex justify-between items-start">
          <div>
            <h3
              className="text-lg font-light text-[#1A1814] mb-1 transition-colors duration-300 group-hover:text-[#C8A96E]"
              style={{ fontFamily: "'DM Sans', sans-serif", letterSpacing: "0.02em" }}
            >
              {project.title}
            </h3>
            <p
              className="text-xs text-[#6B6560] tracking-[0.2em] uppercase"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {project.spaceType}
            </p>
          </div>
          <span
            className="text-xs text-[#C8A96E] tabular-nums mt-1"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {project.year}
          </span>
        </div>
        <div className="h-px w-0 group-hover:w-full bg-[#E5DDD4] transition-all duration-500" />
      </Link>
    </div>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("/api/projects")
      .then((r) => r.json())
      .then((data: Project[]) => {
        if (Array.isArray(data)) setProjects(data.slice(0, 5));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const sectionRef = useRef<HTMLElement>(null);
  const [headerVisible, setHeaderVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="featured-projects"
      className="px-8 md:px-16 py-20 md:py-32"
      style={{ backgroundColor: "var(--warm-white)" }}
    >
      <div className="max-w-[1280px] mx-auto">
      {/* Section header */}
      <div
        className="flex justify-between items-end mb-16 md:mb-24"
        style={{
          transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div>
          <p
            className="text-xs text-[#C8A96E] tracking-[0.4em] uppercase mb-3"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Featured Projects
          </p>
        </div>
        <Link
          href="/projects"
          className="hidden md:inline-flex items-center gap-3 group"
        >
          <span
            className="text-xs tracking-[0.2em] uppercase text-[#6B6560] underline-draw group-hover:text-[#1A1814] transition-colors duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            All Projects
          </span>
          <div className="w-6 h-6 rounded-full border border-[#C8A96E] flex items-center justify-center group-hover:bg-[#C8A96E] transition-colors duration-300">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
              <path d="M1 5h8M5 1l4 4-4 4" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className={`rounded animate-pulse ${i === 0 ? "md:col-span-2" : ""}`}
              style={{
                height: i === 0 ? "520px" : "360px",
                backgroundColor: "var(--border)",
              }}
            />
          ))}
        </div>
      ) : error ? (
        <div className="py-32 text-center">
          <p
            className="text-[#6B6560] text-sm tracking-wide mb-4"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Failed to load projects.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="text-xs tracking-[0.2em] uppercase text-[#C8A96E] border border-[#C8A96E] px-5 py-2.5 rounded-full hover:bg-[#C8A96E] hover:text-white transition-all duration-300"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Retry
          </button>
        </div>
      ) : projects.length === 0 ? (
        <div className="py-32 text-center">
          <p
            className="text-[#6B6560] text-sm tracking-wide"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            No projects yet. Add projects from the{" "}
            <Link href="/admin" className="text-[#C8A96E] underline-draw">
              admin panel
            </Link>
            .
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>
      )}

      {/* CTA to full projects */}
      <div
        className="mt-16 text-center"
        style={{
          transition: "opacity 0.8s ease 0.6s",
        }}
      >
        <Link
          href="/projects"
          className="inline-flex items-center gap-4 group"
        >
          <div
            className="w-14 h-14 rounded-full border border-[#C8A96E] flex items-center justify-center transition-all duration-400 group-hover:bg-[#C8A96E]"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="group-hover:text-white transition-colors duration-300">
              <path d="M1 8h14M8 1l7 7-7 7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-left">
            <p
              className="text-xs text-[#C8A96E] tracking-[0.3em] uppercase mb-0.5"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Explore All
            </p>
            <p
              className="text-lg font-light text-[#1A1814]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View Projects Page →
            </p>
          </div>
        </Link>
      </div>
      </div>
    </section>
  );
}
