import React, { useEffect, useState } from 'react';

import {
  Button,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';

import GlassCard from '@/components/Common/GlassCard';

import {
  deleteUser,
  getUsers,
  lockUser,
  resetUserPassword,
} from '@/services/adminApi';

const { Title } = Typography;

const AdminUsers: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);

  const fetchUsers = async () => {
    try {
      const res = await getUsers();

      setUsers(res.data || []);
    } catch (error) {
      message.error('Không tải được danh sách user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteUser(id);

      message.success('Đã xóa user');

      fetchUsers();
    } catch (error) {
      message.error('Không thể xóa');
    }
  };

  const handleLock = async (id: string) => {
    try {
      await lockUser(id);

      message.success('Đã khóa tài khoản');

      fetchUsers();
    } catch (error) {
      message.error('Không thể khóa');
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      await resetUserPassword(id);

      message.success('Đã cấp lại mật khẩu');
    } catch (error) {
      message.error('Không thể reset password');
    }
  };

  const columns = [
    {
      title: 'Họ tên',
      dataIndex: 'name',
    },

    {
      title: 'Email',
      dataIndex: 'email',
    },

    {
      title: 'Vai trò',
      dataIndex: 'role',
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role}
        </Tag>
      ),
    },

    {
      title: 'Trạng thái',
      dataIndex: 'locked',
      render: (locked: boolean) =>
        locked ? (
          <Tag color="red">Đã khóa</Tag>
        ) : (
          <Tag color="green">Hoạt động</Tag>
        ),
    },

    {
      title: 'Thao tác',

      render: (_: any, record: any) => (
        <Space>
          <Button onClick={() => handleLock(record.id)}>
            Khóa
          </Button>

          <Button onClick={() => handleResetPassword(record.id)}>
            Reset password
          </Button>

          <Popconfirm
            title="Xóa user?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-user-management-page">
      <GlassCard className="table-card">
        <Title level={3}>Quản lý người dùng</Title>

        <Table
          rowKey="id"
          columns={columns}
          dataSource={users}
        />
      </GlassCard>
    </div>
  );
};

export default AdminUsers;