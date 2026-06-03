import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Input } from 'antd';
import { forumService } from '../../services/forumService';
import { useAuth } from '../../hooks/useAuth';
import type { Post, Comment } from '../../types';

const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Vừa xong';
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return d < 30 ? `${d}d` : new Date(dateStr).toLocaleDateString('vi-VN');
};

function Avatar({ user, size = 'md' }: { user?: { name?: string }; size?: 'sm' | 'md' | 'lg' }) {
  const name = user?.name || '?';
  const initial = String(name)[0]?.toUpperCase() || '?';
  const colors = ['#4F8CFF', '#7B61FF', '#4DE2E2', '#FF6B6B'];
  const bg = colors[(String(name).charCodeAt(0) || 0) % colors.length];
  return (
    <div className={`avatar avatar-${size}`} style={{ background: bg }}>
      {initial}
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = { student: '#4F8CFF', lecturer: '#7B61FF', admin: '#FF6B6B' };
  const labels: Record<string, string> = { student: 'Sinh viên', lecturer: 'Giảng viên', admin: 'Quản trị viên' };
  return <span className="badge badge-blue" style={{ background: colors[role] + '18', color: colors[role], fontSize: 12 }}>{labels[role]}</span>;
}

function CommentItem({ comment, onReply }: { comment: Comment; onReply?: (id: string) => void }) {
  return (
    <div className="comment">
      <Avatar user={comment.author} />
      <div className="comment-body">
        <div className="comment-header">
          <span className="comment-author-name">{comment.author.name}</span>
          <RoleBadge role={comment.author.role} />
          <span className="comment-time">{timeAgo(comment.createdAt)}</span>
        </div>
        <div className="comment-text">{comment.content}</div>
        <div className="comment-actions">
          <button className="comment-action-btn">▲ {comment.votes}</button>
          <button className="comment-action-btn" onClick={() => onReply?.(comment.id)}>Trả lời</button>
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <div className="replies">
            {comment.replies.map((r) => (
              <CommentItem key={r.id} comment={r} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const PostDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const params = useParams<{ id: string }>();
  const postId = params.id || '';
  const { isLoggedIn } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!postId) {
      navigate('/forum');
      return;
    }

    const loadPost = async () => {
      setLoading(true);
      try {
        const [p, c] = await Promise.all([
          forumService.getPost(postId),
          forumService.getComments(postId),
        ]);
        setPost(p);
        setComments(c);
      } catch {
        navigate('/forum');
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [postId, navigate]);

  const handleSubmitComment = async () => {
    if (!commentText.trim() || !isLoggedIn) return;
    setSubmitting(true);
    try {
      const newComment = await forumService.createComment(postId, { content: commentText });
      setComments([newComment, ...comments]);
      setCommentText('');
    } catch {
      // handle error
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-loading">
        <div className="spinner" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="page-loading">
        <div className="page-empty-state">
          <div className="empty-icon">❌</div>
          <p>Không tìm thấy bài viết</p>
          <Button onClick={() => navigate('/forum')} className="empty-back-btn rounded-btn">
            Quay lại danh sách
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="thread-detail-page">
      <nav className="page-nav">
        <div className="page-nav-inner">
          <button className="nav-back-btn" onClick={() => navigate('/forum')}>
            ← Quay lại
          </button>
          <div className="page-nav-title" onClick={() => navigate('/')}>
            📚 Diễn đàn
          </div>
          <div className="page-nav-actions">
            {isLoggedIn ? (
              <Button type="primary" onClick={() => navigate('/ask')} className="rounded-btn">
                ✏️ Đặt câu hỏi
              </Button>
            ) : (
              <Button type="primary" onClick={() => navigate('/auth/login')} className="rounded-btn">
                Đăng nhập
              </Button>
            )}
          </div>
        </div>
      </nav>

      <div className="page-inner two-col-layout">
        {/* Main */}
        <div>
          {/* Post Detail */}
          <div className="content-card post-detail-card">
            <h1 className="post-title post-detail-title">{post.title}</h1>

            <div className="post-detail-header">
              <Avatar user={post.author} size="lg" />
              <div className="post-detail-author">
                <div className="post-author">{post.author.name}</div>
                <div className="post-detail-meta">
                  <RoleBadge role={post.author.role} />
                  <span>{timeAgo(post.createdAt)}</span>
                </div>
              </div>
              <div className="post-detail-stats">
                <div>▲ {post.votes} vote</div>
                <div>👁 {post.views} lượt xem</div>
              </div>
            </div>

            <div className="post-content">
              {post.content}
            </div>

            {post.tags && post.tags.length > 0 && (
              <div className="tags-wrap">
                {post.tags.map((t) => (
                  <span
                    key={t.id}
                    className="tag-badge"
                    onClick={() => navigate(`/forum?tag=${t.id}`)}
                    style={{ background: `${t.color}20`, color: t.color }}
                  >
                    {t.name}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Comments Section */}
          <div className="content-card">
            <div className="section-header section-header-spacing">
              <div>
                <h2 className="section-title">💬 {comments.length} Bình luận</h2>
              </div>
            </div>

            {/* Comment Form */}
            {isLoggedIn ? (
              <div className="comment-form">
                <Input.TextArea
                  className="form-textarea"
                  placeholder="Viết bình luận của bạn..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  rows={4}
                />
                <div className="comment-submit-row">
                  <Button
                    type="primary"
                    onClick={handleSubmitComment}
                    loading={submitting}
                    disabled={!commentText.trim()}
                    className="rounded-btn"
                  >
                    Gửi bình luận
                  </Button>
                </div>
              </div>
            ) : (
              <div className="content-card comment-guest-card">
                <p className="comment-guest-copy">Bạn cần đăng nhập để bình luận</p>
                <Button onClick={() => navigate('/auth/login')} type="primary" size="small" className="comment-guest-btn">
                  Đăng nhập ngay
                </Button>
              </div>
            )}
            {/* Comments List */}
            {comments.length > 0 ? (
              <div>
                {comments.map(c => (
                  <CommentItem key={c.id} comment={c} />
                ))}
              </div>
            ) : (
              <div className="page-empty-state">
                <div className="empty-icon">💭</div>
                <p>Chưa có bình luận. Hãy là người đầu tiên!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="aside-card">
            <div className="sidebar-title">📊 Thống kê</div>
            <div className="sidebar-text">
              <div className="sidebar-row">
                <span>Lượt xem:</span>
                <span className="sidebar-row-value">{post.views}</span>
              </div>
              <div className="sidebar-row">
                <span>Vote:</span>
                <span className="sidebar-row-value">{post.votes}</span>
              </div>
              <div className="sidebar-row">
                <span>Bình luận:</span>
                <span className="sidebar-row-value">{comments.length}</span>
              </div>
              <div className="sidebar-row">
                <span>Hỏi lúc:</span>
                <span className="sidebar-row-value">{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
              </div>
            </div>
          </div>

          <div className="aside-card">
            <div className="sidebar-title">💡 Mẹo</div>
            <div className="sidebar-text">
              <ul className="sidebar-list">
                <li>Tìm kiếm trước khi hỏi</li>
                <li>Vote bộ nhận biết</li>
                <li>Cảm ơn những câu trả lời hữu ích</li>
                <li>Đánh dấu câu trả lời tốt nhất</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
