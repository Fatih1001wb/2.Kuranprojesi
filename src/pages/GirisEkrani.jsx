import React, { useState } from 'react';

const inputStyle = {
  width: '100%',
  padding: '12px 15px',
  background: 'var(--bg)',
  border: '1px solid var(--border)',
  borderRadius: 9,
  fontSize: 17,
  color: 'var(--text)',
  outline: 'none',
};

export default function GirisEkrani({ auth, onGeri }) {
  const [mod, setMod] = useState('giris');
  const [email, setEmail] = useState('');
  const [sifre, setSifre] = useState('');
  const [hata, setHata] = useState('');
  const [bilgi, setBilgi] = useState('');
  const [yukleniyor, setYukleniyor] = useState('');

  const geriDon = () => {
    if (typeof onGeri === 'function') onGeri();
  };

  const temizle = () => {
    setHata('');
    setBilgi('');
  };

  const emailGonder = async (e) => {
    e.preventDefault();
    temizle();
    setYukleniyor('email');
    const sonuc = mod === 'giris' ? await auth.girisYap(email, sifre) : await auth.kayitOl(email, sifre);
    setYukleniyor('');
    if (sonuc?.hata) setHata(sonuc.hata);
    if (sonuc?.mesaj) setBilgi(sonuc.mesaj);
    if (sonuc?.basari && mod === 'giris') geriDon();
  };

  const sosyal = async (platform) => {
    temizle();
    setYukleniyor(platform);
    const fn = platform === 'google' ? auth.googleIleGiris : auth.githubIleGiris;
    const r = await fn();
    if (r?.hata) {
      setHata(r.hata);
      setYukleniyor('');
      return;
    }
    geriDon();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        minHeight: '100dvh',
        background: 'var(--bg)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px 16px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div style={{ position: 'fixed', top: 14, left: 14 }}>
        <button type="button" className="btn-altin" onClick={geriDon}>
          ← Okumaya Don
        </button>
      </div>

      <div className="giris-kart scale-in">
        <div style={{ width: '100%', height: 3, background: 'linear-gradient(90deg,transparent,var(--gold),transparent)', borderRadius: 2, marginBottom: 28 }} />

        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(22px,5vw,28px)', color: 'var(--text)', letterSpacing: 2, fontWeight: 600, marginBottom: 5 }}>
            Kuran-i Kerim
          </div>
          <div style={{ fontSize: 'clamp(14px,3.5vw,16px)', color: 'var(--text-muted)' }}>
            {mod === 'giris' ? 'Hesabiniza giris yapin' : 'Yeni hesap olusturun'}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 22 }}>
          <button type="button" onClick={() => sosyal('google')} disabled={Boolean(yukleniyor)} style={{ padding: '13px 16px', borderRadius: 10, border: '1px solid #dadce0', background: '#fff', fontSize: 'clamp(14px,3.5vw,16px)', color: '#3c4043' }}>
            Google ile {mod === 'giris' ? 'Giris Yap' : 'Kayit Ol'}
          </button>
          <button type="button" onClick={() => sosyal('github')} disabled={Boolean(yukleniyor)} style={{ padding: '13px 16px', borderRadius: 10, border: '1px solid #d1d5da', background: '#24292f', fontSize: 'clamp(14px,3.5vw,16px)', color: '#fff' }}>
            GitHub ile {mod === 'giris' ? 'Giris Yap' : 'Kayit Ol'}
          </button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 18 }}>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
          <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>veya e-posta ile</span>
          <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        </div>

        <div style={{ display: 'flex', background: 'var(--bg-surface)', borderRadius: 10, padding: 4, marginBottom: 18, border: '1px solid var(--border)' }}>
          {[
            ['giris', 'Giris Yap'],
            ['kayit', 'Kayit Ol'],
          ].map(([k, label]) => (
            <button
              type="button"
              key={k}
              onClick={() => {
                setMod(k);
                setEmail('');
                setSifre('');
                temizle();
              }}
              style={{
                flex: 1,
                padding: '9px 0',
                borderRadius: 8,
                fontSize: 'clamp(13px,3.5vw,15px)',
                background: mod === k ? 'var(--bg-card)' : 'transparent',
                color: mod === k ? 'var(--gold)' : 'var(--text-muted)',
                border: mod === k ? '1px solid var(--gold-border)' : '1px solid transparent',
              }}
            >
              {label}
            </button>
          ))}
        </div>

        <form onSubmit={emailGonder}>
          <div style={{ marginBottom: 13 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>E-POSTA</label>
            <input type="email" value={email} required placeholder="ornek@eposta.com" onChange={(e) => setEmail(e.target.value)} style={inputStyle} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginBottom: 5 }}>SIFRE</label>
            <input type="password" value={sifre} required minLength={6} placeholder="••••••••" onChange={(e) => setSifre(e.target.value)} style={inputStyle} />
          </div>

          {hata && <div style={{ padding: '10px 13px', borderRadius: 8, marginBottom: 13, background: 'var(--red-bg)', color: 'var(--red)' }}>⚠ {hata}</div>}
          {bilgi && <div style={{ padding: '10px 13px', borderRadius: 8, marginBottom: 13, background: 'var(--green-bg)', color: 'var(--green)' }}>✓ {bilgi}</div>}

          <button type="submit" disabled={Boolean(yukleniyor)} className="btn-dolu" style={{ width: '100%' }}>
            {yukleniyor === 'email' ? 'Yukleniyor...' : mod === 'giris' ? 'E-posta ile Giris Yap' : 'Hesap Olustur'}
          </button>
        </form>
      </div>
    </div>
  );
}
