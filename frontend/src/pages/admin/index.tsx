import React, { useState, useEffect } from 'react';
import { useNavigate } from 'umi';
import { Avatar, TagBadge, RoleBadge, PostCard } from '@/components/forum';
import { timeAgo } from '@/utils/forum';
import { forumAPI } from '@/services/forum-api';
import type { Post, User, Tag } from '@/types';

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'Làm thế nào để hiểu Recursion?',
    content: 'Mình đang học về đệ quy...',
    author: { id: 1, username: 'sv_tranminh', email: 'minh@student.edu.vn', role: 'student' },
    tags: [{ id: 1, name: 'Lập trình', color: '#4F8CFF', usageCount: 45 }],
    votes: 24,
    commentCount: 8,
    views: 312,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

const MOCK_USERS: User[] = [
  { id: 1, username: 'sv_tranminh', email: 'minh@student.edu.vn', role: 'student', isActive: true },
  { id: 2, username: 'gv_nguyenha', email: 'ha@teacher.edu.vn', role: 'lecturer', isActive: true },
  { id: 3, username: 'admin', email: 'admin@forum.edu.vn', role: 'admin', isActive: true },
];

const MOCK_TAGS: Tag[] = [
  { id: 1, name: 'Lập trình', color: '#4F8CFF', usageCount: 45 },
  { id: 2, name: 'React', color: '#61DAFB', usageCount: 38 },
  { id: 3, name: 'SQL', color: '#4DE2E2', usageCount: 28 },
];

export default function AdminPage() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState<'dashboard' | 'users' | 'posts' | 'tags'>('dashboard');
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [modal, setModal] = useState<string | null>(null);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type = 'info') => {
    setToasts((p) => [...p, { message, type }]);
    setTimeout(() => setToasts((p) => p.slice(1)), 3000);
  };

  useEffect(() => {
    (async () => {
      try {
        const ru = await forumAPI.getPosts();
        const rp = await forumAPI.getPosts();
        if (ru?.data) setUsers(ru.data);
        if (rp?.data) setPosts(rp.data);
      } catch (e) {
        console.log('Using mock data');
      }
    })();
  }, []);

  const handleDeletePost = async (id: number) => {
    if (!confirm('Xóa bài viết này?')) return;
    try {
      await forumAPI.deletePost(id);
      setPosts((p) => p.filter((x) => x.id !== id));
      addToast('Đã xóa bài viết', 'success');
    } catch (e) {
      setPosts((p) => p.filter((x) => x.id !== id));
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!confirm('Xóa người dùng này?')) return;
    try {
      await forumAPI.deletePost(id);
      setUsers((p) => p.filter((u) => u.id !== id));
      addToast('Đã xóa người dùng', 'success');
    } catch (e) {
      setUsers((p) => p.filter((u) => u.id !== id));
    }
  };

  const MENU_ITEMS = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard' },
    { id: 'users', icon: '👥', label: 'Người dùng' },
    { id: 'posts', icon: '📝', label: 'Bài viết' },
    { id: 'tags', icon: '🏷️', label: 'Tags' },
  ];

  const barData = [
    { label: 'T2', v: 18 },
    { label: 'T3', v: 32 },
    { label: 'T4', v: 24 },
    { label: 'T5', v: 45 },
    { label: 'T6', v: 38 },
    { label: 'T7', v: 22 },
    { label: 'CN', v: 15 },
  ];
  const maxBar = Math.max(...barData.map((d) => d.v));

  return (
    <div className="admin-layout" style={{ minHeight: '100vh' }}>
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">📚 Admin</div>
        <div style={{ padding: '8px 12px 6px', fontSize: 11, color: 'var(--faint)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px' }}>Menu</div>
        <div className="admin-menu">
          {MENU_ITEMS.map((m: any) => (
            <button key={m.id} className={`admin-menu-item ${menu === m.id ? 'active' : ''}`} onClick={() => setMenu(m.id)}>
              <span>{m.icon}</span> {m.label}
            </button>
          ))}
        </div>
        <div style={{ margin: 'auto 0 0', padding: 12 }}>
          <button className="admin-menu-item" style={{ width: '100%' }} onClick={() => navigate('/forum')}>
            ← Về diễn đàn
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="admin-main">
        <div className="admin-header">
          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18 }}>
            {MENU_ITEMS.find((m: any) => m.id === menu)?.label}
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 12 }}>
            <Avatar username="admin" />
            <span style={{ fontSize: 14, fontWeight: 500 }}>Admin</span>
          </div>
        </div>

        <div className="admin-content">
          {/* DASHBOARD */}
          {menu === 'dashboard' && (
            <>
              <div className="stat-grid">
                {[
                  { label: 'Tổng bài viết', num: posts.length * 47, icon: '📝', color: '#4F8CFF' },
                  { label: 'Tổng người dùng', num: users.length * 23, icon: '👥', color: '#7B61FF' },
                  { label: 'Bình luận', num: posts.reduce((a, b) => a + b.commentCount, 0) * 12, icon: '💬', color: '#4DE2E2' },
                  { label: 'Hoạt động hôm nay', num: 38, icon: '🔥', color: '#F59E0B' },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <div style={{ float: 'right', fontSize: 32, opacity: 0.2 }}>{s.icon}</div>
                    <div className="stat-card-num" style={{ color: s.color }}>{s.num.toLocaleString()}</div>
                    <div className="stat-card-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
                <div className="card">
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📈 Bài viết theo ngày (tuần này)</div>
                  <div className="chart-bar">
                    {barData.map((d) => (
                      <div key={d.label} className="chart-col">
                        <div className="chart-bar-fill" style={{ height: `${(d.v / maxBar) * 90}px` }} />
                        <div className="chart-label">{d.label}</div>
                        <div className="chart-label" style={{ color: 'var(--pri)' }}>{d.v}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="card">
                  <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📊 Thống kê hệ thống</div>
                  {[
                    { label: 'Tỷ lệ bài viết có câu trả lời', val: 78 },
                    { label: 'Người dùng hoạt động (7 ngày)', val: 65 },
                    { label: 'Tỷ lệ sinh viên', val: 82 },
                    { label: 'Điểm hài lòng', val: 91 },
                  ].map((s, i) => (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}>
                        <span className="text-muted">{s.label}</span>
                        <span style={{ fontWeight: 600, color: 'var(--pri)' }}>{s.val}%</span>
                      </div>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${s.val}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="card mt-6">
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📋 Bài viết gần đây</div>
                <table className="data-table">
                  <thead>
                    <tr><th>Tiêu đề</th><th>Tác giả</th><th>Vote</th><th>Views</th><th>Ngày đăng</th></tr>
                  </thead>
                  <tbody>
                    {posts.slice(0, 5).map((p) => (
                      <tr key={p.id}>
                        <td style={{ maxWidth: 280 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div></td>
                        <td><div className="flex items-center gap-2"><Avatar username={p.author.username} />{p.author.username}</div></td>
                        <td><span className="badge badge-blue">▲ {p.votes}</span></td>
                        <td>{p.views}</td>
                        <td>{timeAgo(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* USERS */}
          {menu === 'users' && (
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16 }}>👥 Quản lý người dùng ({users.length})</div>
                <button className="btn btn-primary btn-sm" onClick={() => setModal('adduser')}>+ Thêm người dùng</button>
              </div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr><th>Người dùng</th><th>Email</th><th>Vai trò</th><th>Trạng thái</th><th>Hành động</th></tr>
                  </thead>
                  <tbody>
                    {users.map((u) => (
                      <tr key={u.id}>
                        <td><div className="flex items-center gap-2"><Avatar username={u.username} /><span style={{ fontWeight: 500 }}>{u.username}</span></div></td>
                        <td>{u.email}</td>
                        <td><RoleBadge role={u.role} /></td>
                        <td><span className={`badge ${u.isActive ? 'badge-green' : 'badge-red'}`}>{u.isActive ? '✓ Hoạt động' : '✗ Đã khóa'}</span></td>
                        <td><div className="flex gap-2">
                          <button className="btn btn-ghost btn-xs" onClick={() => { setEditUser(u); setModal('edituser'); }}>Sửa</button>
                          {u.role !== 'admin' && <button className="btn btn-danger btn-xs" onClick={() => handleDeleteUser(u.id)}>Xóa</button>}
                        </div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* POSTS */}
          {menu === 'posts' && (
            <div className="card">
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>📝 Quản lý bài viết ({posts.length})</div>
              <div style={{ overflowX: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr><th>Tiêu đề</th><th>Tác giả</th><th>Tags</th><th>Vote</th><th>Views</th><th>Ngày đăng</th><th>Hành động</th></tr>
                  </thead>
                  <tbody>
                    {posts.map((p) => (
                      <tr key={p.id}>
                        <td style={{ maxWidth: 240 }}><div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500, cursor: 'pointer', color: 'var(--pri)' }} onClick={() => navigate(`/forum/${p.id}`)}>{p.title}</div></td>
                        <td>{p.author.username}</td>
                        <td><div className="flex" style={{ gap: 4, flexWrap: 'wrap' }}>{p.tags.slice(0, 2).map((t) => <TagBadge key={t.id} tag={t} />)}{p.tags.length > 2 && <span className="text-sm text-muted">+{p.tags.length - 2}</span>}</div></td>
                        <td><span className="badge badge-blue">▲ {p.votes}</span></td>
                        <td>{p.views}</td>
                        <td>{timeAgo(p.createdAt)}</td>
                        <td><div className="flex gap-2"><button className="btn btn-ghost btn-xs" onClick={() => navigate(`/forum/${p.id}`)}>Xem</button><button className="btn btn-danger btn-xs" onClick={() => handleDeletePost(p.id)}>Xóa</button></div></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAGS */}
          {menu === 'tags' && (
            <div className="card">
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 16, marginBottom: 20 }}>🏷️ Quản lý Tags</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
                {MOCK_TAGS.map((t) => (
                  <div key={t.id} style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <TagBadge tag={t} />
                      <button className="btn btn-ghost btn-xs">Xóa</button>
                    </div>
                    <div style={{ marginTop: 10, fontSize: 13, color: 'var(--muted)' }}>{t.usageCount} bài viết</div>
                    <div className="progress-bar mt-4"><div className="progress-fill" style={{ width: `${Math.min(100, (t.usageCount / 55) * 100)}%`, background: t.color }} /></div>
                  </div>
                ))}
                <div style={{ border: '2px dashed var(--border)', borderRadius: 'var(--radius-sm)', padding: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--muted)', flexDirection: 'column', gap: 8 }} onClick={() => setModal('addtag')}>
                  <span style={{ fontSize: 28 }}>+</span>
                  <span style={{ fontSize: 13 }}>Thêm tag mới</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {modal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && setModal(null)}>
          <div className="modal">
            {modal === 'edituser' && editUser && (
              <>
                <div className="modal-title">✏️ Sửa người dùng: {editUser.username}</div>
                <div className="form-group">
                  <label className="form-label">Vai trò</label>
                  <select className="form-select" value={editUser.role} onChange={(e) => setEditUser((p) => ({ ...p!, role: e.target.value as any }))}>
                    <option value="student">Sinh viên</option>
                    <option value="lecturer">Giảng viên</option>
                    <option value="admin">Quản trị viên</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Trạng thái</label>
                  <div className="flex items-center gap-2">
                    <input type="checkbox" checked={editUser.isActive} onChange={(e) => setEditUser((p) => ({ ...p!, isActive: e.target.checked }))} />
                    <span style={{ fontSize: 14 }}>Tài khoản đang hoạt động</span>
                  </div>
                </div>
                <div className="modal-actions">
                  <button className="btn btn-ghost" onClick={() => setModal(null)}>Hủy</button>
                  <button className="btn btn-primary" onClick={async () => { addToast('Đã cập nhật người dùng!', 'success'); setModal(null); }}>Lưu thay đổi</button>
                </div>
              </>
            )}
            {modal === 'adduser' && (
              <>
                <div className="modal-title">➕ Thêm người dùng mới</div>
                <div className="form-group"><label className="form-label">Tên đăng nhập</label><input className="form-input" placeholder="Tên đăng nhập" /></div>
                <div className="form-group"><label className="form-label">Email</label><input className="form-input" type="email" placeholder="Email" /></div>
                <div className="form-group"><label className="form-label">Vai trò</label><select className="form-select"><option value="student">Sinh viên</option><option value="lecturer">Giảng viên</option><option value="admin">Quản trị viên</option></select></div>
                <div className="modal-actions"><button className="btn btn-ghost" onClick={() => setModal(null)}>Hủy</button><button className="btn btn-primary" onClick={() => { addToast('Đã thêm người dùng!', 'success'); setModal(null); }}>Thêm</button></div>
              </>
            )}
            {modal === 'addtag' && (
              <>
                <div className="modal-title">🏷️ Thêm Tag mới</div>
                <div className="form-group"><label className="form-label">Tên tag</label><input className="form-input" placeholder="VD: Lập trình" /></div>
                <div className="form-group"><label className="form-label">Màu sắc</label><div className="flex items-center gap-3"><input type="color" defaultValue="#4F8CFF" style={{ width: 48, height: 40, border: '1px solid var(--border)', borderRadius: 6, cursor: 'pointer' }} /><span style={{ fontSize: 14, color: 'var(--muted)' }}>Chọn màu cho tag</span></div></div>
                <div className="modal-actions"><button className="btn btn-ghost" onClick={() => setModal(null)}>Hủy</button><button className="btn btn-primary" onClick={() => { addToast('Đã thêm tag!', 'success'); setModal(null); }}>Thêm tag</button></div>
              </>
            )}
          </div>
        </div>
      )}

      {toasts.map((t, i) => (
        <div key={i} className={`toast toast-${t.type}`}>{t.message}</div>
      ))}
    </div>
  );
}
