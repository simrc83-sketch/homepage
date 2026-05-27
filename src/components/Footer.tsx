"use client";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="px-8 md:px-16 py-8 border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--warm-white)" }}
    >
      <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="flex items-baseline gap-1 leading-none">
          <span
            className="text-sm tracking-[0.12em] uppercase text-[#6B6560]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Design
          </span>
          <span
            className="text-sm tracking-[0.12em] uppercase text-[#1A1814]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            NADEUL
          </span>
        </div>

        {/* Copyright */}
        <p
          className="text-[10px] text-[#6B6560] tracking-wider"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          © {year} DESIGN NADEUL
        </p>
      </div>
    </footer>
  );
}
