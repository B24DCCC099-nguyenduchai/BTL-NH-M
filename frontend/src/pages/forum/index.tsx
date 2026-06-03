import React, { useState, useEffect } from 'react';
import { history } from 'umi';
import { Avatar, TagBadge, RoleBadge, PostCard, Loading, EmptyState } from '@/components/forum';
import { timeAgo } from '@/utils/forum';
import { forumAPI } from '@/services/forum-api';
import { useAuth } from '@/hooks/useAuth';
import type { Post, Tag, User } from '@/types';

// Mock data
const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'Làm thế nào để hiểu Recursion trong lập trình?',
    content: 'Mình đang học về đệ quy nhưng không hiểu cách hoạt động. Ai có thể giải thích bằng ví dụ thực tế không?',
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
  {
    id: 3,
    title: 'Hướng dẫn setup môi trường React từ đầu năm 2024',
    content: 'Mình mới học React và muốn biết cách setup môi trường đúng chuẩn hiện tại không dùng CRA nữa.',
    author: { id: 3, username: 'sv_lephuong', role: 'student', avatar: null },
    tags: [
      { id: 5, name: 'React', color: '#61DAFB' },
      { id: 6, name: 'Frontend', color: '#FF6B6B' },
    ],
    votes: 18,
    views: 201,
    commentCount: 5,
    createdAt: '2024-05-18T09:15:00Z',
  },
  {
    id: 4,
    title: 'Giải thích Big O notation cho người mới',
    content: 'Mình nghe nhiều về Big O nhưng không hiểu tại sao nó quan trọng và cách tính như thế nào.',
    author: { id: 4, username: 'sv_dohung', role: 'student', avatar: null },
    tags: [
      { id: 1, name: 'Lập trình', color: '#4F8CFF' },
      { id: 2, name: 'Thuật toán', color: '#7B61FF' },
    ],
    votes: 32,
    views: 445,
    commentCount: 12,
    createdAt: '2024-05-17T16:45:00Z',
  },
  {
    id: 5,
    title: 'Tổng hợp các lệnh Git quan trọng cần nhớ',
    content: 'Chia sẻ cheatsheet các lệnh Git hay dùng nhất trong quá trình làm việc nhóm.',
    author: { id: 2, username: 'gv_nguyenha', role: 'lecturer', avatar: null },
    tags: [
      { id: 7, name: 'Git', color: '#F05033' },
      { id: 8, name: 'DevOps', color: '#FF9800' },
    ],
    votes: 55,
    views: 720,
    commentCount: 20,
    createdAt: '2024-05-16T11:00:00Z',
  },
];

const MOCK_TAGS: Tag[] = [
  { id: 1, name: 'Lập trình', color: '#4F8CFF' },
  { id: 2, name: 'Thuật toán', color: '#7B61FF' },
  { id: 3, name: 'Cơ sở dữ liệu', color: '#4DE2E2' },
  { id: 4, name: 'SQL', color: '#22C55E' },
  { id: 5, name: 'React', color: '#61DAFB' },
  { id: 6, name: 'Frontend', color: '#FF6B6B' },
  { id: 7, name: 'Git', color: '#F05033' },
  { id: 8, name: 'DevOps', color: '#FF9800' },
];

const MOCK_USERS: User[] = [
  { id: 1, username: 'sv_tranminh', email: 'tranminh@student.edu.vn', role: 'student', avatar: null },
  { id: 2, username: 'gv_nguyenha', email: 'nguyenha@edu.vn', role: 'lecturer', avatar: null },
  { id: 3, username: 'sv_lephuong', email: 'lephuong@student.edu.vn', role: 'student', avatar: null },
];

export default function HomePage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [tags, setTags] = useState<Tag[]>(MOCK_TAGS);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('newest');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const params: any = { page, limit: 10 };
        if (filter !== 'newest') params.sort = filter;
        if (activeTag) params.tag = activeTag;
        if (search) params.keyword = search;

        const res = await forumAPI.getPosts(params);
        if (res?.data) setPosts(res.data);

        const tagsRes = await forumAPI.getTags();
        if (tagsRes?.data) setTags(tagsRes.data);
      } catch (err) {
        // Use mock data on error
        setPosts(MOCK_POSTS);
        setTags(MOCK_TAGS);
      }
      setLoading(false);
    })();
  }, [page, filter, activeTag, search]);

  const filtered = posts.filter((p) => {
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) &&
      !p.content.toLowerCase().includes(search.toLowerCase())) return false;
    if (activeTag && !p.tags.some((t) => t.name === activeTag)) return false;
    return true;
  });

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <h1>📚 Diễn đàn Hỏi Đáp<br />Sinh viên</h1>
        <p>Chia sẻ kiến thức · Giải đáp thắc mắc · Học hỏi cùng nhau</p>
        <div className="hero-btns">
          {user ? (
            <button className="btn-hero btn-hero-pri" onClick={() => history.push('/forum/ask')}>
              ✏️ Đặt câu hỏi
            </button>
          ) : (
            <>
              <button className="btn-hero btn-hero-pri" onClick={() => history.push('/auth/login')}>
                Bắt đầu ngay
              </button>
              <button className="btn-hero btn-hero-sec" onClick={() => history.push('/auth/register')}>
                Tạo tài khoản
              </button>
            </>
          )}
        </div>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-num">{posts.length * 47}+</div>
            <div className="hero-stat-label">Bài viết</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">1,234</div>
            <div className="hero-stat-label">Thành viên</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{tags.length * 89}+</div>
            <div className="hero-stat-label">Bình luận</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-num">{tags.length}</div>
            <div className="hero-stat-label">Chủ đề</div>
          </div>
        </div>
      </div>

      <div className="two-col">
        {/* Main */}
        <div>
          <div className="section-header">
            <div className="section-title">🔥 Bài viết mới nhất</div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['newest', 'hot', 'votes', 'views'].map((s) => (
                <button
                  key={s}
                  className={`filter-btn ${filter === s ? 'active' : ''}`}
                  onClick={() => setFilter(s)}
                >
                  {s === 'newest' ? 'Mới nhất' : s === 'hot' ? 'Nổi bật' : s === 'votes' ? 'Vote cao' : 'Xem nhiều'}
                </button>
              ))}
            </div>
          </div>

          {/* Search */}
          <div className="search-wrap" style={{ maxWidth: '100%', marginBottom: 16 }}>
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              placeholder="Tìm kiếm bài viết, câu hỏi..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {loading ? (
            <Loading />
          ) : filtered.length ? (
            <div className="stack">
              {filtered.map((p) => (
                <PostCard key={p.id} post={p} onClick={() => history.push(`/forum/${p.id}`)} />
              ))}
            </div>
          ) : (
            <EmptyState text="Không tìm thấy bài viết nào" />
          )}

          {/* Pagination */}
          {!loading && (
            <div className="pagination">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`page-btn ${page === p ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          {/* Tags */}
          <div className="card-sm">
            <div className="sidebar-title">🏷️ Chủ đề phổ biến</div>
            <div className="tags-wrap">
              {tags.map((t) => (
                <TagBadge
                  key={t.id}
                  tag={t}
                  active={activeTag === t.name}
                  onClick={() => setActiveTag(activeTag === t.name ? null : t.name)}
                />
              ))}
            </div>
          </div>

          {/* Top Lecturers */}
          <div className="card-sm">
            <div className="sidebar-title">👨‍🏫 Giảng viên nổi bật</div>
            {MOCK_USERS.filter((u) => u.role === 'lecturer').map((u) => (
              <div key={u.id} className="flex items-center gap-2" style={{ marginBottom: 12 }}>
                <Avatar username={u.username} avatar={u.avatar} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 500 }}>{u.username}</div>
                  <RoleBadge role={u.role} />
                </div>
              </div>
            ))}
          </div>

          {/* Hot posts */}
          <div className="card-sm">
            <div className="sidebar-title">🔥 Hot nhất tuần</div>
            {[...posts]
              .sort((a, b) => b.votes - a.votes)
              .slice(0, 3)
              .map((p) => (
                <div
                  key={p.id}
                  style={{ marginBottom: 12, cursor: 'pointer' }}
                  onClick={() => history.push(`/forum/${p.id}`)}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, lineHeight: 1.4, color: 'var(--text)' }}>
                    {p.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--faint)', marginTop: 3 }}>
                    ▲ {p.votes} · 👁 {p.views}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
