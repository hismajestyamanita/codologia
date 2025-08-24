// src/shared/sendLead.ts

export interface LeadPayload {
  type: string;             // Название формы (по-русски)
  parentName?: string;
  childName?: string;
  name?: string;            // для QuestionModal
  phone: string;
  age?: string;
  program?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
}

export default async function sendLead(data: LeadPayload) {
  // Сборка сообщения для Telegram
  const textLines: string[] = [];

  textLines.push(`📩 <b>${data.type || "Лид"}</b>\n`);

  if (data.parentName) textLines.push(`👤 Родитель: ${escapeHtml(data.parentName)}`);
  if (data.name) textLines.push(`👤 Имя: ${escapeHtml(data.name)}`);
  if (data.childName) textLines.push(`🧒 Ребенок: ${escapeHtml(data.childName)}`);
  if (data.age) textLines.push(`🎂 Возраст: ${escapeHtml(data.age)}`);
  if (data.program) textLines.push(`📚 Программа: ${escapeHtml(data.program)}`);
  textLines.push(`📞 Телефон: ${data.phone ? escapeHtml(data.phone) : "—"}`);
  if (data.preferredDate) textLines.push(`📅 Дата: ${escapeHtml(data.preferredDate)}`);
  if (data.preferredTime) textLines.push(`⏰ Время: ${escapeHtml(data.preferredTime)}`);
  if (data.message) textLines.push(`💬 Сообщение: ${escapeHtml(data.message)}`);

  const body = {
    ...data,
    text: textLines.join("\n"),
  };

  try {
    const res = await fetch("/.netlify/functions/notify-telegram", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const json = await res.json().catch(() => ({}));
    return json.ok;
  } catch (err) {
    console.error("sendLead error:", err);
    return false;
  }
}

// --- Вспомогательная функция защиты от HTML-инъекций ---
function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => {
    return (
      {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      }[c] || c
    );
  });
}
