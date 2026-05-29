import React, { useEffect, useState } from 'react';
import { useNavigate } from 'umi';
import UserAvatar from '../../components/common/UserAvatar';
import RoleBadge from '../../components/common/RoleBadge';
import TagBadge from '../../components/common/TagBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { adminService } from '../../services/adminService';
import { addToast } from '../../utils/toast';
import { timeAgo } from '../../utils/helpers';
import type { User, Post, Tag, AdminStats } from '../../types';

interface Props { currentUser: User; }

type MenuKey = 'dashboard' | 'users' | 'posts' | 'tags';

const MENU: { key: MenuKey; icon: string; label: string }[] = [
  { key:'dashboard', icon:'📊', label:'Dashboard' },
  { key:'users', icon:'👥', label:'Người dùng' },
  { key:'posts', icon:'📝', label:'Bài viết' },
  { key:'tags', icon:'🏷️', label:'Tags' },
];

const AdminPage: React.FC<Props> = ({ currentUser }) => {
  const navigate = useNavigate();
  const [menu, setMenu] = useState<MenuKey>('dashboard');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(false);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showAddTag, setShowAddTag] = useState(false);
  const [newUser, setNewUser] = useState({ name:'', email:'', role:'student', password:'' });
  const [newTag, setNewTag] = useState({ name:'', color:'#4f8cff', description:'' });

  if (currentUser.role !== 'admin') { navigate('/'); return null; }

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [st, us, ps] = await Promise.all([
          adminService.getStats(),
          adminService.getUsers(),
          adminService.getPosts(),
        ]);
        setStats(st);
        setUsers(us);
        setPosts(ps);
      } catch { /* use empty */ }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleToggleLock = async (id: string) => {
    try { await adminService.lockUser(id); setUsers(p => p.map(u => u.id===id?{...u,status: u.status === 'active' ? 'locked' : 'active'}:u)); addToast('Đã cập nhật trạng thái!','success'); }
    catch { addToast('Lỗi cập nhật','error'); }
  };
  const handleResetPw = async (id: string) => {
    try { await adminService.resetPassword(id); addToast('Mật khẩu mới đã được gửi email','success'); }
    catch { addToast('Lỗi reset mật khẩu','error'); }
  };
  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('Xóa người dùng này?')) return;
    try { await adminService.deleteUser(id); setUsers(p => p.filter(u => u.id!==id)); addToast('Đã xóa người dùng','success'); }
    catch { addToast('Lỗi xóa','error'); }
  };
  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Xóa bài viết này?')) return;
    try { await adminService.deletePost(id); setPosts(p => p.filter(x => x.id!==id)); addToast('Đã xóa bài viết','success'); }
    catch { addToast('Lỗi xóa','error'); }
  };
  const handleSaveUser = async () => {
    if (!editUser) return;
    try { await adminService.updateUser(editUser.id, editUser); setUsers(p => p.map(u => u.id===editUser.id?editUser:u)); setEditUser(null); addToast('Đã cập nhật!','success'); }
    catch { addToast('Lỗi cập nhật','error'); }
  };
  const handleAddUser = async () => {
    if (!newUser.name||!newUser.email||!newUser.password) { addToast('Vui lòng nhập đủ thông tin','error'); return; }
    try {
      const u = await adminService.createUser(newUser as any);
      setUsers(p => [...p, u]); setShowAddUser(false); setNewUser({name:'',email:'',role:'student',password:''}); addToast('Đã thêm người dùng!','success');
    } catch { addToast('Lỗi thêm người dùng','error'); }
  };

  const inp: React.CSSProperties = { width:'100%', height:40, border:'1.5px solid var(--border)', borderRadius:8, padding:'0 12px', background:'var(--bg)', color:'var(--text)', fontSize:14, outline:'none', fontFamily:'inherit', transition:'all .2s' };
  const focusEvt = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor='var(--pri)'; };
  const blurEvt = (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => { e.target.style.borderColor='var(--border)'; };

  const STAT_CARDS = [
    { label:'Tổng bài viết', num:(stats?.totalPosts??posts.length*47).toLocaleString(), icon:'📝', color:'var(--pri)' },
    { label:'Tổng người dùng', num:(stats?.totalUsers??users.length*23).toLocaleString(), icon:'👥', color:'var(--sec)' },
    { label:'Bình luận', num:(stats?.totalComments??posts.reduce((a,b)=>a+b.commentCount,0)*12).toLocaleString(), icon:'💬', color:'var(--acc)' },
    { label:'Hoạt động hôm nay', num:(stats?.activeUsers24h??38).toString(), icon:'🔥', color:'var(--warn)' },
  ];

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'var(--bg)' }}>
      {/* Sidebar */}
      <div style={{ width:240, background:'var(--surface)', borderRight:'1px solid var(--border)', flexShrink:0, display:'flex', flexDirection:'column' }}>
        <div style={{ padding:'20px 20px 10px', fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:18, background:'linear-gradient(135deg,var(--pri),var(--sec))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
          📚 Admin Panel
        </div>
        <div style={{ padding:'8px 10px', flex:1 }}>
          {MENU.map(m => (
            <button key={m.key} onClick={() => setMenu(m.key)}
              style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:8, cursor:'pointer', fontSize:14, fontWeight:500, color:menu===m.key?'var(--pri)':'var(--muted)', background:menu===m.key?'rgba(79,140,255,.1)':'transparent', border:'none', width:'100%', textAlign:'left', fontFamily:'inherit', transition:'all .15s', marginBottom:2 }}>
              <span>{m.icon}</span>{m.label}
            </button>
          ))}
        </div>
        <div style={{ padding:10, borderTop:'1px solid var(--border)' }}>
          <button onClick={() => navigate('/')} style={{ display:'flex', alignItems:'center', gap:8, padding:'10px 12px', width:'100%', borderRadius:8, border:'none', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>
            ← Về diễn đàn
          </button>
        </div>
      </div>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden' }}>
        {/* Header */}
        <div style={{ height:64, background:'var(--surface)', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', padding:'0 32px', gap:16 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:18 }}>
            {MENU.find(m => m.key===menu)?.icon} {MENU.find(m => m.key===menu)?.label}
          </div>
          <div style={{ marginLeft:'auto', display:'flex', alignItems:'center', gap:10 }}>
            <UserAvatar user={currentUser} size="sm" />
            <span style={{ fontSize:14, fontWeight:500 }}>{currentUser.name}</span>
          </div>
        </div>

        <div style={{ flex:1, overflowY:'auto', padding:32 }}>

          {/* DASHBOARD */}
          {menu==='dashboard' && (
            <>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:18, marginBottom:28 }}>
                {STAT_CARDS.map((s,i) => (
                  <div key={i} style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:'20px 24px' }}>
                    <div style={{ float:'right', fontSize:36, opacity:.15 }}>{s.icon}</div>
                    <div style={{ fontFamily:"'Syne',sans-serif", fontSize:32, fontWeight:800, color:s.color }}>{s.num}</div>
                    <div style={{ fontSize:14, color:'var(--muted)', marginTop:4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20, marginBottom:24 }}>
                {/* Bar chart */}
                <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:18 }}>📈 Bài viết theo ngày (tuần này)</div>
                  <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:120, paddingTop:8 }}>
                    {barData.map(d => (
                      <div key={d.l} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', gap:4 }}>
                        <div style={{ width:'100%', background:'linear-gradient(180deg,var(--pri),var(--sec))', borderRadius:'4px 4px 0 0', height:`${(d.v/maxBar)*90}px`, minHeight:4, transition:'height .4s' }} />
                        <div style={{ fontSize:11, color:'var(--faint)' }}>{d.l}</div>
                        <div style={{ fontSize:11, color:'var(--pri)', fontWeight:600 }}>{d.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
                {/* Progress bars */}
                <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:18 }}>📊 Thống kê hệ thống</div>
                  {[
                    { label:'Bài viết có câu trả lời', val:78 },
                    { label:'Người dùng hoạt động (7 ngày)', val:65 },
                    { label:'Tỷ lệ sinh viên', val:82 },
                    { label:'Mức độ hài lòng', val:91 },
                  ].map((s,i) => (
                    <div key={i} style={{ marginBottom:14 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:5 }}>
                        <span style={{ color:'var(--muted)' }}>{s.label}</span>
                        <span style={{ fontWeight:700, color:'var(--pri)' }}>{s.val}%</span>
                      </div>
                      <div style={{ height:6, borderRadius:3, background:'var(--border)', overflow:'hidden' }}>
                        <div style={{ height:'100%', width:`${s.val}%`, background:'linear-gradient(90deg,var(--pri),var(--sec))', borderRadius:3, transition:'width .4s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent posts table */}
              <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:15, marginBottom:18 }}>📋 Bài viết gần đây</div>
                <table style={{ width:'100%', borderCollapse:'collapse' }}>
                  <thead>
                    <tr>{['Tiêu đề','Tác giả','Vote','Views','Ngày đăng'].map(h => (
                      <th key={h} style={{ background:'var(--bg)', padding:'10px 14px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.5px', borderBottom:'1px solid var(--border)' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {posts.slice(0,5).map(p => (
                      <tr key={p.id} style={{ cursor:'pointer' }} onClick={() => history.push(`/forum/${p.id}`)}>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)', maxWidth:260, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:14, color:'var(--pri)', fontWeight:500 }}>{p.title}</td>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)', fontSize:14 }}>
                          <div style={{ display:'flex', alignItems:'center', gap:8 }}><UserAvatar user={p.author} size="sm" />{p.author.name}</div>
                        </td>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }}><span style={{ background:'rgba(79,140,255,.1)', color:'var(--pri)', borderRadius:12, padding:'2px 10px', fontSize:13, fontWeight:600 }}>▲ {p.votes}</span></td>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)', fontSize:14, color:'var(--muted)' }}>{p.views}</td>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)', fontSize:13, color:'var(--faint)' }}>{timeAgo(p.createdAt)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* USERS */}
          {menu==='users' && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17 }}>👥 Người dùng ({users.length})</div>
                <button onClick={() => setShowAddUser(true)} style={{ padding:'8px 20px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:500, fontFamily:'inherit' }}>+ Thêm người dùng</button>
              </div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:700 }}>
                  <thead>
                    <tr>{['Người dùng','Email','Vai trò','Trạng thái','Hành động'].map(h => (
                      <th key={h} style={{ background:'var(--bg)', padding:'10px 14px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.5px', borderBottom:'1px solid var(--border)' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id} onMouseEnter={e => (e.currentTarget.style.background='var(--bg)')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }}>
                          <div style={{ display:'flex', alignItems:'center', gap:10 }}><UserAvatar user={u} size="sm" /><span style={{ fontWeight:500, fontSize:14 }}>{u.name}</span></div>
                        </td>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)', fontSize:14, color:'var(--muted)' }}>{u.email}</td>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }}><RoleBadge role={u.role} /></td>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }}>
                          <span style={{ background:u.status==='active'?'rgba(34,197,94,.1)':'rgba(239,68,68,.1)', color:u.status==='active'?'var(--success)':'var(--danger)', borderRadius:12, padding:'3px 10px', fontSize:12, fontWeight:600 }}>
                            {u.status === 'active' ? '✓ Hoạt động' : '✗ Đã khóa'}
                          </span>
                        </td>
                        <td style={{ padding:'13px 14px', borderBottom:'1px solid var(--border)' }}>
                          <div style={{ display:'flex', gap:6 }}>
                            {[
                              { label:'Sửa', action:() => setEditUser(u), color:'var(--pri)' },
                              { label:u.status==='active'?'🔒 Khóa':'🔓 Mở', action:() => handleToggleLock(u.id), color:'var(--warn)' },
                              { label:'🔑 Reset', action:() => handleResetPw(u.id), color:'var(--muted)' },
                              ...(u.role!=='admin'?[{ label:'Xóa', action:() => handleDeleteUser(u.id), color:'var(--danger)' }]:[]),
                            ].map((btn,i) => (
                              <button key={i} onClick={btn.action} style={{ padding:'5px 12px', borderRadius:16, border:`1px solid ${btn.color}30`, background:`${btn.color}10`, color:btn.color, cursor:'pointer', fontSize:12, fontWeight:500, fontFamily:'inherit' }}>{btn.label}</button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* POSTS */}
          {menu==='posts' && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17, marginBottom:20 }}>📝 Bài viết ({posts.length})</div>
              <div style={{ overflowX:'auto' }}>
                <table style={{ width:'100%', borderCollapse:'collapse', minWidth:750 }}>
                  <thead>
                    <tr>{['Tiêu đề','Tác giả','Tags','Vote','Views','Ngày đăng','Hành động'].map(h => (
                      <th key={h} style={{ background:'var(--bg)', padding:'10px 14px', textAlign:'left', fontSize:12, fontWeight:700, color:'var(--muted)', textTransform:'uppercase', letterSpacing:'.5px', borderBottom:'1px solid var(--border)' }}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody>
                    {posts.map(p => (
                      <tr key={p.id} onMouseEnter={e => (e.currentTarget.style.background='var(--bg)')} onMouseLeave={e => (e.currentTarget.style.background='transparent')}>
                        <td style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)', maxWidth:220 }}>
                          <div style={{ overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', fontSize:14, fontWeight:500, color:'var(--pri)', cursor:'pointer' }} onClick={() => history.push(`/forum/${p.id}`)}>{p.title}</div>
                        </td>
                        <td style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)', fontSize:14 }}>{p.author.name}</td>
                        <td style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)' }}>
                          <div style={{ display:'flex', gap:4, flexWrap:'wrap' }}>
                            {p.tags.slice(0,2).map(t => <TagBadge key={t.id} tag={t} />)}
                            {p.tags.length>2 && <span style={{ fontSize:12, color:'var(--faint)' }}>+{p.tags.length-2}</span>}
                          </div>
                        </td>
                        <td style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)' }}><span style={{ background:'rgba(79,140,255,.1)', color:'var(--pri)', borderRadius:12, padding:'2px 10px', fontSize:13, fontWeight:600 }}>▲ {p.votes}</span></td>
                        <td style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)', fontSize:14, color:'var(--muted)' }}>{p.views}</td>
                        <td style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)', fontSize:13, color:'var(--faint)' }}>{timeAgo(p.createdAt)}</td>
                        <td style={{ padding:'12px 14px', borderBottom:'1px solid var(--border)' }}>
                          <div style={{ display:'flex', gap:6 }}>
                            <button onClick={() => history.push(`/forum/${p.id}`)} style={{ padding:'5px 12px', borderRadius:16, border:'1px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>Xem</button>
                            <button onClick={() => handleDeletePost(p.id)} style={{ padding:'5px 12px', borderRadius:16, border:'1px solid var(--danger)30', background:'rgba(239,68,68,.08)', color:'var(--danger)', cursor:'pointer', fontSize:12, fontFamily:'inherit' }}>Xóa</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAGS */}
          {menu==='tags' && (
            <div style={{ background:'var(--surface)', border:'1px solid var(--border)', borderRadius:'var(--radius)', padding:24 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
                <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:17 }}>🏷️ Quản lý Tags</div>
                <button onClick={() => setShowAddTag(true)} style={{ padding:'8px 20px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:'pointer', fontSize:13, fontWeight:500, fontFamily:'inherit' }}>+ Thêm tag</button>
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(210px,1fr))', gap:14 }}>
                {[
                  {id:1,name:'Lập trình',color:'#4f8cff',usageCount:45},
                  {id:2,name:'Thuật toán',color:'#7b61ff',usageCount:32},
                  {id:3,name:'Cơ sở dữ liệu',color:'#4de2e2',usageCount:28},
                  {id:4,name:'SQL',color:'#ff6b6b',usageCount:21},
                  {id:5,name:'React',color:'#61dafb',usageCount:19},
                  {id:6,name:'Git',color:'#f05032',usageCount:38},
                ].map(t => (
                  <div key={t.id} style={{ border:'1px solid var(--border)', borderRadius:10, padding:18 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 }}>
                      <TagBadge tag={t} />
                      <button onClick={async () => { if(window.confirm('Xóa tag này?')) { try { await adminService.deleteTag(t.id); addToast('Đã xóa tag','success'); } catch { addToast('Lỗi xóa','error'); } } }}
                        style={{ border:'none', background:'transparent', color:'var(--faint)', cursor:'pointer', fontSize:16, padding:2 }}>✕</button>
                    </div>
                    <div style={{ fontSize:13, color:'var(--muted)', marginBottom:8 }}>{t.usageCount} bài viết</div>
                    <div style={{ height:5, borderRadius:3, background:'var(--border)', overflow:'hidden' }}>
                      <div style={{ height:'100%', width:`${Math.min(100,(t.usageCount/50)*100)}%`, background:t.color, borderRadius:3 }} />
                    </div>
                  </div>
                ))}
                <div onClick={() => setShowAddTag(true)} style={{ border:'2px dashed var(--border)', borderRadius:10, padding:18, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', gap:8, cursor:'pointer', color:'var(--muted)', transition:'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as any).style.borderColor='var(--pri)'; (e.currentTarget as any).style.color='var(--pri)'; }}
                  onMouseLeave={e => { (e.currentTarget as any).style.borderColor='var(--border)'; (e.currentTarget as any).style.color='var(--muted)'; }}>
                  <span style={{ fontSize:28 }}>+</span>
                  <span style={{ fontSize:13 }}>Thêm tag mới</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Modals ── */}
      {/* Edit User Modal */}
      {editUser && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(4px)' }} onClick={e => e.target===e.currentTarget&&setEditUser(null)}>
          <div style={{ background:'var(--surface)', borderRadius:20, padding:32, width:'100%', maxWidth:440, boxShadow:'var(--shadow-xl)' }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:24 }}>✏️ Sửa người dùng: {editUser.name}</div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Vai trò</label>
              <select value={editUser.role} onChange={e => setEditUser({...editUser,role:e.target.value as any})} style={{ ...inp, cursor:'pointer' }} onFocus={focusEvt} onBlur={blurEvt}>
                <option value="student">Sinh viên</option>
                <option value="lecturer">Giảng viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div style={{ marginBottom:20, display:'flex', alignItems:'center', gap:10 }}>
              <input type="checkbox" checked={editUser.status === 'active'} onChange={e => setEditUser({...editUser, status: e.target.checked ? 'active' : 'locked'})} style={{ width:18, height:18, accentColor:'var(--pri)', cursor:'pointer' }} />
              <span style={{ fontSize:14 }}>Tài khoản đang hoạt động</span>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button onClick={() => setEditUser(null)} style={{ padding:'9px 22px', borderRadius:20, border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>Hủy</button>
              <button onClick={handleSaveUser} style={{ padding:'9px 22px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:'pointer', fontSize:14, fontWeight:500, fontFamily:'inherit' }}>Lưu thay đổi</button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showAddUser && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(4px)' }} onClick={e => e.target===e.currentTarget&&setShowAddUser(false)}>
          <div style={{ background:'var(--surface)', borderRadius:20, padding:32, width:'100%', maxWidth:440, boxShadow:'var(--shadow-xl)' }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:24 }}>➕ Thêm người dùng mới</div>
            {[{key:'name',label:'Tên người dùng',type:'text',ph:'Tên đầy đủ'},{key:'email',label:'Email',type:'email',ph:'email@student.edu.vn'},{key:'password',label:'Mật khẩu tạm',type:'password',ph:'Mật khẩu ban đầu'}].map(f => (
              <div key={f.key} style={{ marginBottom:16 }}>
                <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>{f.label}</label>
                <input type={f.type} value={(newUser as any)[f.key]} onChange={e => setNewUser(p => ({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={inp} onFocus={focusEvt} onBlur={blurEvt} />
              </div>
            ))}
            <div style={{ marginBottom:20 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Vai trò</label>
              <select value={newUser.role} onChange={e => setNewUser(p => ({...p,role:e.target.value}))} style={{ ...inp, cursor:'pointer' }} onFocus={focusEvt} onBlur={blurEvt}>
                <option value="student">Sinh viên</option>
                <option value="lecturer">Giảng viên</option>
                <option value="admin">Quản trị viên</option>
              </select>
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button onClick={() => setShowAddUser(false)} style={{ padding:'9px 22px', borderRadius:20, border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>Hủy</button>
              <button onClick={handleAddUser} style={{ padding:'9px 22px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:'pointer', fontSize:14, fontWeight:500, fontFamily:'inherit' }}>Thêm người dùng</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tag Modal */}
      {showAddTag && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.5)', zIndex:1000, display:'flex', alignItems:'center', justifyContent:'center', padding:24, backdropFilter:'blur(4px)' }} onClick={e => e.target===e.currentTarget&&setShowAddTag(false)}>
          <div style={{ background:'var(--surface)', borderRadius:20, padding:32, width:'100%', maxWidth:400, boxShadow:'var(--shadow-xl)' }}>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:20, marginBottom:24 }}>🏷️ Thêm Tag mới</div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Tên tag</label>
              <input value={newTag.name} onChange={e => setNewTag(p => ({...p,name:e.target.value}))} placeholder="VD: Lập trình" style={inp} onFocus={focusEvt} onBlur={blurEvt} />
            </div>
            <div style={{ marginBottom:16 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Màu sắc</label>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <input type="color" value={newTag.color} onChange={e => setNewTag(p => ({...p,color:e.target.value}))} style={{ width:50, height:42, border:'1.5px solid var(--border)', borderRadius:8, cursor:'pointer', background:'transparent' }} />
                <TagBadge tag={{name:newTag.name||'Tag mới',color:newTag.color}} />
              </div>
            </div>
            <div style={{ marginBottom:22 }}>
              <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>Mô tả (tùy chọn)</label>
              <input value={newTag.description} onChange={e => setNewTag(p => ({...p,description:e.target.value}))} placeholder="Mô tả ngắn về tag này..." style={inp} onFocus={focusEvt} onBlur={blurEvt} />
            </div>
            <div style={{ display:'flex', gap:10, justifyContent:'flex-end' }}>
              <button onClick={() => setShowAddTag(false)} style={{ padding:'9px 22px', borderRadius:20, border:'1.5px solid var(--border)', background:'transparent', color:'var(--muted)', cursor:'pointer', fontSize:14, fontFamily:'inherit' }}>Hủy</button>
              <button onClick={async () => { if(!newTag.name){addToast('Nhập tên tag','error');return;} try { await adminService.createTag(newTag); setShowAddTag(false); setNewTag({name:'',color:'#4f8cff',description:''}); addToast('Đã thêm tag!','success'); } catch { addToast('Lỗi thêm tag','error'); } }} style={{ padding:'9px 22px', borderRadius:20, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:'pointer', fontSize:14, fontWeight:500, fontFamily:'inherit' }}>
                Thêm tag
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPage;
