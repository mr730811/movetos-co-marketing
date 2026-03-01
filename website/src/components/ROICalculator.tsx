import { useState } from 'react';

const base = import.meta.env.BASE_URL || '';

export default function ROICalculator() {
  const [visitors, setVisitors] = useState(50000);
  const [ticketPrice, setTicketPrice] = useState(35);
  const [gastroPerVisitor, setGastroPerVisitor] = useState(12);
  const [eventsPerYear, setEventsPerYear] = useState(3);

  const optimizationRate = 0.10;
  const additionalVisitors = Math.round(visitors * optimizationRate);
  const ticketRevenue = additionalVisitors * ticketPrice;
  const gastroRevenue = additionalVisitors * gastroPerVisitor;
  const revenuePerEvent = ticketRevenue + gastroRevenue;
  const annualRevenue = revenuePerEvent * eventsPerYear;

  const fmt = (n: number) => n.toLocaleString('de-DE');

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid var(--color-dark-border)',
        borderRadius: '14px',
        padding: '32px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      }}
    >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <InputField label="Erwartete Besucher" value={visitors} onChange={setVisitors} suffix="" />
        <InputField label="Ticketpreis (Ø)" value={ticketPrice} onChange={setTicketPrice} suffix="€" />
        <InputField label="Gastro-Umsatz / Besucher" value={gastroPerVisitor} onChange={setGastroPerVisitor} suffix="€" />
        <InputField label="Anzahl Events / Jahr" value={eventsPerYear} onChange={setEventsPerYear} suffix="" />
      </div>

      <div
        style={{
          borderTop: '1px solid var(--color-dark-border)',
          paddingTop: '20px',
          marginTop: '8px',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            color: 'var(--color-text-muted)',
            marginBottom: '16px',
          }}
        >
          Bei 10% besserer Kapazitätsauslastung
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ResultRow label={`+ ${fmt(additionalVisitors)} zusätzliche Besucher / Event`} />
          <ResultRow label={`+ ${fmt(ticketRevenue)} € Ticket-Mehrerlös / Event`} />
          <ResultRow label={`+ ${fmt(gastroRevenue)} € Gastro-Mehrerlös / Event`} />
        </div>

        <div
          style={{
            marginTop: '20px',
            paddingTop: '16px',
            borderTop: '2px solid var(--color-brand-orange)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '14px',
              fontWeight: 600,
              color: 'var(--color-text-primary)',
            }}
          >
            Geschätzter Mehrerlös / Jahr
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '28px',
              fontWeight: 800,
              color: 'var(--color-accent-green)',
            }}
          >
            {fmt(annualRevenue)} €
          </span>
        </div>

        <a
          href={`${base}/terrops/demo/`}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '12px 24px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: 600,
            textDecoration: 'none',
            background: 'var(--color-brand-orange)',
            color: '#fff',
            marginTop: '20px',
            transition: 'all 0.2s ease',
            cursor: 'pointer',
            border: 'none',
            width: '100%',
            justifyContent: 'center',
          }}
        >
          Individuelle Berechnung anfragen &rarr;
        </a>
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  suffix,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  suffix: string;
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          fontFamily: 'var(--font-mono)',
          fontSize: '10px',
          letterSpacing: '1px',
          textTransform: 'uppercase',
          color: 'var(--color-text-muted)',
          marginBottom: '6px',
        }}
      >
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value) || 0)}
          style={{
            width: '100%',
            padding: '10px 14px',
            paddingRight: suffix ? '36px' : '14px',
            borderRadius: '8px',
            border: '1px solid var(--color-dark-border)',
            background: 'var(--color-dark)',
            color: 'var(--color-text-primary)',
            fontFamily: 'var(--font-display)',
            fontSize: '16px',
            fontWeight: 600,
            outline: 'none',
            transition: 'border-color 0.2s',
          }}
          onFocus={(e) => (e.target.style.borderColor = 'var(--color-brand-orange)')}
          onBlur={(e) => (e.target.style.borderColor = 'var(--color-dark-border)')}
        />
        {suffix && (
          <span
            style={{
              position: 'absolute',
              right: '14px',
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: '14px',
              color: 'var(--color-text-muted)',
            }}
          >
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
}

function ResultRow({ label }: { label: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        color: 'var(--color-text-secondary)',
      }}
    >
      <span style={{ color: 'var(--color-accent-green)', fontSize: '12px' }}>&#10003;</span>
      {label}
    </div>
  );
}
