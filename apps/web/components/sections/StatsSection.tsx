'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 200, suffix: '+', label: 'Garages partenaires', icon: '🏪', description: 'À travers tout Haïti' },
  { value: 5000, suffix: '+', label: 'Pièces disponibles', icon: '⚙️', description: 'En stock immédiat' },
  { value: 15000, suffix: '+', label: 'Clients actifs', icon: '👥', description: 'Font confiance à AUTONORME' },
  { value: 99, suffix: '%', label: 'Satisfaction client', icon: '⭐', description: 'Note moyenne des garages' },
];

function useCountUp(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [end, duration, start]);

  return count;
}

function StatCard({ stat, visible }: { stat: typeof stats[0]; visible: boolean }) {
  const count = useCountUp(stat.value, 2000, visible);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: 'var(--space-2xl) var(--space-xl)',
        background: 'rgba(255,255,255,0.05)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(8px)',
        transition: 'all var(--transition-base)',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.1)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.2)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
        (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255,255,255,0.1)';
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: 'var(--space-md)' }}>{stat.icon}</div>
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 900,
          fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
          color: '#FFFFFF',
          lineHeight: 1,
          marginBottom: '0.375rem',
        }}
      >
        {count.toLocaleString('fr-HT')}{stat.suffix}
      </div>
      <div style={{ fontWeight: 700, fontSize: '1rem', color: 'rgba(255,255,255,0.9)', marginBottom: '0.25rem' }}>
        {stat.label}
      </div>
      <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.5)' }}>
        {stat.description}
      </div>
    </div>
  );
}

export default function StatsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      id="stats"
      style={{
        padding: 'var(--space-5xl) 0',
        background: 'linear-gradient(135deg, var(--color-primary-900) 0%, var(--color-primary-700) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Décoration de fond */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <div
          style={{
            position: 'absolute',
            top: '-50%',
            left: '-20%',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(74,144,217,0.15) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40%',
            right: '-15%',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0,47,122,0.3) 0%, transparent 70%)',
            borderRadius: '50%',
          }}
        />
      </div>

      <div className="container" style={{ position: 'relative' }}>
        <div className="section-header">
          <span style={{ 
            display: 'inline-block', 
            padding: '0.25rem 0.875rem', 
            borderRadius: 'var(--radius-full)',
            background: 'rgba(255,255,255,0.1)',
            color: 'rgba(255,255,255,0.8)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase' as const,
            marginBottom: 'var(--space-md)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}>
            La plateforme en chiffres
          </span>
          <h2
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: 'clamp(1.875rem, 3.5vw, 2.75rem)',
              color: '#FFFFFF',
              marginBottom: 'var(--space-md)',
            }}
          >
            AUTONORME en pleine expansion
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '1.125rem', maxWidth: '500px', margin: '0 auto' }}>
            Une croissance portée par la confiance des automobilistes et des professionnels haïtiens.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-lg)',
          }}
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} stat={stat} visible={visible} />
          ))}
        </div>
      </div>
    </section>
  );
}
