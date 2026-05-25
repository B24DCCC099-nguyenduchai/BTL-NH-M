import React from 'react';
import './index.less';

interface Props {
  children: React.ReactNode;
}

const AuthLayout: React.FC<Props> = ({ children }) => {
  return (
    <div className="auth-layout">
      <div className="auth-layout-container">
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
