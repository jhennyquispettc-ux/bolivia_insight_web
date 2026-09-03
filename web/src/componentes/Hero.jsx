import React, { useState, useEffect } from 'react';
import { useI18n } from '../data/translations.jsx';
import I from '../ui/iconos.jsx';
import Btn from '../ui/Boton.jsx';

function Hero({ variant = 'A', onCtaClick }) {
  const { t } = useI18n();
  const [night, setNight] = useState(false);
  const [vw, setVw] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

  useEffect(() => {
    const onResize = () => setVw(window.innerWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', night ? 'dark' : 'light');
    // Reset to light theme when the Hero unmounts (user navigates away from landing)
    return () => {
      document.documentElement.setAttribute('data-theme', 'light');
    };
  }, [night]);

  const isMobile = vw < 768;

  const formatTitle = (text, isNight) => {
    const parts = text.split(/[\[\]]/);
    if (parts.length === 3) {
      const renderPart = (p) => {
        return p.split('\n').map((line, i, arr) => (
          <React.Fragment key={i}>
            {line}
            {i < arr.length - 1 && <br />}
          </React.Fragment>
        ));
      };
      return (
        <>
          {renderPart(parts[0])}
          <em style={{
            fontStyle: 'normal', fontWeight: 800,
            color: isNight ? 'var(--mystic-200)' : 'var(--amber-300)',
            display: variant === 'B' ? 'inline-block' : 'inline',
            textShadow: isNight ? '0 2px 20px rgba(106,76,147,0.6)' : '0 2px 18px rgba(179,63,46,0.7), 0 2px 10px rgba(0,0,0,0.5)'
          }}>{renderPart(parts[1])}</em>
          {renderPart(parts[2])}
        </>
      );
    }
    return text;
  };

  return (
    <section style={{
      position: 'relative',
      minHeight: '100vh',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      {}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(assets/logos/uyuni-sunset.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: night ? 0 : 1,
        transition: 'opacity 1500ms var(--ease-in-out)',
      }} />

      {}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(assets/logos/uyuni-night.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
        opacity: night ? 1 : 0,
        transition: 'opacity 1500ms var(--ease-in-out)',
      }} />

      {}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        background: night
          ? 'linear-gradient(180deg, rgba(5,8,19,0.2) 0%, rgba(5,8,19,0) 30%, rgba(5,8,19,0.5) 70%, rgba(5,8,19,0.85) 100%)'
          : 'linear-gradient(180deg, rgba(27,42,65,0.45) 0%, rgba(27,42,65,0.15) 25%, rgba(27,42,65,0.55) 70%, rgba(27,42,65,0.85) 100%)',
        transition: 'background 1500ms',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(90deg, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0.15) 35%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {}
      <div style={{
        position: 'relative', zIndex: 5,
        maxWidth: 1400, margin: '0 auto',
        padding: isMobile ? '100px 20px 200px' : '120px 32px 140px',
        width: '100%',
      }}>
        {variant === 'A' ? (
          <>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', borderRadius: 999,
              background: 'rgba(0,0,0,0.32)',
              border: '1px solid rgba(255,255,255,0.32)',
              backdropFilter: 'blur(10px)',
              color: '#fff', fontSize: isMobile ? 10 : 12, fontWeight: 700, letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              <I.Sparkle size={13} /> {night ? t('hero.sparkleNight', 'Salar at 04:32 a.m.') : t('hero.sparkleSunset', 'Salar at 18:42, sunset')}
            </div>

            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? 'clamp(36px, 11vw, 56px)' : 'clamp(40px, 6vw, 84px)',
              lineHeight: 1,
              letterSpacing: '-0.035em',
              fontWeight: 600,
              color: '#fff',
              // Held to a readable measure so the headline sits as a column
              // against the salt flat instead of stretching across the frame.
              margin: '20px 0 0', maxWidth: isMobile ? '100%' : 720,
              textWrap: 'balance',
              textShadow: night ? '0 4px 40px rgba(106,76,147,0.5), 0 2px 12px rgba(0,0,0,0.6)' : '0 4px 30px rgba(0,0,0,0.6), 0 2px 10px rgba(0,0,0,0.5)',
            }}>
              {formatTitle(night ? t('hero.titleNight', 'Bolivia, in [silver light].') : t('hero.titleDay', 'Bolivia, in [last light].'), night)}
            </h1>
            <p style={{
              color: 'var(--on-dark-1)',
              fontSize: isMobile ? 15 : 19, lineHeight: 1.55,
              maxWidth: isMobile ? '100%' : 580, marginTop: 16, fontWeight: 400,
              textShadow: '0 2px 14px rgba(0,0,0,0.7), 0 1px 4px rgba(0,0,0,0.5)',
            }}>
              {t('hero.subtitle', 'The salt flats keep two faces. An independent travel guide for flashpackers crossing Bolivia on their own — by day and by night.')}
            </p>
            <div style={{ marginTop: 28, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Btn kind="primary" size={isMobile ? 'md' : 'lg'} onClick={onCtaClick}>{t('hero.ctaOpenGuide', 'Open the guide')} <I.ArrowR size={16} /></Btn>
              <Btn kind="glass" size={isMobile ? 'md' : 'lg'}
                onClick={() => document.getElementById('sectores')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                {t('hero.ctaBrowseDestinations', 'Ver los sectores')}
              </Btn>
            </div>
          </>
        ) : (
                    <div style={{ textAlign: 'center', maxWidth: 1100, margin: '0 auto' }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '7px 14px', borderRadius: 999,
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.28)',
              backdropFilter: 'blur(10px)',
              color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.14em',
              textTransform: 'uppercase',
            }}>Salar de Uyuni · 10,582 km²</div>
            <h1 style={{
              fontFamily: 'var(--font-display)',
              fontSize: isMobile ? 'clamp(40px, 12vw, 64px)' : 'clamp(48px, 7vw, 100px)',
              lineHeight: 0.98, letterSpacing: '-0.04em',
              fontWeight: 600, color: '#fff', margin: '24px 0 0',
              textShadow: '0 4px 40px rgba(0,0,0,0.4)',
            }}>
              {formatTitle(t('hero.countryWorth', 'The country\n[worth slowing for].'), night)}
            </h1>
            <div style={{ marginTop: 40, display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Btn kind="primary" size={isMobile ? 'md' : 'lg'} onClick={onCtaClick}>{t('hero.ctaOpenGuide', 'Open the guide')} <I.ArrowR size={16} /></Btn>
              <Btn kind="glass" size={isMobile ? 'md' : 'lg'}
                onClick={() => document.getElementById('sectores')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}>
                {t('hero.ctaBrowseDestinations', 'Ver los sectores')}
              </Btn>
            </div>
          </div>
        )}
      </div>

      {}
      <button onClick={() => setNight(!night)} aria-label={t('a11y.toggleDayNight', 'Toggle day and night')} style={{
        position: 'absolute',
        top: isMobile ? 'auto' : 110,
        bottom: isMobile ? 150 : 'auto',
        right: isMobile ? 20 : 32,
        zIndex: 10,
        width: 72, height: 40, borderRadius: 999,
        background: night ? 'rgba(106,76,147,0.4)' : 'rgba(255,183,3,0.32)',
        border: '1px solid rgba(255,255,255,0.35)',
        backdropFilter: 'blur(10px)', cursor: 'pointer',
        padding: 3, display: 'flex', alignItems: 'center',
        transition: 'background 280ms',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: night ? 'var(--navy-600)' : '#fff',
          color: 'var(--amber-500)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transform: night ? 'translateX(32px)' : 'translateX(0)',
          transition: 'transform 280ms var(--ease-spring), background 280ms',
          boxShadow: '0 2px 6px rgba(0,0,0,0.25)',
        }}>
          {night ? <I.Moon size={14} /> : <I.Sun size={14} />}
        </div>
      </button>

      {}
      {!isMobile && <WeatherWidget night={night} />}

      {}
      {isMobile && <MobileWeatherStrip night={night} />}

      <style>{`
        @keyframes bi-twinkle { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
        @keyframes bi-parallax-0 { from { transform: translateX(0); } to { transform: translateX(-30px); } }
        @keyframes bi-parallax-1 { from { transform: translateX(0); } to { transform: translateX(-60px); } }
        @keyframes bi-parallax-2 { from { transform: translateX(0); } to { transform: translateX(-100px); } }
        @keyframes bi-drift { from { transform: rotate(-18deg) translateX(0); } to { transform: rotate(-18deg) translateX(8%); } }
        @keyframes bi-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
      `}</style>
    </section>
  );
}

function MobileWeatherStrip({ night }) {
  const { t } = useI18n();
  const [citiesData, setCitiesData] = React.useState([
    { city: 'La Paz', lat: -16.5000, lon: -68.1500, tempDay: '--', tempNight: '--', weathercode: undefined },
    { city: 'Uyuni', lat: -20.4597, lon: -66.8250, tempDay: '--', tempNight: '--', weathercode: undefined },
  ]);

  React.useEffect(() => {
    async function fetchWeather() {
      try {
        const lats = citiesData.map(c => c.lat).join(',');
        const lons = citiesData.map(c => c.lon).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FLa_Paz`;
        const res = await fetch(url);
        const data = await res.json();
        const updated = citiesData.map((city, i) => {
          const f = data[i];
          if (!f || !f.current_weather) return city;
          return { ...city, tempDay: Math.round(f.daily.temperature_2m_max[0]), tempNight: Math.round(f.daily.temperature_2m_min[0]), weathercode: f.current_weather.weathercode };
        });
        setCitiesData(updated);
      } catch (e) {}
    }
    fetchWeather();
  }, []);

  return (
    <div style={{
      position: 'absolute', bottom: 28, left: 20, right: 20, zIndex: 6,
      display: 'flex', gap: 10,
    }}>
      {citiesData.map(c => (
        <div key={c.city} style={{
          flex: 1,
          background: 'rgba(13,18,30,0.52)',
          border: '1px solid rgba(255,255,255,0.22)',
          backdropFilter: 'blur(16px)',
          borderRadius: 12, padding: '10px 14px',
          color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700 }}>{c.city}</div>
            <div style={{ fontSize: 10, opacity: 0.7, fontFamily: 'var(--font-mono)' }}>
              {t('hero.liveWeather', 'Live Weather')}
            </div>
          </div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 500, color: 'var(--amber-300)' }}>
            {night ? c.tempNight : c.tempDay}<span style={{ fontSize: 12, opacity: 0.7 }}>°C</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function WeatherWidget({ night }) {
  const { t } = useI18n();
  const [citiesData, setCitiesData] = React.useState([
    { city: 'La Paz', lat: -16.5000, lon: -68.1500, alt: '3,640m', tempDay: '--', tempNight: '--', weathercode: undefined },
    { city: 'Uyuni', lat: -20.4597, lon: -66.8250, alt: '3,656m', tempDay: '--', tempNight: '--', weathercode: undefined },
  ]);

  React.useEffect(() => {
    async function fetchWeather() {
      try {
        const lats = citiesData.map(c => c.lat).join(',');
        const lons = citiesData.map(c => c.lon).join(',');
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${lats}&longitude=${lons}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=America%2FLa_Paz`;
        const res = await fetch(url);
        const data = await res.json();

        const updated = citiesData.map((city, i) => {
          const f = data[i];
          if (!f || !f.current_weather) return city;
          return {
            ...city,
            tempDay: Math.round(f.daily.temperature_2m_max[0]),
            tempNight: Math.round(f.daily.temperature_2m_min[0]),
            weathercode: f.current_weather.weathercode
          };
        });
        setCitiesData(updated);
      } catch (err) {
        console.error('Failed to fetch weather for hero:', err);
      }
    }
    fetchWeather();
  }, []); 

  const getCondition = (code, isNight) => {
    if (code === undefined) return { text: t('weather.loading', 'Loading...'), icon: <I.Cloud size={22} /> };
    if (code === 0) return { text: isNight ? t('weather.clearFreezing', 'Clear, freezing') : t('weather.sunDry', 'Sun, dry'), icon: isNight ? <I.Moon size={22} /> : <I.Sun size={22} /> };
    if (code === 1 || code === 2 || code === 3) return { text: t('weather.partlyCloudy', 'Partly cloudy'), icon: <I.Cloud size={22} /> };
    if (code >= 45 && code <= 48) return { text: t('weather.fog', 'Fog'), icon: <I.Cloud size={22} /> };
    if (code >= 51 && code <= 67) return { text: t('weather.rain', 'Rain'), icon: <I.Cloud size={22} /> };
    if (code >= 71 && code <= 77) return { text: t('weather.snow', 'Snow'), icon: <I.Cloud size={22} /> };
    if (code >= 95) return { text: t('weather.thunderstorm', 'Thunderstorm'), icon: <I.Cloud size={22} /> };
    return { text: t('weather.variable', 'Variable'), icon: <I.Wind size={22} /> };
  };

  return (
    <div style={{
      position: 'absolute', right: 32, bottom: 36, zIndex: 6,
      width: 280,
      background: 'rgba(13,18,30,0.42)',
      border: '1px solid rgba(255,255,255,0.28)',
      backdropFilter: 'blur(20px) saturate(140%)',
      WebkitBackdropFilter: 'blur(20px) saturate(140%)',
      borderRadius: 16, padding: 18,
      color: '#fff',
      boxShadow: '0 10px 40px rgba(0,0,0,0.35)',
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <I.Cloud size={16} />
          <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.14em', textTransform: 'uppercase' }}>{t('hero.liveWeather', 'Live Weather')}</div>
        </div>
        <div style={{ fontSize: 10, fontFamily: 'var(--font-mono)', opacity: 0.7, letterSpacing: 0.4 }}>Open-Meteo</div>
      </div>
      {citiesData.map(c => {
        const cond = getCondition(c.weathercode, night);
        return (
          <div key={c.city} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0' }}>
            <div style={{ color: 'var(--amber-300)' }}>{cond.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{c.city}</div>
              <div style={{ fontSize: 12, opacity: 0.8, fontFamily: 'var(--font-mono)' }}>{c.alt} · {cond.text}</div>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 28, lineHeight: 1, fontWeight: 500 }}>
              {night ? c.tempNight : c.tempDay}<span style={{ fontSize: 14, opacity: 0.7 }}>°C</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Hero;
