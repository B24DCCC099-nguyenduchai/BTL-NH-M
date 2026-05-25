import React from 'react';
import type { Tag } from '../../types';

interface Props {
  tag: Partial<Tag>;
  active?: boolean;
  onClick?: () => void;
  style?: React.CSSProperties;
}

const TagBadge: React.FC<Props> = ({ tag, active, onClick, style }) => {
  const color = tag.color ?? '#4f8cff';
  return (
    <span
      onClick={onClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 12,
        fontWeight: 500,
        cursor: onClick ? 'pointer' : 'default',
        background: active ? color : color + '20',
        color: active ? '#fff' : color,
        border: `1px solid ${color}40`,
        transition: 'all .15s',
        margin: '2px',
        ...style,
      }}
    >
      {tag.name}
    </span>
  );
};

export default TagBadge;
