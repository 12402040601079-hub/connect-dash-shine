import { useState } from "react";

type RatingDialogProps = {
  open: boolean;
  helperName: string;
  submitting?: boolean;
  onClose: () => void;
  onSubmit: (stars: number, review: string) => Promise<void> | void;
};

export default function RatingDialog({ open, helperName, submitting, onClose, onSubmit }: RatingDialogProps) {
  const [stars, setStars] = useState(5);
  const [review, setReview] = useState("");

  if (!open) return null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
      <div style={{ width: "min(94vw, 460px)", background: "#fff", color: "#111", borderRadius: 16, padding: 18 }}>
        <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8 }}>Rate {helperName}</h3>
        <p style={{ fontSize: 13, color: "#555", marginBottom: 14 }}>Your review helps build trust in the community.</p>

        <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => setStars(value)}
              style={{
                border: "1px solid #ddd",
                borderRadius: 10,
                padding: "6px 10px",
                cursor: "pointer",
                background: value <= stars ? "#f59e0b" : "#f3f4f6",
                color: value <= stars ? "#fff" : "#111",
                fontWeight: 700,
              }}
            >
              {value}
            </button>
          ))}
        </div>

        <textarea
          value={review}
          onChange={(e) => setReview(e.target.value)}
          rows={4}
          placeholder="Share a short review"
          style={{ width: "100%", border: "1px solid #ddd", borderRadius: 10, padding: 10, resize: "vertical", marginBottom: 14 }}
        />

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          <button onClick={onClose} style={{ padding: "8px 12px", borderRadius: 10, border: "1px solid #ddd", background: "#fff", cursor: "pointer" }}>
            Cancel
          </button>
          <button
            disabled={Boolean(submitting)}
            onClick={() => onSubmit(stars, review.trim())}
            style={{ padding: "8px 12px", borderRadius: 10, border: "none", background: "#111827", color: "#fff", cursor: "pointer", fontWeight: 700 }}
          >
            {submitting ? "Submitting..." : "Submit Rating"}
          </button>
        </div>
      </div>
    </div>
  );
}
