import { useEffect } from "react";

export function useCategorySync(containerId, setActiveCategory) {
  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const sections = container.querySelectorAll("[data-category-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        root: container,
        rootMargin: "-100px 0px -60% 0px",
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, [containerId, setActiveCategory]);
}
