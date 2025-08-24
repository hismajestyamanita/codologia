// src/shared/sendLead.ts
interface LeadPayload {
  name?: string;
  parentName?: string;
  childName?: string;
  phone: string;
  age?: string;
  program?: string;
  message?: string;
  preferredDate?: string;
  preferredTime?: string;
  source?: string; // hero-modal | lead-form | signup-modal | unified-signup-modal | quiz-form | question-modal
}

function getFormType(source?: string) {
  switch ((source || '').toLowerCase()) {
    case 'hero-modal':
    case 'lead-form':              return 'Форма с главного экрана';
    case 'signup-modal':           return 'Форма записи (кнопка)';
    case 'unified-signup-modal':   return 'Форма записи (кнопка/карточка)';
    case 'quiz-form':              return 'Квиз — подбор программы';
    case 'question-modal':         return 'Форма вопроса';
    default:                       return 'Лид с сайта';
  }
}

export default async function sendLead(data: LeadPayload) {
  const lines: string[] = [];
  const typeLabel = getFormType(data.source);

  lines.push(`📩 <b>${typeLabel}</b>\n`);

  const displayName = data.parentName || data.name;
  if (displayName)     lines.push(`👤 Имя: ${escapeHtml(displayName)}`);
  if (data.childName)  lines.push(`🧒 Ребёнок: ${escapeHtml(data.childName)}`); // <= КРИТИЧНО
  if (data.age)        lines.push(`🎂 Возраст: ${escapeHtml(data.age)}`);
  if (data.program)    lines.push(`📚 Программа: ${escapeHtml(data.program)}`);
  lines.push(`📞 Телефон: ${data.phone ? escapeHtml(data.phone) : '—'}`);
  if (data.preferredDate) lines.push(`📅 Дата: ${escapeHtml(data.preferredDate)}`);
  if (data.preferredTime) lines.push(`⏰ Время: ${escapeHtml(data.preferredTime)}`);
  if (data.message)       lines.push(`💬 Сообщение: ${escapeHtml(data.message)}`);

  const payload = { ...data, text: lines.join('\n') }; // <= КРИТИЧНО

  // ВРЕМЕННЫЙ ЛОГ НА ФРОНТЕ: увидишь в консоли браузера, что реально уходит
  console.log('sendLead payload:', payload);

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

function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] || c));
}
