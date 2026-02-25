import React, { useState } from 'react';

export default function HatimPaneli({ hatim, kayitlar, kapat }) {
  const [onay, setOnay] = useState(false);
  const ilerleme = hatim.aktifIlerleme();
  const yuzde = Math.round((ilerleme / 114) * 100);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 500,
        background: 'rgba(0,0,0,0.55)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) kapat();
      }}
    >
      <div
        style={{
          background: 'var(--bg)',
          borderRadius: 20,
          padding: '32px 28px',
          width: '100%',
          maxWidth: 480,
          border: '1px solid var(--gold-border)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <div>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 22, color: 'var(--gold)' }}>Hatim Takibi</div>
            <div style={{ fontSize: 14, color: 'var(--text-muted)', marginTop: 3 }}>
              Tamamlanan: {hatim.tamamlananHatim.length}
            </div>
          </div>
          <button className="btn-altin" onClick={kapat}>
            ✕
          </button>
        </div>

        {hatim.tamamlananHatim.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 8 }}>Tamamlanan Hatimler</div>
            {hatim.tamamlananHatim.map((h, i) => (
              <div key={h.id} style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 5 }}>
                {i + 1}. Hatim - {new Date(h.baslangic).toLocaleDateString('tr-TR')} → {new Date(h.bitis).toLocaleDateString('tr-TR')}
              </div>
            ))}
          </div>
        )}

        {hatim.aktifHatim ? (
          <div style={{ marginBottom: 20, padding: 14, borderRadius: 12, background: 'var(--bg-surface)', border: '1px solid var(--gold-border)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <div style={{ fontSize: 15, color: 'var(--text)' }}>Aktif Hatim</div>
              <div style={{ fontSize: 18, color: 'var(--gold)', fontFamily: "'Cinzel',serif" }}>%{yuzde}</div>
            </div>
            <div style={{ height: 8, background: 'var(--gold-dim)', borderRadius: 4, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', width: `${yuzde}%`, background: 'linear-gradient(90deg,#9a6f2e,#c9a84c)' }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{ilerleme} / 114 sure</div>
          </div>
        ) : (
          <div style={{ marginBottom: 20, padding: 14, borderRadius: 12, background: 'var(--bg-surface)', border: '1px dashed var(--gold-border)', color: 'var(--text-muted)' }}>
            Aktif hatim bulunmuyor.
          </div>
        )}

        <div style={{ marginBottom: 14 }}>
          <div style={{ fontSize: 12, color: 'var(--gold)', marginBottom: 6 }}>Okunan Sureler ({kayitlar.okundu.length})</div>
          <div style={{ maxHeight: 120, overflowY: 'auto', fontSize: 12, color: 'var(--text-muted)' }}>
            {kayitlar.okundu.length === 0 ? 'Henüz işaretlenmedi.' : kayitlar.okundu.map((s) => `${s.sure_numara}. ${s.sure_ad}`).join(', ')}
          </div>
        </div>

        {!onay ? (
          <button className="btn-dolu" style={{ width: '100%' }} onClick={() => (hatim.aktifHatim ? setOnay(true) : hatim.yeniHatimBaslat())}>
            {hatim.aktifHatim ? 'Yeni Hatim Başlat' : 'Hatim Başlat'}
          </button>
        ) : (
          <div style={{ borderRadius: 10, padding: 14, background: 'var(--red-bg)', border: '1px solid rgba(139,46,46,0.2)' }}>
            <div style={{ color: 'var(--red)', marginBottom: 10, fontSize: 14 }}>
              Mevcut aktif hatim kapanacak. Devam etmek istiyor musunuz?
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn-altin" style={{ flex: 1 }} onClick={() => setOnay(false)}>
                İptal
              </button>
              <button
                className="btn-dolu"
                style={{ flex: 1 }}
                onClick={() => {
                  hatim.yeniHatimBaslat();
                  setOnay(false);
                }}
              >
                Evet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
