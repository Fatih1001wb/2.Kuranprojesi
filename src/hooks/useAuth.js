import { useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { firebaseAuth, githubProvider, googleProvider } from '../services/firebase';

function turkceHata(msg = '') {
  if (msg.includes('auth/invalid-credential')) return 'E-posta veya sifre hatali.';
  if (msg.includes('auth/user-not-found')) return 'Kullanici bulunamadi.';
  if (msg.includes('auth/wrong-password')) return 'Sifre yanlis.';
  if (msg.includes('auth/email-already-in-use')) return 'Bu e-posta zaten kayitli.';
  if (msg.includes('auth/weak-password')) return 'Sifre en az 6 karakter olmali.';
  if (msg.includes('auth/popup-closed-by-user')) return 'Girisi tamamlamadan pencereyi kapattiniz.';
  if (msg.includes('auth/operation-not-allowed')) return 'Bu giris tipi Firebase panelinde aktif degil.';
  if (msg.includes('auth/unauthorized-domain')) return 'Bu domain Firebase tarafinda yetkilendirilmemis.';
  return 'Bir hata olustu.';
}

export function useAuth() {
  const [kullanici, setKullanici] = useState(null);
  const [yukleniyor, setYukleniyor] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(firebaseAuth, (user) => {
      setKullanici(user ?? null);
      setYukleniyor(false);
    });
    return () => unsub();
  }, []);

  const kayitOl = async (email, sifre) => {
    try {
      await createUserWithEmailAndPassword(firebaseAuth, email, sifre);
      return { basari: true, mesaj: 'Hesap olusturuldu.' };
    } catch (e) {
      return { hata: turkceHata(e?.message || '') };
    }
  };

  const girisYap = async (email, sifre) => {
    try {
      await signInWithEmailAndPassword(firebaseAuth, email, sifre);
      return { basari: true };
    } catch (e) {
      return { hata: turkceHata(e?.message || '') };
    }
  };

  const googleIleGiris = async () => {
    try {
      await signInWithPopup(firebaseAuth, googleProvider);
      return { basari: true };
    } catch (e) {
      return { hata: turkceHata(e?.message || '') };
    }
  };

  const githubIleGiris = async () => {
    try {
      await signInWithPopup(firebaseAuth, githubProvider);
      return { basari: true };
    } catch (e) {
      return { hata: turkceHata(e?.message || '') };
    }
  };

  const cikisYap = async () => {
    await signOut(firebaseAuth);
  };

  const kullaniciAdi = kullanici?.displayName || kullanici?.email?.split('@')[0] || 'Kullanici';
  const avatar = kullanici?.photoURL || null;

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
