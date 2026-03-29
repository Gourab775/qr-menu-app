import { useLocation } from "wouter";

export function TableRequiredPage() {
  const [, navigate] = useLocation();

  return (
    <div className="pageLayout">
      <main className="emptyWrap">
        <div className="emptyIllo" aria-hidden="true">
          📱
        </div>
        <h2 className="emptyTitle">Scan QR Code</h2>
        <p className="emptySub">Please scan the QR code from your table to view the menu.</p>
        <button
          className="btn primary pressable"
          onClick={() => {
            const tableId = prompt("Enter table number:");
            if (tableId?.trim()) {
              navigate(`/t/${tableId.trim()}`);
            }
          }}
        >
          Enter Table Number
        </button>
      </main>
    </div>
  );
}
