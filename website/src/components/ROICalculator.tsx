import { useState } from 'react';

const base = import.meta.env.BASE_URL || '';

export default function ROICalculator() {
  const [area, setArea] = useState(50000);
  const [staff, setStaff] = useState(40);
  const [days, setDays] = useState(3);

  const hoursSaved = Math.round((area / 10000) * days * 4);
  const staffSaved = Math.round(staff * 0.15);

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
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
        <InputField label="Geländefläche (m²)" value={area} onChange={setArea} suffix="" />
        <InputField label="Sicherheitspersonal" value={staff} onChange={setStaff} suffix="" />
        <InputField label="Event-Dauer (Tage)" value={days} onChange={setDays} suffix="" />
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
          Ihr Effizienzgewinn mit MOVETOS
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <ResultRow label={`${fmt(hoursSaved)} Koordinationsstunden gespart`} />
          <ResultRow label={`${fmt(staffSaved)} Sicherheitskräfte weniger nötig`} />
          <ResultRow label="Ø 8 Min. schnellere Reaktion durch Echtzeit-Alerts" />
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
            Weniger Aufwand, mehr Kontrolle
          </span>
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '18px',
              fontWeight: 800,
              color: 'var(--color-accent-green)',
            }}
          >
            Effizienter
          </span>
        </div>

        <a
          href={`/ops/demo/`}
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
