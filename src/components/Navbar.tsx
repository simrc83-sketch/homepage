"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/projects", label: "Projects" },
    { href: "/#about", label: "About" },
    { href: "/#contact", label: "Contact" },
  ];

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 px-8 md:px-16 transition-all duration-500 ${
          scrolled
            ? "bg-[#F8F5F0]/90 backdrop-blur-md border-b border-[#E5DDD4]"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-[1280px] mx-auto h-12 md:h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-1 leading-none group">
            <span
              className="text-sm tracking-[0.12em] uppercase text-[#6B6560] transition-all duration-300 group-hover:text-[#C8A96E]"
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
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs tracking-[0.2em] uppercase underline-draw transition-colors duration-300 ${
                  pathname === link.href
                    ? "text-[#C8A96E]"
                    : "text-[#6B6560] hover:text-[#1A1814]"
                }`}
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-px bg-[#1A1814] transition-all duration-300 ${
                menuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`block w-4 h-px bg-[#1A1814] transition-all duration-300 ${
                menuOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block w-6 h-px bg-[#1A1814] transition-all duration-300 ${
                menuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#F8F5F0] flex flex-col justify-center items-center transition-all duration-500 ${
          menuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center gap-8">
          {navLinks.map((link, i) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={`text-4xl font-light tracking-wide ${
                pathname === link.href ? "text-[#C8A96E]" : "text-[#1A1814]"
              }`}
              style={{
                fontFamily: "'DM Sans', sans-serif",
                transitionDelay: `${i * 60}ms`,
                opacity: menuOpen ? 1 : 0,
                transform: menuOpen ? "translateY(0)" : "translateY(20px)",
                transition: "all 0.4s ease",
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}
