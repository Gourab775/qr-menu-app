import { useCallback, useEffect, useRef, useState } from "react";
import { useMenu } from "../hooks/useMenu";

const HOLD_DURATION = 3500;
const TRANSITION_DURATION = 600;

export function HeroBanner() {
  const { featuredItems, categories } = useMenu();
  const containerRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const timerRef = useRef(null);

  const items = featuredItems.length > 0 ? featuredItems : [];
  const itemCount = items.length;

  const advanceSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % itemCount);
  }, [itemCount]);

  useEffect(() => {
    if (itemCount === 0) return;

    timerRef.current = setInterval(advanceSlide, HOLD_DURATION + TRANSITION_DURATION);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [itemCount, advanceSlide]);

  useEffect(() => {
    if (itemCount === 0 || !containerRef.current) return;

    const slides = containerRef.current.querySelectorAll(".featuredSlide");
    slides.forEach((slide, i) => {
      slide.classList.remove("active", "leaving");
      if (i === currentIndex) {
        slide.classList.add("active");
      } else if (i === (currentIndex - 1 + itemCount) % itemCount) {
        slide.classList.add("leaving");
      }
    });
  }, [currentIndex, itemCount]);

  const handleSlideClick = useCallback(
    (redirectUrl) => {
      if (!redirectUrl) return;

      if (redirectUrl.startsWith("#")) {
        const selector = redirectUrl.substring(1);
        const el = document.getElementById(selector);

        if (el) {
          const menuContainer = document.getElementById("menu-container");
          const sticky = menuContainer?.querySelector(".stickyHeader");
          const stickyH = sticky ? sticky.offsetHeight : 0;
          const offset = 80;
          const top = el.getBoundingClientRect().top + (menuContainer?.scrollTop ?? window.scrollY) - stickyH - offset;

          menuContainer?.scrollTo({ top, behavior: "smooth" }) ??
            window.scrollTo({ top, behavior: "smooth" });
        }
      } else {
        const category = categories.find((c) => c.id === redirectUrl);
        if (category) {
          const section = document.getElementById(`category-${category.id}`);
          if (section) {
            const menuContainer = document.getElementById("menu-container");
            const sticky = menuContainer?.querySelector(".stickyHeader");
            const stickyH = sticky ? sticky.offsetHeight : 0;
            const target = section.offsetTop - stickyH - 8;
            menuContainer?.scrollTo({ top: target, behavior: "smooth" });
          }
        }
      }

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      advanceSlide();
      timerRef.current = setInterval(advanceSlide, HOLD_DURATION + TRANSITION_DURATION);
    },
    [categories, advanceSlide]
  );

  if (itemCount === 0) return null;

  return (
    <div className="featuredSection">
      <div ref={containerRef} className="featuredCarousel">
        {items.map((item, i) => {
          const hasImage = item.imageUrl && item.imageUrl.trim() !== "";
          return (
            <div
              key={item.id}
              className={`featuredSlide ${i === 0 ? "active" : ""}`}
              onClick={() => handleSlideClick(item.redirectUrl)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && handleSlideClick(item.redirectUrl)}
            >
              {hasImage ? (
                <img
                  src={item.imageUrl}
                  alt=""
                  className="featuredImg"
                  loading={i === 0 ? "eager" : "lazy"}
                  draggable={false}
                />
              ) : (
                <div className="featuredImg placeholder" />
              )}
              <div className="featuredDots">
                {items.map((_, idx) => (
                  <span
                    key={idx}
                    className={`featuredDot ${idx === currentIndex ? "active" : ""}`}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
