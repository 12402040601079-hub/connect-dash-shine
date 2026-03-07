type BidItem = {
  id: string;
  taskId: string;
  helperName: string;
  amount: number;
  note?: string;
  status: string;
  lastMovedBy?: "helper" | "poster";
  helperAcceptedCounter?: boolean;
};

type BidListProps = {
  bids: BidItem[];
  onAccept: (bidId: string) => void;
  onReject?: (bidId: string) => void;
  onCounter?: (bid: BidItem) => void;
};

export default function BidList({ bids, onAccept, onReject, onCounter }: BidListProps) {
  if (bids.length === 0) {
    return <div style={{ color: "#666", fontSize: 13 }}>No bids yet.</div>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {bids.map((bid) => (
        <div key={bid.id} style={{ border: "1px solid #ddd", borderRadius: 10, padding: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{bid.helperName}</div>
              <div style={{ fontSize: 12, color: "#555" }}>{bid.note || "No note"}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontWeight: 800 }}>INR {bid.amount}</div>
              {bid.status === "pending" && (
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 6, alignItems: "flex-end" }}>
                  {bid.lastMovedBy === "poster" ? (
                    /* User just counter-bid — waiting for helper to respond */
                    <span style={{ fontSize: 11, color: "#9333ea", fontWeight: 700 }}>
                      Your counter sent ✓ — awaiting helper response
                    </span>
                  ) : bid.helperAcceptedCounter ? (
                    /* Helper agreed to user's counter — user must confirm to start task */
                    <>
                      <span style={{ fontSize: 11, color: "#059669", fontWeight: 700 }}>
                        ✓ Helper agreed to INR {bid.amount}. Confirm to start task?
                      </span>
                      <div style={{ display: "flex", gap: 6 }}>
                        <button
                          onClick={() => onReject?.(bid.id)}
                          style={{ border: "1px solid #dc2626", borderRadius: 8, background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: 12, padding: "5px 8px" }}
                        >
                          Reject
                        </button>
                        <button
                          onClick={() => onAccept(bid.id)}
                          style={{ border: "none", borderRadius: 8, background: "#0f766e", color: "#fff", cursor: "pointer", fontSize: 12, padding: "5px 8px", fontWeight: 700 }}
                        >
                          Confirm &amp; Accept
                        </button>
                      </div>
                    </>
                  ) : (
                    /* Normal flow — helper's initial bid or counter-bid, user has all 3 options */
                    <div style={{ display: "flex", gap: 6 }}>
                      <button
                        onClick={() => onCounter?.(bid)}
                        style={{ border: "1px solid #2563eb", borderRadius: 8, background: "#eff6ff", color: "#2563eb", cursor: "pointer", fontSize: 12, padding: "5px 8px" }}
                      >
                        Counter
                      </button>
                      <button
                        onClick={() => onReject?.(bid.id)}
                        style={{ border: "1px solid #dc2626", borderRadius: 8, background: "#fef2f2", color: "#dc2626", cursor: "pointer", fontSize: 12, padding: "5px 8px" }}
                      >
                        Reject
                      </button>
                      <button
                        onClick={() => onAccept(bid.id)}
                        style={{ border: "none", borderRadius: 8, background: "#0f766e", color: "#fff", cursor: "pointer", fontSize: 12, padding: "5px 8px" }}
                      >
                        Accept
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
