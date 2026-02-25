import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabase';

export function useKayitlar(kullanici) {
  const [yerIsaretleri, setYerIsaretleri] = useState([]);
  const [okundu,        setOkundu]        = useState([]);
  const uid = kullanici?.id;

  const yukle = useCallback(async () => {
    if (!uid) { setYerIsaretleri([]); setOkundu([]); return; }
    const [{ data: yi }, { data: ok }] = await Promise.all([
      supabase.from('yer_isaretleri').select('*').eq('kullanici_id', uid).order('tarih', { ascending: false }),
      supabase.from('okundu').select('*').eq('kullanici_id', uid).order('tarih', { ascending: false }),
    ]);
    setYerIsaretleri(yi || []);
    setOkundu(ok || []);
  }, [uid]);

  useEffect(() => { yukle(); }, [yukle]);

  const yerIsaretiEkle = async (sure) => {
    if (!uid) return;
    const { data } = await supabase.from('yer_isaretleri').insert({
      kullanici_id: uid, sure_numara: sure.number, sure_ad: sure.ad,
      tarih: new Date().toISOString(),
    }).select().single();
    if (data) setYerIsaretleri(p => [data, ...p]);
  };

  const yerIsaretiKaldir = async (num) => {
    if (!uid) return;
    await supabase.from('yer_isaretleri').delete().eq('kullanici_id', uid).eq('sure_numara', num);
    setYerIsaretleri(p => p.filter(s => s.sure_numara !== num));
  };

  const yerIsaretliMi = (num) => yerIsaretleri.some(s => s.sure_numara === num);

  const okunduEkle = async (sure) => {
    if (!uid) return;
    const { data } = await supabase.from('okundu').insert({
      kullanici_id: uid, sure_numara: sure.number, sure_ad: sure.ad,
      tarih: new Date().toISOString(),
    }).select().single();
    if (data) setOkundu(p => [data, ...p]);
  };

  const okunduKaldir = async (num) => {
    if (!uid) return;
    await supabase.from('okundu').delete().eq('kullanici_id', uid).eq('sure_numara', num);
    setOkundu(p => p.filter(s => s.sure_numara !== num));
  };

  const okunduMu = (num) => okundu.some(s => s.sure_numara === num);

  return { yerIsaretleri, yerIsaretiEkle, yerIsaretiKaldir, yerIsaretliMi, okundu, okunduEkle, okunduKaldir, okunduMu };
}
