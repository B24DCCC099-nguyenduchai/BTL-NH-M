import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Row, Col, Typography, message } from 'antd';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { resetPassword } from '@/services/authApi';
import { getStoredUser, getHomePathByRole, isLoggedIn } from '@/utils/auth';
import './styles.less';

const { Title, Text } = Typography;

const ResetPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      const user = getStoredUser();
      history.replace(getHomePathByRole(user?.role));
    }
  }, []);

  const onFinish = async (values: { email: string; newPassword: string }) => {
    setLoading(true);
    try {
      await resetPassword({
        email: values.email,
        newPassword: values.newPassword,
      });
      message.success('Đặt lại mật khẩu thành công.');
      history.replace('/user/login');
    } catch (error: any) {
      message.error(error?.message || 'Không đặt lại được mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className="auth-page login-page">
      <Col xs={22} sm={18} md={12} lg={10} xl={8}>
        <Card className="auth-card glass-card" bordered={false}>
          <div className="auth-header">
            <Title level={2}>Đặt lại mật khẩu</Title>
            <Text type="secondary">Nhập email và mật khẩu mới</Text>
          </div>

          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: 'Vui lòng nhập email' },
                { type: 'email', message: 'Email không hợp lệ' },
              ]}
            >
              <Input prefix={<MailOutlined />} placeholder="email@domain.com" />
            </Form.Item>

            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu mới' }]}
            >
              <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu mới" />
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Cập nhật mật khẩu
              </Button>
            </Form.Item>

            <Form.Item>
              <Text>
                <a href="/user/login">Quay lại đăng nhập</a>
              </Text>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default ResetPassword;