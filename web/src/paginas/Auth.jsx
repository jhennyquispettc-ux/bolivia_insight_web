import React, { useEffect, useState } from 'react';
import { apiUrl } from '../data/api.js';

function Auth({ onBack, onLogin, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleGoogleLogin = () => {
    if (!window.google) {
      setError("Google SDK no ha cargado aún. Intenta en un momento.");
      return;
    }

    setError(null);
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '648020306250-ad76806rdeqa45c1rr8enu79poiq0asg.apps.googleusercontent.com',
      scope: 'email profile https://www.googleapis.com/auth/calendar.events',
      prompt: 'consent',
      callback: async (response) => {
        if (response.error) {
          setError("Error en el popup de Google: " + response.error);
          return;
        }

        setLoading(true);
        try {
          
          const res = await fetch(apiUrl('/auth/google'), {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ accessToken: response.access_token }),
          });

          if (!res.ok) throw new Error("Fallo en la autenticación del servidor");

          const data = await res.json();
          console.log("Usuario autenticado con éxito:", data);
          
          if (onLogin) onLogin(data.user, data.accessToken);


          localStorage.setItem('google_access_token', response.access_token);

          // After login go where the caller wants (e.g. back to booking); falls
          // back to the default "go home" behavior when no onSuccess is given.
          if (onSuccess) onSuccess();
          else onBack();
        } catch (err) {
          console.error(err);
          setError("No se pudo conectar con el servidor. ¿Está el backend encendido?");
        } finally {
          setLoading(false);
        }
      },
    });

    client.requestAccessToken();
  };

  return (
    <div style={{
      position: 'relative',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden',
      padding: '24px',
    }}>
      {}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(assets/logos/uyuni-sunset.png)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }} />

      {}
      <div style={{
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0,
        background: 'linear-gradient(180deg, rgba(27,42,65,0.45) 0%, rgba(27,42,65,0.15) 25%, rgba(27,42,65,0.65) 70%, rgba(27,42,65,0.9) 100%)',
      }} />

      <div style={{
        position: 'absolute', top: 32, left: 32, zIndex: 10
      }}>
        <button onClick={onBack} aria-label="Volver" style={{
          background: 'rgba(0,0,0,0.32)', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer',
          color: '#fff', padding: '10px 16px', borderRadius: 999,
          fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 600,
          backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', gap: 6,
          transition: 'background 200ms'
        }}>
          ← Volver
        </button>
      </div>

      {}
      <div className="auth-glass-card">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 32 }}>
          <img src="assets/logos/logo-mark-256.png" alt="" style={{ height: 36, filter: 'brightness(0) invert(1)' }} />
          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 24, color: 'var(--rust-300)' }}>
            Bolivia<span style={{ color: 'var(--amber-400)', fontWeight: 600 }}>Insight</span>
          </span>
        </div>

        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{
            display: 'inline-block',
            padding: '6px 12px', borderRadius: 999,
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            color: 'var(--amber-300)', fontSize: 11, fontWeight: 800, letterSpacing: '0.14em',
            textTransform: 'uppercase', marginBottom: 20
          }}>
            Portal del Viajero
          </div>

          <h1 style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 44px)',
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            fontWeight: 600,
            color: '#fff',
            margin: '0 0 16px',
            textShadow: '0 4px 20px rgba(0,0,0,0.4)'
          }}>
            Continúa tu <em style={{ fontStyle: 'normal', fontWeight: 800, color: 'var(--amber-300)' }}>aventura.</em>
          </h1>

          <p style={{
            color: 'rgba(255,255,255,0.85)',
            fontSize: 16, lineHeight: 1.5,
            margin: 0, fontWeight: 400,
          }}>
            Accede para guardar rutas, contactar expertos y sincronizar tu itinerario de forma segura.
          </p>
        </div>

        {error && (
          <div style={{ background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', padding: '10px', borderRadius: '8px', marginBottom: '16px', fontSize: '13px', textAlign: 'center', border: '1px solid rgba(220,38,38,0.4)' }}>
            {error}
          </div>
        )}

        <button type="button" className="auth-btn-google" onClick={handleGoogleLogin} disabled={loading} style={{ opacity: loading ? 0.7 : 1 }}>
          <svg width="22" height="22" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
          </svg>
          <span style={{ flex: 1, textAlign: 'center', marginRight: 22 }}>
            {loading ? 'Conectando...' : 'Continuar con Google'}
          </span>
        </button>

        <p style={{
          fontSize: 11,
          color: 'rgba(255,255,255,0.45)',
          textAlign: 'center',
          marginTop: 28,
          lineHeight: 1.5,
          fontFamily: 'var(--font-mono)',
          letterSpacing: 0.5,
          textTransform: 'uppercase'
        }}>
          AL CONTINUAR, ACEPTAS NUESTROS<br />TÉRMINOS Y POLÍTICA DE PRIVACIDAD.
        </p>
      </div>

      <style>{`
        .auth-glass-card {
          position: relative;
          z-index: 5;
          width: 100%;
          max-width: 460px;
          background: rgba(13, 18, 30, 0.65);
          border: 1px solid rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(24px) saturate(140%);
          -webkit-backdrop-filter: blur(24px) saturate(140%);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
          animation: bi-fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .auth-btn-google {
          width: 100%;
          display: flex;
          align-items: center;
          background-color: #FFFFFF;
          border: none;
          border-radius: 12px;
          padding: 14px 20px;
          font-family: var(--font-sans);
          font-size: 1.05rem;
          font-weight: 600;
          color: var(--navy-800);
          cursor: pointer;
          transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.2s ease;
          box-shadow: 0 4px 14px rgba(0,0,0,0.15);
        }

        .auth-btn-google:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        }

        .auth-btn-google:active {
          transform: translateY(0);
        }

        @keyframes bi-fade-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 480px) {
          .auth-glass-card {
            padding: 40px 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default Auth;
