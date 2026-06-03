import React from 'react';
import { getAvatarColor } from '@/utils/forum';

interface AvatarProps {
  username?: string;
  avatar?: string | null;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Avatar: React.FC<AvatarProps> = ({ username = '?', avatar, size = 'md' }) => {
  const initial = username?.[0]?.toUpperCase() || '?';
  const bg = getAvatarColor(username);
  
  const sizeClass = {
    sm: 'avatar',
    md: 'avatar',
    lg: 'avatar-lg',
    xl: 'avatar-xl',
  }[size];

  return (
    <div 
      className={sizeClass}
      style={{ background: `linear-gradient(135deg, ${bg}, ${bg}bb)` }}
    >
      {avatar ? (
        <img 
          src={avatar} 
          alt={username}
          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
        />
      ) : (
        initial
      )}
    </div>
  );
};
