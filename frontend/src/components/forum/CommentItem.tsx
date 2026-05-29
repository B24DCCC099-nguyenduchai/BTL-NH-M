import React, { useState } from 'react';
import UserAvatar from '../common/UserAvatar';
import RoleBadge from '../common/RoleBadge';
import { timeAgo } from '../../utils/helpers';
import type { Comment, User } from '../../types';
import { forumService } from '../../services/forumService';
import { addToast } from '../../utils/toast';

interface Props {
  comment: Comment;
  postId: string;
  currentUser: User | null;
  onDelete: (id: string) => void;
  onReplyAdded: (parentId: string, reply: Comment) => void;
}

const CommentItem: React.FC<Props> = ({ comment, postId, currentUser, onDelete, onReplyAdded }) => {
  const [showReply, setShowReply] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [votes, setVotes] = useState(comment.votes || 0);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [sending, setSending] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const canDelete = currentUser && (currentUser.id === comment.userId || currentUser.role === 'admin');

  const handleVote = async (direction: 'up' | 'down') => {
    if (!currentUser) { addToast('Vui lòng đăng nhập để vote', 'info'); return; }
    const prevVote = userVote;
    const newVote = userVote === direction ? null : direction;
    setUserVote(newVote);
    try {
      await forumService.voteComment(comment.id, direction);
    } catch {
      setUserVote(prevVote);
      addToast('Không thể cập nhật vote', 'error');
    }
  };

  const handleReply = async () => {
    if (!replyText.trim()) return;
    setSending(true);
    try {
      const reply = await forumService.createComment(postId, { content: replyText, parentCommentId: comment.id });
      onReplyAdded(comment.id, reply);
      setReplyText('');
      setShowReply(false);
      setExpanded(true);
      addToast('Đã trả lời bình luận!', 'success');
    } catch {
      addToast('Không thể gửi trả lời', 'error');
    } finally {
      setSending(false);
    }
  };

  const visibleReplies = expanded ? (comment.replies ?? []) : (comment.replies ?? []).slice(0, 2);

  return (
    <div style={{ borderBottom: '1px solid var(--border)', paddingBottom: 16, marginBottom: 16 }}>
      <div style={{ display: 'flex', gap: 12 }}>
        {/* Vote mini */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, width: 36, flexShrink: 0 }}>
          <button
            onClick={() => handleVote(1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: userVote === 1 ? 'var(--success)' : 'var(--faint)', fontSize: 14, lineHeight: 1 }}
          >▲</button>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--muted)' }}>{votes}</span>
          <button
            onClick={() => handleVote(-1)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: userVote === -1 ? 'var(--danger)' : 'var(--faint)', fontSize: 14, lineHeight: 1 }}
          >▼</button>
        </div>

        <div style={{ flex: 1 }}>
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <UserAvatar user={comment.author} size="sm" />
            <span style={{ fontWeight: 600, fontSize: 14 }}>{comment.author.username}</span>
            <RoleBadge role={comment.author.role} />
            <span style={{ fontSize: 12, color: 'var(--faint)' }}>{timeAgo(comment.createdAt)}</span>
          </div>

          {/* Content */}
          <div style={{ fontSize: 14, lineHeight: 1.75, color: 'var(--text)', whiteSpace: 'pre-wrap' }}>
            {comment.content}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 10 }}>
            {currentUser && (
              <button
                onClick={() => setShowReply((s) => !s)}
                style={{ fontSize: 13, color: 'var(--faint)', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4 }}
              >
                ↩ Trả lời
              </button>
            )}
            {canDelete && (
              <button
                onClick={() => onDelete(comment.id)}
                style={{ fontSize: 13, color: 'var(--danger)', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                🗑️ Xóa
              </button>
            )}
          </div>

          {/* Reply form */}
          {showReply && (
            <div style={{ marginTop: 12 }}>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Nhập câu trả lời..."
                style={{
                  width: '100%',
                  minHeight: 72,
                  border: '1.5px solid var(--border)',
                  borderRadius: 8,
                  padding: '8px 12px',
                  fontSize: 14,
                  background: 'var(--bg)',
                  color: 'var(--text)',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button
                  onClick={handleReply}
                  disabled={sending}
                  style={{
                    padding: '6px 18px',
                    borderRadius: 20,
                    background: 'linear-gradient(135deg, var(--pri), var(--sec))',
                    color: '#fff',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 13,
                    fontWeight: 500,
                  }}
                >
                  {sending ? 'Đang gửi...' : 'Gửi'}
                </button>
                <button
                  onClick={() => { setShowReply(false); setReplyText(''); }}
                  style={{
                    padding: '6px 18px',
                    borderRadius: 20,
                    background: 'transparent',
                    color: 'var(--muted)',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    fontSize: 13,
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}

          {/* Replies */}
          {(comment.replies?.length ?? 0) > 0 && (
            <div
              style={{
                marginTop: 12,
                borderLeft: '2px solid var(--border)',
                paddingLeft: 16,
              }}
            >
              {visibleReplies.map((reply) => (
                <div key={reply.id} style={{ marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                    <UserAvatar user={reply.author} size="sm" />
                    <span style={{ fontWeight: 600, fontSize: 13 }}>{reply.author.username}</span>
                    <RoleBadge role={reply.author.role} />
                    <span style={{ fontSize: 12, color: 'var(--faint)' }}>{timeAgo(reply.createdAt)}</span>
                  </div>
                  <div style={{ fontSize: 14, lineHeight: 1.7, color: 'var(--text)', paddingLeft: 44 }}>
                    {reply.content}
                  </div>
                </div>
              ))}
              {(comment.replies?.length ?? 0) > 2 && !expanded && (
                <button
                  onClick={() => setExpanded(true)}
                  style={{ fontSize: 13, color: 'var(--pri)', background: 'none', border: 'none', cursor: 'pointer', marginTop: 4 }}
                >
                  Xem thêm {(comment.replies?.length ?? 0) - 2} câu trả lời...
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentItem;
