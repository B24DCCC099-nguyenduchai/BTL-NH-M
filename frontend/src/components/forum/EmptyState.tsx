import React from 'react';

interface EmptyStateProps {
  text?: string;
  icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ 
  text = 'Không có dữ liệu',
  icon = '📭'
}) => {
  return (
    <div className="empty-state">
      <div className="empty-icon">{icon}</div>
      <p>{text}</p>
    </div>
  );
};
