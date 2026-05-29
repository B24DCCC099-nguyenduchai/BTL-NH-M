import React, { useState } from 'react';
import { useNavigate } from 'umi';
import UserAvatar from '../components/common/UserAvatar';
import RoleBadge from '../components/common/RoleBadge';
import { userService } from '../services/userService';
import { authService } from '../services/authService';
import { addToast } from '../utils/toast';
import type { User } from '../types';

interface Props { currentUser: User | null; onUpdateUser: (u: Partial<User>) => void; }

const ProfilePage: React.FC<Props> = ({ currentUser, onUpdateUser }) => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'posts'|'saved'|'edit'|'password'>('posts');
  const [form, setForm] = useState({ username: currentUser?.username||'', bio: currentUser?.bio||'', email: currentUser?.email||'' });
  const [pwForm, setPwForm] = useState({ current:'', newpw:'', confirm:'' });
  const [saving, setSaving] = useState(false);

  if (!currentUser) { navigate('/auth/login'); return null; }

  const inp: React.CSSProperties = { width:'100%', height:44, border:'1.5px solid var(--border)', borderRadius:8, padding:'0 14px', background:'var(--bg)', color:'var(--text)', fontSize:14, outline:'none', fontFamily:'inherit', transition:'all .2s' };
  const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor='var(--pri)'; e.target.style.boxShadow='0 0 0 3px rgba(79,140,255,.1)'; };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow=''; };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      const updated = await userService.updateProfile(form);
      onUpdateUser(updated);
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

  const TABS = [
    { key:'posts', label:'📝 Bài viết' },
    { key:'saved', label:'🔖 Đã lưu' },
    { key:'edit', label:'⚙️ Hồ sơ' },
    { key:'password', label:'🔒 Mật khẩu' },
  ];

  return (
    <div style={{ maxWidth:960, margin:'0 auto', padding:'32px 24px' }}>
      {/* Profile header */}
      <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'28px 32px', marginBottom:24, display:'flex', alignItems:'flex-start', gap:24 }}>
        <div style={{ position:'relative' }}>
          <UserAvatar user={currentUser} size="xl" />
          <div
            title="Thay đổi ảnh"
            style={{ position:'absolute', bottom:4, right:4, width:28, height:28, borderRadius:'50%', background:'var(--pri)', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:14, border:'2px solid var(--surface)' }}
            onClick={async () => {
              const input = document.createElement('input'); input.type='file'; input.accept='image/*';
              input.onchange = async () => {
                if (input.files?.[0]) {
                  try { const r = await userService.uploadAvatar(input.files[0]); onUpdateUser({ avatar: r.avatar }); addToast('Đã cập nhật ảnh!', 'success'); }
                  catch { addToast('Không thể upload ảnh', 'error'); }
                }
              };
              input.click();
            }}>
            📷
          </div>
        </div>
        <div style={{ flex:1 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:24, marginBottom:6 }}>{currentUser.username}</div>
          <div style={{ marginBottom:8 }}><RoleBadge role={currentUser.role} /></div>
          <div style={{ fontSize:14, color:'var(--muted)', marginBottom:12 }}>{currentUser.email}</div>
          {currentUser.bio && <div style={{ fontSize:14, color:'var(--text)', lineHeight:1.6 }}>{currentUser.bio}</div>}
          <div style={{ display:'flex', gap:28, marginTop:16 }}>
            {[{num:12,label:'Bài viết'},{num:48,label:'Bình luận'},{num:234,label:'Vote nhận'}].map((s,i) => (
              <div key={i}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:22, color:'var(--pri)' }}>{s.num}</div>
                <div style={{ fontSize:13, color:'var(--muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', borderBottom:'2px solid var(--border)', marginBottom:24 }}>
        {TABS.map(t => (
          <button key={t.key} onClick={() => setTab(t.key as any)}
            style={{ padding:'10px 20px', fontSize:14, fontWeight:500, color:tab===t.key?'var(--pri)':'var(--muted)', cursor:'pointer', border:'none', background:'transparent', borderBottom:`2px solid ${tab===t.key?'var(--pri)':'transparent'}`, marginBottom:-2, fontFamily:'inherit', transition:'all .15s' }}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab: Posts */}
      {tab==='posts' && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
          <div style={{ textAlign:'center', padding:'40px 0', color:'var(--muted)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>📝</div>
            <p>Bạn chưa đăng bài viết nào</p>
            <button onClick={() => history.push('/ask')} style={{ marginTop:14, padding:'10px 24px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:'pointer', fontSize:14, fontWeight:500, fontFamily:'inherit' }}>Đặt câu hỏi đầu tiên</button>
          </div>
        </div>
      )}

      {/* Tab: Saved */}
      {tab==='saved' && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
          <div style={{ textAlign:'center', padding:'40px 0', color:'var(--muted)' }}>
            <div style={{ fontSize:40, marginBottom:12 }}>🔖</div>
            <p>Chưa có bài viết nào được lưu</p>
          </div>
        </div>
      )}

      {/* Tab: Edit profile */}
      {tab==='edit' && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:28, maxWidth:560 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, marginBottom:24 }}>Thông tin cá nhân</div>
          {[
            { key:'username', label:'Tên đăng nhập', type:'text' },
            { key:'email', label:'Email', type:'email' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>{field.label}</label>
              <input type={field.type} value={(form as any)[field.key]} onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))} style={inp} onFocus={focus} onBlur={blur} />
            </div>
          ))}
          <div style={{ marginBottom:24 }}>
            <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Giới thiệu bản thân</label>
            <textarea value={form.bio} onChange={e => setForm(p => ({ ...p, bio: e.target.value }))} placeholder="Mô tả ngắn về bản thân, chuyên ngành, sở thích..."
              style={{ width:'100%', minHeight:100, border:'1.5px solid var(--border)', borderRadius:8, padding:'10px 14px', background:'var(--bg)', color:'var(--text)', fontSize:14, fontFamily:'inherit', resize:'vertical', outline:'none', lineHeight:1.7 }}
              onFocus={focus} onBlur={blur} />
          </div>
          <button onClick={handleSaveProfile} disabled={saving} style={{ padding:'10px 28px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:saving?'not-allowed':'pointer', fontSize:14, fontWeight:600, fontFamily:'inherit', opacity:saving?.75:1 }}>
            {saving ? 'Đang lưu...' : '💾 Lưu thay đổi'}
          </button>
        </div>
      )}

      {/* Tab: Password */}
      {tab==='password' && (
        <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:28, maxWidth:480 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18, marginBottom:24 }}>Đổi mật khẩu</div>
          {[
            { key:'current', label:'Mật khẩu hiện tại', placeholder:'Nhập mật khẩu hiện tại' },
            { key:'newpw', label:'Mật khẩu mới', placeholder:'Ít nhất 6 ký tự' },
            { key:'confirm', label:'Xác nhận mật khẩu mới', placeholder:'Nhập lại mật khẩu mới' },
          ].map(field => (
            <div key={field.key} style={{ marginBottom:18 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>{field.label}</label>
              <input type="password" value={(pwForm as any)[field.key]} onChange={e => setPwForm(p => ({ ...p, [field.key]: e.target.value }))} placeholder={field.placeholder} style={inp} onFocus={focus} onBlur={blur} />
            </div>
          ))}
          <button onClick={handleChangePw} disabled={saving} style={{ padding:'10px 28px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:saving?'not-allowed':'pointer', fontSize:14, fontWeight:600, fontFamily:'inherit', opacity:saving?.75:1 }}>
            {saving ? 'Đang lưu...' : '🔒 Đổi mật khẩu'}
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
