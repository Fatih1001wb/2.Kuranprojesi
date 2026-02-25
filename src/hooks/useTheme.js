import { useState, useEffect } from 'react';

export function useTheme() {
  const [karanlik, setKaranlik] = useState(() => {
    const kayitli = localStorage.getItem('kuran_tema');
    if (kayitli) return kayitli === 'karanlik';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('kuran_tema', karanlik ? 'karanlik' : 'aydinlik');
    document.documentElement.setAttribute('data-tema', karanlik ? 'karanlik' : 'aydinlik');
  }, [karanlik]);

  const toggle = () => setKaranlik(k => !k);

  return { karanlik, toggle };
}
