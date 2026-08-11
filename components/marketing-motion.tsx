"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";

export function MarketingMotion({ children }: { children: React.ReactNode }) {
  const root = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let observer: IntersectionObserver | undefined;
    const context = gsap.context(() => {
      gsap.from("[data-reveal]", {
        y: 28,
        opacity: 0,
        duration: 0.85,
        stagger: 0.1,
        ease: "power3.out",
      });
      gsap.from("[data-product-preview]", {
        y: 40,
        rotateX: 4,
        opacity: 0,
        duration: 1.1,
        delay: 0.35,
        ease: "power3.out",
      });

      const revealTargets = gsap.utils.toArray<HTMLElement>("[data-scroll-reveal]");
      gsap.set(revealTargets, { y: 48, opacity: 0 });
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          gsap.fromTo(
            entry.target,
            { y: 48, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power3.out", clearProps: "transform,opacity" },
          );
          observer?.unobserve(entry.target);
        });
      }, { threshold: 0.14 });

      revealTargets.forEach((target) => observer?.observe(target));
    }, root);

    return () => {
      observer?.disconnect();
      context.revert();
    };
  }, []);

  return <div ref={root}>{children}</div>;
}
