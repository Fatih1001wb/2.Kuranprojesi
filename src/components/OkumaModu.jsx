import React, { useEffect, useState } from 'react';

export default function OkumaModu({ ayetler, meal, sureAd, nuzulYeri, onKapat, yaziBoyutu, karanlik }) {
  const [aktifIndeks, setAktifIndeks] = useState(0);
  const [gosterMeal, setGosterMeal] = useState(true);

  useEffect(() => {
    const fn = (e) => {
      if (e.key === 'Escape') onKapat();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') setAktifIndeks((i) => Math.min(i + 1, ayetler.length - 1));
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') setAktifIndeks((i) => Math.max(i - 1, 0));
      if (e.key.toLowerCase() === 'm') setGosterMeal((g) => !g);
    };
    window.addEventListener('keydown', fn);
    return () => window.removeEventListener('keydown', fn);
  }, [ayetler.length, onKapat]);

  const ilk = aktifIndeks === 0;
  const son = aktifIndeks === ayetler.length - 1;
  const ayet = ayetler[aktifIndeks];
  const turkce = meal[aktifIndeks];

  const bg = karanlik ? '#0e0c08' : '#faf7f2';
  const fg = karanlik ? '#e8dfc8' : '#26190a';
  const muted = karanlik ? '#7a6a4a' : '#8a7555';
  const gold = '#c9a84c';

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: bg, display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 28px',
          borderBottom: '1px solid rgba(154,111,46,0.15)',
          flexShrink: 0,
        }}
      >
        <div>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 18, color: gold, letterSpacing: 1 }}>{sureAd}</div>
          <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>
            {nuzulYeri} · {ayetler.length} ayet
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button className="btn-altin" onClick={() => setGosterMeal((g) => !g)}>
            Meal {gosterMeal ? '✓' : '○'}
          </button>
          <button className="btn-altin" onClick={onKapat}>
            ✕
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px clamp(24px,8vw,120px)', overflowY: 'auto' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', border: '1.5px solid rgba(154,111,46,0.35)', display: 'grid', placeItems: 'center', fontSize: 15, color: gold, marginBottom: 28 }}>
          {ayet?.numberInSurah}
        </div>

        <div style={{ fontFamily: "'Scheherazade New',serif", fontSize: `clamp(${yaziBoyutu + 14}px,4vw,${yaziBoyutu + 22}px)`, lineHeight: 2.3, textAlign: 'center', direction: 'rtl', color: fg, marginBottom: 28, maxWidth: 760 }}>
          {ayet?.text}
        </div>

        {gosterMeal && (
          <div style={{ fontSize: `clamp(${yaziBoyutu - 2}px,2.5vw,${yaziBoyutu + 2}px)`, lineHeight: 1.9, textAlign: 'center', fontStyle: 'italic', color: muted, maxWidth: 640, borderTop: '1px solid rgba(154,111,46,0.15)', paddingTop: 18 }}>
            {turkce?.text}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 28px', borderTop: '1px solid rgba(154,111,46,0.12)', flexShrink: 0 }}>
        <button className="btn-altin" disabled={ilk} onClick={() => setAktifIndeks((i) => Math.max(i - 1, 0))}>
          ← Önceki
        </button>
        <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, color: muted }}>
          <span style={{ color: gold, fontSize: 18 }}>{aktifIndeks + 1}</span> / {ayetler.length}
        </div>
        <button className="btn-altin" onClick={son ? onKapat : () => setAktifIndeks((i) => Math.min(i + 1, ayetler.length - 1))}>
          {son ? '✓ Tamamla' : 'Sonraki →'}
        </button>
      </div>
    </div>
  );
}
