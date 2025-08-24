// src/shared/sendLead.ts

interface LeadPayload {
  name?: string;          // имя родителя или юзера
  parentName?: string;    // отдельное поле в LeadForm / SignupModal
  childName?: string;     // имя ребёнка
  phone: string;          // телефон
  age?: string;           // возраст ребёнка
  program?: string;       // программа / "Запись на занятие" / "Вопрос"
  message?: string;       // кастомный текст, если есть
  preferredDate?: string; // дата из LeadForm
  preferredTime?: string; // время из LeadForm
  source?: string;        // lead-form, signup-modal, unified-signup-modal, question-modal
}

function getFormType(source?: string) {
  switch (source) {
    case "lead-form":
      return "Лид форма главного экрана";
    case "signup-modal":
      return "Форма записи (модальное окно)";
    case "unified-signup-modal":
      return "Форма после квиза / выбора программы";
    case "question-modal":
      return "Форма вопроса";
    default:
      return "Лид с сайта";
  }
}

export default async function sendLead(data: LeadPayload) {
  const lines: string[] = [];

  // Заголовок
  const typeLabel = getFormType(data.source);
  lines.push(`📩 <b>${typeLabel}</b>\n`);

  // Поля
  if (data.name) lines.push(`👤 Имя: ${escapeHtml(data.name)}`);
  if (data.parentName) lines.push(`👤 Родитель: ${escapeHtml(data.parentName)}`);
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
