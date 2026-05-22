import React, { useEffect, useState } from 'react';
import { Button, Input, Space, Typography, Tag, Badge, message } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { history } from 'umi';
import GlassCard from '@/components/Common/GlassCard';
import { getPosts, searchPosts } from '@/services/forumApi';

const { Title, Text } = Typography;

const ForumPage: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [keyword, setKeyword] = useState('');

  const fetchPosts = async () => {
    try {
      const res = await getPosts();
      setPosts(res.data || []);
    } catch (error) {
      message.error('Không tải được bài viết');
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSearch = async () => {
    try {
      if (!keyword.trim()) {
        fetchPosts();
        return;
      }

      const res = await searchPosts(keyword);
      setPosts(res.data || []);
    } catch (error) {
      message.error('Lỗi tìm kiếm');
    }
  };

  return (
    <div className="forum-page">
      <GlassCard className="hero-card">
        <Title level={2}>Diễn đàn hỏi đáp sinh viên</Title>

        <Space style={{ width: '100%' }}>
          <Input
            size="large"
            placeholder="Tìm kiếm bài viết..."
            prefix={<SearchOutlined />}
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onPressEnter={handleSearch}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => history.push('/forum/ask')}
          >
            Đặt câu hỏi
          </Button>
        </Space>
      </GlassCard>

      <div style={{ marginTop: 24 }}>
        {posts.map((post) => (
          <GlassCard key={post.id} className="post-card">
            <a
              className="post-title"
              onClick={() => history.push(`/forum/question/${post.id}`)}
            >
              {post.title}
            </a>

            <div style={{ marginTop: 12 }}>
              <Text>{post.content?.slice(0, 180)}...</Text>
            </div>

            <div className="post-meta">
              <Space wrap>
                {post.tags?.map((tag: any) => (
                  <Tag key={tag.id || tag}>{tag.name || tag}</Tag>
                ))}
              </Space>
            </div>

            <div style={{ marginTop: 16 }}>
              <Space size="large">
                <Badge count={post.answersCount || 0} />
                <Text>{post.views || 0} lượt xem</Text>
                <Text strong>{post.author?.name}</Text>
              </Space>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
};

export default ForumPage;