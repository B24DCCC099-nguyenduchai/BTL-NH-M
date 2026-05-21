import React from 'react';
import { Tag } from 'antd';

interface TagBadgeProps {
  label: string;
  color?: string;
}

const TagBadge: React.FC<TagBadgeProps> = ({ label, color = '#7B61FF' }) => (
  <Tag color={color} style={{ borderRadius: 16, padding: '0 12px', fontWeight: 500 }}>
    {label}
  </Tag>
);

export default TagBadge;
