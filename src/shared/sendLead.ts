// src/shared/sendLead.ts

interface LeadPayload {
  name?: string;          // имя родителя/пользователя (старое поле)
  parentName?: string;    // имя родителя (новое поле)
  childName?: string;     // имя ребёнка
  phone: string;          // телефон
  age?: string;           // возраст ребёнка
  program?: string;       // программа (для квиза не печатаем)
  message?: string;       // сообщение / для квиза — сводка ответов
  preferredDate?: string; // желаемая дата (если есть)
  preferredTime?: string; // желаемое время (если есть)
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

  // Заголовок
  const typeLabel = getFormType(data.source);
  lines.push(`📩 <b>${typeLabel}</b>\n`);

  // Имя
  const displayName = data.parentName || data.name;
  if (displayName) lines.push(`👤 Имя: ${escapeHtml(displayName)}`);

  // Ребёнок / Возраст
  if (data.childName) lines.push(`🧒 Ребёнок: ${escapeHtml(data.childName)}`);
  if (data.age)       lines.push(`🎂 Возраст: ${escapeHtml(data.age)}`);

  // Программа — НЕ печатаем для квиза
  if ((data.source || '').toLowerCase() !== 'quiz-form' && data.program) {
    lines.push(`📚 Программа: ${escapeHtml(data.program)}`);
  }

  // Телефон
  lines.push(`📞 Телефон: ${data.phone ? escapeHtml(data.phone) : '—'}`);

  // Дата / Время
  if (data.preferredDate) lines.push(`📅 Дата: ${escapeHtml(data.preferredDate)}`);
  if (data.preferredTime) lines.push(`⏰ Время: ${escapeHtml(data.preferredTime)}`);

  // Сообщение:
  // - для квиза печатаем как блок «Ответы квиза»
  // - для остальных источников — обычное сообщение
  if (data.message) {
    if ((data.source || '').toLowerCase() === 'quiz-form') {
      lines.push(`🧩 Ответы квиза:\n${escapeMultiline(data.message)}`);
    } else {
      lines.push(`💬 Сообщение: ${escapeMultiline(data.message)}`);
    }
  }

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

// Экраним HTML
function escapeHtml(s: string) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] || c));
}

// Экраним HTML + сохраняем переносы строк
function escapeMultiline(s: string) {
  return escapeHtml(s).replace(/\r?\n/g, '\n');
}
