import { initializeApp } from 'firebase/app';
import { getAnalytics, isSupported as analyticsSupported } from 'firebase/analytics';
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCCXsDce21uLtp9NpG-p-Bl0nwNa6c0wBA',
  authDomain: 'kuran-sayfasi.firebaseapp.com',
  projectId: 'kuran-sayfasi',
  storageBucket: 'kuran-sayfasi.firebasestorage.app',
  messagingSenderId: '79465539293',
  appId: '1:79465539293:web:5ce6169b2b50a75c12dd34',
  measurementId: 'G-ETF99PL617',
};

export const firebaseApp = initializeApp(firebaseConfig);
export const firebaseAuth = getAuth(firebaseApp);
export const db = getFirestore(firebaseApp);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

export const analyticsPromise = analyticsSupported().then((ok) => {
  if (!ok) return null;
  return getAnalytics(firebaseApp);
});
