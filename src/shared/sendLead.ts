// src/shared/sendLead.ts
type Lead = Record<string, any>;

export default async function sendLead(data: Lead) {
  try {
    const res = await fetch("/.netlify/functions/notify-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok || json.ok === false) {
      throw new Error(json.error || `HTTP ${res.status}`);
    }
    return true;
  } catch (e) {
    console.error("[lead] send error:", e);
    return false;
  }
}