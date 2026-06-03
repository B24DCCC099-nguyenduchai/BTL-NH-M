import React, { useState } from 'react';
import { useNavigate } from 'umi';
import { Avatar, TagBadge, RoleBadge, PostCard, Loading } from '@/components/forum';
import { timeAgo } from '@/utils/forum';
import { forumAPI } from '@/services/forum-api';
import type { Post } from '@/types';

const MOCK_POSTS: Post[] = [
  {
    id: 1,
    title: 'Làm thế nào để hiểu Recursion trong lập trình?',
    content: 'Mình đang học về đệ quy nhưng không hiểu cách hoạt động...',
    author: { id: 1, username: 'sv_tranminh', email: 'minh@student.edu.vn', role: 'student' },
    tags: [{ id: 1, name: 'Lập trình', color: '#4F8CFF', usageCount: 45 }],
    votes: 24,
    commentCount: 8,
    views: 312,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

interface ProfileFormState {
  username: string;
  bio: string;
  email: string;
}

interface PasswordFormState {
  current: string;
  newpw: string;
  confirm: string;
}

export default function ProfilePage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'posts' | 'saved' | 'settings' | 'password'>('posts');
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [form, setForm] = useState<ProfileFormState>({
    username: 'sv_tranminh',
    bio: 'Sinh viên năm 2, đam mê lập trình',
    email: 'minh@student.edu.vn',
  });
  const [pwForm, setPwForm] = useState<PasswordFormState>({
    current: '',
    newpw: '',
    confirm: '',
  });
  const [loading, setLoading] = useState(false);
  const [toasts, setToasts] = useState<any[]>([]);

  const addToast = (message: string, type = 'info') => {
    setToasts((p) => [...p, { message, type }]);
    setTimeout(() => setToasts((p) => p.slice(1)), 3000);
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      await forumAPI.updatePost(1, form);
      addToast('Đã cập nhật hồ sơ!', 'success');
    } catch (e) {
      addToast('Đã cập nhật hồ sơ! (mock)', 'success');
    }
    setLoading(false);
  };

  const handleChangePw = async () => {
    if (pwForm.newpw !== pwForm.confirm) {
      addToast('Mật khẩu xác nhận không khớp', 'error');
      return;
    }
    if (pwForm.newpw.length < 6) {
      addToast('Mật khẩu phải ít nhất 6 ký tự', 'error');
      return;
    }
    setLoading(true);
    try {
      await forumAPI.createPost({ title: '', content: '', tags: [] });
      addToast('Đã đổi mật khẩu thành công!', 'success');
    } catch (e) {
      addToast('Đã đổi mật khẩu thành công! (mock)', 'success');
    }
    setPwForm({ current: '', newpw: '', confirm: '' });
    setLoading(false);
  };

  const user = { id: 1, username: 'sv_tranminh', email: form.email, role: 'student' };

  return (
    <div className="page">
      <div className="profile-header">
        <Avatar username={user.username} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 800, fontSize: 24 }}>{user.username}</div>
          <div style={{ marginTop: 4 }}>
            <RoleBadge role={user.role || 'student'} />
          </div>
          <div style={{ color: 'var(--muted)', fontSize: 14, marginTop: 8 }}>{user.email}</div>
          <div style={{ display: 'flex', gap: 24, marginTop: 16 }}>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20 }}>12</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Bài viết</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20 }}>48</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Bình luận</div>
            </div>
            <div>
              <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 20 }}>234</div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>Vote nhận</div>
            </div>
          </div>
        </div>
      </div>

      <div className="profile-tab-bar">
        {['posts', 'saved', 'settings', 'password'].map((t: string) => (
          <div
            key={t}
            className={`tab-item ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t as any)}
          >
            {t === 'posts'
              ? '📝 Bài viết'
              : t === 'saved'
              ? '🔖 Đã lưu'
              : t === 'settings'
              ? '⚙️ Hồ sơ'
              : '🔒 Mật khẩu'}
          </div>
        ))}
      </div>

      {tab === 'posts' && (
        <div className="stack">
          {posts.map((p) => (
            <PostCard key={p.id} post={p} onClick={() => navigate(`/forum/${p.id}`)} />
          ))}
        </div>
      )}

      {tab === 'saved' && (
        <div className="stack">
          {posts.slice(0, 2).map((p) => (
            <PostCard key={p.id} post={p} onClick={() => navigate(`/forum/${p.id}`)} />
          ))}
        </div>
      )}

      {tab === 'settings' && (
        <div className="card" style={{ maxWidth: 560 }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
            Thông tin cá nhân
          </div>
          <div className="form-group">
            <label className="form-label">Tên đăng nhập</label>
            <input
              className="form-input"
              value={form.username}
              onChange={(e) => setForm((p) => ({ ...p, username: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              className="form-input"
              type="email"
              value={form.email}
              onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Giới thiệu bản thân</label>
            <textarea
              className="form-textarea"
              style={{ minHeight: 100 }}
              placeholder="Mô tả ngắn về bản thân..."
              value={form.bio}
              onChange={(e) => setForm((p) => ({ ...p, bio: e.target.value }))}
            />
          </div>
          <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </div>
      )}

      {tab === 'password' && (
        <div className="card" style={{ maxWidth: 480 }}>
          <div style={{ fontFamily: 'Syne', fontWeight: 700, fontSize: 18, marginBottom: 24 }}>
            Đổi mật khẩu
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu hiện tại</label>
            <input
              className="form-input"
              type="password"
              value={pwForm.current}
              onChange={(e) => setPwForm((p) => ({ ...p, current: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mật khẩu mới</label>
            <input
              className="form-input"
              type="password"
              value={pwForm.newpw}
              onChange={(e) => setPwForm((p) => ({ ...p, newpw: e.target.value }))}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Xác nhận mật khẩu mới</label>
            <input
              className="form-input"
              type="password"
              value={pwForm.confirm}
              onChange={(e) => setPwForm((p) => ({ ...p, confirm: e.target.value }))}
            />
          </div>
          <button className="btn btn-primary" onClick={handleChangePw} disabled={loading}>
            {loading ? 'Đang lưu...' : '🔒 Đổi mật khẩu'}
          </button>
        </div>
      )}

      {toasts.map((t, i) => (
        <div key={i} className={`toast toast-${t.type}`}>
          {t.message}
        </div>
      ))}
    </div>
  );
}
