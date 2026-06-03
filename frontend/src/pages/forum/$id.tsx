import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { history } from 'umi';
import { Avatar, TagBadge, RoleBadge, Loading, EmptyState } from '@/components/forum';
import { timeAgo } from '@/utils/forum';
import { forumAPI } from '@/services/forum-api';
import { useAuth } from '@/hooks/useAuth';
import { addToast } from '@/utils/toast';
import type { Post, Comment, User } from '@/types';

// Mock comments
const MOCK_COMMENTS: Comment[] = [
  {
    id: 1,
    content: 'Đệ quy là khi một hàm gọi lại chính nó với các tham số khác. Ví dụ factorial(n) = n * factorial(n-1)',
    author: { id: 2, username: 'gv_nguyenha', role: 'lecturer', avatar: null },
    votes: 15,
    parentCommentId: null,
    replies: [],
    createdAt: '2024-05-20T11:00:00Z',
  },
  {
    id: 2,
    content: 'Cảm ơn, giờ tôi hiểu rồi!',
    author: { id: 1, username: 'sv_tranminh', role: 'student', avatar: null },
    votes: 3,
    parentCommentId: 1,
    replies: [],
    createdAt: '2024-05-20T11:30:00Z',
  },
];

// Mock posts data
const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'Làm thế nào để hiểu Recursion trong lập trình?',
    content: 'Mình đang học về đệ quy nhưng không hiểu cách hoạt động. Ai có thể giải thích bằng ví dụ thực tế không? Mình cần hiểu rõ về base case và recursive case.',
    author: { id: 1, username: 'sv_tranminh', role: 'student', avatar: null },
    tags: [
      { id: 1, name: 'Lập trình', color: '#4F8CFF' },
      { id: 2, name: 'Thuật toán', color: '#7B61FF' },
    ],
    votes: 24,
    views: 312,
    commentCount: 8,
    createdAt: '2024-05-20T10:30:00Z',
  },
  {
    id: 2,
    title: '"Phân biệt giữa SQL JOIN các loại: INNER, LEFT, RIGHT, FULL"',
    content: 'Mình hay bị nhầm lẫn giữa các loại JOIN trong SQL. Ai giải thích rõ ràng với ví dụ được không?',
    author: { id: 2, username: 'gv_nguyenha', role: 'lecturer', avatar: null },
    tags: [
      { id: 3, name: 'Cơ sở dữ liệu', color: '#4DE2E2' },
      { id: 4, name: 'SQL', color: '#22C55E' },
    ],
    votes: 41,
    views: 580,
    commentCount: 15,
    createdAt: '2024-05-19T14:20:00Z',
  },
];

export default function PostDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>(MOCK_COMMENTS);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [replyTo, setReplyTo] = useState<string | number | null>(null);
  const [replyText, setReplyText] = useState('');
  const [userVote, setUserVote] = useState(0);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const res = await forumAPI.getPost(id!);
        if (res?.data) {
          setPost(res.data);
          setVoteCount(res.data.votes);
        }

        const commentsRes = await forumAPI.getComments(id!);
        if (commentsRes?.data) setComments(commentsRes.data);
      } catch (err) {
        // Use mock data
        const found = MOCK_POSTS.find((x) => String(x.id) === String(id));
        if (found) {
          setPost(found);
          setVoteCount(found.votes);
        }
      }
      setLoading(false);
    })();
  }, [id]);

  const handleVote = async (v: number) => {
    if (!user) {
      history.push('/auth');
      return;
    }
    const newVote = userVote === v ? 0 : v;
    const delta = newVote - userVote;
    setVoteCount((c) => c + delta);
    setUserVote(newVote);

    try {
      await forumAPI.votePost(id!, v === 1 ? 'up' : 'down');
    } catch (err) {
      // Fallback - vote already updated optimistically
    }
  };

  const handleComment = async () => {
    if (!user) {
      history.push('/auth');
      return;
    }
    if (!commentText.trim()) {
      addToast('Vui lòng nhập nội dung bình luận', 'error');
      return;
    }

    try {
      const res = await forumAPI.createComment(id!, { content: commentText });
      const newComment: Comment = res?.data || {
        id: Date.now(),
        content: commentText,
        author: user as any,
        votes: 0,
        parentCommentId: null,
        replies: [],
        createdAt: new Date().toISOString(),
      };
      setComments((p) => [newComment, ...p]);
      setCommentText('');
      addToast('Đã thêm bình luận!', 'success');
    } catch (err) {
      addToast('Lỗi khi thêm bình luận', 'error');
    }
  };

  const handleReply = async (parentId: string | number) => {
    if (!user) {
      history.push('/auth');
      return;
    }
    if (!replyText.trim()) return;

    try {
      const res = await forumAPI.createComment(id!, { content: replyText, parentCommentId: parentId });
      const newReply: Comment = res?.data || {
        id: Date.now(),
        content: replyText,
        author: user as any,
        votes: 0,
        parentCommentId: parentId as number,
        replies: [],
        createdAt: new Date().toISOString(),
      };
      setComments((p) =>
        p.map((c) => (c.id === parentId ? { ...c, replies: [...(c.replies || []), newReply] } : c))
      );
      setReplyText('');
      setReplyTo(null);
      addToast('Đã trả lời bình luận!', 'success');
    } catch (err) {
      addToast('Lỗi khi trả lời', 'error');
    }
  };

  if (loading) return <div className="page"><Loading /></div>;
  if (!post) return <div className="page"><EmptyState text="Không tìm thấy bài viết" /></div>;

  return (
    <div className="page">
      <div className="breadcrumb" onClick={() => history.push('/forum')}>
        ← Về trang chủ · <span>{post.title.slice(0, 40)}...</span>
      </div>

      <div className="two-col">
        <div>
          {/* Post */}
          <div className="post-detail">
            <div className="flex gap-3 items-center" style={{ marginBottom: 16 }}>
              <Avatar username={post.author.username} avatar={post.author.avatar} />
              <div>
                <div className="flex items-center gap-2">
                  <span style={{ fontWeight: 600 }}>{post.author.username}</span>
                  <RoleBadge role={post.author.role} />
                </div>
                <div className="text-sm text-muted">{timeAgo(post.createdAt)} · 👁 {post.views} lượt xem</div>
              </div>
            </div>

            <div className="post-detail-title">{post.title}</div>

            <div className="tags-wrap mb-4">
              {post.tags.map((t) => (
                <TagBadge key={t.id} tag={t} />
              ))}
            </div>

            <div style={{ display: 'flex', gap: 24 }}>
              {/* Vote */}
              <div className="vote-bar">
                <button
                  className={`vote-btn up ${userVote === 1 ? 'active' : ''}`}
                  onClick={() => handleVote(1)}
                >
                  ▲
                </button>
                <div
                  className="vote-count"
                  style={{
                    color:
                      userVote === 1 ? 'var(--success)' : userVote === -1 ? 'var(--danger)' : 'var(--text)',
                  }}
                >
                  {voteCount}
                </div>
                <button
                  className={`vote-btn down ${userVote === -1 ? 'active' : ''}`}
                  onClick={() => handleVote(-1)}
                >
                  ▼
                </button>
              </div>

              {/* Content */}
              <div className="post-content">{post.content}</div>
            </div>

            {/* Actions */}
            {user && (post.author.id === user.id || user.role === 'admin') && (
              <div className="flex gap-2 mt-4" style={{ paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                <button className="btn btn-ghost btn-sm">✏️ Sửa</button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={async () => {
                    if (!confirm('Xóa bài viết này?')) return;
                    try {
                      await forumAPI.deletePost(id!);
                      addToast('Đã xóa bài viết', 'success');
                      history.push('/forum');
                    } catch (err) {
                      addToast('Lỗi khi xóa', 'error');
                    }
                  }}
                >
                  🗑️ Xóa
                </button>
              </div>
            )}
          </div>

          {/* Comment Box */}
          <div className="card mt-6">
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 14 }}>
              💬 Thêm bình luận
            </div>
            {user ? (
              <>
                <div className="flex gap-2 items-center" style={{ marginBottom: 10 }}>
                  <Avatar username={user.username || 'User'} avatar={user.avatar} />
                  <span style={{ fontSize: 14, fontWeight: 500 }}>{user.username}</span>
                </div>
                <textarea
                  className="form-textarea"
                  placeholder="Chia sẻ ý kiến của bạn..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  style={{ minHeight: 100 }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button className="btn btn-primary btn-sm" onClick={handleComment}>
                    Bình luận →
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)' }}>
                <button className="btn btn-primary" onClick={() => history.push('/auth')}>
                  Đăng nhập để bình luận
                </button>
              </div>
            )}
          </div>

          {/* Comments */}
          <div className="card mt-6">
            <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              💬 {comments.length} bình luận
            </div>
            {comments.map((c) => (
              <div key={c.id}>
                <div className="comment">
                  <Avatar username={c.author.username} avatar={c.author.avatar} />
                  <div className="comment-body">
                    <div className="comment-header">
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{c.author.username}</span>
                      <RoleBadge role={c.author.role} />
                      <span className="text-sm text-muted">{timeAgo(c.createdAt)}</span>
                    </div>
                    <div className="comment-text">{c.content}</div>
                    <div className="comment-actions">
                      <button className="comment-action-btn">▲ {c.votes}</button>
                      <button
                        className="comment-action-btn"
                        onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                      >
                        ↩ Trả lời
                      </button>
                      {user && (c.author.id === user.id || user.role === 'admin') && (
                        <button className="comment-action-btn" style={{ color: 'var(--danger)' }}>
                          🗑️ Xóa
                        </button>
                      )}
                    </div>
                    {replyTo === c.id && (
                      <div style={{ marginTop: 10 }}>
                        <textarea
                          className="form-textarea"
                          style={{ minHeight: 70 }}
                          placeholder="Trả lời..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
                          <button
                            className="btn btn-primary btn-xs"
                            onClick={() => handleReply(c.id)}
                          >
                            Gửi
                          </button>
                          <button className="btn btn-ghost btn-xs" onClick={() => setReplyTo(null)}>
                            Hủy
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {c.replies && c.replies.length > 0 && (
                  <div className="replies">
                    {c.replies.map((r) => (
                      <div key={r.id} className="comment" style={{ borderBottom: 'none', paddingBottom: 8 }}>
                        <Avatar username={r.author.username} avatar={r.author.avatar} />
                        <div className="comment-body">
                          <div className="comment-header">
                            <span style={{ fontWeight: 600, fontSize: 14 }}>{r.author.username}</span>
                            <RoleBadge role={r.author.role} />
                            <span className="text-sm text-muted">{timeAgo(r.createdAt)}</span>
                          </div>
                          <div className="comment-text">{r.content}</div>
                          <div className="comment-actions">
                            <button className="comment-action-btn">▲ {r.votes}</button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="card-sm">
            <div className="sidebar-title">📌 Thông tin bài viết</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <div className="text-muted text-sm">Tác giả</div>
                <div style={{ fontWeight: 500 }}>{post.author.username}</div>
              </div>
              <div>
                <div className="text-muted text-sm">Đăng lúc</div>
                <div style={{ fontWeight: 500 }}>{timeAgo(post.createdAt)}</div>
              </div>
              <div>
                <div className="text-muted text-sm">Lượt xem</div>
                <div style={{ fontWeight: 500 }}>👁 {post.views}</div>
              </div>
              <div>
                <div className="text-muted text-sm">Vote</div>
                <div style={{ fontWeight: 500 }}>▲ {voteCount}</div>
              </div>
            </div>
          </div>
          <div className="card-sm">
            <div className="sidebar-title">🏷️ Tags</div>
            <div className="tags-wrap">
              {post.tags.map((t) => (
                <TagBadge key={t.id} tag={t} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
