import React from 'react';
import { useHistory } from 'umi';
import UserAvatar from '../common/UserAvatar';
import RoleBadge from '../common/RoleBadge';
import TagBadge from '../common/TagBadge';
import { timeAgo } from '../../utils/helpers';
import type { Post } from '../../types';

interface Props {
  post: Post;
}

const PostCard: React.FC<Props> = ({ post }) => {
  const history = useHistory();

  return (
    <div
      onClick={() => history.push(`/forum/${post.id}`)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'all .25s',
        animation: 'fadeIn .3s ease both',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--pri)';
        (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
        (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = 'var(--border)';
        (e.currentTarget as HTMLDivElement).style.transform = '';
        (e.currentTarget as HTMLDivElement).style.boxShadow = '';
      }}
    >
      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <UserAvatar user={post.author} size="sm" />
        <span style={{ fontWeight: 600, fontSize: 14 }}>{post.author.username}</span>
        <RoleBadge role={post.author.role} />
        <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--faint)' }}>
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "'Syne', sans-serif",
          fontWeight: 700,
          fontSize: 17,
          lineHeight: 1.4,
          marginBottom: 8,
          color: 'var(--text)',
        }}
      >
        {post.title}
      </div>

      {/* Preview */}
      <div
        style={{
          color: 'var(--muted)',
          fontSize: 14,
          lineHeight: 1.65,
          marginBottom: 12,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {post.content}
      </div>

      {/* Tags */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 12 }}>
        {post.tags.map((t) => (
          <TagBadge key={t.id} tag={t} onClick={(e: any) => { e?.stopPropagation(); }} />
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
        {[
          { icon: '▲', val: post.votes, label: 'vote' },
          { icon: '💬', val: post.commentCount, label: 'bình luận' },
          { icon: '👁', val: post.views, label: 'lượt xem' },
        ].map((s) => (
          <span key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--faint)' }}>
            <span>{s.icon}</span>
            <span style={{ fontWeight: 600, color: 'var(--muted)' }}>{s.val}</span>
            <span>{s.label}</span>
          </span>
        ))}
      </div>
    </div>
  );
};

export default PostCard;
