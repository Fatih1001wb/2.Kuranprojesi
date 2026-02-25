import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

export function useHatim(kullanici, okunduListesi) {
  const [hatimler, setHatimler] = useState([]);
  const [aktifHatim, setAktifHatim] = useState(null);
  const uid = kullanici?.id;

  const yukle = useCallback(async () => {
    if (!uid) { setHatimler([]); setAktifHatim(null); return; }
    const { data } = await supabase
      .from('hatimler')
      .select('*')
      .eq('kullanici_id', uid)
      .order('baslangic', { ascending: false });
    const liste = data || [];
    setHatimler(liste);
    setAktifHatim(liste.find(h => !h.bitis) || null);
  }, [uid]);

  useEffect(() => { yukle(); }, [yukle]);

  // Okundu listesi değişince aktif hatimi kontrol et
  useEffect(() => {
    if (!aktifHatim || !uid) return;
    const okunanNolar = okunduListesi.map(s => s.sure_numara);
    const tumSurelerOkundu = Array.from({length:114},(_,i)=>i+1).every(n => okunanNolar.includes(n));
    if (tumSurelerOkundu) tamamla();
  }, [okunduListesi, aktifHatim]);

  const yeniHatimBaslat = async () => {
    if (!uid) return;
    // Varsa açık hatimi kapat
    if (aktifHatim) {
      await supabase.from('hatimler').update({ bitis: new Date().toISOString() }).eq('id', aktifHatim.id);
    }
    const { data } = await supabase.from('hatimler').insert({
      kullanici_id: uid,
      baslangic: new Date().toISOString(),
      tamamlanan_sure_sayisi: 0,
    }).select().single();
    if (data) {
      setAktifHatim(data);
      setHatimler(prev => [data, ...prev.filter(h => h.id !== aktifHatim?.id)]);
    }
  };

  const tamamla = async () => {
    if (!aktifHatim || !uid) return;
    const { data } = await supabase.from('hatimler')
      .update({ bitis: new Date().toISOString(), tamamlandi: true })
      .eq('id', aktifHatim.id).select().single();
    if (data) {
      setHatimler(prev => prev.map(h => h.id === data.id ? data : h));
      setAktifHatim(null);
    }
  };

  // Aktif hatimde kaç sure okundu
  const aktifIlerleme = () => {
    if (!aktifHatim) return 0;
    return okunduListesi.filter(s => new Date(s.tarih) >= new Date(aktifHatim.baslangic)).length;
  };

  const tamamlananHatim = hatimler.filter(h => h.tamamlandi);

  return { hatimler, aktifHatim, tamamlananHatim, yeniHatimBaslat, tamamla, aktifIlerleme };
}
