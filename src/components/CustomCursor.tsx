"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    const links = document.querySelectorAll("a, button, [data-cursor]");
    links.forEach((el) => {
      el.addEventListener("mouseenter", onEnterLink);
      el.addEventListener("mouseleave", onLeaveLink);
    });

    const observer = new MutationObserver(() => {
      const newLinks = document.querySelectorAll("a, button, [data-cursor]");
      newLinks.forEach((el) => {
        el.removeEventListener("mouseenter", onEnterLink);
        el.removeEventListener("mouseleave", onLeaveLink);
        el.addEventListener("mouseenter", onEnterLink);
        el.addEventListener("mouseleave", onLeaveLink);
      });
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
