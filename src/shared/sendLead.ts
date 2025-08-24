// src/shared/sendLead.ts

interface LeadPayload {
  name?: string;        // общее имя (например QuestionModal)
  parentName?: string;  // имя родителя
  childName?: string;   // имя ребенка
  phone: string;        // телефон
  age?: string;         // возраст
  program?: string;     // выбранная программа
  message?: string;     // произвольный текст/вопрос
  preferredDate?: string;
  preferredTime?: string;
  source?: string;      // откуда пришёл лид (signup-modal, lead-form и тд)
}

export default async function sendLead(data: LeadPayload) {
  const lines: string[] = [];

  // Заголовок — по source, если есть
  let typeLabel = "Лид";
  switch (data.source) {
    case "lead-form":
      typeLabel = "Лид форма главного экрана";
      break;
    case "signup-modal":
      typeLabel = "Модальное окно записи";
      break;
    case "unified-signup-modal":
      typeLabel = "Универсальная форма записи";
      break;
    case "question-modal":
      typeLabel = "Форма вопроса";
      break;
    default:
      typeLabel = "Лид";
  }

  lines.push(`📩 <b>${typeLabel}</b>\n`);

  if (data.parentName) lines.push(`👤 Родитель: ${escapeHtml(data.parentName)}`);
  if (data.name) lines.push(`👤 Имя: ${escapeHtml(data.name)}`);
  if (data.childName) lines.push(`🧒 Ребенок: ${escapeHtml(data.childName)}`);
  if (data.age) lines.push(`🎂 Возраст: ${escapeHtml(data.age)}`);
  if (data.program) lines.push(`📚 Программа: ${escapeHtml(data.program)}`);
  lines.push(`📞 Телефон: ${data.phone ? escapeHtml(data.phone) : "—"}`);
  if (data.preferredDate) lines.push(`📅 Дата: ${escapeHtml(data.preferredDate)}`);
  if (data.preferredTime) lines.push(`⏰ Время: ${escapeHtml(data.preferredTime)}`);
  if (data.message) lines.push(`💬 Сообщение: ${escapeHtml(data.message)}`);

  const body = { ...data, text: lines.join("\n") };

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

// --- helper для защиты от HTML-инъекций ---
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
