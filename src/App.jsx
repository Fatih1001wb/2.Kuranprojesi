import React, { useEffect, useState } from 'react';
import HatimPaneli from './components/HatimPaneli';
import Kenarlik from './components/Kenarlik';
import { useAuth } from './hooks/useAuth';
import { useHatim } from './hooks/useHatim';
import { useKayitlar } from './hooks/useKayitlar';
import { useTheme } from './hooks/useTheme';
import AnaSayfa from './pages/AnaSayfa';
import GirisEkrani from './pages/GirisEkrani';
import { tumSureleriGetir } from './services/kuranApi';

function TemaButonu({ tema, toggle }) {
  const etiket = tema === 'karanlik' ? 'Gece' : tema === 'toprak' ? 'Toprak' : 'Gunduz';
  return (
    <button
      className="btn-altin"
      onClick={toggle}
      style={{ padding: '8px 12px', fontSize: 13 }}
      title="Tema degistir"
    >
      {etiket}
    </button>
  );
}

function App() {
  const { tema, karanlik, toggle } = useTheme();
  const auth = useAuth();
  const kayitlar = useKayitlar(auth.kullanici);
  const hatim = useHatim(auth.kullanici, kayitlar.okundu);

  const [sureler, setSureler] = useState([]);
  const [aktifSure, setAktifSure] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [hata, setHata] = useState('');
  const [aktifSayfa, setAktifSayfa] = useState('sureler');
  const [mobilMenuAcik, setMobilMenuAcik] = useState(false);
  const [ekran, setEkran] = useState('okuma');
  const [hatimPanelAcik, setHatimPanelAcik] = useState(false);

  useEffect(() => {
    let aktif = true;
    tumSureleriGetir()
      .then((r) => {
        if (!aktif) return;
        if (r?.status !== 'OK') throw new Error('SURELER_YUKLENEMEDI');
        setSureler(r.data);
        setYukleniyor(false);
      })
      .catch(() => {
        if (!aktif) return;
        setHata('Sure listesi yuklenemedi. Lutfen baglantinizi kontrol edin.');
        setYukleniyor(false);
      });
    return () => {
      aktif = false;
    };
  }, []);

  useEffect(() => {
    if (ekran === 'giris' && auth.kullanici) {
      setEkran('okuma');
    }
  }, [ekran, auth.kullanici]);

  const sayfaDegistir = (sayfa) => {
    if (sayfa === 'giris-git') {
      setEkran('giris');
      return;
    }
    setAktifSayfa(sayfa);
  };

  const okumayaBasla = () => {
    setAktifSayfa('sureler');
    if (window.innerWidth <= 768) setMobilMenuAcik(true);
  };

  if (auth.yukleniyor || yukleniyor) {
    return (
      <div style={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'var(--bg)', color: 'var(--text-muted)' }}>
        Yukleniyor...
      </div>
    );
  }

  if (ekran === 'giris') {
    return <GirisEkrani auth={auth} onGeri={() => setEkran('okuma')} />;
  }

  return (
    <div className="app-layout">
      <div className="mobil-topbar">
        <button className="hamburger" onClick={() => setMobilMenuAcik(true)} aria-label="Menuyu ac">
          <span />
          <span />
          <span />
        </button>
        <div style={{ flex: 1, minWidth: 0, fontFamily: "'Cinzel', serif", color: '#c9a84c', letterSpacing: 1.5, fontSize: 16 }}>
          Kuran-i Kerim
        </div>
        <TemaButonu tema={tema} toggle={toggle} />
      </div>

      {mobilMenuAcik && <div className="sidebar-overlay" onClick={() => setMobilMenuAcik(false)} />}

      <aside className={`sidebar ${mobilMenuAcik ? 'acik' : ''}`}>
        <Kenarlik
          sureler={sureler}
          aktifSure={aktifSure}
          sureAc={(sure) => setAktifSure(sure)}
          aktifSayfa={aktifSayfa}
          sayfaDegistir={sayfaDegistir}
          kayitlar={kayitlar}
          auth={auth}
          kapat={() => setMobilMenuAcik(false)}
        />
      </aside>

      <main className="main-area">
        {!aktifSure && (
          <div style={{ position: 'fixed', top: 12, right: 14, zIndex: 90, display: 'flex', gap: 8 }}>
            {auth.kullanici && (
              <button className="btn-altin" onClick={() => setHatimPanelAcik(true)} style={{ padding: '8px 12px', fontSize: 13 }}>
                Hatim Takibi
              </button>
            )}
            <TemaButonu tema={tema} toggle={toggle} />
          </div>
        )}

        {hata ? (
          <div style={{ margin: 24, padding: 18, borderRadius: 12, background: 'var(--red-bg)', color: 'var(--red)' }}>{hata}</div>
        ) : (
          <AnaSayfa
            aktifSure={aktifSure}
            geriDon={() => setAktifSure(null)}
            kayitlar={kayitlar}
            auth={auth}
            karanlik={karanlik}
            onOkumayaBasla={okumayaBasla}
          />
        )}
      </main>

      {hatimPanelAcik && <HatimPaneli hatim={hatim} kayitlar={kayitlar} karanlik={karanlik} kapat={() => setHatimPanelAcik(false)} />}
    </div>
  );
}

export default App;
