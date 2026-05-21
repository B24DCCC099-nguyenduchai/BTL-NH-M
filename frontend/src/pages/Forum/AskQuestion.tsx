import React, { useState } from 'react';
import { Button, Checkbox, Col, Form, Input, Row, Select, Typography, message } from 'antd';
import { history, useModel } from 'umi';
import GlassCard from '@/components/Common/GlassCard';
import { createPost } from '@/services/forumApi';

const { Title, Text } = Typography;
const { TextArea } = Input;

const tagOptions = ['MySQL', 'AI', 'Web', 'Lập trình', 'Thuật toán', 'Cơ sở dữ liệu'];

const AskQuestion: React.FC = () => {
  const [form] = Form.useForm();
  const { initialState } = useModel('@@initialState');
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    if (!initialState?.currentUser) {
      message.warning('Vui lòng đăng nhập trước khi đăng câu hỏi.');
      history.push('/user/login');
      return;
    }
    setLoading(true);
    try {
      await createPost({
        title: values.title,
        content: values.description,
        tags: values.tags || [],
      });
      message.success('Câu hỏi của bạn đã được gửi. Mọi người sẽ trả lời sớm!');
      form.resetFields();
      history.push('/forum');
    } catch (error) {
      message.error('Không thể gửi câu hỏi. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Row justify="center" className="ask-page">
      <Col xs={24} sm={22} md={20} lg={16}>
        <GlassCard className="ask-card">
          <Title>Đặt câu hỏi mới</Title>
          <Text type="secondary">Mô tả rõ ràng để nhận được câu trả lời chính xác nhất.</Text>
          <Form layout="vertical" form={form} onFinish={onFinish}>
            <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}> 
              <Input placeholder="Ví dụ: Cách tối ưu query SQL trong MySQL?" />
            </Form.Item>
            <Form.Item name="description" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung câu hỏi' }]}> 
              <TextArea rows={6} placeholder="Mô tả chi tiết vấn đề, ví dụ yêu cầu, dữ liệu mẫu, kết quả mong muốn" />
            </Form.Item>
            <Form.Item name="tags" label="Tag" rules={[{ required: true, message: 'Chọn ít nhất 1 tag' }]}> 
              <Select mode="multiple" allowClear placeholder="Chọn tag liên quan">
                {tagOptions.map((tag) => (<Select.Option key={tag} value={tag}>{tag}</Select.Option>))}
              </Select>
            </Form.Item>
            <Form.Item
              name="agreement"
              valuePropName="checked"
              rules={[
                {
                  validator: (_, value) =>
                    value
                      ? Promise.resolve()
                      : Promise.reject(new Error('Vui lòng đồng ý tuân thủ quy tắc cộng đồng')),
                },
              ]}
            >
              <Checkbox>Tôi đồng ý tuân thủ quy tắc cộng đồng</Checkbox>
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" size="large" loading={loading}>
                Đăng câu hỏi
              </Button>
            </Form.Item>
          </Form>
        </GlassCard>
      </Col>
    </Row>
  );
};

export default AskQuestion;
