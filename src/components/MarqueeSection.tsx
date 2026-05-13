"use client";

export default function MarqueeSection() {
  const items = [
    "Interior Design",
    "·",
    "Spatial Planning",
    "·",
    "Residential",
    "·",
    "Commercial",
    "·",
    "Hospitality",
    "·",
    "Concept Design",
    "·",
    "FF&E",
    "·",
  ];

  return (
    <div
      className="py-5 border-y overflow-hidden"
      style={{ borderColor: "var(--border)" }}
    >
      <div className="marquee-inner">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className={`text-xs tracking-[0.3em] uppercase whitespace-nowrap px-4 ${
              item === "·" ? "text-[#C8A96E]" : "text-[#6B6560]"
            }`}
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
