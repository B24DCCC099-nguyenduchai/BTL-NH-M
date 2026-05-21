import React, { useEffect, useRef, useState } from 'react';
import { Badge, Button, Col, Input, Row, Space, Tag, Typography } from 'antd';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { history } from 'umi';
import GlassCard from '@/components/Common/GlassCard';
import TagBadge from '@/components/Common/TagBadge';
import { getPosts, searchPosts } from '@/services/forumApi';

const { Title, Text } = Typography;

const popularTags = ['Lập trình', 'Toán rời rạc', 'Cơ sở dữ liệu', 'AI', 'Web'];

const ThreadList: React.FC = () => {
  const [keyword, setKeyword] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const isMountedRef = useRef(true);

  const normalizePosts = (data: any) => (Array.isArray(data) ? data : []);

  const fetchPosts = async () => {
    try {
      const response = await getPosts();
      if (isMountedRef.current) {
        setPosts(normalizePosts(response.data));
      }
    } catch (error) {
      if (isMountedRef.current) {
        setPosts([]);
      }
    }
  };

  const handleSearch = async () => {
    if (!keyword) {
      fetchPosts();
      return;
    }
    try {
      const response = await searchPosts(keyword);
      if (isMountedRef.current) {
        setPosts(normalizePosts(response.data));
      }
    } catch (error) {
      if (isMountedRef.current) {
        setPosts([]);
      }
    }
  };

  useEffect(() => {
    fetchPosts();
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  return (
    <div className="forum-page">
      <Row gutter={[24, 24]}>
        <Col xs={24} lg={16}>
          <GlassCard className="hero-card">
            <div className="hero-content">
              <Title level={2}>Diễn đàn hỏi đáp Sinh viên</Title>
              <Text>Chia sẻ kiến thức, đặt câu hỏi và giải đáp cùng cộng đồng học thuật.</Text>
              <Space className="hero-actions">
                <Button type="primary" size="large" onClick={() => history.push('/forum/ask')} icon={<PlusOutlined />}>
                  Đặt câu hỏi
                </Button>
              </Space>
            </div>
            <Input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onPressEnter={handleSearch}
              size="large"
              placeholder="Tìm kiếm câu hỏi theo từ khóa, tag hoặc môn học"
              prefix={<SearchOutlined />}
            />
          </GlassCard>

          <div className="post-list">
            {posts.map((post) => (
              <GlassCard key={post.id} className="post-card">
                <Row justify="space-between" align="middle">
                  <Col>
                    <a
                      href={`/forum/question/${post.id}`}
                      className="post-title"
                      onClick={(event) => {
                        event.preventDefault();
                        history.push(`/forum/question/${post.id}`);
                      }}
                    >
                      {post.title}
                    </a>
                  </Col>
                  <Col>
                    <Badge count={post.answersCount || 0} showZero />
                  </Col>
                </Row>
                <Text type="secondary">{post.content?.slice(0, 140)}...</Text>
                <div className="post-meta">
                  {post.tags?.map((tag: any) => (<TagBadge key={tag.id || tag.name} label={tag.name || tag} />))}
                </div>
                <div className="post-footer">
                  <Space size="middle">
                    <Text strong>+{post.votes || 0}</Text>
                    <Text>{post.views || 0} lượt xem</Text>
                    <Text>{post.author?.name || 'Người dùng'}</Text>
                  </Space>
                </div>
              </GlassCard>
            ))}
          </div>
        </Col>

        <Col xs={24} lg={8}>
          <GlassCard className="sidebar-card">
            <Title level={4}>Tag phổ biến</Title>
            <Space wrap>
              {popularTags.map((tag) => <Tag key={tag}>{tag}</Tag>)}
            </Space>
          </GlassCard>
          <GlassCard className="sidebar-card">
            <Title level={4}>Bài hot</Title>
            <Space direction="vertical" size="middle">
              <a
                href="/forum/question/2"
                onClick={(event) => {
                  event.preventDefault();
                  history.push('/forum/question/2');
                }}
              >
                Bài toán đồ thị và thuật toán Dijkstra trong đồ án?
              </a>
              <a
                href="/forum/question/1"
                onClick={(event) => {
                  event.preventDefault();
                  history.push('/forum/question/1');
                }}
              >
                Cách tối ưu query SQL trong MySQL cho bảng lớn?
              </a>
            </Space>
          </GlassCard>
          <GlassCard className="sidebar-card">
            <Title level={4}>Thành viên nổi bật</Title>
            <Space direction="vertical" size="small">
              <Text>Nguyễn Văn A · 452 điểm</Text>
              <Text>Trần Thị B · 398 điểm</Text>
            </Space>
          </GlassCard>
        </Col>
      </Row>
    </div>
  );
};

export default ThreadList;
