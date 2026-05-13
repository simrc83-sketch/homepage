"use client";

import { useEffect, useRef, useState } from "react";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const values = [
    { num: "01", title: "Concept", desc: "Every space begins with a story. We listen, research, and transform your vision into a cohesive design narrative." },
    { num: "02", title: "Material", desc: "We source materials with intention — textures, tones, and finishes that age beautifully and feel authentic." },
    { num: "03", title: "Experience", desc: "Design is felt before it's seen. We craft environments that engage all senses and adapt to daily life." },
  ];

  return (
    <section
      ref={ref}
      id="about"
      className="py-24 md:py-40 overflow-hidden"
      style={{ backgroundColor: "#F2EDE6" }}
    >
      <div className="px-8 md:px-16 max-w-[1600px] mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 md:mb-32">
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
              About
            </p>
            <h2
              className="font-light text-[#1A1814] mb-8"
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(32px, 4.5vw, 64px)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              Space is where<br />
              <em>life unfolds.</em>
            </h2>
            <p
              className="text-[#6B6560] leading-relaxed max-w-md"
              style={{ fontFamily: "'DM Sans', sans-serif", fontSize: "14px", lineHeight: "1.8" }}
            >
              DESIGN NADEUL is an interior design studio based in Seoul, dedicated to creating 
              thoughtful, livable spaces that reflect the unique character of each client. 
              We believe good design is quiet — it enhances without overwhelming.
            </p>
          </div>

          {/* Stats */}
          <div
            className="flex flex-col justify-end"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.9s cubic-bezier(0.23, 1, 0.32, 1) 0.2s",
            }}
          >
            <div className="grid grid-cols-3 gap-8">
              {[
                { num: "50+", label: "Projects" },
                { num: "7yr", label: "Experience" },
                { num: "98%", label: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="border-t border-[#D4C8B8] pt-6">
                  <p
                    className="font-light text-[#1A1814] mb-2"
                    style={{
                      fontFamily: "'Cormorant Garamond', serif",
                      fontSize: "clamp(28px, 3vw, 48px)",
                    }}
                  >
                    {stat.num}
                  </p>
                  <p
                    className="text-[10px] text-[#6B6560] tracking-[0.3em] uppercase"
                    style={{ fontFamily: "'DM Sans', sans-serif" }}
                  >
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="h-px mb-24 md:mb-32"
          style={{
            background: "linear-gradient(to right, transparent, var(--border), transparent)",
            opacity: visible ? 1 : 0,
            transition: "opacity 0.8s ease 0.4s",
          }}
        />

        {/* Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {values.map((val, i) => (
            <div
              key={val.num}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(40px)",
                transition: `all 0.9s cubic-bezier(0.23, 1, 0.32, 1) ${0.3 + i * 0.15}s`,
              }}
            >
              <div className="flex items-start gap-4 mb-4">
                <span
                  className="text-[10px] text-[#C8A96E] tracking-[0.3em] mt-1"
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {val.num}
                </span>
                <h3
                  className="text-2xl font-light text-[#1A1814]"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  {val.title}
                </h3>
              </div>
              <p
                className="text-[#6B6560] text-sm leading-relaxed pl-8"
                style={{ fontFamily: "'DM Sans', sans-serif", lineHeight: "1.8" }}
              >
                {val.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
