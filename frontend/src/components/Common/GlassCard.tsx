import React from 'react';
import classNames from 'classnames';

interface GlassCardProps {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
}

const GlassCard: React.FC<GlassCardProps> = ({ id, className, style, children }) => (
  <div id={id} className={classNames('glass-card', className)} style={style}>
    {children}
  </div>
);

export default GlassCard;
