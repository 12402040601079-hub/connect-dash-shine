/**
 * MicroLink Security Hardening Engine
 * Defends against XSS, injection, prototype pollution, and malformed state payloads.
 */

// Basic HTML entity encoder to prevent Reflected & Stored XSS
export function sanitizeInput(raw: string): string {
  if (!raw || typeof raw !== "string") return "";
  return raw
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;")
    .trim();
}

// Strip hazardous URL protocols (prevent javascript: protocol execution)
export function sanitizeUrl(url: string): string {
  if (!url || typeof url !== "string") return "#";
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:")
  ) {
    return "#";
  }
  return trimmed;
}

// Safe localStorage JSON parser protecting against prototype pollution & JSON crashes
export function safeStorageGet<T>(key: string, defaultValue: T): T {
  if (typeof window === "undefined") return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    const parsed = JSON.parse(raw);
    // Disallow prototype pollution
    if (parsed && typeof parsed === "object" && ("__proto__" in parsed || "constructor" in parsed)) {
      console.warn(`[Security Warning] Blocked prototype pollution attempt on key: ${key}`);
      return defaultValue;
    }
    return parsed as T;
  } catch (err) {
    console.warn(`[Security Warning] Corrupted storage item for key: ${key}`, err);
    return defaultValue;
  }
}

export function safeStorageSet(key: string, value: any): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    console.error(`[Security Error] Failed to write to localStorage for ${key}`, err);
    return false;
  }
}

// Generate random cryptographic anti-CSRF / session token
export function generateCsrfToken(): string {
  if (typeof window !== "undefined" && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(16);
    window.crypto.getRandomValues(arr);
    return Array.from(arr, b => b.toString(16).padStart(2, "0")).join("");
  }
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}
