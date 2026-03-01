import { useState } from 'react';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    eventType: '',
    visitors: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production: send to API endpoint
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div
        style={{
          background: 'rgba(248,248,250,0.8)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--color-dark-border)',
          borderRadius: '14px',
          padding: '48px 32px',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>&#10003;</div>
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '24px',
            fontWeight: 700,
            marginBottom: '8px',
            color: 'var(--color-text-primary)',
          }}
        >
          Vielen Dank!
        </h3>
        <p style={{ fontSize: '15px', color: 'var(--color-text-secondary)', lineHeight: 1.6 }}>
          Wir melden uns innerhalb von 24 Stunden bei Ihnen.
        </p>
      </div>
    );
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px 16px',
    borderRadius: '8px',
    border: '1px solid var(--color-dark-border)',
    background: 'var(--color-dark)',
    color: 'var(--color-text-primary)',
    fontFamily: 'var(--font-body)',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontFamily: 'var(--font-mono)',
    fontSize: '10px',
    letterSpacing: '1px',
    textTransform: 'uppercase' as const,
    color: 'var(--color-text-muted)',
    marginBottom: '6px',
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        background: 'rgba(248,248,250,0.8)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--color-dark-border)',
        borderRadius: '14px',
        padding: '32px',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="Max Mustermann"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Unternehmen</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
            placeholder="Firma GmbH"
            style={inputStyle}
          />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <label style={labelStyle}>E-Mail *</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="max@firma.de"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Event-Typ</label>
          <select
            name="eventType"
            value={formData.eventType}
            onChange={handleChange}
            style={{ ...inputStyle, appearance: 'auto' as const }}
          >
            <option value="">Bitte wählen</option>
            <option value="festival">Festival / Konzert</option>
            <option value="stadtfest">Stadtfest / Markt</option>
            <option value="corporate">Corporate Event</option>
            <option value="kritis">KRITIS / Infrastruktur</option>
            <option value="sonstige">Sonstiges</option>
          </select>
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={labelStyle}>Erwartete Besucher</label>
        <input
          type="text"
          name="visitors"
          value={formData.visitors}
          onChange={handleChange}
          placeholder="z.B. 20.000"
          style={inputStyle}
        />
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>Nachricht (optional)</label>
        <textarea
          name="message"
          rows={3}
          value={formData.message}
          onChange={handleChange}
          placeholder="Erzählen Sie uns von Ihrem Projekt..."
          style={{ ...inputStyle, resize: 'vertical' as const }}
        />
      </div>

      <button
        type="submit"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '14px 28px',
          borderRadius: '8px',
          fontSize: '14px',
          fontWeight: 600,
          textDecoration: 'none',
          background: 'var(--color-brand-orange)',
          color: '#fff',
          cursor: 'pointer',
          border: 'none',
          width: '100%',
          justifyContent: 'center',
          transition: 'all 0.2s ease',
        }}
      >
        Demo anfragen &rarr;
      </button>

      <p
        style={{
          fontSize: '11px',
          color: 'var(--color-text-muted)',
          textAlign: 'center',
          marginTop: '12px',
          lineHeight: 1.5,
        }}
      >
        Wir melden uns innerhalb von 24 Stunden. Keine Werbemails, versprochen.
      </p>
    </form>
  );
}
