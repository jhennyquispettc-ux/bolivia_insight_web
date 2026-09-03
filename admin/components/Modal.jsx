'use client';
import React from 'react';

export default function Modal({ isOpen, onClose, title, message, type = 'info', primaryAction, secondaryAction }) {
  if (!isOpen) return null;

  const colors = {
    info: 'var(--navy-500, #283b58)',
    warning: 'var(--amber-500, #ffb703)',
    error: 'var(--rust-500, #b33f2e)'
  };
  
  const bgColors = {
    info: 'var(--navy-50, #ecf0f5)',
    warning: 'var(--amber-50, #fff8e1)',
    error: 'var(--rust-50, #fbf0ed)'
  };

  const Icons = {
    info: '✨',
    warning: '⚠️',
    error: '🛡️'
  };

  const Icon = Icons[type] || '✨';

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(8px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
      padding: 20
    }}>
      <div style={{
        background: '#fff', borderRadius: 16, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        width: '100%', maxWidth: 420, overflow: 'hidden',
        animation: 'slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        border: '1px solid var(--border, #e2e8f0)'
      }}>
        <div style={{ padding: '24px 24px 0', display: 'flex', gap: 16 }}>
          <div style={{
            width: 48, height: 48, borderRadius: 12, background: bgColors[type], color: colors[type],
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 24
          }}>
            {Icon}
          </div>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: 'var(--fg1, #0f172a)', margin: '0 0 8px' }}>
              {title}
            </h3>
            <p style={{ fontSize: 14, color: 'var(--fg2, #334155)', lineHeight: 1.5, margin: 0 }}>
              {message}
            </p>
          </div>
        </div>
        
        <div style={{
          padding: '24px', display: 'flex', gap: 12, justifyContent: 'flex-end',
          marginTop: 8
        }}>
          {secondaryAction && (
            <button onClick={secondaryAction.onClick} style={{
              padding: '10px 16px', borderRadius: 8, border: '1px solid var(--border, #e2e8f0)',
              background: '#fff', color: 'var(--fg1, #0f172a)', fontSize: 14, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'inherit'
            }}>
              {secondaryAction.label}
            </button>
          )}
          <button onClick={primaryAction ? primaryAction.onClick : onClose} style={{
            padding: '10px 18px', borderRadius: 8, border: 'none',
            background: colors[type], color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer',
            fontFamily: 'inherit'
          }}>
            {primaryAction ? primaryAction.label : 'Entendido'}
          </button>
        </div>
      </div>
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
