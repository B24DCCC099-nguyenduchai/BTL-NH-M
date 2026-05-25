import React from 'react';
import { roleLabel, roleColor } from '../../utils/helpers';
import type { UserRole } from '../../types';

interface Props {
  role: UserRole;
}

const RoleBadge: React.FC<Props> = ({ role }) => (
  <span
    style={{
      fontSize: 11,
      fontWeight: 600,
      padding: '2px 8px',
      borderRadius: 10,
      background: roleColor[role] + '18',
      color: roleColor[role],
    }}
  >
    {roleLabel[role]}
  </span>
);

export default RoleBadge;
