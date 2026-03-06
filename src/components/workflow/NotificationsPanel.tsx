type NotificationRow = {
  id: string;
  title: string;
  body: string;
  read: boolean;
};

type NotificationsPanelProps = {
  notifications: NotificationRow[];
  onMarkRead: (id: string) => void;
};

export default function NotificationsPanel({ notifications, onMarkRead }: NotificationsPanelProps) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {notifications.length === 0 && <div style={{ color: "#666", fontSize: 13 }}>No notifications yet.</div>}
      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: 12,
            padding: 12,
            background: notification.read ? "#fff" : "#f8fafc",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <div style={{ fontWeight: 700, fontSize: 14 }}>{notification.title}</div>
            {!notification.read && (
              <button
                onClick={() => onMarkRead(notification.id)}
                style={{ border: "none", borderRadius: 8, background: "#111827", color: "#fff", cursor: "pointer", fontSize: 11, padding: "4px 8px" }}
              >
                Mark read
              </button>
            )}
          </div>
          <p style={{ marginTop: 6, fontSize: 12, color: "#555" }}>{notification.body}</p>
        </div>
      ))}
    </div>
  );
}
