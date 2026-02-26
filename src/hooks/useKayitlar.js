import { useEffect, useState } from 'react';
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';

function tarihToIso(tarih) {
  if (!tarih) return new Date().toISOString();
  if (typeof tarih === 'string') return tarih;
  if (typeof tarih?.toDate === 'function') return tarih.toDate().toISOString();
  return new Date().toISOString();
}

export function useKayitlar(kullanici) {
  const uid = kullanici?.uid;
  const [yerIsaretleri, setYerIsaretleri] = useState([]);
  const [okundu, setOkundu] = useState([]);

  useEffect(() => {
    if (!uid) {
      setYerIsaretleri([]);
      setOkundu([]);
      return;
    }

    const yerQ = query(collection(db, 'kullanicilar', uid, 'yer_isaretleri'), orderBy('tarih', 'desc'));
    const okQ = query(collection(db, 'kullanicilar', uid, 'okundu'), orderBy('tarih', 'desc'));

    const unsubYer = onSnapshot(yerQ, (snap) => {
      setYerIsaretleri(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          tarih: tarihToIso(d.data().tarih),
        }))
      );
    });

    const unsubOk = onSnapshot(okQ, (snap) => {
      setOkundu(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
          tarih: tarihToIso(d.data().tarih),
        }))
      );
    });

    return () => {
      unsubYer();
      unsubOk();
    };
  }, [uid]);

  const yerIsaretiEkle = async (sure) => {
    if (!uid) return;
    await setDoc(doc(db, 'kullanicilar', uid, 'yer_isaretleri', String(sure.number)), {
      kullanici_id: uid,
      sure_numara: sure.number,
      sure_ad: sure.ad,
      tarih: new Date().toISOString(),
    });
  };

  const yerIsaretiKaldir = async (num) => {
    if (!uid) return;
    await deleteDoc(doc(db, 'kullanicilar', uid, 'yer_isaretleri', String(num)));
  };

  const yerIsaretliMi = (num) => yerIsaretleri.some((x) => x.sure_numara === num);

  const okunduEkle = async (sure) => {
    if (!uid) return;
    await setDoc(doc(db, 'kullanicilar', uid, 'okundu', String(sure.number)), {
      kullanici_id: uid,
      sure_numara: sure.number,
      sure_ad: sure.ad,
      tarih: new Date().toISOString(),
    });
  };

  const okunduKaldir = async (num) => {
    if (!uid) return;
    await deleteDoc(doc(db, 'kullanicilar', uid, 'okundu', String(num)));
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
