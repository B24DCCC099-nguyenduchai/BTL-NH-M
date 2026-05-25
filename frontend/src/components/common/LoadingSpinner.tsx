import React from 'react';

interface Props {
  text?: string;
}

const LoadingSpinner: React.FC<Props> = ({ text = 'Đang tải...' }) => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      padding: '60px 24px',
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        border: '3px solid var(--border)',
        borderTopColor: 'var(--pri)',
        borderRadius: '50%',
        animation: 'spin .7s linear infinite',
      }}
    />
    <span style={{ fontSize: 14, color: 'var(--muted)' }}>{text}</span>
  </div>
);

export default LoadingSpinner;
