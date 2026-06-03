import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';
import type { Post, Tag } from '../types';
import { forumService } from '../services/forumService';
import { useAuth } from '../hooks/useAuth';

const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Làm thế nào để hiểu Recursion trong lập trình?',
    content: 'Mình đang học về đệ quy nhưng không hiểu cách hoạt động. Ai có thể giải thích bằng ví dụ thực tế không?',
    author: { id: '2', name: 'sv_tranminh', role: 'student' },
    authorId: '2',
    tags: [{ id: '1', name: 'Lập trình', color: '#4F8CFF' }, { id: '2', name: 'Thuật toán', color: '#7B61FF' }],
    votes: 24,
    views: 312,
    commentCount: 8,
    createdAt: '2024-05-20T08:30:00Z',
  },
  {
    id: '2',
    title: 'Phân biệt giữa SQL JOIN các loại: INNER, LEFT, RIGHT, FULL',
    content: 'Mình hay bị nhầm lẫn giữa các loại JOIN trong SQL. Ai giải thích rõ ràng với ví dụ được không?',
    author: { id: '3', name: 'gv_nguyenha', role: 'lecturer' },
    authorId: '3',
    tags: [{ id: '3', name: 'Cơ sở dữ liệu', color: '#4DE2E2' }, { id: '4', name: 'SQL', color: '#FF6B6B' }],
    votes: 41,
    views: 580,
    commentCount: 15,
    createdAt: '2024-05-19T14:20:00Z',
  },
  {
    id: '3',
    title: 'Hướng dẫn setup môi trường React từ đầu năm 2024',
    content: 'Mình mới học React và muốn biết cách setup môi trường đúng chuẩn hiện tại không dùng CRA nữa.',
    author: { id: '4', name: 'sv_lephuong', role: 'student' },
    authorId: '4',
    tags: [{ id: '5', name: 'React', color: '#61DAFB' }, { id: '6', name: 'Frontend', color: '#F7DF1E' }],
    votes: 18,
    views: 201,
    commentCount: 5,
    createdAt: '2024-05-18T10:00:00Z',
  },
  {
    id: '4',
    title: 'Giải thích Big O notation cho người mới',
    content: 'Mình nghe nhiều về Big O nhưng không hiểu tại sao nó quan trọng và cách tính như thế nào.',
    author: { id: '5', name: 'sv_dohung', role: 'student' },
    authorId: '5',
    tags: [{ id: '1', name: 'Lập trình', color: '#4F8CFF' }, { id: '2', name: 'Thuật toán', color: '#7B61FF' }],
    votes: 32,
    views: 445,
    commentCount: 12,
    createdAt: '2024-05-17T09:15:00Z',
  },
  {
    id: '5',
    title: 'Tổng hợp các lệnh Git quan trọng cần nhớ',
    content: 'Chia sẻ cheatsheet các lệnh Git hay dùng nhất trong quá trình làm việc nhóm.',
    author: { id: '3', name: 'gv_nguyenha', role: 'lecturer' },
    authorId: '3',
    tags: [{ id: '7', name: 'Git', color: '#F05032' }, { id: '8', name: 'DevOps', color: '#2496ED' }],
    votes: 55,
    views: 720,
    commentCount: 20,
    createdAt: '2024-05-16T16:40:00Z',
  },
];

const MOCK_TAGS: Tag[] = [
  { id: '1', name: 'Lập trình', color: '#4F8CFF', usageCount: 45 },
  { id: '2', name: 'Thuật toán', color: '#7B61FF', usageCount: 32 },
  { id: '3', name: 'Cơ sở dữ liệu', color: '#4DE2E2', usageCount: 28 },
  { id: '4', name: 'SQL', color: '#FF6B6B', usageCount: 21 },
  { id: '5', name: 'React', color: '#61DAFB', usageCount: 19 },
  { id: '6', name: 'Frontend', color: '#F7DF1E', usageCount: 16 },
  { id: '7', name: 'Git', color: '#F05032', usageCount: 38 },
  { id: '8', name: 'DevOps', color: '#2496ED', usageCount: 12 },
];

// styles moved to src/styles/global.less

function RoleBadge({ role }: { role: string }) {
  const colors: Record<string, string> = { student: '#4F8CFF', lecturer: '#7B61FF', admin: '#FF6B6B' };
  const labels: Record<string, string> = { student: 'Sinh viên', lecturer: 'Giảng viên', admin: 'Quản trị viên' };
  return <span className="badge badge-blue" style={{ background: colors[role] + '18', color: colors[role] }}>{labels[role]}</span>;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Vừa xong';
  if (m < 60) return `${m} phút trước`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h} giờ trước`;
  const d = Math.floor(h / 24);
  if (d < 30) return `${d} ngày trước`;
  return new Date(dateStr).toLocaleDateString('vi-VN');
}

function Avatar({ user, size = '' }: { user?: any; size?: 'lg' | '' }) {
  const name = user?.name || user?.username || '?';
  const initial = String(name)[0]?.toUpperCase() || '?';
  const colors = ['#4F8CFF', '#7B61FF', '#4DE2E2', '#FF6B6B', '#22C55E'];
  const bg = colors[(String(name).charCodeAt(0) || 0) % colors.length];
  return (
    <div className={`avatar ${size === 'lg' ? 'avatar-lg' : 'avatar-md'}`} style={{ background: bg }}>
      {user?.avatar ? <img src={user.avatar} alt={name} className="avatar-img" /> : initial}
    </div>
  );
}

function TagBadge({ tag, onClick, active }: { tag: Tag; onClick?: () => void; active?: boolean }) {
  const color = tag.color || '#4F8CFF';
  return (
    <span className="tag-badge" onClick={onClick} style={active ? { background: color, color: '#fff' } : { background: color + '20', color: color }}>
      {tag.name}
    </span>
  );
}

function PostCard({ post, onClick }: { post: Post; onClick?: (p: Post) => void }) {
  return (
    <div className="post-card" onClick={() => onClick && onClick(post)}>
      <div className="post-header">
        <Avatar user={post.author} />
        <div className="post-author">
          {post.author.name}
          <RoleBadge role={post.author.role} />
        </div>
        <div className="post-date">{timeAgo(post.createdAt)}</div>
      </div>
      <div className="post-title">{post.title}</div>
      <div className="post-content">{post.content}</div>
      <div className="tags-wrap">{post.tags.slice(0, 3).map(t => <TagBadge key={t.id} tag={t} />)}</div>
      <div className="post-stats">
        <span className="stat-pill">▲ {post.votes} vote</span>
        <span className="stat-pill">💬 {post.commentCount} bình luận</span>
        <span className="stat-pill">👁 {post.views} lượt xem</span>
      </div>
    </div>
  );
}

export default function LandingDemo(): JSX.Element {
  const navigate = useNavigate();
  const { user, isLoggedIn } = useAuth();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const postsRes = await forumService.getPosts({ page: 1, limit: 10 });
        if (postsRes?.data) setPosts(postsRes.data);
      } catch {
        // fallback to mocks
      }
      try {
        const top = await forumService.getTopTags(8);
        if (top) setTags(top);
      } catch {
        // fallback to mocks
      }
      setLoading(false);
    })();
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="page-nav">
        <div className="page-nav-inner">
          <div className="page-nav-title" onClick={() => navigate('/')}>
            📚 Diễn đàn
          </div>
          <div className="page-nav-actions">
            {isLoggedIn ? (
              <>
                <Button type="primary" onClick={() => navigate('/ask')} className="hero-btn">
                  ✏️ Đặt câu hỏi
                </Button>
                <Button onClick={() => navigate('/profile')} className="hero-btn hero-btn-ghost">
                  {user?.name}
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate('/auth/login')} className="hero-btn hero-btn-ghost">
                  Đăng nhập
                </Button>
                <Button type="primary" onClick={() => navigate('/auth/register')} className="hero-btn">
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="page-inner">
        <div className="hero-section">
          <div className="hero-copy">
            <div className="eyebrow">🚀 CÓ CÂU HỎI?</div>
            <h1 className="hero-heading">Diễn đàn Hỏi Đáp Sinh viên</h1>
            <p className="hero-lead">Nơi sinh viên chia sẻ kiến thức, giải đáp thắc mắc và học hỏi cùng nhau. Hỏi, trả lời, và phát triển kỹ năng của bạn.</p>
            <div className="hero-btns">
              {isLoggedIn ? (
                <Button type="primary" size="large" className="hero-btn" onClick={() => navigate('/ask')}>
                  Đặt câu hỏi ngay
                </Button>
              ) : (
                <>
                  <Button type="primary" size="large" className="hero-btn" onClick={() => navigate('/auth/login')}>
                    Bắt đầu hỏi đáp
                  </Button>
                  <Button size="large" className="hero-btn hero-btn-ghost" onClick={() => navigate('/forum')}>
                    Xem bài viết
                  </Button>
                </>
              )}
            </div>
          </div>
          <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">2.5K+</div>
            <div className="hero-stat-label">Câu hỏi</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">8K+</div>
            <div className="hero-stat-label">Câu trả lời</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">1.2K+</div>
            <div className="hero-stat-label">Thành viên</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">↗ 98%</div>
            <div className="hero-stat-label">Hài lòng</div>
          </div>
        </div>
      </div>
      </div>

      {/* Main Content */}
      <div className="page-inner">
        <div className="two-col-layout">
          <div>
            {/* Section Header */}
            <div className="section-header">
              <div>
                <h2 className="section-title">🔥 Bài viết mới nhất</h2>
                <p className="section-subtitle">Các câu hỏi và bài viết gần đây từ cộng đồng</p>
              </div>
              <div className="filters">
                <Button size="small" className="filter-btn active">
                  Mới nhất
                </Button>
                <Button size="small" className="filter-btn">
                  Nổi bật
                </Button>
                <Button size="small" className="filter-btn">
                  Vote cao
                </Button>
              </div>
            </div>

            {/* Posts List */}
            <div className="post-list">
              {loading ? (
                <div className="loading">
                  <div className="spinner" />
                </div>
              ) : posts.length > 0 ? (
                posts.map(p => (
                  <div key={p.id} onClick={() => navigate(`/forum/${p.id}`)}>
                    <PostCard post={p} onClick={() => navigate(`/forum/${p.id}`)} />
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">📭</div>
                  <p>Chưa có bài viết. Hãy là người đầu tiên đặt câu hỏi!</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="aside-card">
            <h3 className="sidebar-title">
              🏷️ Chủ đề phổ biến
            </h3>
            <div className="tags-wrap">
              {tags.map(t => (
                <TagBadge 
                  key={t.id} 
                  tag={t} 
                  onClick={() => navigate(`/forum?tag=${t.id}`)}
                  active={false}
                />
              ))}
            </div>
            <div className="sidebar-note">
              <div className="sidebar-note-title">💡 Mẹo hỏi đáp:</div>
              <ul className="sidebar-note-list">
                <li>Viết tiêu đề rõ ràng</li>
                <li>Cung cấp chi tiết đầy đủ</li>
                <li>Sử dụng code formatting</li>
                <li>Tìm kiếm trước khi hỏi</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
