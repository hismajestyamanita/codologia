async function sendLead(data: { name: string; phone: string; message?: string }) {
  const res = await fetch('/.netlify/functions/notify-telegram', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return res.json();
}

export default sendLead;
