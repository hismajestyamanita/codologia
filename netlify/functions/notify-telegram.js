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
    const { name, phone, message = '', source = 'site' } = JSON.parse(event.body || '{}');

    if (!name || !phone) {
      return { statusCode: 400, headers: cors, body: JSON.stringify({ ok: false, error: 'name/phone required' }) };
    }

    const text =
      `<b>Новая заявка</b>\n` +
      `Имя: ${name}\n` +
      `Телефон: ${phone}\n` +
      (message ? `Сообщение: ${message}\n` : '') +
      `Источник: ${source}`;

    const tg = await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: process.env.TELEGRAM_CHAT_ID, text, parse_mode: 'HTML' }),
    });

    if (!tg.ok) {
      return { statusCode: 502, headers: cors, body: JSON.stringify({ ok: false, error: 'tg_fail' }) };
    }

    return { statusCode: 200, headers: cors, body: JSON.stringify({ ok: true }) };
  } catch (err) {
    return { statusCode: 500, headers: cors, body: JSON.stringify({ ok: false, error: 'server_error' }) };
  }
}
