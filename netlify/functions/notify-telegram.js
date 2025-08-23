// netlify/functions/notify-telegram.js
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST,OPTIONS',
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS,
      body: JSON.stringify({ ok: false, error: 'Method Not Allowed' }),
    };
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const list = (process.env.TELEGRAM_WHITELIST || '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);

  if (!token || list.length === 0) {
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ ok: false, error: 'Missing token or whitelist' }),
    };
  }

  try {
    const data = JSON.parse(event.body || '{}');

    // Нормализуем поля (чтобы ничего не падало)
    const name     = (data.name || data.childName || data.parentName || '').toString().trim();
    const phone    = (data.phone || data.phoneNumber || '').toString().trim();
    const age      = (data.age   || data.childAge || '').toString().trim();
    const program  = (data.program || data.program1 || data.program2 || data.product || '').toString().trim();
    const source   = (data.source || 'site').toString().trim();

    const utm = [
      data.utm_source  ? `utm_source=${data.utm_source}`   : null,
      data.utm_medium  ? `utm_medium=${data.utm_medium}`   : null,
      data.utm_campaign? `utm_campaign=${data.utm_campaign}`: null,
      data.utm_content ? `utm_content=${data.utm_content}` : null,
      data.utm_term    ? `utm_term=${data.utm_term}`       : null,
    ].filter(Boolean);

    // ЧИСТЫЙ ТЕКСТ, БЕЗ parse_mode !!!
    const text = [
      '🔥 Новый лид',
      name   ? `Имя: ${name}`         : null,
      phone  ? `Телефон: ${phone}`    : null,
      age    ? `Возраст ребёнка: ${age}` : null,
      program? `Программа: ${program}`: null,
      `Источник: ${source}`,
      utm.length ? 'UTM:' : null,
      ...utm,
      `Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Europe/Moscow' })}`,
    ].filter(Boolean).join('\n');

    // Отправка всем из whitelist
    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const sendOne = async (chatId) => {
      const resp = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // НИКАКОГО parse_mode тут не указывать
        body: JSON.stringify({
          chat_id: chatId,
          text,
          disable_web_page_preview: true,
          disable_notification: false,
        }),
      });
      const json = await resp.json();
      if (!resp.ok || !json.ok) {
        throw new Error(`Telegram error ${resp.status}: ${JSON.stringify(json)}`);
      }
    };

    await Promise.all(list.map(sendOne));

    return {
      statusCode: 200,
      headers: CORS,
      body: JSON.stringify({ ok: true }),
    };
  } catch (e) {
    console.error('notify-telegram error', e);
    return {
      statusCode: 500,
      headers: CORS,
      body: JSON.stringify({ ok: false, error: String(e.message || e) }),
    };
  }
};