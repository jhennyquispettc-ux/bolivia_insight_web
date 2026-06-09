import React, { useEffect, useRef, useState } from 'react';

const API = 'http://localhost:3000';

// Load the PayPal JS SDK exactly once per clientId. Returns a promise that
// resolves when window.paypal is ready.
let sdkPromise = null;
function loadPayPalSdk(clientId, currency) {
  if (typeof window !== 'undefined' && window.paypal) return Promise.resolve();
  if (sdkPromise) return sdkPromise;

  sdkPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src =
      `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}` +
      `&currency=${encodeURIComponent(currency)}&intent=capture`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      sdkPromise = null;
      reject(new Error('No se pudo cargar el SDK de PayPal'));
    };
    document.body.appendChild(script);
  });
  return sdkPromise;
}

/**
 * Renders the PayPal smart buttons. The amount is decided by the backend from
 * `durationMin`; this component only carries the booking details so the server
 * can create the booking after a verified capture.
 *
 * Props:
 *  - durationMin: 15 | 30
 *  - slot: { dateISO, time }
 *  - brief: { dates, route, questions, location }
 *  - onPaid(booking): called after a successful capture + booking creation
 *  - onError(message): optional
 */
function PayPalButton({ durationMin, slot, brief, onPaid, onError }) {
  const containerRef = useRef(null);
  const [status, setStatus] = useState('loading'); // loading | ready | not-configured | error
  const [message, setMessage] = useState('');

  // Keep the latest props in a ref so the SDK callbacks (created once) always
  // read fresh values without re-rendering the buttons.
  const dataRef = useRef({ durationMin, slot, brief });
  dataRef.current = { durationMin, slot, brief };

  useEffect(() => {
    let cancelled = false;
    let buttons = null;

    (async () => {
      try {
        const res = await fetch(`${API}/payments/config`);
        if (!res.ok) throw new Error('No se pudo leer la configuración de pago');
        const cfg = await res.json();

        if (!cfg.configured || !cfg.clientId) {
          if (!cancelled) setStatus('not-configured');
          return;
        }

        await loadPayPalSdk(cfg.clientId, cfg.currency || 'USD');
        if (cancelled || !containerRef.current) return;

        buttons = window.paypal.Buttons({
          style: { layout: 'vertical', shape: 'pill', label: 'pay' },

          // Ask our backend to create the order (amount computed server-side).
          createOrder: async () => {
            // Read the token fresh each click — the user may have logged in after mount.
            const token = localStorage.getItem('bolivia_insight_token');
            if (!token) {
              const msg = 'Debes iniciar sesión con Google antes de pagar y agendar.';
              setMessage(msg);
              onError?.(msg);
              throw new Error(msg);
            }

            const r = await fetch(`${API}/payments/orders`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ durationMin: dataRef.current.durationMin }),
            });
            if (r.status === 401) {
              const msg = 'Tu sesión expiró o no has iniciado sesión. Cierra sesión y vuelve a entrar.';
              setMessage(msg);
              onError?.(msg);
              throw new Error(msg);
            }
            if (!r.ok) {
              const msg = 'No se pudo crear la orden de pago.';
              setMessage(msg);
              throw new Error(msg);
            }
            const data = await r.json();
            return data.orderId;
          },

          // Capture on our backend, which also creates the booking.
          onApprove: async (data) => {
            const token = localStorage.getItem('bolivia_insight_token');
            const { slot, brief, durationMin } = dataRef.current;
            const googleAccessToken =
              localStorage.getItem('google_access_token') || 'placeholder';

            const r = await fetch(
              `${API}/payments/orders/${data.orderID}/capture`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                  date: slot.dateISO,
                  timeSlot: slot.time,
                  durationMin,
                  briefDates: brief.dates,
                  briefRoute: brief.route,
                  briefQuestions: brief.questions,
                  briefLocation: brief.location,
                  googleAccessToken,
                }),
              },
            );

            if (!r.ok) {
              let msg = 'No se pudo confirmar la reserva tras el pago.';
              try {
                const err = await r.json();
                if (err?.message) msg = Array.isArray(err.message) ? err.message.join(', ') : err.message;
              } catch {}
              setMessage(msg);
              onError?.(msg);
              return;
            }

            const result = await r.json();
            onPaid?.(result.booking);
          },

          onCancel: () => {
            setMessage('Pago cancelado. Puedes intentarlo de nuevo cuando quieras.');
          },

          onError: (err) => {
            console.error('PayPal error:', err);
            const msg = 'Ocurrió un problema con PayPal. Intenta nuevamente.';
            setMessage(msg);
            onError?.(msg);
          },
        });

        await buttons.render(containerRef.current);
        if (!cancelled) setStatus('ready');
      } catch (e) {
        console.error(e);
        if (!cancelled) {
          setStatus('error');
          setMessage(e.message || 'Error al inicializar el pago');
        }
      }
    })();

    return () => {
      cancelled = true;
      try { buttons?.close?.(); } catch {}
    };
    // Render buttons once on mount; live values are read from dataRef.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {status === 'loading' && (
        <div style={{ fontSize: 13, color: 'var(--fg3)', padding: '12px 0' }}>
          Cargando opciones de pago…
        </div>
      )}

      {status === 'not-configured' && (
        <div style={{
          background: 'var(--amber-50, #fff8e7)', border: '1px solid var(--amber-200, #ffe7a8)',
          borderRadius: 12, padding: '14px 18px', fontSize: 13, color: 'var(--fg2)', lineHeight: 1.55,
        }}>
          <strong style={{ color: 'var(--fg1)' }}>Pago no configurado.</strong> Falta
          definir <code>PAYPAL_CLIENT_ID</code> y <code>PAYPAL_SECRET</code> en
          el archivo <code>backend/.env</code> (cuenta Sandbox de PayPal).
        </div>
      )}

      <div ref={containerRef} style={{ display: status === 'ready' ? 'block' : 'none' }} />

      {message && (
        <div style={{
          marginTop: 12, background: 'var(--rust-50)', color: 'var(--rust-700)',
          border: '1px solid var(--rust-200)', borderRadius: 10, padding: '10px 14px', fontSize: 13,
        }}>
          {message}
        </div>
      )}
    </div>
  );
}

export default PayPalButton;
