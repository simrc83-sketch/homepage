"use client";

import { useEffect, useRef, useState } from "react";

export default function ContactSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="contact"
      className="py-24 md:py-40 px-8 md:px-16"
      style={{ backgroundColor: "var(--warm-white)" }}
    >
      <div className="max-w-[1600px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-end">
          {/* Left */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.9s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <p
              className="text-xs text-[#C8A96E] tracking-[0.4em] uppercase mb-4"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Contact
            </p>
            <h2
              className="font-light text-[#1A1814] mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(36px, 5vw, 80px)",
                lineHeight: 1.05,
              }}
            >
              Let's create<br />
              <em>together.</em>
            </h2>
            <p
              className="text-[#6B6560] text-sm leading-relaxed max-w-sm mb-12"
              style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: "1.8" }}
            >
              Whether you're planning a full renovation or a focused redesign, 
              we'd love to hear about your project. Let's talk.
            </p>

            <div className="space-y-4">
              <a
                href="mailto:hello@designnadeul.com"
                className="flex items-center gap-3 group"
              >
                <span className="text-[10px] text-[#C8A96E] tracking-widest uppercase w-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email</span>
                <span className="text-sm text-[#1A1814] underline-draw group-hover:text-[#C8A96E] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  hello@designnadeul.com
                </span>
              </a>
              <a
                href="tel:+821000000000"
                className="flex items-center gap-3 group"
              >
                <span className="text-[10px] text-[#C8A96E] tracking-widest uppercase w-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>Phone</span>
                <span className="text-sm text-[#1A1814] underline-draw group-hover:text-[#C8A96E] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  +82 10-0000-0000
                </span>
              </a>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-[#C8A96E] tracking-widest uppercase w-16" style={{ fontFamily: "'DM Sans', sans-serif" }}>Studio</span>
                <span className="text-sm text-[#6B6560]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Seoul, South Korea
                </span>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.2s",
            }}
          >
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6560]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="bg-transparent border-b border-[#E5DDD4] py-3 text-sm text-[#1A1814] placeholder-[#C8C0B0] outline-none focus:border-[#C8A96E] transition-colors duration-300"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6560]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="bg-transparent border-b border-[#E5DDD4] py-3 text-sm text-[#1A1814] placeholder-[#C8C0B0] outline-none focus:border-[#C8A96E] transition-colors duration-300"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6560]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Project Type
                </label>
                <select
                  className="bg-transparent border-b border-[#E5DDD4] py-3 text-sm text-[#1A1814] outline-none focus:border-[#C8A96E] transition-colors duration-300 appearance-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  <option value="">Select type...</option>
                  <option>Residential</option>
                  <option>Commercial</option>
                  <option>Hospitality</option>
                  <option>Other</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[10px] tracking-[0.3em] uppercase text-[#6B6560]" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your project..."
                  className="bg-transparent border-b border-[#E5DDD4] py-3 text-sm text-[#1A1814] placeholder-[#C8C0B0] outline-none focus:border-[#C8A96E] transition-colors duration-300 resize-none"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                />
              </div>

              <button
                type="submit"
                className="group flex items-center gap-4 pt-2"
              >
                <div className="w-12 h-12 rounded-full bg-[#1A1814] flex items-center justify-center transition-all duration-400 group-hover:bg-[#C8A96E] group-hover:scale-110">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white">
                    <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <span
                  className="text-xs tracking-[0.25em] uppercase text-[#1A1814] group-hover:text-[#C8A96E] transition-colors duration-300"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  Send Message
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
