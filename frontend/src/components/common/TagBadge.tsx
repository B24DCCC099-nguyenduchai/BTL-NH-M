import React from 'react';
import { Tag } from 'antd';
import type { Tag as TagModel } from '../../types';

interface TagBadgeProps {
  tag?: TagModel;
  label?: string;
  active?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  style?: React.CSSProperties;
  className?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({ tag, label, active, onClick, style, className }) => {
  const content = tag?.name ?? label ?? '';
  const background = active ? '#eef2ff' : '#f7f8fc';
  const borderColor = active ? '#c7d2fe' : '#e5e7eb';

  return (
    <Tag
      color={background}
      style={{
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 16,
        padding: '0 12px',
        fontWeight: 500,
        color: '#1f2937',
        border: `1px solid ${borderColor}`,
        opacity: 1,
        transition: 'all .2s',
        ...style,
      }}
      onClick={onClick}
      className={className}
    >
      {content}
    </Tag>
  );
};

export default TagBadge;
