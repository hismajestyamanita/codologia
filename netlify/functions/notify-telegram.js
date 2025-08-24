// netlify/functions/notify-telegram.js
export async function handler(event) {
  const cors = {
    'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 200, headers: cors, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers: cors, body: 'Method not allowed' };

  try {
    const data = JSON.parse(event.body || '{}');
    const { name, phone, message = '', source = 'site', text } = data;

    // Если sendLead собрал готовый текст — шлём его
    let finalText = text;
    if (!finalText) {
      finalText =
        `<b>Новая заявка</b>\n` +
        (name ? `Имя: ${escapeHtml(name)}\n` : '') +
        (phone ? `Телефон: ${escapeHtml(phone)}\n` : '') +
        (message ? `Сообщение: ${escapeHtml(message)}\n` : '') +
        `Источник: ${escapeHtml(source)}`;
    }

    const tg = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: finalText,
        parse_mode: 'HTML',
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
