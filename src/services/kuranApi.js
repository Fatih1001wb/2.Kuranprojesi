const BASE = 'https://api.alquran.cloud/v1';

// Kıraat: Mishary Rashid Al-Afasy (ar.alafasy)
const KIRAAT = 'ar.alafasy';

export const tumSureleriGetir = () =>
  fetch(`${BASE}/surah`).then(r => r.json());

export const sureyiGetir = (numara) =>
  Promise.all([
    fetch(`${BASE}/surah/${numara}/${KIRAAT}`).then(r => r.json()),
    fetch(`${BASE}/surah/${numara}/tr.diyanet`).then(r => r.json()),
  ]);

/**
 * Mishary Rashid Al-Afasy — tam sure sesi (tek dosya)
 * Format: https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/001.mp3
 */
export const sureSesiUrl = (sureNumarasi) =>
  `https://download.quranicaudio.com/quran/mishaari_raashid_al_3afaasee/${
    String(sureNumarasi).padStart(3, '0')
  }.mp3`;

/**
 * Ayet bazlı ses (Islamic Network CDN)
 * Format: https://cdn.islamic.network/quran/audio/128/ar.alafasy/001001.mp3
 */
export const ayetSesiUrl = (sureNo, ayetNo) =>
  `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${
    String(sureNo).padStart(3, '0') + String(ayetNo).padStart(3, '0')
  }.mp3`;
