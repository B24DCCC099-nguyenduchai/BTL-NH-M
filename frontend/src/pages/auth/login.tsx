import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { Card, Form, Input, Button, Typography, Alert } from 'antd';

const { Title, Paragraph } = Typography;

const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      await login(values);
    } catch (e) {
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Email hoặc mật khẩu không chính xác');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <Card className="auth-card glass-card">
        <div className="auth-header">
          <Title level={3} className="auth-title">📚 Diễn đàn SV</Title>
          <Paragraph type="secondary">Đăng nhập để kết nối, học hỏi và chia sẻ nhanh chóng.</Paragraph>
        </div>

        {error && <Alert type="error" message={error} className="auth-alert" />}

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item name="email" label="Email hoặc tên đăng nhập" rules={[{ required: true, message: 'Vui lòng nhập email hoặc tên đăng nhập' }]}>
            <Input placeholder="email@student.edu.vn" size="large" className="auth-input" />
          </Form.Item>

          <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}>
            <Input.Password placeholder="••••••••" size="large" className="auth-input" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block size="large" loading={loading} className="auth-submit">
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-divider">hoặc</div>

        <div className="auth-footer">
          Chưa có tài khoản?{' '}
          <span onClick={() => { window.location.href = '/auth/register'; }} className="auth-link">Đăng ký ngay</span>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
