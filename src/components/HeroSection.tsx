"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 30;
      const y = (e.clientY / window.innerHeight - 0.5) * 30;
      setMousePos({ x, y });
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
      style={{ backgroundColor: "var(--warm-white)" }}
    >
      {/* Background grid lines */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute top-0 bottom-0 w-px"
            style={{
              left: `${(i + 1) * (100 / 7)}%`,
              background: "linear-gradient(to bottom, transparent, var(--border) 20%, var(--border) 80%, transparent)",
              opacity: 0.4,
            }}
          />
        ))}
        {/* Warm gradient blob */}
        <div
          className="blob-animate absolute rounded-full"
          style={{
            width: "600px",
            height: "600px",
            top: "-10%",
            right: "-5%",
            background: "radial-gradient(circle at center, rgba(200,169,110,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
        <div
          className="blob-animate absolute rounded-full"
          style={{
            width: "400px",
            height: "400px",
            bottom: "10%",
            left: "-5%",
            background: "radial-gradient(circle at center, rgba(200,169,110,0.05) 0%, transparent 70%)",
            filter: "blur(30px)",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Floating geometric elements */}
      <div
        className="absolute pointer-events-none select-none"
        style={{
          top: "15%",
          right: "10%",
          transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px)`,
          transition: "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div
          className="w-24 h-24 border border-[#C8A96E] rounded-full opacity-30"
          style={{
            animation: "spin 25s linear infinite",
          }}
        />
      </div>

      <div
        className="absolute pointer-events-none select-none"
        style={{
          bottom: "25%",
          left: "8%",
          transform: `translate(${-mousePos.x * 0.2}px, ${-mousePos.y * 0.2}px)`,
          transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="w-40 h-px bg-gradient-to-r from-transparent via-[#C8A96E] to-transparent opacity-50" />
      </div>

      {/* Top label */}
      <div
        className="relative z-10 flex justify-between items-center pt-28 md:pt-32 px-8 md:px-16"
        style={{
          transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1)",
        }}
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-px bg-[#C8A96E]" />
          <span
            className="text-[10px] tracking-[0.4em] uppercase text-[#6B6560]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Interior Design Studio
          </span>
        </div>
        <span
          className="text-[10px] tracking-[0.3em] uppercase text-[#6B6560]"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          Seoul, Korea
        </span>
      </div>

      {/* Main headline */}
      <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 flex-1">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="overflow-hidden">
            <h1
              className="font-light text-[#1A1814] leading-[0.88]"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(72px, 12vw, 200px)",
                transition: "all 1s cubic-bezier(0.23, 1, 0.32, 1) 0.2s",
              }}
            >
              Design
            </h1>
          </div>
          <div className="overflow-hidden flex items-end justify-between">
            <h1
              className="font-light text-[#1A1814] leading-[0.88] italic"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(72px, 12vw, 200px)",
                transition: "all 1s cubic-bezier(0.23, 1, 0.32, 1) 0.35s",
              }}
            >
              Nadeul
            </h1>
            <div
              className="hidden md:flex flex-col items-end gap-2 mb-4"
              style={{
                transition: "opacity 0.8s ease 0.8s",
              }}
            >
              <p
                className="text-xs text-[#6B6560] tracking-[0.2em] uppercase"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Est. 2018
              </p>
              <div className="w-16 h-px bg-[#E5DDD4]" />
              <p
                className="text-xs text-[#6B6560] max-w-[200px] text-right leading-relaxed"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Crafting spaces that<br />resonate with life
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="relative z-10 flex justify-between items-end pb-8 md:pb-12 px-8 md:px-16"
        style={{
          transition: "all 0.8s cubic-bezier(0.23, 1, 0.32, 1) 0.6s",
        }}
      >
        <div className="flex flex-col gap-3">
          <p
            className="text-xs text-[#6B6560] tracking-[0.2em] uppercase"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Residential · Commercial · Hospitality
          </p>
          <Link
            href="/projects"
            className="group inline-flex items-center gap-4"
          >
            <div className="relative w-12 h-12 rounded-full border border-[#C8A96E] flex items-center justify-center overflow-hidden transition-all duration-400 group-hover:bg-[#C8A96E]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 14 14"
                fill="none"
                className="transition-all duration-300 group-hover:translate-x-0.5 group-hover:text-white"
              >
                <path
                  d="M1 7h12M7 1l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span
              className="text-xs tracking-[0.2em] uppercase text-[#1A1814] underline-draw"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              View Work
            </span>
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-2 rotate-90 origin-bottom-right">
          <div className="w-8 h-px bg-[#C8A96E]" />
          <span
            className="text-[10px] tracking-[0.3em] uppercase text-[#6B6560]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Scroll
          </span>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
