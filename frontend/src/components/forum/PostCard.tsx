import React from 'react';
import { Avatar } from './Avatar';
import { TagBadge } from './TagBadge';
import { RoleBadge } from './RoleBadge';
import { timeAgo } from '@/utils/forum';
import type { Post } from '@/types';

interface Props {
  post: Post;
  onClick?: (post: Post) => void;
}

const PostCard: React.FC<Props> = ({ post, onClick }) => {
  const authorName = String('username' in post.author ? post.author.username : post.author.name);

  return (
    <div className="post-card" onClick={() => onClick?.(post)}>
      <div className="flex items-center gap-2 mb-4" style={{ marginBottom: 10 }}>
        <Avatar 
          username={authorName}
          avatar={'avatar' in post.author ? post.author.avatar : undefined}
        />
        <div>
          <span className="author-name">{authorName}</span>
          <RoleBadge role={post.author.role} />
        </div>
        <span className="text-muted text-sm" style={{ marginLeft: 'auto' }}>
          {timeAgo(post.createdAt)}
        </span>
      </div>

      <div className="post-title">{post.title}</div>
      <div className="post-preview">{post.content}</div>

      <div className="tags-wrap">
        {post.tags.map((t) => (
          <TagBadge 
            key={t.id} 
            tag={t}
            onClick={(e: any) => e?.stopPropagation?.()}
          />
        ))}
      </div>

      <div className="post-stats">
        <span className="stat-pill">▲ {post.votes} vote</span>
        <span className="stat-pill">💬 {post.commentCount} bình luận</span>
        <span className="stat-pill">👁 {post.views} lượt xem</span>
      </div>
    </div>
  );
};

export default PostCard;
