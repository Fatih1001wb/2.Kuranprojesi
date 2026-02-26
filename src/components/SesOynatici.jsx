import React, { useEffect, useMemo, useRef, useState } from 'react';

function formatSure(saniye = 0) {
  const dk = Math.floor(saniye / 60);
  const sn = Math.floor(saniye % 60);
  return `${String(dk).padStart(2, '0')}:${String(sn).padStart(2, '0')}`;
}

export default function SesOynatici({ ses, kapat }) {
  const ref = useRef(null);
  const [oynuyor, setOynuyor] = useState(false);
  const [sure, setSure] = useState(0);
  const [konum, setKonum] = useState(0);

  useEffect(() => {
    const audio = ref.current;
    if (!audio || !ses?.url) return;

    const onLoaded = () => setSure(audio.duration || 0);
    const onTime = () => setKonum(audio.currentTime || 0);
    const onEnded = () => setOynuyor(false);
    const onPlay = () => setOynuyor(true);
    const onPause = () => setOynuyor(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);

    audio.load();
    audio.play().catch(() => {});

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTime);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
    };
  }, [ses?.url]);

  const yuzde = useMemo(() => (sure > 0 ? (konum / sure) * 100 : 0), [konum, sure]);

  const togglePlay = () => {
    const audio = ref.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => {});
    else audio.pause();
  };

  const ileriSar = (saniye) => {
    const audio = ref.current;
    if (!audio) return;
    audio.currentTime = Math.min(Math.max(audio.currentTime + saniye, 0), audio.duration || 0);
  };

  const seek = (e) => {
    const audio = ref.current;
    if (!audio) return;
    const val = Number(e.target.value);
    audio.currentTime = val;
    setKonum(val);
  };

  if (!ses) return null;

  return (
    <div className="player">
      <audio ref={ref} preload="metadata">
        <source src={ses.url} type="audio/mpeg" />
      </audio>

      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: '50%',
          border: '1px solid rgba(200,168,75,0.35)',
          display: 'grid',
          placeItems: 'center',
          color: '#c9a84c',
          fontSize: 16,
          flexShrink: 0,
        }}
      >
        ♪
      </div>

      <div className="player-info" style={{ minWidth: 120 }}>
        <div
          style={{
            fontFamily: "'Cinzel',serif",
            fontSize: 13,
            color: '#c9a84c',
            letterSpacing: 0.5,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {ses.etiket}
        </div>
        <div style={{ fontSize: 11, color: 'var(--sidebar-muted)' }}>Mishary Rashid Al-Afasy</div>
      </div>

      <div className="player-controls">
        <button className="player-btn" onClick={() => ileriSar(-10)} aria-label="10 saniye geri">
          -10
        </button>
        <button className="player-btn player-btn-main" onClick={togglePlay} aria-label="Oynat veya duraklat">
          {oynuyor ? 'Duraklat' : 'Oynat'}
        </button>
        <button className="player-btn" onClick={() => ileriSar(10)} aria-label="10 saniye ileri">
          +10
        </button>
      </div>

      <div className="player-progress-wrap">
        <input
          className="player-progress"
          type="range"
          min="0"
          max={Math.max(sure, 0)}
          value={Math.min(konum, sure || 0)}
          onChange={seek}
          style={{
            background: `linear-gradient(90deg, #c9a84c 0%, #c9a84c ${yuzde}%, rgba(200, 168, 75, 0.25) ${yuzde}%, rgba(200, 168, 75, 0.25) 100%)`,
          }}
        />
        <div className="player-time">
          <span>{formatSure(konum)}</span>
          <span>{formatSure(sure)}</span>
        </div>
      </div>

      <button
        onClick={kapat}
        style={{
          width: 30,
          height: 30,
          borderRadius: '50%',
          border: '1px solid rgba(200,168,75,0.25)',
          color: 'var(--sidebar-muted)',
          fontSize: 14,
          display: 'grid',
          placeItems: 'center',
          flexShrink: 0,
        }}
      >
        ✕
      </button>
    </div>
  );
}
