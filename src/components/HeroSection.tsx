"use client";

import Image from "next/image";
import Link from "next/link";

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen"
      style={{ backgroundColor: "var(--warm-white)" }}
    >
      {/* Subtle background blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full"
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
          className="absolute rounded-full"
          style={{
            width: "400px",
            height: "400px",
            bottom: "10%",
            left: "-5%",
            background: "radial-gradient(circle at center, rgba(200,169,110,0.05) 0%, transparent 70%)",
            filter: "blur(30px)",
          }}
        />
      </div>

      <div className="flex flex-col md:flex-row min-h-screen max-w-[1280px] mx-auto">

      {/* Image — top on mobile, right on desktop */}
      <div className="relative w-full md:w-[30%] min-h-[50vh] md:min-h-0 md:aspect-[9/16] order-1 md:order-2 md:self-center">
        <Image
          src="/hero-bg.jpeg"
          alt=""
          fill
          className="object-cover"
          priority
          sizes="(max-width: 768px) 100vw, 38.2vw"
        />
      </div>

      {/* Text — bottom on mobile, left on desktop */}
      <div className="relative z-10 w-full md:flex-1 flex flex-col justify-between px-8 md:px-0 order-2 md:order-1">
        {/* Top label */}
        <div className="pt-36 md:pt-32">
          <div className="flex items-center gap-3">
            <div className="w-12 h-px bg-[#C8A96E]" />
            <span
              className="text-[10px] tracking-[0.4em] uppercase text-[#6B6560]"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Interior Studio
            </span>
          </div>
        </div>

        {/* Center: Headline + Subline */}
        <div className="flex flex-col justify-center flex-1">
          <div className="max-w-[600px]">
            <h1
              style={{
                fontFamily: "'Source Serif Pro', serif",
                fontWeight: 200,
                fontSize: "clamp(44px, 7vw, 100px)",
                letterSpacing: "0.04em",
                lineHeight: 1.05,
                color: "#1A1814",
                textAlign: "left",
              }}
            >
              DESIGN NADEUL
            </h1>
            <div className="mt-12 md:mt-6 mb-8 md:mb-0">
              <p
                style={{
                  fontFamily: "'Pretendard Variable', 'DM Sans', sans-serif",
                  fontSize: "clamp(14px, 1.5vw, 22px)",
                  color: "#6B6560",
                  lineHeight: 1.9,
                  fontStyle: "italic",
                  textAlign: "left",
                  wordBreak: "keep-all",
                }}
              >
                당신이 꿈꾸는 디자인,<br />
                가장 정직한 마음으로 완성합니다.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom: View Work */}
        <div className="pb-12">
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
      </div>
      </div>
    </section>
  );
}
