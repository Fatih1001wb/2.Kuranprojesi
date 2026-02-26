import { useEffect, useMemo, useState } from 'react';

function okuJson(key, varsayilan) {
  try {
    const ham = localStorage.getItem(key);
    return ham ? JSON.parse(ham) : varsayilan;
  } catch {
    return varsayilan;
  }
}

function yazJson(key, deger) {
  localStorage.setItem(key, JSON.stringify(deger));
}

export function useHatim(kullanici, okunduListesi) {
  const uid = kullanici?.uid;
  const key = useMemo(() => (uid ? `kuran:${uid}:hatimler` : ''), [uid]);
  const [hatimler, setHatimler] = useState([]);
  const [aktifHatim, setAktifHatim] = useState(null);

  useEffect(() => {
    if (!uid) {
      setHatimler([]);
      setAktifHatim(null);
      return;
    }
    const liste = okuJson(key, []);
    setHatimler(liste);
    setAktifHatim(liste.find((h) => !h.bitis) || null);
  }, [uid, key]);

  const kaydet = (yeniListe) => {
    setHatimler(yeniListe);
    setAktifHatim(yeniListe.find((h) => !h.bitis) || null);
    yazJson(key, yeniListe);
  };

  const tamamla = async () => {
    if (!aktifHatim || !uid) return;
    const yeni = hatimler.map((h) =>
      h.id === aktifHatim.id ? { ...h, bitis: new Date().toISOString(), tamamlandi: true } : h
    );
    kaydet(yeni);
  };

  useEffect(() => {
    if (!aktifHatim || !uid) return;
    const okunanNolar = okunduListesi.map((s) => s.sure_numara);
    const tumSurelerOkundu = Array.from({ length: 114 }, (_, i) => i + 1).every((n) =>
      okunanNolar.includes(n)
    );
    if (tumSurelerOkundu) tamamla();
  }, [okunduListesi, aktifHatim, uid]);

  const yeniHatimBaslat = async () => {
    if (!uid) return;
    const now = new Date().toISOString();
    const kapatilan = hatimler.map((h) => (!h.bitis ? { ...h, bitis: now, tamamlandi: Boolean(h.tamamlandi) } : h));
    const yeni = {
      id: `hatim-${Date.now()}`,
      kullanici_id: uid,
      baslangic: now,
      bitis: null,
      tamamlandi: false,
      tamamlanan_sure_sayisi: 0,
    };
    kaydet([yeni, ...kapatilan]);
  };

  const aktifIlerleme = () => {
    if (!aktifHatim) return 0;
    return okunduListesi.filter((s) => new Date(s.tarih) >= new Date(aktifHatim.baslangic)).length;
  };

  const tamamlananHatim = hatimler.filter((h) => h.tamamlandi);

  return { hatimler, aktifHatim, tamamlananHatim, yeniHatimBaslat, tamamla, aktifIlerleme };
}
