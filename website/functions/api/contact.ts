interface Env {
  RESEND_API_KEY: string;
  CONTACT_EMAIL?: string;
}

interface ContactData {
  name: string;
  email: string;
  company?: string;
  eventType?: string;
  visitors?: string;
  message?: string;
  consent_timestamp?: string;
  consent_version?: string;
  consent_source?: string;
}

const REQUIRED_FIELDS = ['name', 'email'] as const;

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    const data: ContactData = await context.request.json();

    // Validate required fields
    for (const field of REQUIRED_FIELDS) {
      if (!data[field] || !data[field].trim()) {
        return new Response(
          JSON.stringify({ error: `Field "${field}" is required.` }),
          { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
        );
      }
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address.' }),
        { status: 400, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    const recipientEmail = context.env.CONTACT_EMAIL || 'kontakt@movetos.de';

    const htmlBody = `
      <h2>Neue Kontaktanfrage über cf.movetos.com</h2>
      <table style="border-collapse:collapse;font-family:sans-serif;">
        <tr><td style="padding:6px 12px;font-weight:bold;">Name</td><td style="padding:6px 12px;">${escapeHtml(data.name)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">E-Mail</td><td style="padding:6px 12px;">${escapeHtml(data.email)}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Unternehmen</td><td style="padding:6px 12px;">${escapeHtml(data.company || '—')}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Einsatztyp</td><td style="padding:6px 12px;">${escapeHtml(data.eventType || '—')}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Besucher</td><td style="padding:6px 12px;">${escapeHtml(data.visitors || '—')}</td></tr>
        <tr><td style="padding:6px 12px;font-weight:bold;">Nachricht</td><td style="padding:6px 12px;">${escapeHtml(data.message || '—')}</td></tr>
      </table>
      <hr style="margin:16px 0;">
      <p style="font-size:12px;color:#888;">
        Einwilligung: ${data.consent_timestamp || '—'}<br>
        Version: ${data.consent_version || '—'}<br>
        Quelle: ${data.consent_source || '—'}
      </p>
    `;

    // Send via Resend API
    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${context.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'MOVETOS Website <noreply@movetos.com>',
        to: [recipientEmail],
        reply_to: data.email,
        subject: `Kontaktanfrage von ${data.name}${data.company ? ` (${data.company})` : ''}`,
        html: htmlBody,
      }),
    });

    if (!resendResponse.ok) {
      const err = await resendResponse.text();
      console.error('Resend error:', err);
      return new Response(
        JSON.stringify({ error: 'Failed to send email.' }),
        { status: 502, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  } catch (err) {
    console.error('Contact function error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error.' }),
      { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
    );
  }
};

// Handle CORS preflight
export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};
