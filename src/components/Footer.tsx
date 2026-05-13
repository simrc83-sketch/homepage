"use client";

import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer
      className="px-8 md:px-16 py-12 border-t"
      style={{ borderColor: "var(--border)", backgroundColor: "var(--warm-white)" }}
    >
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Logo */}
        <div className="flex flex-col leading-none">
          <span
            className="text-[10px] tracking-[0.4em] uppercase text-[#6B6560]"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            Design
          </span>
          <span
            className="text-lg font-light tracking-[0.25em] uppercase text-[#1A1814]"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            NADEUL
          </span>
        </div>

        {/* Nav */}
        <div className="flex items-center gap-8">
          {[
            { href: "/", label: "Home" },
            { href: "/projects", label: "Projects" },
            { href: "/#about", label: "About" },
            { href: "/#contact", label: "Contact" },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[10px] tracking-[0.2em] uppercase text-[#6B6560] hover:text-[#1A1814] transition-colors duration-300 underline-draw"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {link.label}
            </Link>
          ))}
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
