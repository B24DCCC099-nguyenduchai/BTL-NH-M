import React from 'react';
import { useNavigate } from 'umi';
import UserAvatar from '../common/UserAvatar';
import RoleBadge from '../common/RoleBadge';
import TagBadge from '../common/TagBadge';
import { timeAgo } from '../../utils/helpers';
import type { Post } from '../../types';

interface Props {
  post: Post;
}

const PostCard: React.FC<Props> = ({ post }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(`/forum/${post.id}`)}
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '20px 24px',
        cursor: 'pointer',
        transition: 'all .25s',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 12,
        }}
      >
        <UserAvatar user={post.author} size="sm" />

        <span style={{ fontWeight: 600, fontSize: 14 }}>
          {post.author.username}
        </span>

        <RoleBadge role={post.author.role} />

        <span
          style={{
            marginLeft: 'auto',
            fontSize: 13,
            color: 'var(--faint)',
          }}
        >
          {timeAgo(post.createdAt)}
        </span>
      </div>

      <div
        style={{
          fontWeight: 700,
          fontSize: 18,
          marginBottom: 10,
        }}
      >
        {post.title}
      </div>

      <div
        style={{
          color: 'var(--muted)',
          marginBottom: 12,
        }}
      >
        {post.content}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 6,
          marginBottom: 12,
        }}
      >
        {post.tags.map((t) => (
          <TagBadge
            key={t.id}
            tag={t}
            onClick={(e: React.MouseEvent<HTMLDivElement>) => {
              e.stopPropagation();
            }}
          />
        ))}
      </div>

      <div style={{ display: 'flex', gap: 16 }}>
        <span>▲ {post.votes}</span>
        <span>💬 {post.commentCount}</span>
        <span>👁 {post.views}</span>
      </div>
    </div>
  );
};

export default PostCard;