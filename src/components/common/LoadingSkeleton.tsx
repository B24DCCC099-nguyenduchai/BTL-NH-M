import React from 'react';
import { Skeleton, Card, Space } from 'antd';

interface Props {
  count?: number;
  type?: 'card' | 'text' | 'page';
}

const LoadingSkeleton: React.FC<Props> = ({ count = 3, type = 'card' }) => {
  if (type === 'page') {
    return (
      <div style={{ padding: '32px 24px', maxWidth: 900, margin: '0 auto' }}>
        <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 24 }} />
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} style={{ marginBottom: 16 }}>
            <Skeleton active avatar paragraph={{ rows: 3 }} />
          </Card>
        ))}
      </div>
    );
  }

  if (type === 'text') {
    return (
      <Space direction="vertical" style={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <Skeleton key={i} active paragraph={{ rows: 2 }} />
        ))}
      </Space>
    );
  }

  return (
    <Space direction="vertical" style={{ width: '100%' }} size={16}>
      {Array.from({ length: count }).map((_, i) => (
        <Card key={i} style={{ animationDelay: `${i * 0.05}s` }}>
          <Skeleton active avatar={{ size: 36 }} paragraph={{ rows: 3 }} />
        </Card>
      ))}
    </Space>
  );
};

export default LoadingSkeleton;
