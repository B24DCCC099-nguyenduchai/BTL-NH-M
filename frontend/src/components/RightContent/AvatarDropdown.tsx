import { logout } from '@/services/authApi';
import { Avatar, Dropdown, Modal, Space, Spin, Typography, message } from 'antd';
import type { MenuProps } from 'antd';
import {
  BellOutlined,
  LogoutOutlined,
  UserOutlined,
  DashboardOutlined,
} from '@ant-design/icons';
import React from 'react';
import { history, useModel } from 'umi';
import styles from './index.less';

export type GlobalHeaderRightProps = {
  menu?: boolean;
};

const { Text } = Typography;

const AvatarDropdown: React.FC<GlobalHeaderRightProps> = () => {
  const { initialState, setInitialState } = useModel('@@initialState');

  const loginOut = () => {
    Modal.confirm({
      title: 'Đăng xuất',
      content: 'Bạn có chắc muốn đăng xuất khỏi hệ thống không?',
      okText: 'Đăng xuất',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          await logout();
        } catch (error) {
          // Backend logout có thể chỉ là stub, vẫn cho logout phía client
        } finally {
          localStorage.removeItem('token');
          localStorage.removeItem('user');

          await setInitialState((s: any) => ({
            ...s,
            currentUser: null,
          }));

          message.success('Đăng xuất thành công');
          history.push('/user/login');
        }
      },
    });
  };

  if (!initialState || !initialState.currentUser) {
    return (
      <span className={`${styles.action} ${styles.account}`}>
        <Spin size="small" style={{ marginLeft: 8, marginRight: 8 }} />
      </span>
    );
  }

  const fullName =
    initialState.currentUser?.family_name
      ? `${initialState.currentUser.family_name} ${initialState.currentUser?.given_name ?? ''}`
      : initialState.currentUser?.name ??
        initialState.currentUser?.preferred_username ??
        initialState.currentUser?.email ??
        '';

  const lastNameChar = fullName.split(' ')?.at(-1)?.[0]?.toUpperCase();

  const items: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Trang cá nhân',
      onClick: () => history.push('/profile'),
    },
    {
      key: 'notifications',
      icon: <BellOutlined />,
      label: 'Thông báo',
      onClick: () => history.push('/notifications'),
    },
    {
      key: 'admin',
      icon: <DashboardOutlined />,
      label: 'Quản trị',
      onClick: () => history.push('/admin/dashboard'),
      disabled: initialState.currentUser?.role !== 'admin',
    },
    {
      type: 'divider',
      key: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: loginOut,
      danger: true,
    },
  ];

  return (
    <Dropdown menu={{ items }} placement="bottomRight" trigger={['click']}>
      <span className={`${styles.action} ${styles.account}`}>
        <Avatar
          className={styles.avatar}
          src={initialState.currentUser?.avatar || initialState.currentUser?.picture}
          icon={!initialState.currentUser?.avatar && !initialState.currentUser?.picture ? lastNameChar ?? <UserOutlined /> : undefined}
          alt="avatar"
        />
        <span className={styles.name}>
          <Text strong style={{ fontSize: 13 }}>
            {fullName}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {initialState.currentUser?.role || 'guest'}
          </Text>
        </span>
      </span>
    </Dropdown>
  );
};

export default AvatarDropdown;