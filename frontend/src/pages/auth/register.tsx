import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Form, Input, Button, Typography, Alert, Space } from 'antd';

const { Title, Paragraph, Text } = Typography;

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [role, setRole] = useState<'student' | 'lecturer'>('student');

  const onFinish = async (values: { name: string; email: string; password: string; confirm: string }) => {
    if (values.password !== values.confirm) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }
    if (values.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await register({ name: values.name, email: values.email, password: values.password, role });
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card glass-card auth-card-lg">
        <div className="auth-header">
          <Title level={3} className="auth-title">Tạo tài khoản</Title>
          <Paragraph type="secondary">Tham gia cộng đồng để đặt câu hỏi và nhận giải đáp nhanh chóng.</Paragraph>
        </div>

        <Space wrap className="role-selector">
          <button type="button" onClick={() => setRole('student')} className={role === 'student' ? 'role-btn active' : 'role-btn'}>
            <div className="role-emoji">🎓</div>
            <div className="role-title">Sinh viên</div>
            <Text type="secondary">Đặt câu hỏi, chia sẻ tài liệu.</Text>
          </button>
          <button type="button" onClick={() => setRole('lecturer')} className={role === 'lecturer' ? 'role-btn active' : 'role-btn'}>
            <div className="role-emoji">👨‍🏫</div>
            <div className="role-title">Giảng viên</div>
            <Text type="secondary">Cập nhật và giải đáp cho sinh viên.</Text>
          </button>
        </Space>

        {error && <Alert type="error" message={error} className="auth-alert" />}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item label="Vai trò">
            <Text>{role === 'student' ? 'Sinh viên' : 'Giảng viên'}</Text>
          </Form.Item>

          <Form.Item name="name" label="Tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập tên đăng nhập' }]}>
            <Input placeholder="vd. nguyen.van.a" size="large" className="auth-input" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true, type: 'email', message: 'Vui lòng nhập email hợp lệ' }]}>
            <Input placeholder="email@student.edu.vn" size="large" className="auth-input" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password placeholder="Tối thiểu 6 ký tự" size="large" className="auth-input" />
          </Form.Item>

          <Form.Item name="confirm" label="Xác nhận mật khẩu" rules={[{ required: true, message: 'Vui lòng xác nhận mật khẩu' }]}>
            <Input.Password placeholder="Nhập lại mật khẩu" size="large" className="auth-input" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading} className="auth-submit">
              Tạo tài khoản
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-footer">
          Đã có tài khoản?{' '}
          <span onClick={() => { window.location.href = '/auth/login'; }} className="auth-link">Đăng nhập</span>
        </div>
      </Card>
    </div>
  );
};

export default RegisterPage;
