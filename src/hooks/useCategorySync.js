import { useEffect } from "react";

export function useCategorySync(setActiveCategory) {
  useEffect(() => {
    const sections = document.querySelectorAll("[data-category-section]");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveCategory(entry.target.id);
          }
        });
      },
      {
        rootMargin: "-80px 0px -70% 0px",
        threshold: 0,
      }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => observer.disconnect();
  }, [setActiveCategory]);
}
