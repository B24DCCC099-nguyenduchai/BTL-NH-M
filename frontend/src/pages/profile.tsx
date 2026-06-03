import React, { useEffect, useState } from 'react';
import UserAvatar from '../components/common/UserAvatar';
import RoleBadge from '../components/common/RoleBadge';
import { forumService } from '../services/forumService';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { useAuth } from '../hooks/useAuth';
import { addToast } from '../utils/toast';
import type { Post } from '../types';

type ProfileForm = {
  name: string;
  bio: string;
  email: string;
};

const ProfilePage: React.FC = () => {
  const { user: currentUser, loading } = useAuth();
  const [tab, setTab] = useState<'posts'|'saved'|'edit'|'password'>('posts');
  const [form, setForm] = useState<ProfileForm | null>(null);
  const [pwForm, setPwForm] = useState({ current:'', newpw:'', confirm:'' });
  const [saving, setSaving] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
  const [savedLoading, setSavedLoading] = useState(false);

  const currentForm: ProfileForm = form ?? {
    name: currentUser?.name ?? '',
    bio: currentUser?.bio ?? '',
    email: currentUser?.email ?? '',
  };

  const handleFormChange = (field: keyof ProfileForm, value: string) => {
    setForm({ ...currentForm, [field]: value });
  };

  useEffect(() => {
    if (loading) return;
    if (!currentUser) {
      window.location.href = '/auth/login';
    }
  }, [currentUser, loading]);

  useEffect(() => {
    if (loading || !currentUser) return;
    const loadSaved = async () => {
      setSavedLoading(true);
      try {
        const posts = await forumService.getSavedPosts();
        setSavedPosts(posts);
      } catch {
        setSavedPosts([]);
      } finally {
        setSavedLoading(false);
      }
    };
    loadSaved();
  }, [currentUser, loading]);

  if (loading || !currentUser) return null;

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await userService.updateProfile(currentForm);
      addToast('Đã cập nhật hồ sơ!', 'success');
    } catch { addToast('Không thể cập nhật', 'error'); }
    finally { setSaving(false); }
  };

  const handleChangePw = async () => {
    if (!pwForm.current) { addToast('Nhập mật khẩu hiện tại', 'error'); return; }
    if (pwForm.newpw.length < 6) { addToast('Mật khẩu mới ít nhất 6 ký tự', 'error'); return; }
    if (pwForm.newpw !== pwForm.confirm) { addToast('Mật khẩu xác nhận không khớp', 'error'); return; }
    setSaving(true);
    try {
      await authService.changePassword(pwForm.current, pwForm.newpw);
      setPwForm({ current:'', newpw:'', confirm:'' });
      addToast('Đã đổi mật khẩu thành công!', 'success');
    } catch { addToast('Mật khẩu hiện tại không đúng', 'error'); }
    finally { setSaving(false); }
  };

  const TABS: Array<{ key: 'posts'|'saved'|'edit'|'password'; label: string }> = [
    { key:'posts', label:'📝 Bài viết' },
    { key:'saved', label:'🔖 Đã lưu' },
    { key:'edit', label:'⚙️ Hồ sơ' },
    { key:'password', label:'🔒 Mật khẩu' },
  ];

  return (
    <div className="profile-page page-inner">
      {/* Profile header */}
      <div className="content-card profile-header-card">
        <div className="profile-avatar-wrapper">
          <UserAvatar user={currentUser} size="xl" />
          <div
            title="Thay đổi ảnh"
            className="profile-avatar-overlay"
            onClick={async () => {
              const input = document.createElement('input'); input.type='file'; input.accept='image/*';
              input.onchange = async () => {
                if (input.files?.[0]) {
                  try { await userService.uploadAvatar(input.files[0]); addToast('Đã cập nhật ảnh!', 'success'); }
                  catch { addToast('Không thể upload ảnh', 'error'); }
                }
              };
              input.click();
            }}>
            📷
          </div>
        </div>
        <div className="profile-details">
          <div className="profile-name">{currentUser.name}</div>
          <div className="profile-role-line"><RoleBadge role={currentUser.role} /></div>
          <div className="profile-email">{currentUser.email}</div>
          {currentUser.bio && <div className="profile-bio">{currentUser.bio}</div>}
          <div className="profile-metrics">
            {[{num:12,label:'Bài viết'},{num:48,label:'Bình luận'},{num:234,label:'Vote nhận'}].map((s,i) => (
              <div key={i} className="profile-stat">
                <div className="profile-stat-number">{s.num}</div>
                <div className="profile-stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tab-bar">
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key)} className={`admin-tab-btn${tab===t.key ? ' active' : ''}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Posts */}
      {tab==='posts' && (
        <div className="content-card profile-section-card">
          <div className="profile-empty-state">
            <div className="profile-empty-icon">📝</div>
            <p>Bạn chưa đăng bài viết nào</p>
            <button onClick={() => { window.location.href = '/ask'; }} className="profile-action-btn profile-empty-cta">
              Đặt câu hỏi đầu tiên
            </button>
          </div>
        </div>
      )}

      {/* Tab: Saved */}
      {tab==='saved' && (
        <div className="content-card profile-section-card">
          {savedLoading ? (
            <div className="profile-empty-state">
              <div className="profile-empty-icon">⏳</div>
              <p>Đang tải bài viết đã lưu...</p>
            </div>
          ) : savedPosts.length > 0 ? (
            <div className="saved-post-grid">
              {savedPosts.map((post) => (
                <button key={post.id} className="saved-post-card" onClick={() => window.location.href = `/forum/${post.id}`}>
                  <div className="saved-post-title">{post.title}</div>
                  <div className="saved-post-meta">
                    <span>👤 {post.author.name}</span>
                    <span>💬 {post.commentCount ?? 0}</span>
                    <span>👁 {post.views ?? 0}</span>
                  </div>
                  <div className="saved-post-tag-row">
                    {post.tags.map((tag) => (
                      <span key={tag.id} className="saved-post-tag" style={{ background: tag.color ? `${tag.color}22` : 'var(--border)', color: tag.color || 'var(--text)' }}>{tag.name}</span>
                    ))}
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="profile-saved-empty">
              <div className="profile-empty-icon">🔖</div>
              <p>Chưa có bài viết nào được lưu</p>
            </div>
          )}
        </div>
      )}

      {/* Tab: Edit profile */}
      {tab==='edit' && (
        <div className="content-card profile-form-card">
          <div className="profile-form-title">Thông tin cá nhân</div>
          {[
            { key:'name' as const, label:'Tên đăng nhập', type:'text' },
            { key:'email' as const, label:'Email', type:'email' },
          ].map(field => (
            <div key={field.key} className="profile-field">
              <label className="form-label">{field.label}</label>
              <input type={field.type} value={currentForm[field.key]} onChange={e => handleFormChange(field.key, e.target.value)} className="form-input" />
            </div>
          ))}
          <div className="profile-field">
            <label className="form-label">Giới thiệu bản thân</label>
            <textarea value={currentForm.bio} onChange={e => handleFormChange('bio', e.target.value)} placeholder="Mô tả ngắn về bản thân, chuyên ngành, sở thích..."
              className="form-textarea" />
          </div>
          <button onClick={handleSaveProfile} disabled={saving} className="profile-action-btn">
            {saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </div>
      )}

      {/* Tab: Password */}
      {tab==='password' && (
        <div className="content-card profile-form-card profile-form-sm">
          <div className="profile-form-title">Đổi mật khẩu</div>
          {[
            { key:'current' as const, label:'Mật khẩu hiện tại', placeholder:'Nhập mật khẩu hiện tại' },
            { key:'newpw' as const, label:'Mật khẩu mới', placeholder:'Ít nhất 6 ký tự' },
            { key:'confirm' as const, label:'Xác nhận mật khẩu mới', placeholder:'Nhập lại mật khẩu mới' },
          ].map(field => (
            <div key={field.key} className="profile-field">
              <label className="form-label">{field.label}</label>
              <input type="password" value={pwForm[field.key]} onChange={e => setPwForm(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} className="form-input" />
            </div>
          ))}
          <button onClick={handleChangePw} disabled={saving} className="profile-action-btn">
            {saving ? 'Đang lưu...' : '🔒 Đổi mật khẩu'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
