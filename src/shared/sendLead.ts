// src/shared/sendLead.ts

interface LeadPayload {
  name?: string;          // имя родителя/пользователя
  parentName?: string;    // альтернативное имя родителя
  childName?: string;
  phone: string;
  age?: string;           // возраст
  program?: string;       // программа / "Запись на занятие" / "Квиз - ..."
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  source?: string;        // hero-modal | lead-form | signup-modal | unified-signup-modal | quiz-form | question-modal | ...
}

function getFormType(source?: string) {
  switch ((source || '').toLowerCase()) {
    case 'hero-modal':
    case 'lead-form':
      return 'Форма с главного экрана';
    case 'signup-modal':
      return 'Форма записи (кнопка)';
    case 'unified-signup-modal':
      // Эта модалка у тебя вызывается и с карточек, и с хедера/последнего экрана
      return 'Форма записи (кнопка/карточка)';
    case 'quiz-form':
      return 'Квиз — подбор программы';
    case 'question-modal':
      return 'Форма вопроса';
    default:
      return 'Лид с сайта';
  }
}

export default async function sendLead(data: LeadPayload) {
  const lines: string[] = [];
  const typeLabel = getFormType(data.source);

  lines.push(`📩 <b>${typeLabel}</b>\n`);

  // Имя: берём самое информативное
  const displayName = data.parentName || data.name;
  if (displayName) lines.push(`👤 Имя: ${escapeHtml(displayName)}`);

  if (data.childName)  lines.push(`🧒 Ребёнок: ${escapeHtml(data.childName)}`);
  if (data.age)        lines.push(`🎂 Возраст: ${escapeHtml(data.age)}`);
  if (data.program)    lines.push(`📚 Программа: ${escapeHtml(data.program)}`);

  lines.push(`📞 Телефон: ${data.phone ? escapeHtml(data.phone) : '—'}`);

  if (data.preferredDate) lines.push(`📅 Дата: ${escapeHtml(data.preferredDate)}`);
  if (data.preferredTime) lines.push(`⏰ Время: ${escapeHtml(data.preferredTime)}`);
  if (data.message)       lines.push(`💬 Сообщение: ${escapeHtml(data.message)}`);

  const payload = { ...data, text: lines.join('\n') };

  try {
    const res = await fetch('/.netlify/functions/notify-telegram', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const json = await res.json().catch(() => ({}));
    return Boolean(json?.ok);
  } catch (e) {
    console.error('sendLead error:', e);
    return false;
  }
}

// HTML-экранирование
function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] || c));
}
