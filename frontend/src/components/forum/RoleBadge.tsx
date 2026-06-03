import React from 'react';
import { roleLabel, roleColor } from '@/utils/forum';

interface RoleBadgeProps {
  role: 'student' | 'lecturer' | 'admin';
}

export const RoleBadge: React.FC<RoleBadgeProps> = ({ role }) => {
  return (
    <span 
      style={{ 
        fontSize: 11, 
        fontWeight: 600, 
        padding: '2px 8px', 
        borderRadius: 10, 
        background: `${roleColor[role]}18`, 
        color: roleColor[role]
      }}
    >
      {roleLabel[role]}
    </span>
  );
};
