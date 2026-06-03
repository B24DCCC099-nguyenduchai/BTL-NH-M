import React from 'react';

interface Tag {
  id: string | number;
  name: string;
  color?: string;
}

interface TagBadgeProps {
  tag: Tag;
  onClick?: () => void;
  active?: boolean;
}

export const TagBadge: React.FC<TagBadgeProps> = ({ tag, onClick, active = false }) => {
  const color = tag.color || '#4F8CFF';
  
  return (
    <span
      className="tag"
      style={{
        background: active ? color : `${color}20`,
        color: active ? '#fff' : color,
        border: `1px solid ${color}40`,
      }}
      onClick={onClick}
    >
      {tag.name}
    </span>
  );
};
