import React from 'react';
import { getInitial, getAvatarBg } from '../../utils/helpers';
import type { User, PostAuthor } from '../../types';

interface Props {
  user: Partial<User & PostAuthor> | null | undefined;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: React.CSSProperties;
}

const sizes = { sm: 28, md: 36, lg: 56, xl: 96 };
const fontSizes = { sm: 12, md: 14, lg: 22, xl: 36 };

const UserAvatar: React.FC<Props> = ({ user, size = 'md', style }) => {
  const px = sizes[size];
  const fs = fontSizes[size];
  const bg = getAvatarBg(user?.username ?? '');

  return (
    <div
      style={{
        width: px,
        height: px,
        borderRadius: '50%',
        background: user?.avatar ? 'transparent' : `linear-gradient(135deg, ${bg}, ${bg}bb)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: fs,
        fontWeight: 700,
        color: '#fff',
        overflow: 'hidden',
        ...style,
      }}
    >
      {user?.avatar ? (
        <img src={user.avatar} alt={user.username} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      ) : (
        getInitial(user?.username ?? '?')
      )}
    </div>
  );
};

export default UserAvatar;
