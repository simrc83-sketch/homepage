"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.matchMedia("(pointer: fine)").matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = 0;
    let mouseY = 0;
    let ringX = 0;
    let ringY = 0;
    let animId: number;

    const onMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate(${mouseX - 4}px, ${mouseY - 4}px)`;
    };

    const animate = () => {
      ringX += (mouseX - ringX - 16) * 0.12;
      ringY += (mouseY - ringY - 16) * 0.12;
      ring.style.transform = `translate(${ringX}px, ${ringY}px)`;
      animId = requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      ring.style.width = "56px";
      ring.style.height = "56px";
      ring.style.marginLeft = "-12px";
      ring.style.marginTop = "-12px";
      ring.style.borderColor = "var(--dark)";
      ring.style.backgroundColor = "rgba(200,169,110,0.08)";
    };

    const onLeaveLink = () => {
      ring.style.width = "32px";
      ring.style.height = "32px";
      ring.style.marginLeft = "0";
      ring.style.marginTop = "0";
      ring.style.borderColor = "var(--accent)";
      ring.style.backgroundColor = "transparent";
    };

    document.addEventListener("mousemove", onMove);
    animId = requestAnimationFrame(animate);

    const initLink = (el: Element) => {
      if (el.getAttribute("data-cursor-initialized") !== null) return;
      el.setAttribute("data-cursor-initialized", "");
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    };

    document.querySelectorAll("a, button, [data-cursor]").forEach(initLink);

    const observer = new MutationObserver(() => {
      document
        .querySelectorAll("a, button, [data-cursor]:not([data-cursor-initialized])")
        .forEach(initLink);
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(animId);
      observer.disconnect();
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot hidden md:block" />
      <div ref={ringRef} className="cursor-ring hidden md:block" />
    </>
  );
}
