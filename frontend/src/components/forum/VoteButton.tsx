import React from 'react';

interface Props {
  votes: number;
  userVote: 'up' | 'down' | null;
  onVote: (direction: 'up' | 'down') => void;
  disabled?: boolean;
}

const VoteButton: React.FC<Props> = ({ votes, userVote, onVote, disabled }) => {
  const btnStyle = (direction: 'up' | 'down'): React.CSSProperties => ({
    width: 38,
    height: 38,
    borderRadius: '50%',
    border: `1.5px solid ${
      userVote === direction ? (direction === 'up' ? 'var(--success)' : 'var(--danger)') : 'var(--border)'
    }`,
    background:
      userVote === direction
        ? direction === 'up'
          ? 'rgba(34,197,94,.1)'
          : 'rgba(239,68,68,.1)'
        : 'transparent',
    color:
      userVote === direction
        ? direction === 'up'
          ? 'var(--success)'
          : 'var(--danger)'
        : 'var(--muted)',
    cursor: disabled ? 'not-allowed' : 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 16,
    fontWeight: 700,
    transition: 'all .15s',
    opacity: disabled ? 0.6 : 1,
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
      <button style={btnStyle('up')} onClick={() => !disabled && onVote('up')}>▲</button>
      <span
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 800,
          fontSize: 20,
          color: userVote === 'up' ? 'var(--success)' : userVote === 'down' ? 'var(--danger)' : 'var(--text)',
          lineHeight: 1,
          minWidth: 32,
          textAlign: 'center',
        }}
      >
        {votes}
      </span>
      <button style={btnStyle('down')} onClick={() => !disabled && onVote('down')}>▼</button>
    </div>
  );
};

export default VoteButton;
