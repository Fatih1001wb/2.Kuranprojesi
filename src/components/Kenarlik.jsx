import React, { useMemo, useState } from 'react';
import { SURE_ADLARI, SURE_ANLAMI } from '../data/sureler';

const normalizeTr = (deger = '') =>
  deger
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i');

export default function Kenarlik({ sureler, aktifSure, sureAc, aktifSayfa, sayfaDegistir, kayitlar, auth, kapat }) {
  const [arama, setArama] = useState('');
  const girisliMi = Boolean(auth.kullanici);

  const filtreliSureler = useMemo(() => {
    const q = normalizeTr(arama.trim());
    if (!q) return sureler;
    return sureler.filter((s) => {
      const ad = normalizeTr(SURE_ADLARI[s.number] || s.englishName);
      const anlam = normalizeTr(SURE_ANLAMI[s.number] || '');
      return ad.includes(q) || anlam.includes(q) || String(s.number).includes(q);
    });
  }, [arama, sureler]);

  const ilerleme = Math.round((kayitlar.okundu.length / 114) * 100);
  const sonOkunan = kayitlar.okundu[0];

  const handleSureAc = (sure) => {
    sureAc(sure);
    sayfaDegistir('sureler');
    if (kapat) kapat();
  };

  return (
    <>
      <div style={{ borderBottom: '1px solid var(--sidebar-border)' }}>
        <div
          style={{
            padding: '18px 18px 12px',
            textAlign: 'center',
            background: 'linear-gradient(180deg,rgba(200,168,75,0.08) 0%,transparent 100%)',
          }}
        >
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 20, color: '#c9a84c', letterSpacing: 3, fontWeight: 600 }}>
            Kuran-ı Kerim
          </div>
          <div style={{ width: 46, height: 1, background: 'linear-gradient(90deg,transparent,#c9a84c,transparent)', margin: '7px auto 0' }} />
        </div>

        <button
          onClick={() => {
            sayfaDegistir('giris-git');
            if (kapat) kapat();
          }}
          style={{
            width: '100%',
            padding: '10px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: girisliMi ? 'rgba(200,168,75,0.08)' : 'rgba(200,70,70,0.09)',
            borderTop: '1px solid var(--sidebar-border)',
            transition: 'var(--transition)',
          }}
        >
          {auth.avatar ? (
            <img
              src={auth.avatar}
              alt=""
              style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(200,168,75,0.4)', flexShrink: 0 }}
            />
          ) : (
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                flexShrink: 0,
                background: girisliMi ? 'rgba(200,168,75,0.18)' : 'rgba(200,70,70,0.18)',
                border: `2px solid ${girisliMi ? 'rgba(200,168,75,0.45)' : 'rgba(200,70,70,0.45)'}`,
                display: 'grid',
                placeItems: 'center',
                fontSize: 15,
              }}
            >
              {girisliMi ? '👤' : '🔒'}
            </div>
          )}
          <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
            {girisliMi ? (
              <>
                <div style={{ fontSize: 14, color: '#c9a84c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {auth.kullaniciAdi}
                </div>
                <div style={{ fontSize: 11, color: 'var(--sidebar-muted)' }}>Hesabı yönet →</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 14, color: '#e87878', fontWeight: 600 }}>Giriş Yap / Kayıt Ol</div>
                <div style={{ fontSize: 11, color: 'rgba(220,110,110,0.75)' }}>İlerlemeni kaydetmek için →</div>
              </>
            )}
          </div>
          <span style={{ fontSize: 14, color: girisliMi ? 'var(--sidebar-muted)' : '#e87878' }}>›</span>
        </button>
      </div>

      <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--sidebar-border)', display: 'flex', gap: 5 }}>
        {[
          { id: 'sureler', label: 'Sureler', ikon: '📖' },
          { id: 'ilerleme', label: 'İlerleme', ikon: '📊' },
        ].map((m) => (
          <button
            key={m.id}
            onClick={() => sayfaDegistir(m.id)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: 8,
              fontSize: 11,
              fontFamily: "'Cinzel',serif",
              letterSpacing: 0.3,
              background: aktifSayfa === m.id ? 'rgba(200,168,75,0.16)' : 'transparent',
              color: aktifSayfa === m.id ? '#c9a84c' : 'var(--sidebar-muted)',
              border: aktifSayfa === m.id ? '1px solid rgba(200,168,75,0.3)' : '1px solid transparent',
              transition: 'var(--transition)',
            }}
          >
            {m.ikon} {m.label}
          </button>
        ))}
      </div>

      {aktifSayfa === 'sureler' && (
        <div style={{ padding: '9px 12px', borderBottom: '1px solid var(--sidebar-border)' }}>
          <input
            placeholder="Sure adı veya numara ara..."
            value={arama}
            onChange={(e) => setArama(e.target.value)}
            style={{
              width: '100%',
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(200,168,75,0.18)',
              borderRadius: 8,
              padding: '9px 12px',
              color: 'var(--sidebar-text)',
              fontSize: 15,
              outline: 'none',
            }}
          />
        </div>
      )}

      <div style={{ flex: 1, overflowY: 'auto', WebkitOverflowScrolling: 'touch' }}>
        {aktifSayfa === 'sureler' &&
          filtreliSureler.map((sure, idx) => {
            const ad = SURE_ADLARI[sure.number] || sure.englishName;
            const anlam = SURE_ANLAMI[sure.number] || '';
            const aktif = aktifSure?.number === sure.number;
            return (
              <div
                key={sure.number}
                onClick={() => handleSureAc(sure)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '10px 14px',
                  cursor: 'pointer',
                  borderBottom: '1px solid rgba(200,168,75,0.05)',
                  background: aktif ? 'rgba(200,168,75,0.13)' : 'transparent',
                  borderLeft: aktif ? '3px solid #c9a84c' : '3px solid transparent',
                  animation: `slideIn 0.28s ${Math.min(idx * 0.006, 0.2)}s ease both`,
                  animationFillMode: 'backwards',
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    flexShrink: 0,
                    borderRadius: '50%',
                    border: '1px solid rgba(200,168,75,0.28)',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 11,
                    color: '#c9a84c',
                    fontFamily: "'Cinzel',serif",
                  }}
                >
                  {sure.number}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, color: aktif ? '#c9a84c' : 'var(--sidebar-text)', lineHeight: 1.2 }}>{ad}</div>
                  <div style={{ fontSize: 11, color: 'var(--sidebar-muted)', marginTop: 1 }}>{anlam}</div>
                </div>
                <div style={{ display: 'flex', gap: 2, flexShrink: 0 }}>
                  {kayitlar.yerIsaretliMi(sure.number) && <span style={{ fontSize: 11 }}>🔖</span>}
                  {kayitlar.okunduMu(sure.number) && <span style={{ fontSize: 11 }}>✅</span>}
                </div>
                <div style={{ fontSize: 10, color: 'var(--sidebar-muted)', textAlign: 'right', flexShrink: 0 }}>
                  {sure.numberOfAyahs}
                  <br />
                  <span style={{ fontSize: 9 }}>ayet</span>
                </div>
              </div>
            );
          })}

        {aktifSayfa === 'ilerleme' && (
          <div style={{ padding: '14px 13px' }}>
            {!girisliMi && (
              <div style={{ padding: 16, borderRadius: 12, background: 'rgba(200,70,70,0.08)', border: '1px solid rgba(200,70,70,0.2)' }}>
                <div style={{ fontSize: 15, color: '#e87878', marginBottom: 10, lineHeight: 1.5 }}>
                  İlerleme kaydı için giriş yapmalısınız.
                </div>
                <button
                  onClick={() => {
                    sayfaDegistir('giris-git');
                    if (kapat) kapat();
                  }}
                  style={{
                    width: '100%',
                    padding: 9,
                    borderRadius: 8,
                    border: '1px solid rgba(200,70,70,0.35)',
                    background: 'rgba(200,70,70,0.12)',
                    color: '#e87878',
                    fontSize: 13,
                    fontFamily: "'Cinzel',serif",
                  }}
                >
                  Giriş Ekranına Git
                </button>
              </div>
            )}

            {girisliMi && (
              <>
                <div style={{ marginBottom: 16, padding: 13, borderRadius: 12, background: 'rgba(200,168,75,0.08)', border: '1px solid rgba(200,168,75,0.2)' }}>
                  <div style={{ fontSize: 15, color: 'var(--sidebar-text)' }}>{auth.kullaniciAdi}</div>
                  <div style={{ fontSize: 11, color: 'var(--sidebar-muted)' }}>{auth.kullanici?.email}</div>
                  <button
                    onClick={auth.cikisYap}
                    style={{
                      width: '100%',
                      padding: '7px',
                      marginTop: 10,
                      borderRadius: 7,
                      border: '1px solid rgba(200,168,75,0.25)',
                      background: 'transparent',
                      color: '#c9a84c',
                      fontSize: 12,
                    }}
                  >
                    Çıkış Yap
                  </button>
                </div>

                <div style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--sidebar-muted)', marginBottom: 6 }}>
                    <span>Toplam İlerleme</span>
                    <span style={{ color: '#c9a84c', fontFamily: "'Cinzel',serif", fontWeight: 600 }}>%{ilerleme}</span>
                  </div>
                  <div style={{ height: 8, background: 'rgba(200,168,75,0.12)', borderRadius: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${ilerleme}%`, background: 'linear-gradient(90deg,#9a6f2e,#c9a84c)' }} />
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--sidebar-muted)', marginTop: 5 }}>{kayitlar.okundu.length} / 114 sure tamamlandı</div>
                </div>

                <div style={{ marginBottom: 14, padding: 10, borderRadius: 10, background: 'rgba(42,96,72,0.08)', border: '1px solid rgba(42,96,72,0.2)' }}>
                  <div style={{ fontSize: 11, color: 'var(--green)', marginBottom: 6, letterSpacing: 1 }}>EN SON OKUNAN</div>
                  {sonOkunan ? (
                    <>
                      <div style={{ fontSize: 14, color: 'var(--sidebar-text)' }}>
                        {sonOkunan.sure_numara}. {sonOkunan.sure_ad}
                      </div>
                      <div style={{ fontSize: 11, color: 'var(--sidebar-muted)' }}>
                        {new Date(sonOkunan.tarih).toLocaleString('tr-TR')}
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: 'var(--sidebar-muted)' }}>Henüz okuma kaydı yok.</div>
                  )}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: '#c9a84c', letterSpacing: 1, marginBottom: 7 }}>🔖 Yer İşaretleri ({kayitlar.yerIsaretleri.length})</div>
                  {kayitlar.yerIsaretleri.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--sidebar-muted)', fontStyle: 'italic' }}>Henüz eklenmedi</div>
                  ) : (
                    kayitlar.yerIsaretleri.map((s) => (
                      <div key={s.id || s.sure_numara} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                        <div style={{ fontSize: 14, color: 'var(--sidebar-text)' }}>
                          {s.sure_numara}. {s.sure_ad}
                        </div>
                        <button onClick={() => kayitlar.yerIsaretiKaldir(s.sure_numara)} style={{ fontSize: 11, color: '#c55' }}>
                          Kaldır
                        </button>
                      </div>
                    ))
                  )}
                </div>

                <div>
                  <div style={{ fontSize: 11, color: '#c9a84c', letterSpacing: 1, marginBottom: 7 }}>✅ Tamamlanan Sureler ({kayitlar.okundu.length})</div>
                  {kayitlar.okundu.length === 0 ? (
                    <div style={{ fontSize: 13, color: 'var(--sidebar-muted)', fontStyle: 'italic' }}>Henüz işaretlenmedi</div>
                  ) : (
                    kayitlar.okundu.map((s) => (
                      <div key={s.id || s.sure_numara} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 0' }}>
                        <div style={{ fontSize: 14, color: 'var(--sidebar-text)' }}>
                          {s.sure_numara}. {s.sure_ad}
                        </div>
                        <button onClick={() => kayitlar.okunduKaldir(s.sure_numara)} style={{ fontSize: 11, color: '#c55' }}>
                          Kaldır
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </>
  );
}
