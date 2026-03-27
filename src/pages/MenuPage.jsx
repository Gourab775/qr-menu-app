import { useMemo, useState } from "react";
import { Header } from "../components/Header";
import { SearchBar } from "../components/SearchBar";
import { VegToggle } from "../components/VegToggle";
import { HeroBanner } from "../components/HeroBanner";
import { CategorySlider } from "../components/CategorySlider";
import { MenuItemCard } from "../components/MenuItemCard";
import { useMenu } from "../hooks/useMenu";
import { useMenuSearch } from "../hooks/useMenuSearch";
import { useCart } from "../hooks/useCart";
import { useCategorySync } from "../hooks/useCategorySync";

function slugify(text) {
  return String(text ?? "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

let isScrolling = false;
let animationFrameId = null;

const smoothScrollTo = (targetY, duration = 500) => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }

  isScrolling = true;

  const startY = window.scrollY;
  const difference = targetY - startY;
  let startTime = null;

  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;

    const time = timestamp - startTime;
    const percent = Math.min(time / duration, 1);

    const ease =
      percent < 0.5
        ? 2 * percent * percent
        : 1 - Math.pow(-2 * percent + 2, 2) / 2;

    window.scrollTo(0, startY + difference * ease);

    if (percent < 1 && isScrolling) {
      animationFrameId = requestAnimationFrame(step);
    } else {
      isScrolling = false;
    }
  };

  animationFrameId = requestAnimationFrame(step);
};

const stopScroll = () => {
  isScrolling = false;
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
  }
};

if (typeof window !== "undefined") {
  window.addEventListener("touchstart", stopScroll);
  window.addEventListener("wheel", stopScroll);
}

export function MenuPage() {
  const { vegMode, searchQuery } = useCart();
  const { categories, menuItems, loading, error, refetch } = useMenu();
  const { results: searchResults, searching } = useMenuSearch(searchQuery);

  const isSearching = searchQuery.trim() !== "";

  const [activeCategory, setActiveCategory] = useState(null);

  const grouped = useMemo(() => {
    if (isSearching) {
      if (searchResults.length === 0) return [];
      let items = [...searchResults];
      if (vegMode) items = items.filter((i) => i.isVeg);
      return [{ category: { id: "__search", name: `Results for "${searchQuery}"` }, items }];
    }

    return categories
      .map((c) => {
        let items = menuItems.filter((i) => i.categoryId === c.id);
        if (vegMode) items = items.filter((i) => i.isVeg);
        return { category: c, items };
      })
      .filter((g) => g.items.length > 0);
  }, [categories, menuItems, searchResults, vegMode, searchQuery, isSearching]);

  // ── Scroll sync: container scroll → update active category ──
  useCategorySync("menu-container", setActiveCategory);

  // ── Scroll to section using custom smooth animation ──
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 90;
    const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;
    smoothScrollTo(offsetPosition, 600);
  };

  // ── Category click → scroll to section ──
  const handleCategoryClick = (categoryName) => {
    const slug = slugify(categoryName);
    setActiveCategory(slug);
    setTimeout(() => scrollToSection(slug), 100);
  };

  return (
    <div className="menuLayout">
      <main id="menu-container" className="menuScroll hideScrollbar">
        <Header />

        <div className="stickyHeader">
          <div className="stickySearchRow">
            <SearchBar />
            <VegToggle />
          </div>
          {!isSearching && (
            <CategorySlider
              categories={categories}
              activeCategory={activeCategory}
              onCategoryClick={handleCategoryClick}
            />
          )}
        </div>

        {!isSearching && <HeroBanner />}

        <div className="container">
          {(loading || searching) && (
            <>
              {[1, 2, 3, 4, 5].map((n) => (
                <div key={n} className="skeletonCard" />
              ))}
            </>
          )}

          {!loading && !searching && error && (
            <div className="emptyState">
              <h2>Network issue</h2>
              <p className="muted">Check your connection and try again.</p>
              <button className="btn primary" onClick={refetch}>Try again</button>
            </div>
          )}

          {!loading && !searching && !error && grouped.length > 0 && (
            <>
              <div className="sections">
                {grouped.map(({ category, items }) => (
                  <div
                    key={category.id}
                    id={slugify(category.name)}
                    className="menuSection"
                  >
                    <div className="sectionHeader">
                      <h2>{category?.name ?? ""}</h2>
                      <span className="muted">
                        {`${items.length} item${items.length === 1 ? "" : "s"}`}
                      </span>
                    </div>
                    {items.map((item) => (
                      <MenuItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ))}
              </div>
            </>
          )}

          {!loading && !searching && !error && grouped.length === 0 && (
            <div className="emptyState">
              {isSearching ? (
                <>
                  <div className="emptyIcon" aria-label="Search icon">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="m21 21-4.35-4.35" />
                      <path d="M8 11h6" />
                    </svg>
                  </div>
                  <h2>No dishes found</h2>
                  <p className="muted">Try a different search term.</p>
                </>
              ) : menuItems.length === 0 ? (
                <>
                  <h2>Menu loading…</h2>
                  <p className="muted">Waiting for menu data from Supabase.</p>
                </>
              ) : (
                <>
                  <h2>No dishes found</h2>
                  <p className="muted">Try turning off Veg mode.</p>
                </>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
