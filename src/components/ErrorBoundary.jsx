import React from "react";

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    if (import.meta?.env?.DEV) {
      console.error("UI crashed:", error, info);
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div
        style={{
          height: "100%",
          padding: 16,
          display: "grid",
          placeItems: "center",
          background: "rgba(245,245,245,1)",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 360,
            borderRadius: 18,
            border: "1px solid rgba(17, 24, 39, 0.08)",
            background: "#fff",
            padding: 16,
            boxShadow: "0 10px 22px rgba(17,24,39,0.08)",
            textAlign: "center",
          }}
        >
          <div style={{ fontWeight: 900, fontSize: 16 }}>Something went wrong</div>
          <div style={{ marginTop: 8, color: "rgba(17,24,39,0.62)", fontSize: 12 }}>
            Please refresh the page. Your cart is saved.
          </div>
          <button
            style={{
              marginTop: 12,
              width: "100%",
              height: 44,
              borderRadius: 16,
              border: "1px solid rgba(17, 24, 39, 0.08)",
              background: "#fff",
              fontWeight: 900,
              cursor: "pointer",
            }}
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }
}

