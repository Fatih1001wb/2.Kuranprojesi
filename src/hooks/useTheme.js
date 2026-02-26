import { useEffect, useState } from 'react';

const TEMALAR = ['aydinlik', 'karanlik', 'toprak'];

export function useTheme() {
  const [tema, setTema] = useState(() => {
    const kayitli = localStorage.getItem('kuran_tema');
    if (kayitli && TEMALAR.includes(kayitli)) return kayitli;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'karanlik' : 'aydinlik';
  });

  useEffect(() => {
    localStorage.setItem('kuran_tema', tema);
    document.documentElement.setAttribute('data-tema', tema);
  }, [tema]);

  const toggle = () => {
    const idx = TEMALAR.indexOf(tema);
    setTema(TEMALAR[(idx + 1) % TEMALAR.length]);
  };

  return { tema, karanlik: tema === 'karanlik', toggle };
}
