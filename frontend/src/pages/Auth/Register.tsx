import React, { useState } from 'react';
import { Button, Card, Form, Input, Radio, Row, Col, Typography, message } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined } from '@ant-design/icons';
import { history } from 'umi';
import { register } from '@/services/authApi';
import './styles.less';

const { Title, Text } = Typography;

const Register: React.FC = () => {
  const [role, setRole] = useState<'student' | 'lecturer'>('student');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await register({ ...values, role });
      message.success('Đăng ký thành công. Vui lòng đăng nhập để tiếp tục.');
      history.push('/user/login');
    } catch (error) {
      message.error('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" align="middle" className="auth-page register-page">
      <Col xs={22} sm={18} md={12} lg={10} xl={8}>
        <Card className="auth-card glass-card" bordered={false}>
          <div className="auth-header">
            <Title level={2}>Đăng ký</Title>
            <Text type="secondary">Tham gia cộng đồng học thuật của sinh viên & giảng viên</Text>
          </div>
          <Form name="register_form" layout="vertical" onFinish={onFinish}>
            <Form.Item name="name" label="Họ và tên" rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}> 
              <Input prefix={<UserOutlined />} placeholder="Họ và tên" />
            </Form.Item>
            <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Vui lòng nhập email' }, { type: 'email', message: 'Email không hợp lệ' }]}>
              <Input prefix={<MailOutlined />} placeholder="email@domain.com" />
            </Form.Item>
            <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}> 
              <Input.Password prefix={<LockOutlined />} placeholder="Tạo mật khẩu" />
            </Form.Item>
            <Form.Item label="Vai trò">
              <Radio.Group value={role} onChange={(e) => setRole(e.target.value)} optionType="button" buttonStyle="solid">
                <Radio.Button value="student">Sinh viên</Radio.Button>
                <Radio.Button value="lecturer">Giảng viên</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" block size="large" loading={loading}>
                Tạo tài khoản
              </Button>
            </Form.Item>
            <Form.Item>
              <Text>
                Đã có tài khoản? <a href="/user/login">Đăng nhập</a>
              </Text>
            </Form.Item>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default Register;
