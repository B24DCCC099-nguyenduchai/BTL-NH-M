import React, { useEffect, useState } from 'react';
import { useHistory } from 'umi';
import Navbar from './components/layout/Navbar';
import ToastContainer from './components/common/ToastContainer';
import { useAuth } from './hooks/useAuth';
import { useDarkMode } from './hooks/useDarkMode';
import './styles/global.less';

export default function App() {
  const { user, logout, updateUser } = useAuth();
  const { dark, toggle: toggleDark } = useDarkMode();
  const history = useHistory();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    setInitialized(true);
  }, []);

  if (!initialized) return <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 14 }}>📚</div>
      <div style={{ fontSize: 16, fontWeight: 600 }}>Diễn đàn Hỏi Đáp Sinh viên</div>
    </div>
  </div>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar user={user} dark={dark} onToggleDark={toggleDark} onLogout={logout} />
      <ToastContainer />
    </div>
  );
}
