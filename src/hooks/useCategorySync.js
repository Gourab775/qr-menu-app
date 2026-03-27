import { useEffect, useRef } from "react";

export function useCategorySync(containerId, setActiveCategory) {
  const tickingRef = useRef(false);
  const lastActiveRef = useRef(null);

  useEffect(() => {
    const container = document.getElementById(containerId);
    if (!container) return;

    const updateActiveCategory = () => {
      const sections = container.querySelectorAll(".menuSection");
      const sticky = container.querySelector(".stickyHeader");
      const stickyHeight = sticky ? sticky.offsetHeight : 60;
      const triggerPoint = stickyHeight + 80;

      let currentId = "";

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        const sectionTop = rect.top - containerRect.top + container.scrollTop;

        if (container.scrollTop >= sectionTop - triggerPoint) {
          currentId = section.id;
        }
      });

      if (currentId && currentId !== lastActiveRef.current) {
        lastActiveRef.current = currentId;
        setActiveCategory(currentId);
      }

      tickingRef.current = false;
    };

    const handleScroll = () => {
      if (!tickingRef.current) {
        tickingRef.current = true;
        requestAnimationFrame(updateActiveCategory);
      }
    };

    container.addEventListener("scroll", handleScroll, { passive: true });

    requestAnimationFrame(updateActiveCategory);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [containerId, setActiveCategory]);
}
