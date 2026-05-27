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
    { num: "01", title: "Concept", desc: "공간의 목적과 효율에 맞는 구조를 고민합니다. 불필요한 과잉 설계는 제안하지 않습니다." },
    { num: "02", title: "Material", desc: "공간에 필요한 질감과 색감, 마감재를 정성스럽게 선별합니다." },
    { num: "03", title: "Experience", desc: "좋은 공간은 머무는 사람을 닮아갑니다. 당신의 공간이 당신의 이야기를 담을 수 있도록 돕습니다." },
  ];

  return (
    <section
      ref={ref}
      id="about"
      className="px-8 md:px-16 py-20 md:py-32 overflow-hidden"
      style={{ backgroundColor: "var(--warm-white-2)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        {/* Top row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-16 md:mb-24">
          <div
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? "translateY(0)" : "translateY(40px)",
              transition: "all 0.9s cubic-bezier(0.23, 1, 0.32, 1)",
            }}
          >
            <p
              className="text-xs text-[#C8A96E] tracking-[0.4em] uppercase mb-3"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              About
            </p>
            <h2
              className="font-light text-[#1A1814] mb-8"
              style={{
                fontFamily: "'Pretendard Variable', 'DM Sans', sans-serif",
                fontSize: "clamp(24px, 3.5vw, 42px)",
                lineHeight: 1.1,
                letterSpacing: "-0.01em",
              }}
            >
              <em>정직한 시공이 가장 좋은</em><br />
              <em>인테리어라고 믿습니다.</em>
            </h2>
            <p
              className="text-[#6B6560] leading-relaxed max-w-md"
              style={{ fontFamily: "'Pretendard Variable', 'DM Sans', sans-serif", fontSize: "15px", lineHeight: "1.8" }}
            >
              우리는 도면 너머 당신의 삶을 고민하고,<br />
              가장 정직한 마음으로 그 꿈을 현실에 구현합니다.<br />
              과도한 제안 보단, 당신의 삶에 꼭 필요한 가치를 담아냅니다.
              <br /><br />
              당신의 삶이 머물고, 매일의 시간이 흐르는 곳.<br />
              당신이 꿈꾸는 디자인,<br />
              나들이 가장 정직한 마음으로 완성하겠습니다.
              <br /><br />
              감사합니다.
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
                { num: "16yr", label: "Experience" },
                { num: "98%", label: "Satisfaction" },
              ].map((stat) => (
                <div key={stat.label} className="border-t border-[#D4C8B8] pt-6">
                  <p
                    className="font-light text-[#1A1814] mb-2"
                    style={{
                      fontFamily: "'DM Sans', sans-serif",
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
          className="h-px mb-16 md:mb-24"
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
                  style={{ fontFamily: "'DM Sans', sans-serif" }}
                >
                  {val.title}
                </h3>
              </div>
              <p
                className="text-[#6B6560] text-sm leading-relaxed pl-8"
                style={{ fontFamily: "'Pretendard Variable', 'DM Sans', sans-serif", lineHeight: "1.8" }}
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
