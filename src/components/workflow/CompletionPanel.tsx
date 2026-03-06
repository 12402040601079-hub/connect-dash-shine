type CompletionPanelProps = {
  status: string;
  isHelper: boolean;
  canRequestCompletion: boolean;
  canConfirmCompletion: boolean;
  onRequestCompletion: () => void;
  onConfirmCompletion: () => void;
};

export default function CompletionPanel({
  status,
  isHelper,
  canRequestCompletion,
  canConfirmCompletion,
  onRequestCompletion,
  onConfirmCompletion,
}: CompletionPanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: "#555" }}>Status: {status}</div>
      {isHelper && canRequestCompletion && (
        <button
          onClick={onRequestCompletion}
          style={{ width: "fit-content", padding: "7px 10px", borderRadius: 10, border: "none", background: "#0f766e", color: "#fff", cursor: "pointer", fontWeight: 700 }}
        >
          Request Completion
        </button>
      )}
      {!isHelper && canConfirmCompletion && (
        <button
          onClick={onConfirmCompletion}
          style={{ width: "fit-content", padding: "7px 10px", borderRadius: 10, border: "none", background: "#1d4ed8", color: "#fff", cursor: "pointer", fontWeight: 700 }}
        >
          Confirm Completion
        </button>
      )}
    </div>
  );
}
