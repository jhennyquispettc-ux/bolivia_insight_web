import React from 'react';

function StatusDot({ ok = true }) {
  return <span style={{
    display: 'inline-block', width: 8, height: 8, borderRadius: 999,
    background: ok ? 'var(--green-500)' : 'var(--rust-500)',
    boxShadow: `0 0 0 4px ${ok ? 'rgba(45,106,79,0.18)' : 'rgba(179,63,46,0.18)'}`,
    animation: 'bi-pulse 2s ease-in-out infinite',
  }}/>;
}

export default StatusDot;
