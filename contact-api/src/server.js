import express from 'express';
import cors from 'cors';
import nodemailer from 'nodemailer';

const app = express();

// --- Konfiguration aus Umgebungsvariablen ---
const {
  SMTP_HOST = 'smtp.example.com',
  SMTP_PORT = '587',
  SMTP_SECURE = 'false',
  SMTP_USER = '',
  SMTP_PASS = '',
  CONTACT_EMAIL = 'kontakt@movetos.de',
  ALLOWED_ORIGIN = 'https://mr730811.github.io',
  PORT = '3001',
} = process.env;

// --- CORS: Nur die eigene Website erlauben ---
app.use(cors({
  origin: ALLOWED_ORIGIN,
  methods: ['POST', 'OPTIONS'],
}));
app.use(express.json());

// --- SMTP-Transport ---
const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: parseInt(SMTP_PORT),
  secure: SMTP_SECURE === 'true',
  auth: { user: SMTP_USER, pass: SMTP_PASS },
});

// --- Einfaches Rate-Limiting (pro IP, im Memory) ---
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60_000; // 1 Minute
const RATE_LIMIT_MAX = 3;         // max. 3 Anfragen pro Minute

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now - entry.firstRequest > RATE_LIMIT_WINDOW) {
    rateLimit.set(ip, { firstRequest: now, count: 1 });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

// --- Einsatz-Typ Label-Mapping ---
const eventTypeLabels = {
  festival: 'Festival / Konzert',
  stadtfest: 'Stadtfest / Markt',
  corporate: 'Corporate Event',
  kritis: 'KRITIS / Infrastruktur',
  sonstige: 'Sonstiges',
};

// --- POST /api/contact ---
app.post('/api/contact', async (req, res) => {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: 'Zu viele Anfragen. Bitte versuchen Sie es in einer Minute erneut.' });
  }

  const { name, company, email, eventType, visitors, message, consent_timestamp, consent_version, consent_source } = req.body;

  // Pflichtfelder prüfen
  if (!name || !email) {
    return res.status(400).json({ error: 'Name und E-Mail sind Pflichtfelder.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Ungültige E-Mail-Adresse.' });
  }

  const typeLabel = eventTypeLabels[eventType] || eventType || '—';
  const subject = `Neue Anfrage von ${name}${company ? ` (${company})` : ''}`;

  const textBody = [
    `Neue Kontaktanfrage über movetos.de`,
    `${'─'.repeat(40)}`,
    ``,
    `Name:           ${name}`,
    `Unternehmen:    ${company || '—'}`,
    `E-Mail:         ${email}`,
    `Einsatz-Typ:    ${typeLabel}`,
    `Personenzahl:   ${visitors || '—'}`,
    ``,
    `Nachricht:`,
    message || '(keine Nachricht)',
    ``,
    `${'─'.repeat(40)}`,
    `DSGVO-Consent`,
    `Zeitstempel:    ${consent_timestamp || '—'}`,
    `Version:        ${consent_version || '—'}`,
    `Quelle:         ${consent_source || '—'}`,
  ].join('\n');

  const htmlBody = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #E8661E; margin-bottom: 20px;">Neue Kontaktanfrage</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666; width: 140px;">Name</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(name)}</td></tr>
        <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Unternehmen</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(company || '—')}</td></tr>
        <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">E-Mail</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;"><a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a></td></tr>
        <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Einsatz-Typ</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(typeLabel)}</td></tr>
        <tr><td style="padding: 8px 12px; border-bottom: 1px solid #eee; color: #666;">Personenzahl</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${escapeHtml(visitors || '—')}</td></tr>
      </table>
      <div style="margin-top: 20px; padding: 16px; background: #f8f8f8; border-radius: 8px;">
        <strong style="color: #666;">Nachricht:</strong>
        <p style="margin-top: 8px; white-space: pre-wrap;">${escapeHtml(message || '(keine Nachricht)')}</p>
      </div>
      <div style="margin-top: 20px; padding: 12px; background: #f0f0f0; border-radius: 6px; font-size: 12px; color: #888;">
        <strong>DSGVO-Consent:</strong> ${escapeHtml(consent_timestamp || '—')} | Version ${escapeHtml(consent_version || '—')} | ${escapeHtml(consent_source || '—')}
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"MOVETOS Kontaktformular" <${SMTP_USER}>`,
      to: CONTACT_EMAIL,
      replyTo: email,
      subject,
      text: textBody,
      html: htmlBody,
    });

    console.log(`[${new Date().toISOString()}] Email sent: ${name} <${email}>`);
    res.json({ success: true });
  } catch (err) {
    console.error(`[${new Date().toISOString()}] Email error:`, err.message);
    res.status(500).json({ error: 'Nachricht konnte nicht gesendet werden. Bitte versuchen Sie es später erneut.' });
  }
});

// --- Health-Check ---
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// --- Server starten ---
app.listen(parseInt(PORT), () => {
  console.log(`MOVETOS Contact API running on port ${PORT}`);
  console.log(`CORS allowed origin: ${ALLOWED_ORIGIN}`);
  console.log(`Emails will be sent to: ${CONTACT_EMAIL}`);
});

// --- Hilfsfunktion: HTML-Escape ---
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
