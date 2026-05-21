import React, { useEffect, useState } from 'react';
import { useModel, history } from 'umi';
import { Button, Card, Descriptions, Drawer, message, Space, Table, Tag, Typography } from 'antd';
import GlassCard from '@/components/Common/GlassCard';
import { deleteAdminPost, getAdminPost, getAdminPosts } from '@/services/adminApi';

const { Title } = Typography;

const PostManagement: React.FC = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const { initialState } = useModel('@@initialState');

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await getAdminPosts();
      setPosts(response.data || []);
    } catch (error) {
      message.error('Không tải được danh sách bài viết.');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  useEffect(() => {
    const role = (initialState as any)?.currentUser?.role;
    if (role !== 'admin') {
      history.push('/403');
    }
  }, [initialState]);

  const handleDelete = async (id: string) => {
    try {
      await deleteAdminPost(id);
      message.success('Đã xóa bài viết thành công.');
      fetchPosts();
    } catch (error) {
      message.error('Xóa bài viết thất bại.');
    }
  };

  const viewPost = async (record: any) => {
    try {
      const response = await getAdminPost(record.id);
      setSelectedPost(response.data);
      setDrawerVisible(true);
    } catch (error) {
      message.error('Không thể tải chi tiết bài viết.');
    }
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
    setSelectedPost(null);
  };

  const columns = [
    { title: 'Tiêu đề', dataIndex: 'title', key: 'title', render: (text: string) => <span>{text}</span> },
    {
      title: 'Tác giả',
      dataIndex: ['author', 'name'],
      key: 'author',
      render: (authorName: string, record: any) => <span>{authorName || record.authorId}</span>,
    },
    {
      title: 'Tag',
      dataIndex: 'tags',
      key: 'tags',
      render: (tags: any[]) => (
        <>{tags?.map((tag) => <Tag key={tag.id || tag.name} color={tag.color || 'default'}>{tag.name}</Tag>)}</>
      ),
    },
    { title: 'Bình luận', dataIndex: 'answersCount', key: 'answersCount' },
    { title: 'Lượt vote', dataIndex: 'votes', key: 'votes' },
    { title: 'Ngày tạo', dataIndex: 'createdAt', key: 'createdAt', render: (date: string) => <span>{new Date(date).toLocaleDateString('vi-VN')}</span> },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_: any, record: any) => (
        <Space>
          <Button type="link" onClick={() => viewPost(record)}>Xem</Button>
          <Button type="link" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="admin-post-management-page">
      <GlassCard className="page-title-card">
        <Title level={2}>Quản lý bài viết</Title>
        <p>Kiểm duyệt, xóa bài hoặc truy cập chi tiết bài từ giao diện admin.</p>
      </GlassCard>
      <Card bordered={false} className="table-card">
        <Table columns={columns} dataSource={posts} loading={loading} rowKey="id" pagination={{ pageSize: 6 }} />
      </Card>
      <Drawer
        title="Chi tiết bài viết"
        placement="right"
        width={560}
        onClose={closeDrawer}
        visible={drawerVisible}
      >
        {selectedPost ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Tiêu đề">{selectedPost.title}</Descriptions.Item>
            <Descriptions.Item label="Tác giả">{selectedPost.author?.name || selectedPost.authorId}</Descriptions.Item>
            <Descriptions.Item label="Tag">
              {selectedPost.tags?.map((tag: any) => (
                <Tag key={tag.id || tag.name} color={tag.color || 'default'}>{tag.name}</Tag>
              ))}
            </Descriptions.Item>
            <Descriptions.Item label="Lượt vote">{selectedPost.votes}</Descriptions.Item>
            <Descriptions.Item label="Số bình luận">{selectedPost.answersCount}</Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">{new Date(selectedPost.createdAt).toLocaleString('vi-VN')}</Descriptions.Item>
            <Descriptions.Item label="Nội dung">
              <div style={{ whiteSpace: 'pre-wrap' }}>{selectedPost.content}</div>
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>Đang tải chi tiết bài viết...</p>
        )}
      </Drawer>
    </div>
  );
};

export default PostManagement;
