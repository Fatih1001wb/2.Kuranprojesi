import { useEffect, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../services/firebase';

function tarihToIso(tarih) {
  if (!tarih) return null;
  if (typeof tarih === 'string') return tarih;
  if (typeof tarih?.toDate === 'function') return tarih.toDate().toISOString();
  return null;
}

export function useHatim(kullanici, okunduListesi) {
  const uid = kullanici?.uid;
  const [hatimler, setHatimler] = useState([]);
  const [aktifHatim, setAktifHatim] = useState(null);

  useEffect(() => {
    if (!uid) {
      setHatimler([]);
      setAktifHatim(null);
      return;
    }

    const q = query(collection(db, 'kullanicilar', uid, 'hatimler'), orderBy('baslangic', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      const liste = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
        baslangic: tarihToIso(d.data().baslangic),
        bitis: tarihToIso(d.data().bitis),
      }));
      setHatimler(liste);
      setAktifHatim(liste.find((h) => !h.bitis) || null);
    });

    return () => unsub();
  }, [uid]);

  const tamamla = async () => {
    if (!aktifHatim || !uid) return;
    await updateDoc(doc(db, 'kullanicilar', uid, 'hatimler', aktifHatim.id), {
      bitis: new Date().toISOString(),
      tamamlandi: true,
    });
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
    if (aktifHatim?.id) {
      await updateDoc(doc(db, 'kullanicilar', uid, 'hatimler', aktifHatim.id), {
        bitis: new Date().toISOString(),
        tamamlandi: Boolean(aktifHatim.tamamlandi),
      });
    }
    await addDoc(collection(db, 'kullanicilar', uid, 'hatimler'), {
      kullanici_id: uid,
      baslangic: new Date().toISOString(),
      bitis: null,
      tamamlandi: false,
      tamamlanan_sure_sayisi: 0,
    });
  };

  const aktifIlerleme = () => {
    if (!aktifHatim?.baslangic) return 0;
    return okunduListesi.filter((s) => new Date(s.tarih) >= new Date(aktifHatim.baslangic)).length;
  };

  const tamamlananHatim = hatimler.filter((h) => h.tamamlandi);

  return { hatimler, aktifHatim, tamamlananHatim, yeniHatimBaslat, tamamla, aktifIlerleme };
}
