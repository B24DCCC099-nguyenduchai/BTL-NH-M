import React, { useEffect, useState } from 'react';
import { Button, Card, Form, Input, Row, Col, Typography, message } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { forgotPassword } from '@/services/authApi';
import { getStoredUser, getHomePathByRole, isLoggedIn } from '@/utils/auth';
import './styles.less';

const { Title, Text } = Typography;

const ForgotPassword: React.FC = () => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      const user = getStoredUser();
      history.replace(getHomePathByRole(user?.role));
    }
  }, []);

  const onFinish = async (values: { email: string }) => {
    setLoading(true);
    try {
      await forgotPassword({ email: values.email });
      message.success('Yêu cầu đã được gửi. Vui lòng kiểm tra email.');
      history.replace('/user/login');
    } catch (error: any) {
      message.error(error?.message || 'Không gửi được yêu cầu đặt lại mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className="auth-page login-page">
      <Col xs={22} sm={18} md={12} lg={10} xl={8}>
        <Card className="auth-card glass-card" bordered={false}>
          <div className="auth-header">
            <Title level={2}>Quên mật khẩu</Title>
            <Text type="secondary">Nhập email để nhận hướng dẫn đặt lại mật khẩu</Text>
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

            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Gửi yêu cầu
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

export default ForgotPassword;