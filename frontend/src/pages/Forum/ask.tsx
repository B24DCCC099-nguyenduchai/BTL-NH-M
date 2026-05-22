import React, { useState } from 'react';
import { Button, Form, Input, Select, Typography, message } from 'antd';
import { history } from 'umi';
import GlassCard from '@/components/Common/GlassCard';
import { createPost } from '@/services/forumApi';

const { Title } = Typography;
const { TextArea } = Input;

const AskQuestion: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);

      await createPost({
        title: values.title,
        content: values.content,
        tags: values.tags,
      });

      message.success('Đăng bài thành công');

      history.push('/forum');
    } catch (error) {
      message.error('Không thể đăng bài');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ask-page">
      <GlassCard className="ask-card">
        <Title level={2}>Đặt câu hỏi</Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            name="title"
            label="Tiêu đề"
            rules={[{ required: true }]}
          >
            <Input placeholder="Nhập tiêu đề câu hỏi" />
          </Form.Item>

          <Form.Item
            name="content"
            label="Nội dung"
            rules={[{ required: true }]}
          >
            <TextArea rows={8} />
          </Form.Item>

          <Form.Item
            name="tags"
            label="Tag"
          >
            <Select mode="tags" placeholder="Ví dụ: MySQL, AI, Java">
              <Select.Option value="MySQL">MySQL</Select.Option>
              <Select.Option value="AI">AI</Select.Option>
              <Select.Option value="Java">Java</Select.Option>
            </Select>
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            Đăng bài
          </Button>
        </Form>
      </GlassCard>
    </div>
  );
};

export default AskQuestion;