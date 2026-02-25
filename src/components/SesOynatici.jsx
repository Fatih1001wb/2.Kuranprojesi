import React, { useEffect, useRef } from 'react';

export default function SesOynatici({ ses, kapat }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !ses?.url) return;
    ref.current.load();
    ref.current.play().catch(() => {});
  }, [ses?.url]);

  if (!ses) return null;

  return (
    <div className="player">
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '1px solid rgba(200,168,75,0.35)',
          display: 'grid',
          placeItems: 'center',
          color: '#c9a84c',
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        ♪
      </div>

      <div className="player-info" style={{ minWidth: 120 }}>
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 13,
            color: '#c9a84c',
            letterSpacing: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {ses.etiket}
        </div>
        <div style={{ fontSize: 11, color: 'var(--sidebar-muted)' }}>Mishary Rashid Al-Afasy</div>
      </div>

      <audio ref={ref} controls style={{ flex: 1, minWidth: 0, height: 34 }}>
        <source src={ses.url} type="audio/mpeg" />
        Tarayıcınız ses oynatmayı desteklemiyor.
      </audio>

      <button
        onClick={kapat}
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '1px solid rgba(200,168,75,0.25)',
          color: 'var(--sidebar-muted)',
          fontSize: 14,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}
