import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Row, Col, Typography, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { login } from '@/services/authApi';
import { getHomePathByRole, getStoredUser, saveAuth, isLoggedIn } from '@/utils/auth';
import './styles.less';

const { Title, Text } = Typography;

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      const user = getStoredUser();
      history.replace(getHomePathByRole(user?.role));
    }
  }, []);

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    try {
      const response = await login(values);
      const { token, user } = response.data || {};

      if (!token || !user) {
        throw new Error('Phản hồi đăng nhập không hợp lệ.');
      }

      saveAuth(token, user);

      message.success(
        `Đăng nhập thành công với vai trò ${user.role === 'student'
          ? 'Sinh viên'
          : user.role === 'lecturer'
            ? 'Giảng viên'
            : 'Quản trị viên'
        }`,
      );

      history.replace(getHomePathByRole(user.role));
    } catch (error: any) {
      message.error(error?.message || 'Đăng nhập thất bại. Vui lòng kiểm tra thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className="auth-page login-page">
      <Col xs={22} sm={18} md={12} lg={10} xl={8}>
        <Card className="auth-card glass-card" bordered={false}>
          <div className="auth-header">
            <Title level={2}>Diễn đàn hỏi đáp</Title>
            <Text type="secondary">Đăng nhập để tham gia thảo luận học thuật</Text>
          </div>

          <Form name="login_form" layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: 'Vui lòng nhập email' }]}
            >
              <Input prefix={<UserOutlined />} placeholder="email@domain.com" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Đăng nhập
              </Button>
            </Form.Item>

            <Form.Item>
              <Text>
                Chưa có tài khoản? <a href="/user/register">Đăng ký ngay</a>
              </Text>
            </Form.Item>

            <Form.Item>
              <Text>
                Quên mật khẩu? <a href="/user/forgot-password">Khôi phục mật khẩu</a>
              </Text>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;