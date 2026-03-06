type BidItem = {
  id: string;
  helperName: string;
  amount: number;
  note?: string;
  status: string;
};

type BidListProps = {
  bids: BidItem[];
  onAccept: (bidId: string) => void;
};

export default function BidList({ bids, onAccept }: BidListProps) {
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
                <button
                  onClick={() => onAccept(bid.id)}
                  style={{ marginTop: 6, border: "none", borderRadius: 8, background: "#0f766e", color: "#fff", cursor: "pointer", fontSize: 12, padding: "5px 8px" }}
                >
                  Accept
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
