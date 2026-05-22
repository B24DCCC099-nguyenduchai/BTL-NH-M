import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Typography, message } from 'antd';

import {
  UserOutlined,
  FileTextOutlined,
  CommentOutlined,
} from '@ant-design/icons';

import GlassCard from '@/components/Common/GlassCard';

import { getStats } from '@/services/adminApi';

const { Title } = Typography;

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>({});

  const fetchStats = async () => {
    try {
      const res = await getStats();

      setStats(res.data || {});
    } catch (error) {
      message.error('Không tải được thống kê');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <Title level={2}>Dashboard quản trị</Title>

      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <GlassCard>
            <Statistic
              title="Người dùng"
              value={stats.users || 0}
              prefix={<UserOutlined />}
            />
          </GlassCard>
        </Col>

        <Col xs={24} md={8}>
          <GlassCard>
            <Statistic
              title="Bài viết"
              value={stats.posts || 0}
              prefix={<FileTextOutlined />}
            />
          </GlassCard>
        </Col>

        <Col xs={24} md={8}>
          <GlassCard>
            <Statistic
              title="Bình luận"
              value={stats.comments || 0}
              prefix={<CommentOutlined />}
            />
          </GlassCard>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard;