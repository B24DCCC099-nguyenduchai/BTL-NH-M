import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import type { UserRole } from '../../types';

const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const [role, setRole] = useState<UserRole>('student');
  const [form, setForm] = useState({ username:'', email:'', password:'', confirm:'' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const f = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm(p => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.username || !form.email || !form.password) { setError('Vui lòng nhập đầy đủ thông tin'); return; }
    if (form.password.length < 6) { setError('Mật khẩu phải có ít nhất 6 ký tự'); return; }
    if (form.password !== form.confirm) { setError('Mật khẩu xác nhận không khớp'); return; }
    setLoading(true); setError('');
    try { await register({ username: form.username, email: form.email, password: form.password, role }); }
    catch (e) { 
      const err = e as { response?: { data?: { message?: string } } };
      setError(err?.response?.data?.message || 'Đăng ký thất bại, vui lòng thử lại'); 
    }
    finally { setLoading(false); }
  };

  const inp: React.CSSProperties = { width:'100%', height:46, border:'1.5px solid var(--border)', borderRadius:8, padding:'0 14px', background:'var(--bg)', color:'var(--text)', fontSize:15, outline:'none', fontFamily:'inherit', transition:'all .2s' };
  const focus = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor='var(--pri)'; e.target.style.boxShadow='0 0 0 3px rgba(79,140,255,.1)'; };
  const blur = (e: React.FocusEvent<HTMLInputElement>) => { e.target.style.borderColor='var(--border)'; e.target.style.boxShadow=''; };

  const ROLES: { value: UserRole; icon: string; label: string; desc: string }[] = [
    { value:'student', icon:'🎓', label:'Sinh viên', desc:'Đặt câu hỏi, học hỏi' },
    { value:'lecturer', icon:'👨‍🏫', label:'Giảng viên', desc:'Chia sẻ kiến thức' },
  ];

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24, background:'linear-gradient(135deg,rgba(79,140,255,.06),rgba(123,97,255,.06))' }}>
      <div style={{ width:'100%', maxWidth:460, background:'var(--surface)', border:'1px solid var(--border)', borderRadius:20, padding:40, boxShadow:'var(--shadow-lg)' }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:26, background:'linear-gradient(135deg,var(--pri),var(--sec))', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', marginBottom:8 }}>📚 Tạo tài khoản</div>
          <div style={{ color:'var(--muted)', fontSize:15 }}>Tham gia cộng đồng học tập</div>
        </div>

        {error && (
          <div style={{ background:'rgba(239,68,68,.08)', border:'1px solid rgba(239,68,68,.3)', borderRadius:8, padding:'10px 14px', fontSize:14, color:'var(--danger)', marginBottom:16 }}>⚠️ {error}</div>
        )}

        {/* Role picker */}
        <div style={{ marginBottom:20 }}>
          <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:10 }}>Bạn là</label>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10 }}>
            {ROLES.map(r => (
              <div key={r.value} onClick={() => setRole(r.value)}
                style={{ border:`2px solid ${role===r.value?'var(--pri)':'var(--border)'}`, borderRadius:10, padding:14, textAlign:'center', cursor:'pointer', background:role===r.value?'rgba(79,140,255,.06)':'transparent', transition:'all .2s' }}>
                <div style={{ fontSize:28, marginBottom:6 }}>{r.icon}</div>
                <div style={{ fontWeight:600, fontSize:14 }}>{r.label}</div>
                <div style={{ fontSize:12, color:'var(--muted)', marginTop:3 }}>{r.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {[
          { key:'username', label:'Tên đăng nhập', placeholder:'sv_tenminhban', type:'text' },
          { key:'email', label:'Email', placeholder:'email@student.edu.vn', type:'email' },
          { key:'password', label:'Mật khẩu', placeholder:'Ít nhất 6 ký tự', type:'password' },
          { key:'confirm', label:'Xác nhận mật khẩu', placeholder:'Nhập lại mật khẩu', type:'password' },
        ].map(field => (
          <div key={field.key} style={{ marginBottom:16 }}>
            <label style={{ display:'block', fontWeight:600, fontSize:14, marginBottom:6 }}>{field.label}</label>
            <input type={field.type} value={(form)[field.key as keyof typeof form]} onChange={f(field.key as keyof typeof form)} placeholder={field.placeholder} style={inp} onFocus={focus} onBlur={blur} />
          </div>
        ))}

        <button onClick={handleSubmit} disabled={loading} style={{ width:'100%', height:48, borderRadius:24, border:'none', background:'linear-gradient(135deg,var(--pri),var(--sec))', color:'#fff', cursor:loading?'not-allowed':'pointer', fontSize:16, fontWeight:600, fontFamily:'inherit', opacity:loading?.75:1, marginTop:8 }}>
          {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản →'}
        </button>

        <div style={{ textAlign:'center', fontSize:14, color:'var(--muted)', marginTop:20 }}>
          Đã có tài khoản?{' '}
          <span onClick={() => history.push('/auth/login')} style={{ color:'var(--pri)', fontWeight:600, cursor:'pointer' }}>Đăng nhập</span>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
