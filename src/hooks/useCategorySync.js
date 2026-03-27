import { useEffect, useRef } from "react";

export function useCategorySync(containerId, setActiveCategory) {
  const observerRef = useRef(null);
  const lastActiveRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const topSection = container.querySelector(".topSection");
    const headerHeight = topSection ? topSection.offsetHeight : 180;

    const visibleSections = new Map();

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visibleSections.set(entry.target.id, entry.intersectionRatio);
        } else {
          visibleSections.delete(entry.target.id);
        }
      });

      let maxRatio = 0;
      let maxId = null;

      visibleSections.forEach((ratio, id) => {
        if (ratio > maxRatio) {
          maxRatio = ratio;
          maxId = id;
        }
      });

      if (maxId && maxId !== lastActiveRef.current) {
        lastActiveRef.current = maxId;
        setActiveCategory(maxId);
      }
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: container,
      rootMargin: `-${headerHeight}px 0px -50% 0px`,
      threshold: [0, 0.25, 0.5, 0.75, 1],
    });

    const sections = container.querySelectorAll(".menuSection");
    sections.forEach((section) => {
      if (section.id) {
        observerRef.current.observe(section);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [containerId, setActiveCategory]);
}
