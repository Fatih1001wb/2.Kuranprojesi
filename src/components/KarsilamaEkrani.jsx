import React from 'react';

export default function KarsilamaEkrani({ onOkumayaBasla }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '70vh',
        textAlign: 'center',
        padding: '40px 24px',
        gap: 20,
      }}
    >
      <div
        style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          border: '2px solid var(--gold-border)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 34,
          animation: 'scaleIn 0.6s ease both',
          boxShadow: '0 8px 32px rgba(154,111,46,0.12)',
        }}
      >
        📖
      </div>

      <div style={{ animation: 'fadeUp 0.7s 0.1s ease both', opacity: 0, animationFillMode: 'forwards' }}>
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 'clamp(22px,5vw,30px)',
            color: 'var(--text)',
            letterSpacing: 3,
            fontWeight: 600,
            marginBottom: 8,
          }}
        >
          Kuran-ı Kerim
        </div>
        <div
          style={{
            width: 60,
            height: 2,
            background: 'linear-gradient(90deg,transparent,var(--gold),transparent)',
            margin: '0 auto 14px',
          }}
        />
        <div style={{ fontSize: 'clamp(15px,3.5vw,18px)', color: 'var(--text-muted)', lineHeight: 1.8 }}>
          Sureleri Türkçe isimleriyle arayabilir, Arapça metni odakta okuyabilir
          <br />
          ve kaldığınız yerden devam edebilirsiniz.
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          gap: 'clamp(20px,5vw,40px)',
          marginTop: 16,
          animation: 'fadeUp 0.7s 0.3s ease both',
          opacity: 0,
          animationFillMode: 'forwards',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {[
          ['114', 'Sure'],
          ['6236', 'Ayet'],
          ['77430', 'Kelime'],
        ].map(([sayi, etiket]) => (
          <div key={etiket} style={{ textAlign: 'center' }}>
            <div
              style={{
                fontFamily: "'Cinzel',serif",
                fontSize: 'clamp(20px,4vw,26px)',
                color: 'var(--gold)',
                fontWeight: 600,
              }}
            >
              {sayi}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{etiket}</div>
          </div>
        ))}
      </div>

      <button className="btn-dolu" onClick={onOkumayaBasla}>
        Okumaya Başla
      </button>
    </div>
  );
}
