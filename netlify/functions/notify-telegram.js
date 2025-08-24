// netlify/functions/notify-telegram.js
export async function handler(event) {
  const cors = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST')   return { statusCode: 405, headers: cors, body: 'Method not allowed' };

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, parentName, childName, phone, message = '', source = 'site', text } = data;

    // ВРЕМЕННЫЙ ЛОГ НА БЭКЕ: смотри в Netlify → Functions → notify-telegram → Logs
    console.log('notify-telegram body:', data);

    let finalText = text; // <= если фронт прислал готовый text — используем его
    if (!finalText) {
      const lines = [];
      lines.push(`<b>Новая заявка</b>\n`);
      const displayName = parentName || name;
      if (displayName) lines.push(`Имя: ${escapeHtml(displayName)}`);
      if (childName)   lines.push(`Ребёнок: ${escapeHtml(childName)}`);
      if (phone)       lines.push(`Телефон: ${escapeHtml(phone)}`);
      if (message)     lines.push(`Сообщение: ${escapeHtml(message)}`);
      lines.push(`Источник: ${escapeHtml(source)}`);
      finalText = lines.join('\n');
    }

    const tg = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: finalText,
        parse_mode: 'HTML',
        disable_web_page_preview: true
      }),
    });

    if (!tg.ok) {
      const err = await tg.text();
      return { statusCode: 502, headers: cors, body: JSON.stringify({ ok: false, error: 'tg_fail', details: err }) };
    }

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    console.error('notify-telegram error', err);
    return { statusCode: 500, headers: cors, body: JSON.stringify({ ok: false, error: 'server_error' }) };
  }
}

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c] || c));
}
