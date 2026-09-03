import React from 'react';

function Btn({ kind = 'primary', size = 'md', children, onClick, style = {}, iconR, ...rest }) {
  const k = {
    primary: { background: 'var(--rust-500)', color: '#fff', boxShadow: '0 6px 16px -6px rgba(179,63,46,0.5)' },
    navy:    { background: 'var(--navy-600)', color: '#fff', boxShadow: 'var(--shadow-sm)' },
    amber:   { background: 'var(--amber-500)', color: 'var(--navy-700)', boxShadow: '0 6px 16px -6px rgba(255,183,3,0.5)' },
    ghost:   { background: 'transparent', color: 'var(--fg1)', border: '1px solid var(--border-strong)' },
    inverse: { background: 'rgba(255,255,255,0.95)', color: 'var(--navy-700)', backdropFilter: 'blur(10px)' },
    glass:   { background: 'rgba(255,255,255,0.16)', color: '#fff', border: '1px solid rgba(255,255,255,0.28)', backdropFilter: 'blur(10px)' },
  }[kind];
  const s = {
    // minHeight keeps every button a valid touch target (44px) without
    // changing how the small variant reads.
    sm: { padding: '8px 14px', fontSize: 13, minHeight: 44 },
    md: { padding: '12px 22px', fontSize: 14, minHeight: 44 },
    lg: { padding: '15px 28px', fontSize: 15 },
  }[size];
  return <button onClick={onClick} className="bi-btn" style={{
    display: 'inline-flex', alignItems: 'center', gap: 8,
    borderRadius: 10, border: 0, cursor: 'pointer',
    fontFamily: 'var(--font-sans)', fontWeight: 700,
    transition: 'all 180ms var(--ease-out)',
    ...k, ...s, ...style,
  }} {...rest}>{children}{iconR}</button>;
}

export default Btn;
