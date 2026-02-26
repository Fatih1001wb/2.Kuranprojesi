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

export function useKayitlar(kullanici) {
  const uid = kullanici?.uid;
  const prefix = useMemo(() => (uid ? `kuran:${uid}` : ''), [uid]);
  const [yerIsaretleri, setYerIsaretleri] = useState([]);
  const [okundu, setOkundu] = useState([]);

  useEffect(() => {
    if (!uid) {
      setYerIsaretleri([]);
      setOkundu([]);
      return;
    }
    setYerIsaretleri(okuJson(`${prefix}:yer_isaretleri`, []));
    setOkundu(okuJson(`${prefix}:okundu`, []));
  }, [uid, prefix]);

  const yerIsaretiEkle = async (sure) => {
    if (!uid) return;
    const kayit = {
      id: `${sure.number}-${Date.now()}`,
      kullanici_id: uid,
      sure_numara: sure.number,
      sure_ad: sure.ad,
      tarih: new Date().toISOString(),
    };
    setYerIsaretleri((prev) => {
      const temiz = prev.filter((x) => x.sure_numara !== sure.number);
      const yeni = [kayit, ...temiz];
      yazJson(`${prefix}:yer_isaretleri`, yeni);
      return yeni;
    });
  };

  const yerIsaretiKaldir = async (num) => {
    if (!uid) return;
    setYerIsaretleri((prev) => {
      const yeni = prev.filter((x) => x.sure_numara !== num);
      yazJson(`${prefix}:yer_isaretleri`, yeni);
      return yeni;
    });
  };

  const yerIsaretliMi = (num) => yerIsaretleri.some((x) => x.sure_numara === num);

  const okunduEkle = async (sure) => {
    if (!uid) return;
    const kayit = {
      id: `${sure.number}-${Date.now()}`,
      kullanici_id: uid,
      sure_numara: sure.number,
      sure_ad: sure.ad,
      tarih: new Date().toISOString(),
    };
    setOkundu((prev) => {
      const temiz = prev.filter((x) => x.sure_numara !== sure.number);
      const yeni = [kayit, ...temiz];
      yazJson(`${prefix}:okundu`, yeni);
      return yeni;
    });
  };

  const okunduKaldir = async (num) => {
    if (!uid) return;
    setOkundu((prev) => {
      const yeni = prev.filter((x) => x.sure_numara !== num);
      yazJson(`${prefix}:okundu`, yeni);
      return yeni;
    });
  };

  const okunduMu = (num) => okundu.some((x) => x.sure_numara === num);

  return {
    yerIsaretleri,
    yerIsaretiEkle,
    yerIsaretiKaldir,
    yerIsaretliMi,
    okundu,
    okunduEkle,
    okunduKaldir,
    okunduMu,
  };
}
