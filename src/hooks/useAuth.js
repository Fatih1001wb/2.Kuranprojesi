import { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';

function turkceHata(msg) {
  if (!msg) return 'Bir hata oluştu.';
  if (msg.includes('Invalid login')) return 'E-posta veya şifre yanlış.';
  if (msg.includes('Email not confirmed')) return 'E-postanızı doğrulamanız gerekiyor.';
  if (msg.includes('already registered')) return 'Bu e-posta zaten kayıtlı.';
  if (msg.includes('Password should')) return 'Şifre en az 6 karakter olmalı.';
  if (msg.includes('rate limit')) return 'Çok fazla deneme. Lütfen bekleyin.';
  return msg;
}

export function useAuth() {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setKullanici(session?.user ?? null);
      setYukleniyor(false);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_e, session) => {
      setKullanici(session?.user ?? null);
      setYukleniyor(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const kayitOl = async (email, sifre) => {
    const { error } = await supabase.auth.signUp({ email, password: sifre });
    if (error) return { hata: turkceHata(error.message) };
    return { basari: true, mesaj: 'Hesap oluşturuldu. E-posta doğrulamasını tamamlayın.' };
  };

  const girisYap = async (email, sifre) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: sifre });
    if (error) return { hata: turkceHata(error.message) };
    return { basari: true };
  };

  const googleIleGiris = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
    if (error) return { hata: turkceHata(error.message) };
    return { basari: true };
  };

  const githubIleGiris = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: window.location.origin },
    });
    if (error) return { hata: turkceHata(error.message) };
    return { basari: true };
  };

  const cikisYap = () => supabase.auth.signOut();

  const kullaniciAdi = kullanici
    ? kullanici.user_metadata?.full_name || kullanici.user_metadata?.user_name || kullanici.email?.split('@')[0] || 'Kullanıcı'
    : null;

  const avatar = kullanici?.user_metadata?.avatar_url || null;

  return {
    kullanici,
    kullaniciAdi,
    avatar,
    yukleniyor,
    kayitOl,
    girisYap,
    googleIleGiris,
    githubIleGiris,
    cikisYap,
  };
}
