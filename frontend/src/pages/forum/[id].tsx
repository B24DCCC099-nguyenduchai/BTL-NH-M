import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'umi';
import UserAvatar from '../../components/common/UserAvatar';
import RoleBadge from '../../components/common/RoleBadge';
import TagBadge from '../../components/common/TagBadge';
import VoteButton from '../../components/forum/VoteButton';
import CommentItem from '../../components/forum/CommentItem';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { forumService } from '../../services/forumService';
import { addToast } from '../../utils/toast';
import { timeAgo } from '../../utils/helpers';
import type { Post, Comment, User } from '../../types';

interface Props { currentUser: User | null; }

const PostDetailPage: React.FC<Props> = ({ currentUser }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const postId = id!;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userVote, setUserVote] = useState<'up' | 'down' | null>(null);
  const [voteCount, setVoteCount] = useState(0);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [p, c] = await Promise.all([
          forumService.getPost(postId),
          forumService.getComments(postId),
        ]);
        setPost(p);
        setVoteCount(p.votes || 0);
        setComments(c);
      } catch { addToast('Không tìm thấy bài viết', 'error'); navigate('/forum'); }
      finally { setLoading(false); }
    })();
  }, [postId, navigate]);

  const handleVote = async (direction: 'up' | 'down') => {
    if (!currentUser) { addToast('Vui lòng đăng nhập để vote', 'info'); navigate('/auth/login'); return; }
    const prevVote = userVote;
    const newVote = userVote === direction ? null : direction;
    setUserVote(newVote);
    try {
      await forumService.votePost(postId, direction);
      const p = await forumService.getPost(postId);
      setVoteCount(p.votes || 0);
    } catch {
      setUserVote(prevVote);
      addToast('Không thể cập nhật vote', 'error');
    }
  };

  const handleSave = async () => {
    if (!currentUser) { navigate('/auth/login'); return; }
    try {
      const r = await forumService.savePost(postId);
      setIsSaved(r.saved);
      addToast(r.saved ? 'Đã lưu bài viết!' : 'Đã bỏ lưu!', 'success');
    } catch { addToast('Lỗi thao tác', 'error'); }
  };

  const handleComment = async () => {
    if (!currentUser) { navigate('/auth/login'); return; }
    if (!commentText.trim()) { addToast('Vui lòng nhập nội dung', 'error'); return; }
    setSubmitting(true);
    try {
      const c = await forumService.createComment(postId, { content: commentText });
      setComments(prev => [c, ...prev]);
      setCommentText('');
      if (post) setPost({ ...post, commentCount: (post.commentCount || 0) + 1 });
      addToast('Đã thêm bình luận!', 'success');
    } catch { addToast('Không thể gửi bình luận', 'error'); }
    finally { setSubmitting(false); }
  };

  const handleDeleteComment = async (cid: string) => {
    if (!window.confirm('Xóa bình luận này?')) return;
    try {
      await forumService.deleteComment(cid);
      setComments(prev => prev.filter(c => c.id !== cid));
      addToast('Đã xóa bình luận', 'success');
    } catch { addToast('Không thể xóa', 'error'); }
  };

  const handleReplyAdded = (parentId: number, reply: Comment) => {
    setComments(prev => prev.map(c => c.id === parentId ? { ...c, replies: [...(c.replies ?? []), reply] } : c));
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Xóa bài viết này? Hành động không thể hoàn tác!')) return;
    try {
      await forumService.deletePost(postId);
      addToast('Đã xóa bài viết', 'success');
      navigate('/forum');
    } catch { addToast('Không thể xóa', 'error'); }
  };

  if (loading) return <div style={{ maxWidth:960, margin:'0 auto', padding:'40px 24px' }}><LoadingSpinner /></div>;
  if (!post) return null;

  const canEdit = currentUser && (currentUser.id === post.authorId || currentUser.role === 'admin');
  const ta: React.CSSProperties = { width:'100%', minHeight:110, border:'1.5px solid var(--border)', borderRadius:8, padding:'10px 14px', background:'var(--bg)', color:'var(--text)', fontSize:14, fontFamily:'inherit', resize:'vertical', outline:'none', lineHeight:1.7 };

  return (
    <div style={{ maxWidth:1100, margin:'0 auto', padding:'32px 24px' }}>
      {/* Breadcrumb */}
      <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:14, color:'var(--muted)', marginBottom:24, cursor:'pointer' }}
        onClick={() => navigate('/forum')}>
        ← Diễn đàn · <span style={{ color:'var(--text)', fontWeight:500, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:400 }}>{post.title}</span>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:28, alignItems:'start' }}>
        {/* Main content */}
        <div>
          {/* Post card */}
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:32, marginBottom:20 }}>
            {/* Author */}
            <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:20 }}>
              <UserAvatar user={post.author} size="md" />
              <div>
                <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap' }}>
                  <span style={{ fontWeight:600, fontSize:15 }}>{post.author.username}</span>
                  <RoleBadge role={post.author.role} />
                </div>
                <div style={{ fontSize:13, color:'var(--faint)', marginTop:2 }}>{timeAgo(post.createdAt)} · 👁 {post.views.toLocaleString()} lượt xem</div>
              </div>
              <div style={{ marginLeft:'auto', display:'flex', gap:8 }}>
                <button onClick={handleSave} title={isSaved?'Bỏ lưu':'Lưu bài'} style={{ padding:'6px 14px', borderRadius:20, border:`1.5px solid ${isSaved?'var(--warn)':'var(--border)'}`, background:isSaved?'rgba(245,158,11,.08)':'transparent', color:isSaved?'var(--warn)':'var(--muted)', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>
                  {isSaved ? '🔖 Đã lưu' : '🔖 Lưu'}
                </button>
                {canEdit && (
                  <>
                    <button onClick={() => navigate(`/ask?edit=${postId}`)} style={{ padding:'6px 14px', borderRadius:20, border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>✏️ Sửa</button>
                    <button onClick={handleDeletePost} style={{ padding:'6px 14px', borderRadius:20, border:'1.5px solid var(--danger)', background:'rgba(239,68,68,.06)', color:'var(--danger)', cursor:'pointer', fontSize:13, fontFamily:'inherit' }}>🗑️ Xóa</button>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:26, lineHeight:1.3, marginBottom:16 }}>{post.title}</h1>

            {/* Tags */}
            <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginBottom:20 }}>
              {post.tags.map(t => <TagBadge key={t.id} tag={t} onClick={() => navigate(`/forum?tag=${t.name}`)} />)}
            </div>

            {/* Content + Vote */}
            <div style={{ display:'flex', gap:24 }}>
              <VoteButton votes={voteCount} userVote={userVote} onVote={handleVote} disabled={!currentUser} />
              <div style={{ flex:1, fontSize:15, lineHeight:1.8, color:'var(--text)', whiteSpace:'pre-wrap', wordBreak:'break-word' }}>
                {post.content}
              </div>
            </div>
          </div>

          {/* Comment form */}
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24, marginBottom:20 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17, marginBottom:16 }}>💬 Thêm bình luận</div>
            {currentUser ? (
              <>
                <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12 }}>
                  <UserAvatar user={currentUser} size="sm" />
                  <span style={{ fontWeight:500, fontSize:14 }}>{currentUser.username}</span>
                </div>
                <textarea value={commentText} onChange={e => setCommentText(e.target.value)} placeholder="Chia sẻ suy nghĩ hoặc giải đáp câu hỏi..."
                  style={ta}
                  onFocus={e => { e.target.style.borderColor='var(--pri)'; e.target.style.boxShadow='0 0 0 3px rgba(79,140,255,.1)'; }}
                  onBlur={e => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow=''; }} />
                <div style={{ display:'flex', justifyContent:'flex-end', marginTop:12 }}>
                  <button onClick={handleComment} disabled={submitting} style={{ padding:'9px 24px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:submitting?'not-allowed':'pointer', fontSize:14, fontWeight:500, fontFamily:'inherit', opacity:submitting?.7:1 }}>
                    {submitting ? 'Đang gửi...' : '📤 Gửi bình luận'}
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign:'center', padding:'20px 0' }}>
                <p style={{ color:'var(--muted)', marginBottom:14 }}>Đăng nhập để tham gia thảo luận</p>
                <button onClick={() => navigate('/auth/login')} style={{ padding:'10px 28px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:'pointer', fontSize:14, fontWeight:500, fontFamily:'inherit' }}>Đăng nhập</button>
              </div>
            )}
          </div>

          {/* Comments list */}
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17, marginBottom:20 }}>
              💬 {comments.length} bình luận
            </div>
            {comments.length ? (
              comments.map(c => (
                <CommentItem key={c.id} comment={c} postId={postId} currentUser={currentUser}
                  onDelete={handleDeleteComment} onReplyAdded={handleReplyAdded} />
              ))
            ) : (
              <div style={{ textAlign:'center', padding:'32px 0', color:'var(--muted)' }}>
                <div style={{ fontSize:36, marginBottom:10 }}>💭</div>
                <p>Chưa có bình luận nào. Hãy là người đầu tiên!</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display:'flex', flexDirection:'column', gap:16, position:'sticky', top:80 }}>
          <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:20 }}>
            <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.5px', color:'var(--muted)', textTransform:'uppercase', marginBottom:14 }}>📌 Thông tin bài viết</div>
            {[
              { label:'Tác giả', val: post.author.username },
              { label:'Đăng lúc', val: timeAgo(post.createdAt) },
              { label:'Lượt xem', val: `👁 ${post.views.toLocaleString()}` },
              { label:'Vote', val: `▲ ${voteCount}` },
              { label:'Bình luận', val: `💬 ${comments.length}` },
            ].map((r,i) => (
              <div key={i} style={{ marginBottom:12 }}>
                <div style={{ fontSize:12, color:'var(--faint)', marginBottom:2 }}>{r.label}</div>
                <div style={{ fontWeight:500, fontSize:14 }}>{r.val}</div>
              </div>
            ))}
          </div>
          {post.tags.length > 0 && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:20 }}>
              <div style={{ fontSize:12, fontWeight:700, letterSpacing:'.5px', color:'var(--muted)', textTransform:'uppercase', marginBottom:12 }}>🏷️ Tags</div>
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {post.tags.map(t => <TagBadge key={t.id} tag={t} onClick={() => navigate(`/forum?tag=${t.name}`)} />)}
              </div>
            </div>
          )}
          <button onClick={() => navigate('/forum')} style={{ padding:'11px 0', borderRadius:'var(--radius)', border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:14, fontFamily:'inherit', transition:'all .2s' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor='var(--pri)'; el.style.color='var(--pri)'; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor='var(--border)'; el.style.color='var(--muted)'; }}>
            ← Về diễn đàn
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;
