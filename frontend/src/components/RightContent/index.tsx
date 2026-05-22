import React, { useEffect, useState } from 'react';
import { Button, Tooltip } from 'antd';
import { BgColorsOutlined, BulbOutlined, LoginOutlined, UserAddOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import AvatarDropdown from './AvatarDropdown';
import styles from './index.less';

export type SiderTheme = 'light' | 'dark';

const DARK_MODE_KEY = 'forum-dark-mode';

const GlobalHeaderRight: React.FC = () => {
  const { initialState } = useModel('@@initialState');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(DARK_MODE_KEY) === 'true';
    setDarkMode(stored);
    document.body.classList.toggle('dark-theme', stored);
  }, []);

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem(DARK_MODE_KEY, String(next));
    document.body.classList.toggle('dark-theme', next);
  };

  return (
    <div className={styles.right}>
      <Tooltip title={darkMode ? 'Chế độ sáng' : 'Chế độ tối'}>
        <Button
          type="text"
          shape="circle"
          icon={darkMode ? <BulbOutlined /> : <BgColorsOutlined />}
          onClick={toggleTheme}
        />
      </Tooltip>

      {!initialState?.currentUser && (
        <>
          <Button
            type="link"
            icon={<LoginOutlined />}
            onClick={() => history.push('/user/login')}
          >
            Đăng nhập
          </Button>

          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => history.push('/user/register')}
          >
            Đăng ký
          </Button>
        </>
      )}

      {initialState?.currentUser && <AvatarDropdown menu />}
    </div>
  );
};

export default GlobalHeaderRight;