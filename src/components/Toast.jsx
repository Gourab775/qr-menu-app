import { useEffect } from "react";

export function Toast({ message, type = "success", onHide }) {
  useEffect(() => {
    const el = document.getElementById("app-toast");
    if (!el) return;

    if (message) {
      el.classList.add("toastWrap--visible");
      el.textContent = message;
      const timer = setTimeout(() => {
        el.classList.remove("toastWrap--visible");
        setTimeout(() => onHide?.(), 320);
      }, 2200);
      return () => clearTimeout(timer);
    } else {
      el.classList.remove("toastWrap--visible");
    }
  }, [message, onHide]);

  return (
    <div
      id="app-toast"
      className={`toastWrap toastWrap--${type}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="toastIcon" aria-hidden="true">
        {type === "success" ? "✓" : type === "error" ? "✕" : "ℹ"}
      </span>
      <span className="toastMsg">{message}</span>
    </div>
  );
}
