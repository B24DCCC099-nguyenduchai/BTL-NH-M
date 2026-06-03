import React from 'react';
import Navbar from '@/components/layout/Navbar';
import ToastContainer from '@/components/common/ToastContainer';
import { useAuth } from '@/hooks/useAuth';
import { useDarkMode } from '@/hooks/useDarkMode';
import 'antd/dist/reset.css';
import '@/styles/global.less';

export default ({ children }: { children?: React.ReactNode }) => {
  const { user, logout } = useAuth();
  const { dark, toggle } = useDarkMode();

  return (
    <>
      <Navbar
        user={user}
        dark={dark}
        onToggleDark={toggle}
        onLogout={logout}
      />
      <main>{children}</main>
      <ToastContainer />
    </>
  );
};
