import React, { useEffect, useState } from 'react';
import { Card, Col, Progress, Row, Statistic, Typography, message } from 'antd';
import GlassCard from '@/components/Common/GlassCard';
import { getStats } from '@/services/adminApi';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalPosts: 0, totalComments: 0 });

  const fetchStats = async () => {
    try {
      const response = await getStats();
      setStats(response.data || {});
    } catch (error) {
      message.error('Không tải được thống kê.');
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <GlassCard className="page-title-card">
            <Title level={2}>Bảng điều khiển Admin</Title>
            <p>Thống kê cơ bản của diễn đàn: người dùng, bài viết, bình luận và tag phổ biến.</p>
          </GlassCard>
        </Col>

        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} className="stat-card">
            <Statistic title="Tổng bài viết" value={stats.totalPosts} valueStyle={{ color: '#4F8CFF' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} className="stat-card">
            <Statistic title="Người dùng" value={stats.totalUsers} valueStyle={{ color: '#7B61FF' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} className="stat-card">
            <Statistic title="Bình luận" value={stats.totalComments} valueStyle={{ color: '#4DE2E2' }} />
          </Card>
        </Col>
        <Col xs={24} sm={12} xl={6}>
          <Card bordered={false} className="stat-card">
            <Statistic title="Tag phổ biến" value={32} valueStyle={{ color: '#0D3C88' }} />
          </Card>
        </Col>

        <Col span={24} xl={12}>
          <GlassCard>
            <Title level={4}>Hoạt động gần đây</Title>
            <Progress percent={72} status="active" />
            <p>Hoạt động đăng bài và trả lời trong 7 ngày qua.</p>
          </GlassCard>
        </Col>
        <Col span={24} xl={12}>
          <GlassCard>
            <Title level={4}>Tăng trưởng người dùng</Title>
            <Progress percent={58} strokeColor="#7B61FF" status="active" />
            <p>Tăng 58% người dùng mới so với tháng trước.</p>
          </GlassCard>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
