import React from 'react';
import './index.less';

interface Props {
  children: React.ReactNode;
}

const AdminLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="admin-layout">
      {children}
    </div>
  );
};

export default AdminLayout;
