import { useLocation } from "wouter";

export function NotFoundPage() {
  const [, navigate] = useLocation();
  return (
    <div className="page">
      <main className="container">
        <div className="emptyState">
          <h2>Page not found</h2>
          <p className="muted">That route doesn’t exist.</p>
          <button className="btn" onClick={() => navigate("/")}>
            Go to menu
          </button>
        </div>
      </main>
    </div>
  );
}

