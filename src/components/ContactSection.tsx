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
      className="py-20 md:py-32 px-8 md:px-16"
      style={{ backgroundColor: "var(--warm-white)" }}
    >
      <div className="max-w-[1280px] mx-auto">
        <div>
          {/* Left */}
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
              Contact
            </p>
            <h2
              className="font-light text-[#1A1814] mb-8"
              style={{
                fontFamily: "'Pretendard Variable', 'DM Sans', sans-serif",
                fontSize: "clamp(24px, 3.5vw, 42px)",
                lineHeight: 1.05,
              }}
            >
              <em>기본을 지키는 마음으로</em><br />
              <em>공간을 책임집니다.</em>
            </h2>
            <p
              className="text-[#6B6560] leading-relaxed max-w-md mb-10"
              style={{ fontFamily: "'Pretendard Variable', 'DM Sans', sans-serif", fontSize: "15px", lineHeight: "1.8" }}
            >
              공간에 대한 고민이 있다면 언제든 이야기해주세요.<br />
              당신의 프로젝트를 기다리고 있습니다.
            </p>
            <a
              href="https://tally.so/r/WOKGMR"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-10 py-4 rounded-full border text-sm tracking-[0.2em] uppercase transition-all duration-300 mb-12"
              style={{
                borderColor: "#C8A96E",
                color: "#1A1814",
                fontFamily: "'DM Sans', sans-serif",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = "#C8A96E"; e.currentTarget.style.color = "white"; }}
              onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = "transparent"; e.currentTarget.style.color = "#1A1814"; }}
            >
              <span>상담문의</span>
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 7h12M7 1l6 6-6 6" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <div className="space-y-4">
              <a
                href="mailto:simrc83@naver.com"
                className="flex items-center gap-4 group"
              >
                <span className="w-16 text-[10px] text-[#C8A96E] tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>Email</span>
                <span className="text-sm text-[#1A1814] underline-draw group-hover:text-[#C8A96E] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  simrc83@naver.com
                </span>
              </a>
              <a
                href="tel:+821073797778"
                className="flex items-center gap-4 group"
              >
                <span className="w-16 text-[10px] text-[#C8A96E] tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>Phone</span>
                <span className="text-sm text-[#1A1814] underline-draw group-hover:text-[#C8A96E] transition-colors duration-300" style={{ fontFamily: "'DM Sans', sans-serif" }}>
                  +82 10-7379-7778
                </span>
              </a>
              <div className="flex items-center gap-4">
                <span className="w-16 text-[10px] text-[#C8A96E] tracking-widest uppercase" style={{ fontFamily: "'DM Sans', sans-serif" }}>Studio</span>
                <span className="text-sm text-[#6B6560]" style={{ fontFamily: "'Pretendard Variable', 'DM Sans', sans-serif" }}>
                  경기도 고양시 덕양구 마상로 161
                </span>
              </div>
            </div>
          </div>


        </div>
      </div>
    </section>
  );
}
