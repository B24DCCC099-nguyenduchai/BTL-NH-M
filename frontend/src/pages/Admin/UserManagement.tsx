import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { Button, Card, Form, Input, message, Modal, Radio, Space, Table, Tag, Typography } from 'antd';
import GlassCard from '@/components/Common/GlassCard';
import { createUser, getUsers, resetUserPassword, updateUser } from '@/services/adminApi';

const { Title } = Typography;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getUsers();
      setUsers(response.data || []);
    } catch (error) {
      message.error('Không tải được danh sách người dùng.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const role = (initialState as any)?.currentUser?.role;
    if (role !== 'admin') {
      history.push('/403');
    }
  }, [initialState]);

  const openModal = (user?: any) => {
    setSelectedUser(user || null);
    form.resetFields();
    if (user) {
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department,
        faculty: user.faculty,
        class: user.class,
        status: user.status,
      });
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedUser(null);
    form.resetFields();
  };

  const handleSaveUser = async (values: any) => {
    setSaving(true);
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, values);
        message.success('Cập nhật người dùng thành công.');
      } else {
        await createUser(values);
        message.success('Tạo người dùng mới thành công.');
      }
      closeModal();
      fetchUsers();
    } catch (error) {
      message.error('Lưu thông tin người dùng không thành công.');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleLock = async (record: any) => {
    try {
      await updateUser(record.id, { status: record.status === 'locked' ? 'active' : 'locked' });
      message.success(record.status === 'locked' ? 'Mở khóa người dùng thành công.' : 'Đã khóa người dùng.');
      fetchUsers();
    } catch (error) {
      message.error('Thao tác không thành công.');
    }
  };

  const handleResetPassword = async (id: string) => {
    try {
      const response = await resetUserPassword(id);
      message.success(`Reset mật khẩu thành công: ${response.data.newPassword}`);
    } catch (error) {
      message.error('Reset mật khẩu không thành công.');
    }
  };

  const columns = [
    { title: 'Họ và tên', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    {
      title: 'Vai trò', dataIndex: 'role', key: 'role', render: (role: string) => (
        <Tag color={role === 'admin' ? 'gold' : role === 'lecturer' ? 'purple' : 'blue'}>{role}</Tag>
      ),
    },
    {
      title: 'Trạng thái', dataIndex: 'status', key: 'status', render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>{status === 'active' ? 'Hoạt động' : 'Bị khóa'}</Tag>
      ),
    },
    {
      title: 'Hành động', key: 'actions', render: (_: any, record: any) => (
        <Space align="center">
          <Button type="link" onClick={() => openModal(record)}>Sửa</Button>
          <Button type="link" onClick={() => handleToggleLock(record)}>
            {record.status === 'locked' ? 'Mở khóa' : 'Khóa'}
          </Button>
          <Button type="link" onClick={() => handleResetPassword(record.id)}>Reset mật khẩu</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-user-management-page">
      <GlassCard className="page-title-card">
        <Title level={2}>Quản lý người dùng</Title>
        <p>Thêm, sửa, khóa hoặc reset mật khẩu người dùng ngay trong dashboard.</p>
        <Button type="primary" onClick={() => openModal()}>Thêm người dùng</Button>
      </GlassCard>
      <Card bordered={false} className="table-card">
        <Table columns={columns} dataSource={users} loading={loading} rowKey="id" pagination={{ pageSize: 6 }} />
      </Card>

      <Modal
        title={selectedUser ? 'Chỉnh sửa người dùng' : 'Tạo người dùng mới'}
        visible={modalVisible}
        onCancel={closeModal}
        onOk={() => form.submit()}
        confirmLoading={saving}
      >
        <Form form={form} layout="vertical" onFinish={handleSaveUser}>
          <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}> 
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}> 
            <Input />
          </Form.Item>
          {!selectedUser && (
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}> 
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item name="role" label="Vai trò" rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}> 
            <Radio.Group>
              <Radio value="student">Sinh viên</Radio>
              <Radio value="lecturer">Giảng viên</Radio>
              <Radio value="admin">Quản trị viên</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}> 
            <Radio.Group>
              <Radio value="active">Hoạt động</Radio>
              <Radio value="locked">Bị khóa</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item name="department" label="Khoa / Bộ môn">
            <Input />
          </Form.Item>
          <Form.Item name="faculty" label="Ngành">
            <Input />
          </Form.Item>
          <Form.Item name="class" label="Lớp">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
