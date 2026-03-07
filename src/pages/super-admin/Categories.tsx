import React, { useEffect, useState } from "react";
import { addDoc, collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import { firestore } from "@/integrations/firebase/client";
import { AT, GLASS_CARD } from "./adminTheme";

type Cat = { id: string; name: string; enabled?: boolean };

export default function Categories() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [newName, setNewName] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!firestore) return;
    const unsub = onSnapshot(query(collection(firestore, "categories")), snap => {
      setCats(snap.docs.map(d => ({ id: d.id, ...d.data() } as Cat)));
    });
    return () => unsub();
  }, []);

  const addCat = async () => {
    const name = newName.trim();
    if (!name || !firestore) return;
    setBusy(true); setErr("");
    try {
      await addDoc(collection(firestore, "categories"), { name, enabled: true, createdAt: new Date() });
      setNewName("");
    } catch (e: unknown) { setErr(e instanceof Error ? e.message : "Failed"); }
    setBusy(false);
  };

  const delCat = async (id: string) => {
    if (!firestore) return;
    try { await deleteDoc(doc(firestore, "categories", id)); }
    catch (e: unknown) { setErr(e instanceof Error ? e.message : "Failed to delete"); }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 800, color: AT.text }}>Categories</h2>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: AT.muted }}>{cats.length} categories configured</p>
        </div>
      </div>

      {/* Add new */}
      <div style={{ ...GLASS_CARD, padding: "18px 20px", display: "flex", gap: 10, alignItems: "flex-end" }}>
        <div style={{ flex: 1 }}>
          <label style={{ display: "block", fontSize: 10, fontWeight: 700, color: AT.muted, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.8px" }}>New Category Name</label>
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addCat()}
            placeholder="e.g. Plumbing, Tutoring, Delivery…"
            style={{ width: "100%", padding: "9px 14px", borderRadius: 10, border: `1px solid ${AT.border}`, background: "rgba(139,92,246,0.08)", color: AT.text, fontSize: 13, outline: "none", boxSizing: "border-box" }}
          />
        </div>
        <button
          onClick={addCat}
          disabled={busy || !newName.trim()}
          style={{ padding: "9px 20px", borderRadius: 10, border: "none", background: AT.primaryGrad, color: "#fff", fontWeight: 700, fontSize: 13, cursor: "pointer", opacity: !newName.trim() ? 0.5 : 1, flexShrink: 0 }}
        >{busy ? "Adding…" : "Add Category"}</button>
      </div>
      {err && <p style={{ margin: 0, fontSize: 12, color: AT.danger }}>{err}</p>}

      {/* List */}
      <div style={{ ...GLASS_CARD, overflow: "hidden" }}>
        {cats.length === 0 && (
          <div style={{ padding: "24px 20px", fontSize: 13, color: AT.muted }}>No categories yet. Add your first one above.</div>
        )}
        {cats.map((cat, i) => (
          <div key={cat.id} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: i < cats.length - 1 ? `1px solid ${AT.border}` : "none",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: cat.enabled !== false ? AT.accent : AT.muted, flexShrink: 0 }} />
              <span style={{ fontSize: 14, fontWeight: 600, color: AT.text }}>{cat.name}</span>
              <span style={{ fontSize: 10, fontWeight: 700, color: cat.enabled !== false ? AT.accent : AT.muted, background: cat.enabled !== false ? `${AT.accent}18` : `${AT.muted}18`, padding: "2px 7px", borderRadius: 99, border: `1px solid ${cat.enabled !== false ? AT.accent : AT.muted}30` }}>
                {cat.enabled !== false ? "Enabled" : "Disabled"}
              </span>
            </div>
            <button
              onClick={() => delCat(cat.id)}
              style={{ padding: "5px 10px", borderRadius: 7, border: `1px solid ${AT.danger}40`, background: `${AT.danger}14`, color: AT.danger, fontSize: 11, fontWeight: 700, cursor: "pointer" }}
            >Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
