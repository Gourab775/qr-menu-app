import { useEffect, useRef } from "react";

function slugify(text) {
  return String(text ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function CategorySlider({ categories, activeCategory, onCategoryClick }) {
  const isDragging = useRef(false);

  useEffect(() => {
    if (!activeCategory) return;
    const btn = document.getElementById(`cat-btn-${activeCategory}`);
    if (!btn) return;
    btn.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  }, [activeCategory]);

  const handleTouchStart = () => {
    isDragging.current = false;
  };

  const handleTouchMove = () => {
    isDragging.current = true;
  };

  const handleTouchEnd = (name) => {
    if (!isDragging.current) {
      onCategoryClick(name);
    }
  };

  if (!categories || categories.length === 0) return null;

  return (
    <nav aria-label="Menu categories">
      <div className="catScroll">
        {categories.map((c) => {
          const slug = slugify(c.name);
          const isActive = slug === activeCategory;
          return (
            <button
              key={c.id}
              id={`cat-btn-${slug}`}
              className={`catPill ${isActive ? "catPill--active" : ""}`}
              onClick={() => onCategoryClick(c.name)}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={() => handleTouchEnd(c.name)}
              role="tab"
              aria-selected={isActive}
              aria-label={`${c.name} category`}
            >
              <div className="catPillImg">
                {c.imageUrl && c.imageUrl.trim() !== "" ? (
                  <img
                    src={c.imageUrl}
                    alt=""
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                ) : (
                  <div className="catPillImgPlaceholder" />
                )}
              </div>
              <span className="catPillName">{c.name}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}