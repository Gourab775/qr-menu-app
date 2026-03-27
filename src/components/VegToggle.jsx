import { useCart } from "../hooks/useCart";

export function VegToggle() {
  const { vegMode, setVegMode } = useCart();

  return (
    <div className="vegToggleWrap">
      <span className="vegLabel">VEG</span>
      <button
        onClick={() => setVegMode(!vegMode)}
        className={`vegSwitch ${vegMode ? "on" : ""}`}
        aria-pressed={vegMode}
        title={vegMode ? "Veg only (on)" : "Veg only (off)"}
      >
        <span className="vegThumb" />
      </button>
    </div>
  );
}
