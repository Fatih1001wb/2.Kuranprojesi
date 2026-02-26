import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import KarsilamaEkrani from '../components/KarsilamaEkrani';
import OkumaModu from '../components/OkumaModu';
import SesOynatici from '../components/SesOynatici';
import { SURE_ADLARI } from '../data/sureler';
import { ayetSesiUrl, sureSesiUrl, sureyiGetir } from '../services/kuranApi';

const TEFSIR_CACHE = {};

async function tefsirGetir(sureNo) {
  if (TEFSIR_CACHE[sureNo]) return TEFSIR_CACHE[sureNo];
  const r = await fetch(`https://api.alquran.cloud/v1/surah/${sureNo}/tr.yazir`);
  const d = await r.json();
  TEFSIR_CACHE[sureNo] = d.data?.ayahs || [];
  return TEFSIR_CACHE[sureNo];
}

function AyetKart({ arapca, turkce, tefsir, sureNo, sureAd, sesOynat, yaziBoyutu, tefsirAcik }) {
  const [tefsirGoster, setTefsirGoster] = useState(false);

  return (
    <div className="ayet-kart">
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 34, height: 34, border: '1px solid var(--gold-border)', borderRadius: '50%', display: 'grid', placeItems: 'center', fontSize: 13, color: 'var(--gold)', background: 'var(--bg-card)', fontFamily: "'Cinzel',serif" }}>
          {arapca.numberInSurah}
        </div>
        <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg,var(--gold-border),transparent)' }} />
        <button className="btn-altin" style={{ padding: '5px 12px', fontSize: 12 }} onClick={() => sesOynat(ayetSesiUrl(sureNo, arapca.numberInSurah), `${sureAd} · ${arapca.numberInSurah}. ayet`)}>
          ▶ Dinle
        </button>
      </div>
      <div className="ayet-arapca" style={{ fontSize: yaziBoyutu + 16 }}>{arapca.text}</div>
      <div className="ayet-meal" style={{ fontSize: yaziBoyutu }}>{turkce?.text || ''}</div>

      {tefsirAcik && tefsir && (
        <div style={{ marginTop: 8 }}>
          <button onClick={() => setTefsirGoster((s) => !s)} style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {tefsirGoster ? 'Tefsiri Gizle' : 'Tefsiri Goster'}
          </button>
          {tefsirGoster && (
            <div style={{ marginTop: 6, fontSize: yaziBoyutu - 2, lineHeight: 1.8, color: 'var(--text-sec)', padding: '14px 16px', borderRadius: 8, background: 'var(--bg-surface)', border: '1px solid var(--gold-border)' }}>
              {tefsir.text}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SayfaModu({ ayetler, sureAdi }) {
  const sayfalar = useMemo(() => {
    const boyut = 8;
    const result = [];
    for (let i = 0; i < ayetler.length; i += boyut) {
      result.push(ayetler.slice(i, i + boyut));
    }
    return result;
  }, [ayetler]);

  return (
    <div className="icerik-ic">
      {sayfalar.map((paket, idx) => (
        <section key={`sayfa-${idx}`} className="quran-page">
          <div className="quran-page-head">{sureAdi} · Sayfa {idx + 1}</div>
          <div className="quran-page-text">
            {paket.map((a) => (
              <span key={a.number} style={{ marginLeft: 8 }}>
                {a.text} <span style={{ fontSize: 18, opacity: 0.7 }}>۝{a.numberInSurah}</span>
              </span>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default function AnaSayfa({ aktifSure, geriDon, kayitlar, auth, karanlik, onOkumayaBasla }) {
  const [arapcaAyetler, setArapcaAyetler] = useState([]);
  const [turkceMeal, setTurkceMeal] = useState([]);
  const [tefsirAyetler, setTefsirAyetler] = useState([]);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [hata, setHata] = useState('');
  const [ses, setSes] = useState(null);
  const [yaziBoyutu, setYaziBoyutu] = useState(18);
  const [okumaModuAcik, setOkumaModuAcik] = useState(false);
  const [tefsirAcik, setTefsirAcik] = useState(false);
  const [tefsirYukleniyor, setTefsirYukleniyor] = useState(false);
  const [sayfaGorunumu, setSayfaGorunumu] = useState(false);
  const icerikRef = useRef(null);

  const sureAdi = aktifSure ? SURE_ADLARI[aktifSure.number] || aktifSure.englishName : '';
  const nuzulYeri = aktifSure?.revelationType === 'Meccan' ? 'Mekke' : 'Medine';
  const girisliMi = Boolean(auth.kullanici);
  const yerIsaretli = aktifSure ? kayitlar.yerIsaretliMi(aktifSure.number) : false;
  const tamamlandi = aktifSure ? kayitlar.okunduMu(aktifSure.number) : false;

  useEffect(() => {
    if (!aktifSure) return;
    setYukleniyor(true);
    setHata('');
    setSes(null);
    setTefsirAyetler([]);
    setTefsirAcik(false);
    if (icerikRef.current) icerikRef.current.scrollTop = 0;

    sureyiGetir(aktifSure.number)
      .then(([ar, tr]) => {
        if (ar.status !== 'OK' || tr.status !== 'OK') throw new Error('SURE_YUKLENEMEDI');
        setArapcaAyetler(ar.data.ayahs);
        setTurkceMeal(tr.data.ayahs);
        setYukleniyor(false);
      })
      .catch(() => {
        setHata('Sure yuklenemedi.');
        setYukleniyor(false);
      });
  }, [aktifSure]);

  const tefsirToggle = useCallback(async () => {
    if (!aktifSure) return;
    if (tefsirAcik) return setTefsirAcik(false);
    if (tefsirAyetler.length > 0) return setTefsirAcik(true);
    setTefsirYukleniyor(true);
    const ayetler = await tefsirGetir(aktifSure.number).catch(() => []);
    setTefsirAyetler(ayetler);
    setTefsirAcik(true);
    setTefsirYukleniyor(false);
  }, [aktifSure, tefsirAcik, tefsirAyetler]);

  const sesOynat = (url, etiket) => setSes({ url, etiket });
  const sureyiDinle = () => aktifSure && setSes({ url: sureSesiUrl(aktifSure.number), etiket: `${sureAdi} · Tam sure` });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
      {okumaModuAcik && arapcaAyetler.length > 0 && (
        <OkumaModu ayetler={arapcaAyetler} meal={turkceMeal} sureAd={sureAdi} nuzulYeri={nuzulYeri} yaziBoyutu={yaziBoyutu} karanlik={karanlik} onKapat={() => setOkumaModuAcik(false)} />
      )}

      {aktifSure && (
        <div className="sure-topbar">
          <button className="btn-altin" onClick={geriDon}>← Geri</button>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="sure-baslik-buyuk" style={{ fontFamily: "'Cinzel',serif", fontSize: 18 }}>{sureAdi}</div>
            <div className="sure-baslik-kucuk" style={{ fontSize: 13, color: 'var(--text-muted)' }}>{nuzulYeri} · {aktifSure.numberOfAyahs} ayet</div>
          </div>

          <button className="btn-altin" onClick={sureyiDinle}>🎧 Dinle</button>
          <button className="btn-altin" onClick={tefsirToggle} disabled={tefsirYukleniyor}>{tefsirYukleniyor ? 'Yukleniyor...' : '📚 Tefsir'}</button>
          <button className="btn-altin" onClick={() => setOkumaModuAcik(true)} disabled={arapcaAyetler.length === 0}>⛶ Odak</button>
          <button className="btn-altin" onClick={() => setSayfaGorunumu((s) => !s)}>{sayfaGorunumu ? 'Ayet Modu' : 'Sayfa Modu'}</button>

          <div className="topbar-yazi-kontrol" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <button className="btn-altin" style={{ width: 38, justifyContent: 'center', padding: '6px 0' }} onClick={() => setYaziBoyutu((b) => Math.max(14, b - 2))}>A-</button>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', minWidth: 20, textAlign: 'center' }}>{yaziBoyutu}</span>
            <button className="btn-altin" style={{ width: 38, justifyContent: 'center', padding: '6px 0' }} onClick={() => setYaziBoyutu((b) => Math.min(32, b + 2))}>A+</button>
          </div>

          {girisliMi && (
            <button className="btn-altin" onClick={() => (yerIsaretli ? kayitlar.yerIsaretiKaldir(aktifSure.number) : kayitlar.yerIsaretiEkle({ number: aktifSure.number, ad: sureAdi }))}>
              {yerIsaretli ? '🔖 Isaretli' : '🔖 Yer Isareti'}
            </button>
          )}
          {girisliMi && (
            <button className="btn-altin" onClick={() => (tamamlandi ? kayitlar.okunduKaldir(aktifSure.number) : kayitlar.okunduEkle({ number: aktifSure.number, ad: sureAdi }))}>
              {tamamlandi ? '✅ Tamamlandi' : '○ Tamamlandi'}
            </button>
          )}
        </div>
      )}

      <div ref={icerikRef} className="icerik-alani" style={{ paddingBottom: ses ? 'calc(var(--player-h) + 20px)' : 0 }}>
        {!aktifSure && <KarsilamaEkrani onOkumayaBasla={onOkumayaBasla} />}

        {yukleniyor && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--text-muted)' }}>
            <div style={{ fontFamily: "'Cinzel',serif", fontSize: 14, letterSpacing: 4, marginBottom: 16 }}>YUKLENIYOR</div>
            <div style={{ width: 50, height: 3, background: 'var(--gold)', margin: '0 auto', borderRadius: 2, animation: 'pulse 1.4s ease infinite' }} />
          </div>
        )}

        {hata && <div style={{ margin: '40px 24px', padding: 20, borderRadius: 12, background: 'var(--red-bg)', color: 'var(--red)' }}>⚠ {hata}</div>}

        {!yukleniyor && !hata && arapcaAyetler.length > 0 && (
          sayfaGorunumu ? (
            <SayfaModu ayetler={arapcaAyetler} sureAdi={sureAdi} />
          ) : (
            <div className="icerik-ic">
              <div style={{ textAlign: 'center', padding: '28px 0 32px', borderBottom: '2px solid var(--gold-border)', marginBottom: 8 }}>
                <div style={{ fontFamily: "'Cinzel',serif", fontSize: 'clamp(22px,5vw,32px)', color: 'var(--text)', letterSpacing: 2, marginBottom: 5 }}>{sureAdi}</div>
                <div style={{ fontSize: 'clamp(13px,3vw,16px)', color: 'var(--text-muted)' }}>{nuzulYeri} suresi · {aktifSure.numberOfAyahs} ayet</div>
              </div>
              {arapcaAyetler.map((ayet, i) => (
                <AyetKart key={ayet.number} arapca={ayet} turkce={turkceMeal[i]} tefsir={tefsirAyetler[i]} sureNo={aktifSure.number} sureAd={sureAdi} sesOynat={sesOynat} yaziBoyutu={yaziBoyutu} tefsirAcik={tefsirAcik} />
              ))}
            </div>
          )
        )}
      </div>

      <SesOynatici ses={ses} kapat={() => setSes(null)} />
    </div>
  );
}
