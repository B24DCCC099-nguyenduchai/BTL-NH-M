import React from 'react';

interface Props {
  icon?: string;
  title?: string;
  description?: string;
  action?: React.ReactNode;
}

const EmptyState: React.FC<Props> = ({
  icon = '📭',
  title = 'Không có dữ liệu',
  description,
  action,
}) => (
  <div
    style={{
      textAlign: 'center',
      padding: '64px 24px',
      color: 'var(--muted)',
    }}
  >
    <div style={{ fontSize: 52, marginBottom: 14 }}>{icon}</div>
    <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 6 }}>{title}</div>
    {description && <div style={{ fontSize: 14, marginBottom: 20 }}>{description}</div>}
    {action}
  </div>
);

export default EmptyState;
